"""
middleware/auth.py
───────────────────
Autenticación JWT local.

- Genera tokens firmados con SECRET_KEY del .env.
- Verifica tokens en cada request protegido.
- Define el modelo del usuario autenticado.
- Proporciona el 'dependency' de FastAPI para rutas protegidas.
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated
import bcrypt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from config import settings
from utils.file_handler import read_json

# ── Esquema de seguridad HTTP Bearer ─────────────────────────────────────────
bearer_scheme = HTTPBearer()


# ── Funciones de contraseña ───────────────────────────────────────────────────

def hash_password(plain_password: str) -> str:
    """
    Genera el hash bcrypt de una contraseña en texto plano.

    Args:
        plain_password: Contraseña sin hashear.

    Returns:
        Hash bcrypt listo para almacenar en JSON.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compara una contraseña en texto plano con su hash almacenado.

    Args:
        plain_password: Contraseña ingresada por el usuario.
        hashed_password: Hash almacenado en admin_users.json.

    Returns:
        True si coinciden, False en caso contrario.
    """
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


# ── Funciones de token JWT ─────────────────────────────────────────────────────

def create_access_token(payload: dict) -> str:
    """
    Crea un JWT firmado con la SECRET_KEY local.

    El token incluye:
    - sub: ID del usuario
    - username: nombre de usuario
    - rol: rol del usuario (superadmin, admin, editor)
    - iat: timestamp de creación
    - exp: timestamp de expiración (TOKEN_EXPIRE_HOURS horas)

    Args:
        payload: Diccionario con datos a incluir en el token.

    Returns:
        String del JWT firmado.
    """
    to_encode = payload.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        hours=settings.TOKEN_EXPIRE_HOURS
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    """
    Decodifica y valida un JWT.

    Args:
        token: String del JWT recibido en el header Authorization.

    Returns:
        Payload decodificado del token.

    Raises:
        HTTPException 401: Si el token es inválido o ha expirado.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado. Inicia sesión nuevamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── Dependency de FastAPI ──────────────────────────────────────────────────────

def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
) -> dict:
    """
    Dependency de FastAPI para rutas protegidas.

    Extrae el token del header 'Authorization: Bearer <token>',
    lo valida y retorna los datos del usuario autenticado.

    Uso en rutas:
        @router.get("/admin/noticias")
        def listar(user = Depends(get_current_user)):
            ...

    Args:
        credentials: Token extraído automáticamente por FastAPI.

    Returns:
        Diccionario con datos del usuario:
        { id, username, email, nombre_completo, rol }

    Raises:
        HTTPException 401: Si el token es inválido.
        HTTPException 401: Si el usuario ya no existe en el sistema.
        HTTPException 403: Si el usuario está desactivado.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token malformado: falta el campo 'sub'.",
        )

    # Verificar que el usuario aún existe en el JSON
    users = read_json(settings.FILE_USERS)
    user = next((u for u in users if u.get("id") == user_id), None)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El usuario asociado al token ya no existe.",
        )

    if not user.get("activo", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu cuenta ha sido desactivada. Contacta al administrador.",
        )

    return {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "nombre_completo": user["nombre_completo"],
        "rol": user["rol"],
    }


def require_role(allowed_roles: list[str]):
    """
    Dependency factory para restringir acceso por rol.

    Uso:
        @router.delete("/admin/users/:id")
        def eliminar(user = Depends(require_role(["superadmin"]))):
            ...

    Args:
        allowed_roles: Lista de roles que pueden acceder.

    Returns:
        Dependency de FastAPI.
    """
    def role_checker(
        current_user: dict = Depends(get_current_user),
    ) -> dict:
        if current_user["rol"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Acceso denegado. Se requiere uno de estos roles: "
                    f"{', '.join(allowed_roles)}. Tu rol actual: {current_user['rol']}."
                ),
            )
        return current_user

    return role_checker
