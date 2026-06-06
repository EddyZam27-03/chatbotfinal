"""
routes/auth.py
───────────────
Endpoints de autenticación:
- POST /auth/login    → Iniciar sesión
- POST /auth/logout   → Cerrar sesión
- GET  /auth/me       → Obtener usuario actual
"""

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from config import settings
from middleware.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from models.schemas import LoginRequest
from utils.file_handler import read_json, update_record

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", summary="Iniciar sesión de administrador")
def login(body: LoginRequest):
    """
    Autentica un administrador y retorna un JWT local.

    - Busca el usuario por 'username' en admin_users.json
    - Verifica la contraseña con bcrypt
    - Genera y retorna un JWT firmado con SECRET_KEY local
    - Actualiza el campo 'ultimo_acceso' del usuario

    Respuesta exitosa:
        {
          "success": true,
          "data": {
            "token": "eyJ...",
            "user": { id, username, email, nombre_completo, rol }
          }
        }
    """
    users = read_json(settings.FILE_USERS)

    # Buscar usuario por username (case-insensitive)
    user = next(
        (u for u in users if u.get("username", "").lower() == body.username.lower()),
        None,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas.",
        )

    if not user.get("activo", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu cuenta está desactivada. Contacta al administrador.",
        )

    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas.",
        )

    # Actualizar último acceso
    update_record(
        settings.FILE_USERS,
        user["id"],
        {"ultimo_acceso": datetime.now(timezone.utc).isoformat()},
    )

    # Crear token JWT
    token = create_access_token({
        "sub": user["id"],
        "username": user["username"],
        "rol": user["rol"],
    })

    return {
        "success": True,
        "data": {
            "token": token,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "nombre_completo": user["nombre_completo"],
                "rol": user["rol"],
            },
        },
    }


@router.post("/logout", summary="Cerrar sesión")
def logout(current_user: Annotated[dict, Depends(get_current_user)]):
    """
    Cierra la sesión del usuario.

    Nota: Como los tokens son stateless (JWT), el cliente debe
    eliminar el token localmente. Este endpoint sirve como
    confirmación y puede usarse para auditoría.
    """
    return {
        "success": True,
        "message": f"Sesión cerrada. Hasta luego, {current_user['nombre_completo']}.",
    }


@router.get("/me", summary="Obtener usuario autenticado")
def me(current_user: Annotated[dict, Depends(get_current_user)]):
    """
    Retorna los datos del usuario dueño del token.

    Útil para que el frontend verifique si el token sigue siendo válido
    y para obtener el rol del usuario al cargar la app.
    """
    return {
        "success": True,
        "data": current_user,
    }
