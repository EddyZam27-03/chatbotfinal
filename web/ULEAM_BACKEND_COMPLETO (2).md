# ULEAM — Backend Completo
## Sistema Académico | FastAPI + JSON | 100% Local

> **Stack:** Python 3.10+ · FastAPI · JWT · bcrypt · JSON Files · uvicorn  
> **Persistencia:** Archivos JSON locales (sin base de datos)  
> **Red:** 100% LAN, sin internet, sin servicios externos  
> **Versión:** 1.0.0 — Junio 2026

---

## ÍNDICE

1. [Estructura de carpetas](#estructura)
2. [requirements.txt](#requirements)
3. [.env](#env)
4. [config.py](#config)
5. [utils/file_handler.py](#file-handler)
6. [utils/uuid_helper.py](#uuid-helper)
7. [utils/pagination.py](#pagination)
8. [utils/validators.py](#validators)
9. [middleware/auth.py](#auth-middleware)
10. [models/schemas.py](#schemas)
11. [routes/auth.py](#routes-auth)
12. [routes/noticias.py](#routes-noticias)
13. [routes/docentes.py](#routes-docentes)
14. [routes/faq.py](#routes-faq)
15. [routes/documentos.py](#routes-documentos)
16. [routes/chatbot.py](#routes-chatbot)
17. [seed.py](#seed)
18. [main.py](#main)
19. [Comandos de ejecución](#comandos)

---

## 1. ESTRUCTURA DE CARPETAS

```
uleam-backend/
│
├── data/                          ← Persistencia JSON (auto-generados)
│   ├── admin_users.json
│   ├── noticias.json
│   ├── docentes.json
│   ├── faq_items.json
│   ├── documentos.json
│   └── chatbot_knowledge.json
│
├── uploads/                       ← Archivos subidos
│   ├── noticias/
│   ├── docentes/
│   └── documentos/
│
├── middleware/
│   ├── __init__.py
│   └── auth.py                    ← Verificación JWT
│
├── models/
│   ├── __init__.py
│   └── schemas.py                 ← Modelos Pydantic
│
├── routes/
│   ├── __init__.py
│   ├── auth.py
│   ├── noticias.py
│   ├── docentes.py
│   ├── faq.py
│   ├── documentos.py
│   └── chatbot.py
│
├── utils/
│   ├── __init__.py
│   ├── file_handler.py            ← Leer/escribir JSON
│   ├── uuid_helper.py             ← Generar IDs
│   ├── pagination.py              ← Paginación
│   └── validators.py              ← Validaciones de archivos
│
├── config.py                      ← Configuración global
├── seed.py                        ← Datos iniciales
├── main.py                        ← Entrada principal
├── .env                           ← Variables de entorno
└── requirements.txt
```

---

## 2. requirements.txt

```txt
fastapi==0.111.0
uvicorn[standard]==0.29.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
aiofiles==23.2.1
python-dotenv==1.0.1
Pillow==10.3.0
```

---

## 3. .env

```env
# ─── Servidor ───────────────────────────────────────
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# ─── Seguridad ──────────────────────────────────────
SECRET_KEY=uleam_clave_super_secreta_2026_extensionelcarmen
ALGORITHM=HS256
TOKEN_EXPIRE_HOURS=24

# ─── Rutas locales ──────────────────────────────────
DATA_PATH=./data
UPLOADS_PATH=./uploads

# ─── CORS (IPs permitidas en la LAN) ────────────────
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# ─── Archivos ────────────────────────────────────────
MAX_FILE_SIZE_MB=10
ALLOWED_IMAGE_EXTENSIONS=jpg,jpeg,png,webp
ALLOWED_DOC_EXTENSIONS=pdf,doc,docx,xls,xlsx,ppt,pptx
```

---

## 4. config.py

```python
"""
config.py
─────────
Centraliza toda la configuración del backend.
Lee variables desde el archivo .env y expone
constantes usadas en todo el proyecto.
"""

import os
from dotenv import load_dotenv
from pathlib import Path

# Carga el archivo .env al iniciar
load_dotenv()


class Settings:
    """
    Clase de configuración global.
    Todos los módulos importan desde aquí.
    """

    # ── Servidor ──────────────────────────────────────────────────────────
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # ── Seguridad JWT ──────────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cambia_esta_clave_en_produccion")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    TOKEN_EXPIRE_HOURS: int = int(os.getenv("TOKEN_EXPIRE_HOURS", "24"))

    # ── Rutas de datos ────────────────────────────────────────────────────
    DATA_PATH: Path = Path(os.getenv("DATA_PATH", "./data"))
    UPLOADS_PATH: Path = Path(os.getenv("UPLOADS_PATH", "./uploads"))

    # ── Archivos JSON de datos ────────────────────────────────────────────
    FILE_USERS: Path = DATA_PATH / "admin_users.json"
    FILE_NOTICIAS: Path = DATA_PATH / "noticias.json"
    FILE_DOCENTES: Path = DATA_PATH / "docentes.json"
    FILE_FAQ: Path = DATA_PATH / "faq_items.json"
    FILE_DOCUMENTOS: Path = DATA_PATH / "documentos.json"
    FILE_CHATBOT: Path = DATA_PATH / "chatbot_knowledge.json"

    # ── Carpetas de uploads ───────────────────────────────────────────────
    UPLOADS_NOTICIAS: Path = UPLOADS_PATH / "noticias"
    UPLOADS_DOCENTES: Path = UPLOADS_PATH / "docentes"
    UPLOADS_DOCUMENTOS: Path = UPLOADS_PATH / "documentos"

    # ── CORS ──────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173"
    ).split(",")

    # ── Restricciones de archivos ──────────────────────────────────────────
    MAX_FILE_SIZE_BYTES: int = int(os.getenv("MAX_FILE_SIZE_MB", "10")) * 1024 * 1024

    ALLOWED_IMAGE_EXTENSIONS: set[str] = {
        f".{ext.strip()}"
        for ext in os.getenv("ALLOWED_IMAGE_EXTENSIONS", "jpg,jpeg,png,webp").split(",")
    }

    ALLOWED_DOC_EXTENSIONS: set[str] = {
        f".{ext.strip()}"
        for ext in os.getenv(
            "ALLOWED_DOC_EXTENSIONS", "pdf,doc,docx,xls,xlsx,ppt,pptx"
        ).split(",")
    }

    # ── Categorías válidas ─────────────────────────────────────────────────
    CATEGORIAS_NOTICIAS: list[str] = [
        "Infraestructura",
        "Logros Estudiantiles",
        "Convenios",
        "Eventos",
        "Académico",
        "Investigación",
        "General",
    ]

    CATEGORIAS_DOCUMENTOS: list[str] = [
        "Reglamentos",
        "Mallas",
        "Calendarios",
        "Admisión",
        "Aranceles",
        "Otros",
    ]

    CATEGORIAS_FAQ: list[str] = [
        "Admisión",
        "Académico",
        "Trámites",
        "Pagos",
        "Horarios",
        "General",
    ]

    CATEGORIAS_CHATBOT: list[str] = [
        "Matrícula",
        "Admisión",
        "Malla Curricular",
        "Contacto",
        "Costos",
        "Fechas",
        "General",
    ]

    ROLES_VALIDOS: list[str] = ["superadmin", "admin", "editor"]

    def __init__(self):
        """Crea las carpetas necesarias si no existen al iniciar."""
        self.DATA_PATH.mkdir(parents=True, exist_ok=True)
        self.UPLOADS_NOTICIAS.mkdir(parents=True, exist_ok=True)
        self.UPLOADS_DOCENTES.mkdir(parents=True, exist_ok=True)
        self.UPLOADS_DOCUMENTOS.mkdir(parents=True, exist_ok=True)


# Instancia global — importar desde aquí en todos los módulos
settings = Settings()
```

---

## 5. utils/file_handler.py

```python
"""
utils/file_handler.py
──────────────────────
Utilidades para leer y escribir archivos JSON.
Toda la persistencia del sistema pasa por estas funciones.
Incluye manejo de errores, bloqueo de concurrencia básico
y auto-inicialización de archivos vacíos.
"""

import json
import os
import threading
from pathlib import Path
from typing import Any

# Lock global para evitar corrupción por escrituras concurrentes
_file_locks: dict[str, threading.Lock] = {}
_lock_registry = threading.Lock()


def _get_lock(filepath: str) -> threading.Lock:
    """
    Retorna un lock único por archivo.
    Garantiza que solo un hilo escriba al mismo tiempo.
    """
    with _lock_registry:
        if filepath not in _file_locks:
            _file_locks[filepath] = threading.Lock()
        return _file_locks[filepath]


def read_json(filepath: Path) -> list[dict]:
    """
    Lee un archivo JSON y retorna su contenido como lista.

    - Si el archivo no existe, lo crea vacío automáticamente.
    - Si el JSON está corrupto, retorna lista vacía y registra el error.

    Args:
        filepath: Ruta al archivo JSON.

    Returns:
        Lista de diccionarios con los registros.
    """
    filepath = Path(filepath)

    if not filepath.exists():
        write_json(filepath, [])
        return []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON corrupto en {filepath}: {e}")
        return []
    except Exception as e:
        print(f"[ERROR] No se pudo leer {filepath}: {e}")
        return []


def write_json(filepath: Path, data: list[dict]) -> bool:
    """
    Escribe una lista de diccionarios en un archivo JSON.

    Usa un lock por archivo para evitar condiciones de carrera.
    Escribe primero en un archivo temporal y luego hace
    reemplazo atómico para evitar corrupción.

    Args:
        filepath: Ruta al archivo JSON.
        data: Lista de registros a escribir.

    Returns:
        True si la escritura fue exitosa, False si falló.
    """
    filepath = Path(filepath)
    lock = _get_lock(str(filepath))

    with lock:
        temp_path = filepath.with_suffix(".tmp")
        try:
            # Escribe en temporal primero
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2, default=str)

            # Reemplazo atómico
            os.replace(temp_path, filepath)
            return True

        except Exception as e:
            print(f"[ERROR] No se pudo escribir {filepath}: {e}")
            if temp_path.exists():
                temp_path.unlink()
            return False


def find_by_id(filepath: Path, record_id: str) -> dict | None:
    """
    Busca un registro por su campo 'id'.

    Args:
        filepath: Ruta al archivo JSON.
        record_id: UUID del registro a buscar.

    Returns:
        El diccionario del registro o None si no existe.
    """
    records = read_json(filepath)
    return next((r for r in records if r.get("id") == record_id), None)


def insert_record(filepath: Path, record: dict) -> bool:
    """
    Agrega un nuevo registro al archivo JSON.

    Args:
        filepath: Ruta al archivo JSON.
        record: Diccionario con el nuevo registro.

    Returns:
        True si se insertó correctamente.
    """
    records = read_json(filepath)
    records.append(record)
    return write_json(filepath, records)


def update_record(filepath: Path, record_id: str, updates: dict) -> dict | None:
    """
    Actualiza campos de un registro existente.

    Solo actualiza los campos presentes en 'updates'.
    No borra campos existentes que no estén en 'updates'.

    Args:
        filepath: Ruta al archivo JSON.
        record_id: UUID del registro a actualizar.
        updates: Diccionario con los campos a modificar.

    Returns:
        El registro actualizado o None si no se encontró.
    """
    records = read_json(filepath)
    updated = None

    for i, record in enumerate(records):
        if record.get("id") == record_id:
            records[i] = {**record, **updates}
            updated = records[i]
            break

    if updated is None:
        return None

    write_json(filepath, records)
    return updated


def delete_record(filepath: Path, record_id: str) -> bool:
    """
    Elimina un registro del archivo JSON por su ID.

    Args:
        filepath: Ruta al archivo JSON.
        record_id: UUID del registro a eliminar.

    Returns:
        True si se eliminó, False si no se encontró.
    """
    records = read_json(filepath)
    original_count = len(records)
    records = [r for r in records if r.get("id") != record_id]

    if len(records) == original_count:
        return False

    write_json(filepath, records)
    return True


def bulk_delete(filepath: Path, ids: list[str]) -> int:
    """
    Elimina múltiples registros del archivo JSON.

    Args:
        filepath: Ruta al archivo JSON.
        ids: Lista de UUIDs a eliminar.

    Returns:
        Cantidad de registros eliminados efectivamente.
    """
    records = read_json(filepath)
    ids_set = set(ids)
    original_count = len(records)
    records = [r for r in records if r.get("id") not in ids_set]
    deleted_count = original_count - len(records)
    write_json(filepath, records)
    return deleted_count


def count_records(filepath: Path) -> int:
    """Retorna la cantidad total de registros en el archivo."""
    return len(read_json(filepath))
```

---

## 6. utils/uuid_helper.py

```python
"""
utils/uuid_helper.py
─────────────────────
Generación de identificadores únicos.
No depende de ninguna base de datos.
"""

import uuid


def generate_uuid() -> str:
    """
    Genera un UUID v4 único como string.

    Ejemplo de salida: '550e8400-e29b-41d4-a716-446655440000'

    Returns:
        String con UUID v4.
    """
    return str(uuid.uuid4())


def is_valid_uuid(value: str) -> bool:
    """
    Verifica si un string es un UUID v4 válido.

    Args:
        value: String a verificar.

    Returns:
        True si es UUID válido, False en caso contrario.
    """
    try:
        uuid.UUID(str(value), version=4)
        return True
    except ValueError:
        return False
```

---

## 7. utils/pagination.py

```python
"""
utils/pagination.py
────────────────────
Utilidades para paginar, filtrar y ordenar
listas de registros en memoria (sin BD).
"""

from typing import Any


def paginate(
    items: list[dict],
    page: int = 1,
    limit: int = 10,
) -> dict:
    """
    Pagina una lista de elementos.

    Args:
        items: Lista completa de registros.
        page: Número de página (empieza en 1).
        limit: Cantidad de items por página.

    Returns:
        Diccionario con 'items' paginados y 'pagination' con metadata.
    """
    page = max(1, page)
    limit = max(1, min(100, limit))  # Entre 1 y 100

    total = len(items)
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    start = (page - 1) * limit
    end = start + limit

    return {
        "items": items[start:end],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": total_pages,
            "hasNextPage": page < total_pages,
            "hasPrevPage": page > 1,
        },
    }


def filter_by_field(
    items: list[dict],
    field: str,
    value: Any,
) -> list[dict]:
    """
    Filtra registros por un campo y valor exacto.

    Args:
        items: Lista de registros.
        field: Nombre del campo a filtrar.
        value: Valor exacto que debe tener el campo.

    Returns:
        Lista filtrada.
    """
    return [item for item in items if item.get(field) == value]


def search_in_fields(
    items: list[dict],
    query: str,
    fields: list[str],
) -> list[dict]:
    """
    Filtra registros buscando 'query' en los campos indicados.
    La búsqueda es case-insensitive y parcial.

    Args:
        items: Lista de registros.
        query: Texto a buscar.
        fields: Lista de campos donde buscar.

    Returns:
        Lista de registros que contienen el texto en alguno de los campos.
    """
    if not query or not query.strip():
        return items

    query_lower = query.lower().strip()

    def matches(item: dict) -> bool:
        for field in fields:
            value = item.get(field)
            if value and query_lower in str(value).lower():
                return True
        return False

    return [item for item in items if matches(item)]


def sort_items(
    items: list[dict],
    sort_field: str = "created_at",
    order: str = "desc",
) -> list[dict]:
    """
    Ordena una lista de registros por un campo.

    Args:
        items: Lista de registros.
        sort_field: Campo por el que ordenar.
        order: 'asc' para ascendente, 'desc' para descendente.

    Returns:
        Lista ordenada.
    """
    reverse = order.lower() == "desc"

    def sort_key(item: dict):
        value = item.get(sort_field, "")
        return value if value is not None else ""

    try:
        return sorted(items, key=sort_key, reverse=reverse)
    except TypeError:
        return items


def filter_by_date_range(
    items: list[dict],
    date_field: str,
    fecha_desde: str | None = None,
    fecha_hasta: str | None = None,
) -> list[dict]:
    """
    Filtra registros dentro de un rango de fechas.
    Las fechas deben estar en formato ISO 'YYYY-MM-DD'.

    Args:
        items: Lista de registros.
        date_field: Campo de fecha a comparar.
        fecha_desde: Fecha inicial (inclusive).
        fecha_hasta: Fecha final (inclusive).

    Returns:
        Lista filtrada.
    """
    result = items

    if fecha_desde:
        result = [r for r in result if r.get(date_field, "") >= fecha_desde]

    if fecha_hasta:
        result = [r for r in result if r.get(date_field, "") <= fecha_hasta]

    return result
```

---

## 8. utils/validators.py

```python
"""
utils/validators.py
────────────────────
Validaciones de archivos subidos:
extensión, tamaño y tipo MIME.
"""

import os
from pathlib import Path
from fastapi import HTTPException, UploadFile

from config import settings


async def validate_image(file: UploadFile) -> bytes:
    """
    Valida que el archivo sea una imagen permitida y
    que no supere el tamaño máximo configurado.

    Extensiones permitidas: jpg, jpeg, png, webp
    Tamaño máximo: definido en .env (MAX_FILE_SIZE_MB)

    Args:
        file: Archivo subido desde el form.

    Returns:
        Contenido del archivo en bytes.

    Raises:
        HTTPException 400: Si la extensión no es válida.
        HTTPException 413: Si el archivo supera el tamaño máximo.
    """
    extension = Path(file.filename or "").suffix.lower()

    if extension not in settings.ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Formato de imagen no permitido: '{extension}'. "
                f"Permitidos: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}"
            ),
        )

    content = await file.read()

    if len(content) > settings.MAX_FILE_SIZE_BYTES:
        size_mb = len(content) / (1024 * 1024)
        max_mb = settings.MAX_FILE_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail=(
                f"El archivo pesa {size_mb:.1f}MB. "
                f"El máximo permitido es {max_mb:.0f}MB."
            ),
        )

    return content


async def validate_document(file: UploadFile) -> bytes:
    """
    Valida que el archivo sea un documento permitido.

    Extensiones permitidas: pdf, doc, docx, xls, xlsx, ppt, pptx
    Tamaño máximo: definido en .env (MAX_FILE_SIZE_MB)

    Args:
        file: Archivo subido desde el form.

    Returns:
        Contenido del archivo en bytes.

    Raises:
        HTTPException 400: Si la extensión no es válida.
        HTTPException 413: Si el archivo supera el tamaño máximo.
    """
    extension = Path(file.filename or "").suffix.lower()

    if extension not in settings.ALLOWED_DOC_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Formato de documento no permitido: '{extension}'. "
                f"Permitidos: {', '.join(settings.ALLOWED_DOC_EXTENSIONS)}"
            ),
        )

    content = await file.read()

    if len(content) > settings.MAX_FILE_SIZE_BYTES:
        size_mb = len(content) / (1024 * 1024)
        max_mb = settings.MAX_FILE_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail=(
                f"El archivo pesa {size_mb:.1f}MB. "
                f"El máximo permitido es {max_mb:.0f}MB."
            ),
        )

    return content


def save_file(content: bytes, folder: Path, filename: str) -> str:
    """
    Guarda un archivo en el sistema local.

    Args:
        content: Contenido del archivo en bytes.
        folder: Carpeta destino.
        filename: Nombre del archivo con extensión.

    Returns:
        URL relativa del archivo guardado.
        Ejemplo: '/uploads/noticias/uuid.jpg'
    """
    folder.mkdir(parents=True, exist_ok=True)
    file_path = folder / filename

    with open(file_path, "wb") as f:
        f.write(content)

    # Retorna URL relativa que el frontend usará
    relative_path = str(file_path).replace(".", "", 1).replace("\\", "/")
    return relative_path


def delete_file(file_url: str) -> bool:
    """
    Elimina un archivo del sistema local dado su URL relativa.

    Args:
        file_url: URL relativa del archivo. Ej: '/uploads/noticias/uuid.jpg'

    Returns:
        True si se eliminó, False si no existía.
    """
    if not file_url:
        return False

    # Convierte URL relativa a ruta del sistema
    file_path = Path("." + file_url)

    if file_path.exists():
        file_path.unlink()
        return True

    return False
```

---

## 9. middleware/auth.py

```python
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

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings
from utils.file_handler import read_json

# ── Configuración de hashing de contraseñas ───────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compara una contraseña en texto plano con su hash almacenado.

    Args:
        plain_password: Contraseña ingresada por el usuario.
        hashed_password: Hash almacenado en admin_users.json.

    Returns:
        True si coinciden, False en caso contrario.
    """
    return pwd_context.verify(plain_password, hashed_password)


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
```

---

## 10. models/schemas.py

```python
"""
models/schemas.py
──────────────────
Modelos Pydantic para validación de requests y responses.
Cada sección corresponde a un módulo del sistema.
"""

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field, field_validator


# ═══════════════════════════════════════════════════════════
#  RESPUESTAS ESTÁNDAR
# ═══════════════════════════════════════════════════════════

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int
    hasNextPage: bool
    hasPrevPage: bool


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any = None
    message: str = "Operación exitosa"


class PaginatedResponse(BaseModel):
    success: bool = True
    data: dict  # { items: [...], pagination: {...} }


class ErrorResponse(BaseModel):
    success: bool = False
    error: dict  # { code: str, message: str }


# ═══════════════════════════════════════════════════════════
#  AUTENTICACIÓN
# ═══════════════════════════════════════════════════════════

class LoginRequest(BaseModel):
    """Datos requeridos para iniciar sesión."""
    username: str = Field(..., min_length=3, max_length=50, description="Nombre de usuario")
    password: str = Field(..., min_length=6, description="Contraseña")


class UserPublic(BaseModel):
    """Datos del usuario que se exponen en la API (sin password_hash)."""
    id: str
    username: str
    email: str
    nombre_completo: str
    rol: str


class LoginResponse(BaseModel):
    success: bool = True
    data: dict  # { token: str, user: UserPublic }


# ═══════════════════════════════════════════════════════════
#  NOTICIAS
# ═══════════════════════════════════════════════════════════

class NoticiaCreate(BaseModel):
    """
    Datos para crear una noticia.
    La imagen se recibe como archivo separado (multipart/form-data).
    """
    titulo: str = Field(..., min_length=5, max_length=255, description="Título de la noticia")
    descripcion: str = Field(..., min_length=10, description="Contenido de la noticia")
    categoria: str = Field(..., description="Categoría de la noticia")
    fecha: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Fecha en formato YYYY-MM-DD")
    activo: bool = Field(True, description="Si la noticia está publicada")

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        from config import settings
        if v not in settings.CATEGORIAS_NOTICIAS:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_NOTICIAS}")
        return v


class NoticiaUpdate(BaseModel):
    """
    Datos para actualizar una noticia.
    Todos los campos son opcionales.
    """
    titulo: Optional[str] = Field(None, min_length=5, max_length=255)
    descripcion: Optional[str] = Field(None, min_length=10)
    categoria: Optional[str] = None
    fecha: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    activo: Optional[bool] = None

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        if v is None:
            return v
        from config import settings
        if v not in settings.CATEGORIAS_NOTICIAS:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_NOTICIAS}")
        return v


class NoticiaOut(BaseModel):
    """Representación de una noticia en las respuestas."""
    id: str
    titulo: str
    imagen_url: Optional[str]
    descripcion: str
    categoria: str
    activo: bool
    fecha: str
    created_at: str
    updated_at: str
    created_by: Optional[str]


# ═══════════════════════════════════════════════════════════
#  DOCENTES
# ═══════════════════════════════════════════════════════════

class DocenteCreate(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=255, description="Nombre completo del docente")
    email: Optional[str] = Field(None, description="Correo electrónico del docente")
    materias: str = Field(..., min_length=3, description="Materias separadas por coma")
    especialidad: Optional[str] = Field(None, max_length=255)
    activo: bool = Field(True)


class DocenteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=3, max_length=255)
    email: Optional[str] = None
    materias: Optional[str] = Field(None, min_length=3)
    especialidad: Optional[str] = None
    activo: Optional[bool] = None


class DocenteOut(BaseModel):
    id: str
    nombre: str
    email: Optional[str]
    foto_url: Optional[str]
    materias: str
    especialidad: Optional[str]
    activo: bool
    created_at: str
    updated_at: str


# ═══════════════════════════════════════════════════════════
#  FAQ
# ═══════════════════════════════════════════════════════════

class FAQCreate(BaseModel):
    pregunta: str = Field(..., min_length=10, max_length=500, description="Pregunta frecuente")
    respuesta: str = Field(..., min_length=10, description="Respuesta completa")
    categoria: str = Field(..., description="Categoría de la pregunta")
    orden: int = Field(0, ge=0, description="Orden de aparición (mayor = antes)")
    activo: bool = Field(True)

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        from config import settings
        if v not in settings.CATEGORIAS_FAQ:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_FAQ}")
        return v


class FAQUpdate(BaseModel):
    pregunta: Optional[str] = Field(None, min_length=10, max_length=500)
    respuesta: Optional[str] = Field(None, min_length=10)
    categoria: Optional[str] = None
    orden: Optional[int] = Field(None, ge=0)
    activo: Optional[bool] = None

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        if v is None:
            return v
        from config import settings
        if v not in settings.CATEGORIAS_FAQ:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_FAQ}")
        return v


class FAQOut(BaseModel):
    id: str
    pregunta: str
    respuesta: str
    categoria: str
    orden: int
    activo: bool
    created_at: str
    updated_at: str


# ═══════════════════════════════════════════════════════════
#  DOCUMENTOS
# ═══════════════════════════════════════════════════════════

class DocumentoCreate(BaseModel):
    titulo: str = Field(..., min_length=5, max_length=255)
    descripcion: Optional[str] = Field(None)
    categoria: str = Field(...)
    activo: bool = Field(True)

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        from config import settings
        if v not in settings.CATEGORIAS_DOCUMENTOS:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_DOCUMENTOS}")
        return v


class DocumentoUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=5, max_length=255)
    descripcion: Optional[str] = None
    categoria: Optional[str] = None
    activo: Optional[bool] = None

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        if v is None:
            return v
        from config import settings
        if v not in settings.CATEGORIAS_DOCUMENTOS:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_DOCUMENTOS}")
        return v


class DocumentoOut(BaseModel):
    id: str
    titulo: str
    descripcion: Optional[str]
    categoria: str
    archivo_url: str
    archivo_nombre: str
    archivo_size: int
    archivo_tipo: str
    activo: bool
    fecha_subida: str
    updated_at: str


# ═══════════════════════════════════════════════════════════
#  CHATBOT
# ═══════════════════════════════════════════════════════════

class ChatbotQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Pregunta del usuario")


class ChatbotKnowledgeCreate(BaseModel):
    keywords: List[str] = Field(..., min_length=1, description="Palabras clave que activan esta respuesta")
    respuesta: str = Field(..., min_length=10, description="Respuesta del chatbot en Markdown")
    categoria: str = Field(...)
    activo: bool = Field(True)

    @field_validator("categoria")
    @classmethod
    def validate_categoria(cls, v):
        from config import settings
        if v not in settings.CATEGORIAS_CHATBOT:
            raise ValueError(f"Categoría inválida. Opciones: {settings.CATEGORIAS_CHATBOT}")
        return v


class ChatbotKnowledgeUpdate(BaseModel):
    keywords: Optional[List[str]] = None
    respuesta: Optional[str] = Field(None, min_length=10)
    categoria: Optional[str] = None
    activo: Optional[bool] = None


class ChatbotQueryResponse(BaseModel):
    success: bool = True
    data: dict  # { respuesta, fuente, confianza }


# ═══════════════════════════════════════════════════════════
#  BULK DELETE
# ═══════════════════════════════════════════════════════════

class BulkDeleteRequest(BaseModel):
    """Usado para eliminar múltiples registros a la vez."""
    ids: List[str] = Field(..., min_length=1, description="Lista de IDs a eliminar")
```

---

## 11. routes/auth.py

```python
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
```

---

## 12. routes/noticias.py

```python
"""
routes/noticias.py
───────────────────
Endpoints de Noticias:

PÚBLICO:
  GET  /noticias           → Listar noticias activas (con filtros y paginación)
  GET  /noticias/{id}      → Obtener una noticia por ID

ADMIN (requiere JWT):
  GET    /admin/noticias            → Listar todas (activas e inactivas)
  POST   /admin/noticias            → Crear noticia (con imagen)
  PUT    /admin/noticias/{id}       → Actualizar noticia
  DELETE /admin/noticias/{id}       → Eliminar una noticia
  DELETE /admin/noticias/bulk       → Eliminar múltiples noticias
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status

from config import settings
from middleware.auth import get_current_user
from models.schemas import BulkDeleteRequest, NoticiaUpdate
from utils.file_handler import (
    bulk_delete,
    delete_record,
    find_by_id,
    insert_record,
    read_json,
    update_record,
)
from utils.pagination import (
    filter_by_date_range,
    filter_by_field,
    paginate,
    search_in_fields,
    sort_items,
)
from utils.uuid_helper import generate_uuid
from utils.validators import delete_file, save_file, validate_image

router = APIRouter(tags=["Noticias"])


# ─── PÚBLICO ─────────────────────────────────────────────────────────────────

@router.get("/noticias", summary="Listar noticias públicas")
def listar_noticias_publicas(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Items por página"),
    categoria: Optional[str] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Buscar en título o descripción"),
    fecha_desde: Optional[str] = Query(None, description="Fecha inicio YYYY-MM-DD"),
    fecha_hasta: Optional[str] = Query(None, description="Fecha fin YYYY-MM-DD"),
    sort: str = Query("fecha", description="Campo de ordenamiento"),
    order: str = Query("desc", description="Orden: asc o desc"),
):
    """
    Lista las noticias publicadas (activo=True) con soporte para:
    - Paginación
    - Búsqueda por texto en título y descripción
    - Filtro por categoría
    - Filtro por rango de fechas
    - Ordenamiento por cualquier campo
    """
    items = read_json(settings.FILE_NOTICIAS)

    # Solo noticias activas para el público
    items = filter_by_field(items, "activo", True)

    if categoria:
        items = filter_by_field(items, "categoria", categoria)

    if search:
        items = search_in_fields(items, search, ["titulo", "descripcion"])

    if fecha_desde or fecha_hasta:
        items = filter_by_date_range(items, "fecha", fecha_desde, fecha_hasta)

    items = sort_items(items, sort, order)

    return {"success": True, "data": paginate(items, page, limit)}


@router.get("/noticias/{noticia_id}", summary="Obtener una noticia por ID")
def obtener_noticia(noticia_id: str):
    """
    Retorna una noticia específica.
    Solo retorna noticias activas para usuarios no autenticados.
    """
    noticia = find_by_id(settings.FILE_NOTICIAS, noticia_id)

    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada.")

    if not noticia.get("activo", True):
        raise HTTPException(status_code=404, detail="Noticia no disponible.")

    return {"success": True, "data": noticia}


# ─── ADMIN ────────────────────────────────────────────────────────────────────

@router.get("/admin/noticias", summary="[Admin] Listar todas las noticias")
def admin_listar_noticias(
    current_user: Annotated[dict, Depends(get_current_user)],
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    categoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
):
    """
    Lista todas las noticias (activas e inactivas).
    Solo accesible para administradores autenticados.
    """
    items = read_json(settings.FILE_NOTICIAS)

    if activo is not None:
        items = filter_by_field(items, "activo", activo)

    if categoria:
        items = filter_by_field(items, "categoria", categoria)

    if search:
        items = search_in_fields(items, search, ["titulo", "descripcion"])

    items = sort_items(items, sort, order)

    return {"success": True, "data": paginate(items, page, limit)}


@router.post("/admin/noticias", status_code=201, summary="[Admin] Crear noticia")
async def admin_crear_noticia(
    current_user: Annotated[dict, Depends(get_current_user)],
    titulo: str = Form(..., min_length=5, max_length=255),
    descripcion: str = Form(..., min_length=10),
    categoria: str = Form(...),
    fecha: str = Form(...),
    activo: bool = Form(True),
    imagen: Optional[UploadFile] = File(None),
):
    """
    Crea una nueva noticia.

    - Acepta multipart/form-data
    - La imagen es opcional
    - Valida categoría, fecha, y restricciones de imagen
    """
    # Validar categoría
    if categoria not in settings.CATEGORIAS_NOTICIAS:
        raise HTTPException(
            status_code=400,
            detail=f"Categoría inválida. Opciones: {settings.CATEGORIAS_NOTICIAS}",
        )

    noticia_id = generate_uuid()
    now = datetime.now(timezone.utc).isoformat()
    imagen_url = None

    # Procesar imagen si se adjuntó
    if imagen and imagen.filename:
        content = await validate_image(imagen)
        extension = Path(imagen.filename).suffix.lower()
        filename = f"{noticia_id}{extension}"
        imagen_url = save_file(content, settings.UPLOADS_NOTICIAS, filename)

    noticia = {
        "id": noticia_id,
        "titulo": titulo,
        "imagen_url": imagen_url,
        "descripcion": descripcion,
        "categoria": categoria,
        "activo": activo,
        "fecha": fecha,
        "created_at": now,
        "updated_at": now,
        "created_by": current_user["id"],
    }

    insert_record(settings.FILE_NOTICIAS, noticia)

    return {
        "success": True,
        "message": "Noticia creada correctamente.",
        "data": noticia,
    }


@router.put("/admin/noticias/{noticia_id}", summary="[Admin] Actualizar noticia")
async def admin_actualizar_noticia(
    noticia_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    titulo: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    categoria: Optional[str] = Form(None),
    fecha: Optional[str] = Form(None),
    activo: Optional[bool] = Form(None),
    imagen: Optional[UploadFile] = File(None),
):
    """
    Actualiza una noticia existente.

    Todos los campos son opcionales. Solo se actualizan los que se envían.
    Si se envía una nueva imagen, la anterior es eliminada del sistema.
    """
    noticia = find_by_id(settings.FILE_NOTICIAS, noticia_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada.")

    if categoria and categoria not in settings.CATEGORIAS_NOTICIAS:
        raise HTTPException(
            status_code=400,
            detail=f"Categoría inválida. Opciones: {settings.CATEGORIAS_NOTICIAS}",
        )

    updates: dict = {"updated_at": datetime.now(timezone.utc).isoformat()}

    if titulo is not None:
        updates["titulo"] = titulo
    if descripcion is not None:
        updates["descripcion"] = descripcion
    if categoria is not None:
        updates["categoria"] = categoria
    if fecha is not None:
        updates["fecha"] = fecha
    if activo is not None:
        updates["activo"] = activo

    # Reemplazar imagen si se adjunta nueva
    if imagen and imagen.filename:
        content = await validate_image(imagen)
        # Eliminar imagen anterior
        if noticia.get("imagen_url"):
            delete_file(noticia["imagen_url"])
        extension = Path(imagen.filename).suffix.lower()
        filename = f"{noticia_id}{extension}"
        updates["imagen_url"] = save_file(content, settings.UPLOADS_NOTICIAS, filename)

    updated = update_record(settings.FILE_NOTICIAS, noticia_id, updates)

    return {
        "success": True,
        "message": "Noticia actualizada correctamente.",
        "data": updated,
    }


@router.delete("/admin/noticias/bulk", summary="[Admin] Eliminar múltiples noticias")
def admin_eliminar_noticias_bulk(
    body: BulkDeleteRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    """
    Elimina múltiples noticias por ID.
    También elimina las imágenes asociadas del sistema de archivos.
    """
    noticias = read_json(settings.FILE_NOTICIAS)

    # Eliminar archivos de imagen de las noticias afectadas
    for noticia in noticias:
        if noticia["id"] in body.ids and noticia.get("imagen_url"):
            delete_file(noticia["imagen_url"])

    deleted = bulk_delete(settings.FILE_NOTICIAS, body.ids)

    return {
        "success": True,
        "message": f"{deleted} noticia(s) eliminada(s) correctamente.",
    }


@router.delete("/admin/noticias/{noticia_id}", summary="[Admin] Eliminar una noticia")
def admin_eliminar_noticia(
    noticia_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    """Elimina una noticia y su imagen asociada."""
    noticia = find_by_id(settings.FILE_NOTICIAS, noticia_id)

    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada.")

    # Eliminar imagen del sistema de archivos
    if noticia.get("imagen_url"):
        delete_file(noticia["imagen_url"])

    delete_record(settings.FILE_NOTICIAS, noticia_id)

    return {"success": True, "message": "Noticia eliminada correctamente."}
```

---

## 13. routes/docentes.py

```python
"""
routes/docentes.py
───────────────────
Endpoints de Docentes:

PÚBLICO:
  GET  /docentes          → Listar docentes activos
  GET  /docentes/{id}     → Obtener un docente

ADMIN (requiere JWT):
  GET    /admin/docentes
  POST   /admin/docentes
  PUT    /admin/docentes/{id}
  DELETE /admin/docentes/{id}
  DELETE /admin/docentes/bulk
"""

from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from config import settings
from middleware.auth import get_current_user
from models.schemas import BulkDeleteRequest
from utils.file_handler import (
    bulk_delete,
    delete_record,
    find_by_id,
    insert_record,
    read_json,
    update_record,
)
from utils.pagination import filter_by_field, paginate, search_in_fields, sort_items
from utils.uuid_helper import generate_uuid
from utils.validators import delete_file, save_file, validate_image

router = APIRouter(tags=["Docentes"])


# ─── PÚBLICO ─────────────────────────────────────────────────────────────────

@router.get("/docentes", summary="Listar docentes activos")
def listar_docentes(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Buscar por nombre o materias"),
    sort: str = Query("nombre"),
    order: str = Query("asc"),
):
    """Lista solo docentes con activo=True."""
    items = read_json(settings.FILE_DOCENTES)
    items = filter_by_field(items, "activo", True)

    if search:
        items = search_in_fields(items, search, ["nombre", "materias", "especialidad"])

    items = sort_items(items, sort, order)
    return {"success": True, "data": paginate(items, page, limit)}


@router.get("/docentes/{docente_id}", summary="Obtener un docente por ID")
def obtener_docente(docente_id: str):
    docente = find_by_id(settings.FILE_DOCENTES, docente_id)

    if not docente or not docente.get("activo", True):
        raise HTTPException(status_code=404, detail="Docente no encontrado.")

    return {"success": True, "data": docente}


# ─── ADMIN ────────────────────────────────────────────────────────────────────

@router.get("/admin/docentes", summary="[Admin] Listar todos los docentes")
def admin_listar_docentes(
    current_user: Annotated[dict, Depends(get_current_user)],
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    sort: str = Query("nombre"),
    order: str = Query("asc"),
):
    items = read_json(settings.FILE_DOCENTES)

    if activo is not None:
        items = filter_by_field(items, "activo", activo)

    if search:
        items = search_in_fields(items, search, ["nombre", "materias", "especialidad"])

    items = sort_items(items, sort, order)
    return {"success": True, "data": paginate(items, page, limit)}


@router.post("/admin/docentes", status_code=201, summary="[Admin] Crear docente")
async def admin_crear_docente(
    current_user: Annotated[dict, Depends(get_current_user)],
    nombre: str = Form(..., min_length=3, max_length=255),
    materias: str = Form(...),
    email: Optional[str] = Form(None),
    especialidad: Optional[str] = Form(None),
    activo: bool = Form(True),
    foto: Optional[UploadFile] = File(None),
):
    """
    Crea un nuevo docente.
    La foto es opcional. Si se adjunta, se valida y guarda localmente.
    """
    docente_id = generate_uuid()
    now = datetime.now(timezone.utc).isoformat()
    foto_url = None

    if foto and foto.filename:
        content = await validate_image(foto)
        extension = Path(foto.filename).suffix.lower()
        filename = f"{docente_id}{extension}"
        foto_url = save_file(content, settings.UPLOADS_DOCENTES, filename)

    docente = {
        "id": docente_id,
        "nombre": nombre,
        "email": email,
        "foto_url": foto_url,
        "materias": materias,
        "especialidad": especialidad,
        "activo": activo,
        "created_at": now,
        "updated_at": now,
        "created_by": current_user["id"],
    }

    insert_record(settings.FILE_DOCENTES, docente)

    return {"success": True, "message": "Docente creado correctamente.", "data": docente}


@router.put("/admin/docentes/{docente_id}", summary="[Admin] Actualizar docente")
async def admin_actualizar_docente(
    docente_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    nombre: Optional[str] = Form(None),
    materias: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    especialidad: Optional[str] = Form(None),
    activo: Optional[bool] = Form(None),
    foto: Optional[UploadFile] = File(None),
):
    docente = find_by_id(settings.FILE_DOCENTES, docente_id)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado.")

    updates: dict = {"updated_at": datetime.now(timezone.utc).isoformat()}

    if nombre is not None:
        updates["nombre"] = nombre
    if materias is not None:
        updates["materias"] = materias
    if email is not None:
        updates["email"] = email
    if especialidad is not None:
        updates["especialidad"] = especialidad
    if activo is not None:
        updates["activo"] = activo

    if foto and foto.filename:
        content = await validate_image(foto)
        if docente.get("foto_url"):
            delete_file(docente["foto_url"])
        extension = Path(foto.filename).suffix.lower()
        filename = f"{docente_id}{extension}"
        updates["foto_url"] = save_file(content, settings.UPLOADS_DOCENTES, filename)

    updated = update_record(settings.FILE_DOCENTES, docente_id, updates)

    return {"success": True, "message": "Docente actualizado correctamente.", "data": updated}


@router.delete("/admin/docentes/bulk", summary="[Admin] Eliminar múltiples docentes")
def admin_eliminar_docentes_bulk(
    body: BulkDeleteRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    docentes = read_json(settings.FILE_DOCENTES)
    for docente in docentes:
        if docente["id"] in body.ids and docente.get("foto_url"):
            delete_file(docente["foto_url"])

    deleted = bulk_delete(settings.FILE_DOCENTES, body.ids)
    return {"success": True, "message": f"{deleted} docente(s) eliminado(s) correctamente."}


@router.delete("/admin/docentes/{docente_id}", summary="[Admin] Eliminar un docente")
def admin_eliminar_docente(
    docente_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    docente = find_by_id(settings.FILE_DOCENTES, docente_id)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado.")

    if docente.get("foto_url"):
        delete_file(docente["foto_url"])

    delete_record(settings.FILE_DOCENTES, docente_id)
    return {"success": True, "message": "Docente eliminado correctamente."}
```

---

## 14. routes/faq.py

```python
"""
routes/faq.py
──────────────
Endpoints de Preguntas Frecuentes (FAQ):

PÚBLICO:
  GET  /faq                → Listar FAQs activas (con filtros)

ADMIN (requiere JWT):
  GET    /admin/faq
  POST   /admin/faq
  PUT    /admin/faq/{id}
  DELETE /admin/faq/{id}
  DELETE /admin/faq/bulk
"""

from datetime import datetime, timezone
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from config import settings
from middleware.auth import get_current_user
from models.schemas import BulkDeleteRequest, FAQCreate, FAQUpdate
from utils.file_handler import (
    bulk_delete,
    delete_record,
    find_by_id,
    insert_record,
    read_json,
    update_record,
)
from utils.pagination import filter_by_field, search_in_fields, sort_items
from utils.uuid_helper import generate_uuid

router = APIRouter(tags=["FAQ"])


# ─── PÚBLICO ─────────────────────────────────────────────────────────────────

@router.get("/faq", summary="Listar preguntas frecuentes")
def listar_faq(
    categoria: Optional[str] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Buscar en pregunta o respuesta"),
):
    """
    Lista las FAQs activas.
    Ordenadas por campo 'orden' de forma ascendente.
    """
    items = read_json(settings.FILE_FAQ)
    items = filter_by_field(items, "activo", True)

    if categoria:
        items = filter_by_field(items, "categoria", categoria)

    if search:
        items = search_in_fields(items, search, ["pregunta", "respuesta"])

    # Ordenar por campo 'orden' ascendente
    items = sort_items(items, "orden", "asc")

    return {"success": True, "data": items}


# ─── ADMIN ────────────────────────────────────────────────────────────────────

@router.get("/admin/faq", summary="[Admin] Listar todas las FAQs")
def admin_listar_faq(
    current_user: Annotated[dict, Depends(get_current_user)],
    activo: Optional[bool] = Query(None),
    categoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    items = read_json(settings.FILE_FAQ)

    if activo is not None:
        items = filter_by_field(items, "activo", activo)
    if categoria:
        items = filter_by_field(items, "categoria", categoria)
    if search:
        items = search_in_fields(items, search, ["pregunta", "respuesta"])

    items = sort_items(items, "orden", "asc")
    return {"success": True, "data": items}


@router.post("/admin/faq", status_code=201, summary="[Admin] Crear pregunta FAQ")
def admin_crear_faq(
    body: FAQCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    now = datetime.now(timezone.utc).isoformat()

    faq = {
        "id": generate_uuid(),
        "pregunta": body.pregunta,
        "respuesta": body.respuesta,
        "categoria": body.categoria,
        "orden": body.orden,
        "activo": body.activo,
        "created_at": now,
        "updated_at": now,
    }

    insert_record(settings.FILE_FAQ, faq)
    return {"success": True, "message": "Pregunta FAQ creada correctamente.", "data": faq}


@router.put("/admin/faq/{faq_id}", summary="[Admin] Actualizar FAQ")
def admin_actualizar_faq(
    faq_id: str,
    body: FAQUpdate,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    faq = find_by_id(settings.FILE_FAQ, faq_id)
    if not faq:
        raise HTTPException(status_code=404, detail="Pregunta FAQ no encontrada.")

    updates = body.model_dump(exclude_none=True)
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    updated = update_record(settings.FILE_FAQ, faq_id, updates)
    return {"success": True, "message": "FAQ actualizada correctamente.", "data": updated}


@router.delete("/admin/faq/bulk", summary="[Admin] Eliminar múltiples FAQs")
def admin_eliminar_faq_bulk(
    body: BulkDeleteRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    deleted = bulk_delete(settings.FILE_FAQ, body.ids)
    return {"success": True, "message": f"{deleted} pregunta(s) eliminada(s) correctamente."}


@router.delete("/admin/faq/{faq_id}", summary="[Admin] Eliminar FAQ")
def admin_eliminar_faq(
    faq_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    if not find_by_id(settings.FILE_FAQ, faq_id):
        raise HTTPException(status_code=404, detail="Pregunta FAQ no encontrada.")

    delete_record(settings.FILE_FAQ, faq_id)
    return {"success": True, "message": "Pregunta FAQ eliminada correctamente."}
```

---

## 15. routes/documentos.py

```python
"""
routes/documentos.py
─────────────────────
Endpoints de Documentos:

PÚBLICO:
  GET  /documentos          → Listar documentos activos
  GET  /documentos/{id}     → Obtener un documento

ADMIN (requiere JWT):
  GET    /admin/documentos
  POST   /admin/documentos
  PUT    /admin/documentos/{id}
  DELETE /admin/documentos/{id}
  DELETE /admin/documentos/bulk
"""

from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from config import settings
from middleware.auth import get_current_user
from models.schemas import BulkDeleteRequest, DocumentoUpdate
from utils.file_handler import (
    bulk_delete,
    delete_record,
    find_by_id,
    insert_record,
    read_json,
    update_record,
)
from utils.pagination import filter_by_field, paginate, search_in_fields, sort_items
from utils.uuid_helper import generate_uuid
from utils.validators import delete_file, save_file, validate_document

router = APIRouter(tags=["Documentos"])


# ─── PÚBLICO ─────────────────────────────────────────────────────────────────

@router.get("/documentos", summary="Listar documentos públicos")
def listar_documentos(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    categoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Buscar en título o descripción"),
    sort: str = Query("fecha_subida"),
    order: str = Query("desc"),
):
    items = read_json(settings.FILE_DOCUMENTOS)
    items = filter_by_field(items, "activo", True)

    if categoria:
        items = filter_by_field(items, "categoria", categoria)
    if search:
        items = search_in_fields(items, search, ["titulo", "descripcion"])

    items = sort_items(items, sort, order)
    return {"success": True, "data": paginate(items, page, limit)}


@router.get("/documentos/{documento_id}", summary="Obtener un documento por ID")
def obtener_documento(documento_id: str):
    doc = find_by_id(settings.FILE_DOCUMENTOS, documento_id)

    if not doc or not doc.get("activo", True):
        raise HTTPException(status_code=404, detail="Documento no encontrado.")

    return {"success": True, "data": doc}


# ─── ADMIN ────────────────────────────────────────────────────────────────────

@router.get("/admin/documentos", summary="[Admin] Listar todos los documentos")
def admin_listar_documentos(
    current_user: Annotated[dict, Depends(get_current_user)],
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    categoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort: str = Query("fecha_subida"),
    order: str = Query("desc"),
):
    items = read_json(settings.FILE_DOCUMENTOS)

    if activo is not None:
        items = filter_by_field(items, "activo", activo)
    if categoria:
        items = filter_by_field(items, "categoria", categoria)
    if search:
        items = search_in_fields(items, search, ["titulo", "descripcion"])

    items = sort_items(items, sort, order)
    return {"success": True, "data": paginate(items, page, limit)}


@router.post("/admin/documentos", status_code=201, summary="[Admin] Subir documento")
async def admin_crear_documento(
    current_user: Annotated[dict, Depends(get_current_user)],
    titulo: str = Form(..., min_length=5, max_length=255),
    categoria: str = Form(...),
    descripcion: Optional[str] = Form(None),
    activo: bool = Form(True),
    archivo: UploadFile = File(...),
):
    """
    Sube un nuevo documento.
    El archivo es OBLIGATORIO (pdf, doc, docx, xls, xlsx, ppt, pptx).
    Tamaño máximo: MAX_FILE_SIZE_MB del .env.
    """
    if categoria not in settings.CATEGORIAS_DOCUMENTOS:
        raise HTTPException(
            status_code=400,
            detail=f"Categoría inválida. Opciones: {settings.CATEGORIAS_DOCUMENTOS}",
        )

    doc_id = generate_uuid()
    now = datetime.now(timezone.utc).isoformat()

    # Validar y guardar el archivo
    content = await validate_document(archivo)
    extension = Path(archivo.filename).suffix.lower()
    filename = f"{doc_id}{extension}"
    archivo_url = save_file(content, settings.UPLOADS_DOCUMENTOS, filename)

    documento = {
        "id": doc_id,
        "titulo": titulo,
        "descripcion": descripcion,
        "categoria": categoria,
        "archivo_url": archivo_url,
        "archivo_nombre": archivo.filename,
        "archivo_size": len(content),
        "archivo_tipo": archivo.content_type or "application/octet-stream",
        "activo": activo,
        "fecha_subida": now,
        "updated_at": now,
        "created_by": current_user["id"],
    }

    insert_record(settings.FILE_DOCUMENTOS, documento)

    return {"success": True, "message": "Documento subido correctamente.", "data": documento}


@router.put("/admin/documentos/{documento_id}", summary="[Admin] Actualizar documento")
async def admin_actualizar_documento(
    documento_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    titulo: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    categoria: Optional[str] = Form(None),
    activo: Optional[bool] = Form(None),
    archivo: Optional[UploadFile] = File(None),
):
    doc = find_by_id(settings.FILE_DOCUMENTOS, documento_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado.")

    if categoria and categoria not in settings.CATEGORIAS_DOCUMENTOS:
        raise HTTPException(
            status_code=400,
            detail=f"Categoría inválida. Opciones: {settings.CATEGORIAS_DOCUMENTOS}",
        )

    updates: dict = {"updated_at": datetime.now(timezone.utc).isoformat()}

    if titulo is not None:
        updates["titulo"] = titulo
    if descripcion is not None:
        updates["descripcion"] = descripcion
    if categoria is not None:
        updates["categoria"] = categoria
    if activo is not None:
        updates["activo"] = activo

    # Reemplazar archivo si se adjunta uno nuevo
    if archivo and archivo.filename:
        content = await validate_document(archivo)
        if doc.get("archivo_url"):
            delete_file(doc["archivo_url"])
        extension = Path(archivo.filename).suffix.lower()
        filename = f"{documento_id}{extension}"
        updates["archivo_url"] = save_file(content, settings.UPLOADS_DOCUMENTOS, filename)
        updates["archivo_nombre"] = archivo.filename
        updates["archivo_size"] = len(content)
        updates["archivo_tipo"] = archivo.content_type or "application/octet-stream"

    updated = update_record(settings.FILE_DOCUMENTOS, documento_id, updates)
    return {"success": True, "message": "Documento actualizado correctamente.", "data": updated}


@router.delete("/admin/documentos/bulk", summary="[Admin] Eliminar múltiples documentos")
def admin_eliminar_documentos_bulk(
    body: BulkDeleteRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    documentos = read_json(settings.FILE_DOCUMENTOS)
    for doc in documentos:
        if doc["id"] in body.ids and doc.get("archivo_url"):
            delete_file(doc["archivo_url"])

    deleted = bulk_delete(settings.FILE_DOCUMENTOS, body.ids)
    return {"success": True, "message": f"{deleted} documento(s) eliminado(s) correctamente."}


@router.delete("/admin/documentos/{documento_id}", summary="[Admin] Eliminar documento")
def admin_eliminar_documento(
    documento_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    doc = find_by_id(settings.FILE_DOCUMENTOS, documento_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado.")

    if doc.get("archivo_url"):
        delete_file(doc["archivo_url"])

    delete_record(settings.FILE_DOCUMENTOS, documento_id)
    return {"success": True, "message": "Documento eliminado correctamente."}
```

---

## 16. routes/chatbot.py

```python
"""
routes/chatbot.py
──────────────────
Endpoints del Chatbot:

PÚBLICO:
  POST /chatbot/query              → Consulta al chatbot

ADMIN (requiere JWT):
  GET    /admin/chatbot            → Ver knowledge base
  POST   /admin/chatbot            → Agregar respuesta
  PUT    /admin/chatbot/{id}       → Editar respuesta
  DELETE /admin/chatbot/{id}       → Eliminar respuesta

ALGORITMO:
  1. Normalizar query (lowercase, sin acentos)
  2. Buscar en chatbot_knowledge por keywords (coincidencia parcial)
  3. Calcular puntuación por cantidad de keywords que coinciden
  4. Si no hay match suficiente, buscar en FAQ
  5. Si tampoco hay match, retornar respuesta genérica
"""

import unicodedata
from datetime import datetime, timezone
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from config import settings
from middleware.auth import get_current_user
from models.schemas import BulkDeleteRequest, ChatbotKnowledgeCreate, ChatbotKnowledgeUpdate, ChatbotQuery
from utils.file_handler import (
    bulk_delete,
    delete_record,
    find_by_id,
    insert_record,
    read_json,
    update_record,
)
from utils.pagination import filter_by_field, paginate, search_in_fields, sort_items
from utils.uuid_helper import generate_uuid

router = APIRouter(tags=["Chatbot"])

# Umbral mínimo de confianza para considerar un match válido
CONFIDENCE_THRESHOLD = 0.3

RESPUESTA_GENERICA = (
    "Lo siento, no encontré información específica sobre tu consulta. "
    "Te recomiendo contactar directamente a la ULEAM Extensión El Carmen:\n\n"
    "📍 **Dirección:** El Carmen, Manabí, Ecuador\n"
    "📞 **Teléfono:** (05) 276-xxxx\n"
    "📧 **Email:** extensionelcarmen@uleam.edu.ec\n\n"
    "O también puedes revisar nuestra sección de [Preguntas Frecuentes](/faq)."
)


def normalize_text(text: str) -> str:
    """
    Normaliza texto para búsqueda:
    - Convierte a minúsculas
    - Elimina acentos (tildes)
    - Elimina caracteres especiales

    Args:
        text: Texto a normalizar.

    Returns:
        Texto normalizado.
    """
    text = text.lower().strip()
    # Eliminar acentos
    nfkd = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in nfkd if not unicodedata.combining(c))
    return text


def calculate_confidence(query_words: list[str], keywords: list[str]) -> float:
    """
    Calcula la confianza de un match entre la query y los keywords.

    Algoritmo:
    - Por cada keyword del registro, verifica si aparece en la query
    - La confianza es el porcentaje de keywords que coinciden

    Args:
        query_words: Palabras normalizadas de la query del usuario.
        keywords: Lista de keywords del registro del chatbot.

    Returns:
        Float entre 0.0 y 1.0 representando la confianza.
    """
    if not keywords:
        return 0.0

    query_text = " ".join(query_words)
    matches = sum(
        1 for kw in keywords if normalize_text(kw) in query_text
    )

    return matches / len(keywords)


# ─── PÚBLICO ─────────────────────────────────────────────────────────────────

@router.post("/chatbot/query", summary="Consultar al chatbot")
def chatbot_query(body: ChatbotQuery):
    """
    Procesa una consulta del usuario y retorna la respuesta más relevante.

    Pasos:
    1. Normaliza la query del usuario
    2. Busca en chatbot_knowledge por coincidencia de keywords
    3. Si no hay match con confianza suficiente, busca en FAQ
    4. Si no hay match en ninguno, retorna respuesta genérica
    5. Retorna la mejor respuesta con su fuente y nivel de confianza
    """
    query_normalized = normalize_text(body.query)
    query_words = query_normalized.split()

    # ── Paso 1: Buscar en Knowledge Base ──────────────────────────────────
    knowledge_items = read_json(settings.FILE_CHATBOT)
    active_knowledge = [k for k in knowledge_items if k.get("activo", True)]

    best_match = None
    best_confidence = 0.0

    for item in active_knowledge:
        keywords = item.get("keywords", [])
        confidence = calculate_confidence(query_words, keywords)

        if confidence > best_confidence:
            best_confidence = confidence
            best_match = item

    if best_match and best_confidence >= CONFIDENCE_THRESHOLD:
        return {
            "success": True,
            "data": {
                "respuesta": best_match["respuesta"],
                "fuente": "knowledge_base",
                "confianza": round(best_confidence, 2),
                "categoria": best_match.get("categoria"),
            },
        }

    # ── Paso 2: Buscar en FAQ ──────────────────────────────────────────────
    faq_items = read_json(settings.FILE_FAQ)
    active_faq = [f for f in faq_items if f.get("activo", True)]

    best_faq = None
    best_faq_confidence = 0.0

    for faq in active_faq:
        pregunta_normalized = normalize_text(faq.get("pregunta", ""))
        pregunta_words = pregunta_normalized.split()

        # Contar cuántas palabras de la query aparecen en la pregunta
        matches = sum(1 for word in query_words if word in pregunta_words and len(word) > 2)
        confidence = matches / max(len(query_words), 1)

        if confidence > best_faq_confidence:
            best_faq_confidence = confidence
            best_faq = faq

    if best_faq and best_faq_confidence >= CONFIDENCE_THRESHOLD:
        return {
            "success": True,
            "data": {
                "respuesta": best_faq["respuesta"],
                "fuente": "faq",
                "confianza": round(best_faq_confidence, 2),
                "categoria": best_faq.get("categoria"),
            },
        }

    # ── Paso 3: Respuesta genérica ─────────────────────────────────────────
    return {
        "success": True,
        "data": {
            "respuesta": RESPUESTA_GENERICA,
            "fuente": "default",
            "confianza": 0.0,
            "categoria": None,
        },
    }


# ─── ADMIN ────────────────────────────────────────────────────────────────────

@router.get("/admin/chatbot", summary="[Admin] Listar knowledge base")
def admin_listar_chatbot(
    current_user: Annotated[dict, Depends(get_current_user)],
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    categoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    items = read_json(settings.FILE_CHATBOT)

    if activo is not None:
        items = filter_by_field(items, "activo", activo)
    if categoria:
        items = filter_by_field(items, "categoria", categoria)
    if search:
        items = search_in_fields(items, search, ["respuesta", "categoria"])

    items = sort_items(items, "created_at", "desc")
    return {"success": True, "data": paginate(items, page, limit)}


@router.post("/admin/chatbot", status_code=201, summary="[Admin] Agregar entrada a knowledge base")
def admin_crear_conocimiento(
    body: ChatbotKnowledgeCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    """
    Agrega una nueva entrada a la knowledge base del chatbot.

    Los 'keywords' son palabras clave que, al aparecer en la consulta
    del usuario, activarán esta respuesta.

    Ejemplo:
        keywords: ["matrícula", "inscribir", "registrar", "matricular"]
        respuesta: "Para matricularte necesitas presentar..."
    """
    now = datetime.now(timezone.utc).isoformat()

    item = {
        "id": generate_uuid(),
        "keywords": [kw.lower().strip() for kw in body.keywords],
        "respuesta": body.respuesta,
        "categoria": body.categoria,
        "activo": body.activo,
        "created_at": now,
        "updated_at": now,
    }

    insert_record(settings.FILE_CHATBOT, item)
    return {"success": True, "message": "Entrada de chatbot creada correctamente.", "data": item}


@router.put("/admin/chatbot/{item_id}", summary="[Admin] Actualizar entrada de chatbot")
def admin_actualizar_conocimiento(
    item_id: str,
    body: ChatbotKnowledgeUpdate,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    item = find_by_id(settings.FILE_CHATBOT, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Entrada de chatbot no encontrada.")

    updates = body.model_dump(exclude_none=True)

    # Normalizar keywords si se actualizan
    if "keywords" in updates:
        updates["keywords"] = [kw.lower().strip() for kw in updates["keywords"]]

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    updated = update_record(settings.FILE_CHATBOT, item_id, updates)
    return {"success": True, "message": "Entrada actualizada correctamente.", "data": updated}


@router.delete("/admin/chatbot/bulk", summary="[Admin] Eliminar múltiples entradas")
def admin_eliminar_chatbot_bulk(
    body: BulkDeleteRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    deleted = bulk_delete(settings.FILE_CHATBOT, body.ids)
    return {"success": True, "message": f"{deleted} entrada(s) de chatbot eliminada(s)."}


@router.delete("/admin/chatbot/{item_id}", summary="[Admin] Eliminar entrada de chatbot")
def admin_eliminar_conocimiento(
    item_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    if not find_by_id(settings.FILE_CHATBOT, item_id):
        raise HTTPException(status_code=404, detail="Entrada de chatbot no encontrada.")

    delete_record(settings.FILE_CHATBOT, item_id)
    return {"success": True, "message": "Entrada de chatbot eliminada correctamente."}
```

---

## 17. seed.py

```python
"""
seed.py
────────
Inicializa los archivos JSON con datos de ejemplo.
Ejecutar UNA SOLA VEZ antes de arrancar el backend por primera vez.

Uso:
    python seed.py

Genera:
  - Un usuario administrador por defecto
  - 3 noticias de ejemplo
  - 4 docentes de ejemplo
  - 5 preguntas FAQ de ejemplo
  - 5 entradas en la knowledge base del chatbot
"""

from datetime import datetime, timezone
from pathlib import Path

from config import settings
from middleware.auth import hash_password
from utils.file_handler import write_json
from utils.uuid_helper import generate_uuid


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def seed_admin_users():
    print("→ Creando usuario administrador...")

    admin_id = generate_uuid()
    users = [
        {
            "id": admin_id,
            "username": "admin",
            "email": "admin@uleam.edu.ec",
            "password_hash": hash_password("admin123"),
            "nombre_completo": "Administrador del Sistema",
            "rol": "superadmin",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "ultimo_acceso": None,
        }
    ]

    write_json(settings.FILE_USERS, users)
    print(f"  ✓ Usuario: admin | Contraseña: admin123 | Rol: superadmin")
    return admin_id


def seed_noticias(admin_id: str):
    print("→ Creando noticias de ejemplo...")

    noticias = [
        {
            "id": generate_uuid(),
            "titulo": "Inauguración de Nuevas Instalaciones en El Carmen",
            "imagen_url": None,
            "descripcion": (
                "La ULEAM Extensión El Carmen celebró la inauguración de sus nuevas "
                "instalaciones académicas, que incluyen laboratorios equipados, aulas "
                "interactivas y espacios de estudio colaborativo para los estudiantes "
                "de la carrera de Administración de Empresas."
            ),
            "categoria": "Infraestructura",
            "activo": True,
            "fecha": "2026-03-15",
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "titulo": "Estudiantes ULEAM Ganan Concurso Nacional de Emprendimiento",
            "imagen_url": None,
            "descripcion": (
                "Un equipo de cinco estudiantes de la carrera de Administración de "
                "Empresas representó a la ULEAM en el Concurso Nacional de Emprendimiento "
                "Universitario, obteniendo el primer lugar con su proyecto de agricultura "
                "sostenible para la zona tropical húmeda de Manabí."
            ),
            "categoria": "Logros Estudiantiles",
            "activo": True,
            "fecha": "2026-02-28",
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "titulo": "Proceso de Admisión 2026 — Segunda Fase Abierta",
            "imagen_url": None,
            "descripcion": (
                "La ULEAM Extensión El Carmen anuncia la apertura de la segunda fase "
                "del proceso de admisión para el ciclo académico 2026. Los aspirantes "
                "pueden presentar su documentación en secretaría hasta el 30 de junio. "
                "Se ofrecen 60 cupos para la carrera de Administración de Empresas."
            ),
            "categoria": "Académico",
            "activo": True,
            "fecha": "2026-06-01",
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
    ]

    write_json(settings.FILE_NOTICIAS, noticias)
    print(f"  ✓ {len(noticias)} noticias creadas")


def seed_docentes(admin_id: str):
    print("→ Creando docentes de ejemplo...")

    docentes = [
        {
            "id": generate_uuid(),
            "nombre": "Dr. Carlos Mendoza Zambrano",
            "email": "carlos.mendoza@uleam.edu.ec",
            "foto_url": None,
            "materias": "Administración Estratégica, Gestión Empresarial",
            "especialidad": "Administración Estratégica",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "nombre": "Mgs. Ana Lucía Torres Ponce",
            "email": "ana.torres@uleam.edu.ec",
            "foto_url": None,
            "materias": "Contabilidad General, Finanzas Empresariales",
            "especialidad": "Contabilidad y Finanzas",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "nombre": "Ing. Roberto Cedeño Alcívar",
            "email": "roberto.cedeno@uleam.edu.ec",
            "foto_url": None,
            "materias": "Marketing Digital, Investigación de Mercados",
            "especialidad": "Marketing y Comercio",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "nombre": "Mgs. Patricia Vera Intriago",
            "email": "patricia.vera@uleam.edu.ec",
            "foto_url": None,
            "materias": "Recursos Humanos, Comportamiento Organizacional",
            "especialidad": "Gestión del Talento Humano",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
    ]

    write_json(settings.FILE_DOCENTES, docentes)
    print(f"  ✓ {len(docentes)} docentes creados")


def seed_faq():
    print("→ Creando preguntas frecuentes...")

    faqs = [
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuáles son los requisitos para ingresar a la carrera?",
            "respuesta": (
                "Para ingresar a la carrera de Administración de Empresas necesitas:\n\n"
                "- **Bachillerato completo** (título de bachiller o acta de grado)\n"
                "- **Cédula de identidad** vigente\n"
                "- **Certificado de votación** (si aplica)\n"
                "- **Puntaje SENESCYT** vigente\n"
                "- **2 fotografías** tamaño carnet en fondo blanco\n\n"
                "Presentar la documentación original y una copia en secretaría."
            ),
            "categoria": "Admisión",
            "orden": 1,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuál es el costo de la matrícula?",
            "respuesta": (
                "La ULEAM es una institución de educación superior pública, por lo tanto "
                "**la matrícula es gratuita** para todos los estudiantes regulares.\n\n"
                "Sin embargo, existen algunos costos administrativos mínimos:\n"
                "- Derecho de matrícula: $25 USD\n"
                "- Seguro estudiantil: $15 USD\n"
                "- Materiales de laboratorio (si aplica): variable\n\n"
                "Para información actualizada sobre aranceles, consulta en secretaría."
            ),
            "categoria": "Pagos",
            "orden": 2,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuánto dura la carrera de Administración de Empresas?",
            "respuesta": (
                "La carrera de **Administración de Empresas** tiene una duración de:\n\n"
                "- **8 semestres** (4 años) para obtener el título de Tecnólogo\n"
                "- **10 semestres** (5 años) para obtener la Licenciatura\n\n"
                "Más el tiempo dedicado al trabajo de titulación y prácticas preprofesionales.\n\n"
                "El plan de estudios incluye materias de formación básica, profesional "
                "y optativas de especialización."
            ),
            "categoria": "Académico",
            "orden": 3,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuáles son los horarios de atención en secretaría?",
            "respuesta": (
                "La secretaría de la ULEAM Extensión El Carmen atiende:\n\n"
                "📅 **Lunes a Viernes:**\n"
                "- Mañana: 8:00 AM – 12:30 PM\n"
                "- Tarde: 2:30 PM – 6:00 PM\n\n"
                "📅 **Sábados:** 8:00 AM – 12:00 PM\n\n"
                "📍 **Ubicación:** Av. Universitaria, El Carmen, Manabí\n"
                "📞 **Teléfono:** (05) 276-xxxx"
            ),
            "categoria": "Horarios",
            "orden": 4,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cómo puedo obtener mi certificado de matrícula?",
            "respuesta": (
                "Para obtener tu certificado de matrícula:\n\n"
                "1. Acércate a **secretaría** con tu cédula de identidad\n"
                "2. Solicita el certificado indicando el período académico\n"
                "3. El trámite demora **1 a 2 días hábiles**\n"
                "4. El costo es de **$2 USD** por certificado\n\n"
                "También puedes solicitarlo por correo a: secretaria.elcarmen@uleam.edu.ec"
            ),
            "categoria": "Trámites",
            "orden": 5,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
    ]

    write_json(settings.FILE_FAQ, faqs)
    print(f"  ✓ {len(faqs)} preguntas FAQ creadas")


def seed_chatbot():
    print("→ Creando knowledge base del chatbot...")

    knowledge = [
        {
            "id": generate_uuid(),
            "keywords": ["matricula", "matricular", "inscripcion", "inscribir", "registro", "registrar"],
            "respuesta": (
                "Para **matricularte** en la ULEAM Extensión El Carmen necesitas:\n\n"
                "📋 **Documentos requeridos:**\n"
                "- Título de bachiller o acta de grado\n"
                "- Cédula de identidad\n"
                "- Puntaje SENESCYT vigente\n"
                "- Certificado de votación\n"
                "- 2 fotos tamaño carnet\n\n"
                "📍 Preséntate en secretaría de lunes a viernes de 8:00 AM a 6:00 PM."
            ),
            "categoria": "Matrícula",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["requisito", "ingreso", "admision", "ingresar", "postular"],
            "respuesta": (
                "Los **requisitos de admisión** para la ULEAM son:\n\n"
                "✅ Bachillerato completo\n"
                "✅ Cédula de identidad vigente\n"
                "✅ Puntaje SENESCYT\n"
                "✅ Certificado de votación\n"
                "✅ 2 fotografías carnet fondo blanco\n\n"
                "El proceso de admisión se abre dos veces al año. "
                "Consulta las fechas en nuestras [noticias](/noticias)."
            ),
            "categoria": "Admisión",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["malla", "materias", "plan", "pensum", "asignaturas", "curriculum"],
            "respuesta": (
                "La **malla curricular** de Administración de Empresas incluye:\n\n"
                "📚 **Área Básica (1-2 semestre):**\n"
                "- Matemáticas, Estadística, Comunicación\n\n"
                "📚 **Área Profesional (3-8 semestre):**\n"
                "- Administración, Finanzas, Marketing, RRHH\n\n"
                "📚 **Área de Especialización (9-10 semestre):**\n"
                "- Optativas según tu perfil profesional\n\n"
                "Descarga la malla completa en nuestra sección de [Documentos](/documentos)."
            ),
            "categoria": "Malla Curricular",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["costo", "precio", "pagar", "arancel", "cuanto", "valor", "gratuito"],
            "respuesta": (
                "La ULEAM es una **universidad pública**, por lo que la educación "
                "es gratuita para los estudiantes regulares.\n\n"
                "💰 **Costos administrativos aproximados:**\n"
                "- Derecho de matrícula: $25 USD\n"
                "- Seguro estudiantil: $15 USD\n\n"
                "Para información exacta y actualizada, consulta en secretaría "
                "o revisa los [Aranceles oficiales](/documentos)."
            ),
            "categoria": "Costos",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["contacto", "telefono", "correo", "email", "direccion", "donde", "ubicacion"],
            "respuesta": (
                "📍 **ULEAM Extensión El Carmen**\n\n"
                "**Dirección:** Av. Universitaria s/n, El Carmen, Manabí, Ecuador\n\n"
                "📞 **Teléfono:** (05) 276-xxxx\n\n"
                "📧 **Email:** extensionelcarmen@uleam.edu.ec\n\n"
                "🕐 **Horario de atención:**\n"
                "Lunes a Viernes: 8:00 AM – 12:30 PM y 2:30 PM – 6:00 PM\n"
                "Sábados: 8:00 AM – 12:00 PM"
            ),
            "categoria": "Contacto",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
    ]

    write_json(settings.FILE_CHATBOT, knowledge)
    print(f"  ✓ {len(knowledge)} entradas de chatbot creadas")


def seed_documentos():
    """Crea un archivo JSON vacío para documentos."""
    write_json(settings.FILE_DOCUMENTOS, [])
    print("  ✓ Archivo de documentos inicializado (vacío)")


if __name__ == "__main__":
    print("\n🌱 Iniciando seed de datos para ULEAM Backend...\n")

    admin_id = seed_admin_users()
    seed_noticias(admin_id)
    seed_docentes(admin_id)
    seed_faq()
    seed_chatbot()
    seed_documentos()

    print("\n✅ Seed completado exitosamente.\n")
    print("Credenciales del administrador:")
    print("  Usuario:    admin")
    print("  Contraseña: admin123")
    print("\nAhora puedes ejecutar el backend con:")
    print("  uvicorn main:app --host 0.0.0.0 --port 8000 --reload\n")
```

---

## 18. main.py

```python
"""
main.py
────────
Punto de entrada principal del backend ULEAM.

Configura la aplicación FastAPI con:
- CORS para permitir acceso desde el frontend local
- Servicio de archivos estáticos (uploads)
- Registro de todos los routers
- Manejadores globales de errores
- Endpoints de health check

Uso:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from routes import auth, chatbot, docentes, documentos, faq, noticias

# ─── Inicialización de la app ──────────────────────────────────────────────────

app = FastAPI(
    title="ULEAM — API Backend",
    description=(
        "API REST para el Sistema Académico de ULEAM Extensión El Carmen. "
        "Gestiona noticias, docentes, FAQ, documentos y el chatbot institucional. "
        "Sistema 100% local, sin base de datos, con persistencia en archivos JSON."
    ),
    version="1.0.0",
    contact={
        "name": "ULEAM Extensión El Carmen",
        "email": "extensionelcarmen@uleam.edu.ec",
    },
    openapi_tags=[
        {"name": "Health", "description": "Estado del servidor"},
        {"name": "Autenticación", "description": "Login y gestión de sesión"},
        {"name": "Noticias", "description": "CRUD de noticias institucionales"},
        {"name": "Docentes", "description": "CRUD de docentes de la carrera"},
        {"name": "FAQ", "description": "Gestión de preguntas frecuentes"},
        {"name": "Documentos", "description": "Gestión de documentos institucionales"},
        {"name": "Chatbot", "description": "Consultas y gestión del chatbot"},
    ],
)

# ─── Middleware CORS ──────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# ─── Archivos estáticos (uploads) ─────────────────────────────────────────────

# Los archivos subidos se sirven en /uploads/...
# Ejemplo: http://192.168.1.x:8000/uploads/noticias/uuid.jpg
app.mount(
    "/uploads",
    StaticFiles(directory=str(settings.UPLOADS_PATH)),
    name="uploads",
)

# ─── Registro de routers ──────────────────────────────────────────────────────

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(noticias.router, prefix=API_PREFIX)
app.include_router(docentes.router, prefix=API_PREFIX)
app.include_router(faq.router, prefix=API_PREFIX)
app.include_router(documentos.router, prefix=API_PREFIX)
app.include_router(chatbot.router, prefix=API_PREFIX)

# ─── Manejadores globales de errores ──────────────────────────────────────────

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": {
                "code": "NOT_FOUND",
                "message": f"Ruta '{request.url.path}' no encontrada.",
            },
        },
    )


@app.exception_handler(405)
async def method_not_allowed_handler(request: Request, exc):
    return JSONResponse(
        status_code=405,
        content={
            "success": False,
            "error": {
                "code": "METHOD_NOT_ALLOWED",
                "message": f"Método '{request.method}' no permitido para esta ruta.",
            },
        },
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Error interno del servidor. Revisa los logs.",
            },
        },
    )


# ─── Endpoints de sistema ──────────────────────────────────────────────────────

@app.get("/", tags=["Health"], summary="Bienvenida")
def root():
    """Endpoint raíz. Confirma que el servidor está en línea."""
    return {
        "sistema": "ULEAM — API Backend",
        "version": "1.0.0",
        "estado": "en línea",
        "documentacion": "/docs",
        "docs_alternativa": "/redoc",
    }


@app.get("/api/v1/health", tags=["Health"], summary="Health check completo")
def health_check():
    """
    Verifica el estado completo del sistema.
    Comprueba que todos los archivos JSON sean accesibles.
    """
    from utils.file_handler import count_records

    archivos = {
        "admin_users": settings.FILE_USERS.exists(),
        "noticias": settings.FILE_NOTICIAS.exists(),
        "docentes": settings.FILE_DOCENTES.exists(),
        "faq_items": settings.FILE_FAQ.exists(),
        "documentos": settings.FILE_DOCUMENTOS.exists(),
        "chatbot_knowledge": settings.FILE_CHATBOT.exists(),
    }

    conteos = {}
    if all(archivos.values()):
        conteos = {
            "noticias": count_records(settings.FILE_NOTICIAS),
            "docentes": count_records(settings.FILE_DOCENTES),
            "faq_items": count_records(settings.FILE_FAQ),
            "documentos": count_records(settings.FILE_DOCUMENTOS),
            "chatbot_entries": count_records(settings.FILE_CHATBOT),
        }

    todo_ok = all(archivos.values())

    return {
        "success": todo_ok,
        "estado": "OK" if todo_ok else "DEGRADADO",
        "archivos_json": archivos,
        "conteos": conteos,
        "configuracion": {
            "environment": settings.ENVIRONMENT,
            "data_path": str(settings.DATA_PATH),
            "uploads_path": str(settings.UPLOADS_PATH),
            "cors_origins": settings.CORS_ORIGINS,
            "token_expire_hours": settings.TOKEN_EXPIRE_HOURS,
        },
    }


@app.get("/api/v1/categorias", tags=["Health"], summary="Listar categorías válidas")
def listar_categorias():
    """
    Retorna todas las categorías válidas del sistema.
    El frontend usa este endpoint para llenar los dropdowns.
    """
    return {
        "success": True,
        "data": {
            "noticias": settings.CATEGORIAS_NOTICIAS,
            "documentos": settings.CATEGORIAS_DOCUMENTOS,
            "faq": settings.CATEGORIAS_FAQ,
            "chatbot": settings.CATEGORIAS_CHATBOT,
        },
    }
```

---

## 19. COMANDOS DE EJECUCIÓN

```bash
# ── 1. Ir a la carpeta del proyecto ──────────────────────────────────────────
cd uleam-backend

# ── 2. Crear entorno virtual (recomendado) ────────────────────────────────────
python -m venv venv

# En Linux/Mac:
source venv/bin/activate

# En Windows:
venv\Scripts\activate

# ── 3. Instalar dependencias ──────────────────────────────────────────────────
pip install -r requirements.txt

# ── 4. Crear el archivo .env (copiar el contenido de la sección .env arriba) ──
# Editar y ajustar la IP y SECRET_KEY según tu red local

# ── 5. Ejecutar el seed (UNA SOLA VEZ) ───────────────────────────────────────
python seed.py

# ── 6. Iniciar el servidor ────────────────────────────────────────────────────
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# ── El backend estará disponible en: ─────────────────────────────────────────
#   http://localhost:8000           → Verificar que está en línea
#   http://localhost:8000/docs      → Swagger UI (prueba de endpoints)
#   http://localhost:8000/redoc     → Documentación alternativa
#   http://localhost:8000/api/v1/health → Estado completo del sistema

# ── Desde otros dispositivos en la misma red LAN: ────────────────────────────
#   http://192.168.X.X:8000/docs   → (reemplazar con tu IP local)
```

---

## RESUMEN DE ENDPOINTS

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/api/v1/auth/login` | No | Login admin |
| POST | `/api/v1/auth/logout` | Sí | Logout |
| GET | `/api/v1/auth/me` | Sí | Usuario actual |
| GET | `/api/v1/noticias` | No | Noticias públicas |
| GET | `/api/v1/noticias/{id}` | No | Una noticia |
| GET | `/api/v1/admin/noticias` | Sí | Todas las noticias |
| POST | `/api/v1/admin/noticias` | Sí | Crear noticia |
| PUT | `/api/v1/admin/noticias/{id}` | Sí | Actualizar noticia |
| DELETE | `/api/v1/admin/noticias/{id}` | Sí | Eliminar noticia |
| DELETE | `/api/v1/admin/noticias/bulk` | Sí | Eliminar varias |
| GET | `/api/v1/docentes` | No | Docentes públicos |
| POST | `/api/v1/admin/docentes` | Sí | Crear docente |
| PUT | `/api/v1/admin/docentes/{id}` | Sí | Actualizar docente |
| DELETE | `/api/v1/admin/docentes/{id}` | Sí | Eliminar docente |
| GET | `/api/v1/faq` | No | FAQs públicas |
| POST | `/api/v1/admin/faq` | Sí | Crear FAQ |
| PUT | `/api/v1/admin/faq/{id}` | Sí | Actualizar FAQ |
| DELETE | `/api/v1/admin/faq/{id}` | Sí | Eliminar FAQ |
| GET | `/api/v1/documentos` | No | Docs públicos |
| POST | `/api/v1/admin/documentos` | Sí | Subir documento |
| PUT | `/api/v1/admin/documentos/{id}` | Sí | Actualizar doc |
| DELETE | `/api/v1/admin/documentos/{id}` | Sí | Eliminar doc |
| POST | `/api/v1/chatbot/query` | No | Consultar chatbot |
| GET | `/api/v1/admin/chatbot` | Sí | Ver knowledge base |
| POST | `/api/v1/admin/chatbot` | Sí | Agregar respuesta |
| PUT | `/api/v1/admin/chatbot/{id}` | Sí | Editar respuesta |
| DELETE | `/api/v1/admin/chatbot/{id}` | Sí | Eliminar respuesta |
| GET | `/api/v1/health` | No | Estado del sistema |
| GET | `/api/v1/categorias` | No | Categorías válidas |

---

---

---

# SECCIÓN 20 — SETUP COMPLETO EN UBUNTU LINUX
## Estado actual: chatbot funcionando → agregar backend + frontend

> **OS:** Ubuntu 22.04+ (directo en laptop, sin máquina virtual)
> **Ya funciona:** chat1 (Django + Ollama + Llama 3 8B)
> **Por construir:** Backend FastAPI + conexión con frontend React

---

## SITUACIÓN REAL DEL PROYECTO

```
TU LAPTOP (Ubuntu)
│
├── ✅ Ollama corriendo         → http://localhost:11434
├── ✅ chat1 (Django chatbot)   → http://localhost:8001
├── ⬜ uleam-backend (FastAPI)  → http://localhost:8000  ← POR CONSTRUIR
└── ⬜ web-chat (React)         → http://localhost:5173  ← POR CONECTAR
```

---

## PASO 1 — VERIFICAR LO QUE YA FUNCIONA

```bash
# Verificar Ollama
curl http://localhost:11434/api/tags
# Debe mostrar: {"models":[{"name":"llama3",...}]}

# Verificar chatbot Django
curl http://localhost:8001/health/
# Debe mostrar: {"success": true, "estado": {"chatbot": "OK",...}}

# Si el chatbot no está corriendo, levantarlo:
cd ~/uleam/chat1
source env/bin/activate
python manage.py runserver 0.0.0.0:8001
```

---

## PASO 2 — CONSTRUIR EL BACKEND FASTAPI

```bash
# Crear la carpeta del backend junto al chatbot
mkdir ~/uleam/uleam-backend
cd ~/uleam/uleam-backend

# Crear entorno virtual
python3 -m venv env
source env/bin/activate

# Instalar dependencias
pip install fastapi==0.111.0 uvicorn[standard]==0.29.0 \
    python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 \
    python-multipart==0.0.9 aiofiles==23.2.1 python-dotenv==1.0.1 \
    Pillow==10.3.0

pip freeze > requirements.txt
```

### Crear el archivo .env

```bash
cat > .env << 'EOF'
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
SECRET_KEY=uleam_clave_super_secreta_2026_elcarmen
ALGORITHM=HS256
TOKEN_EXPIRE_HOURS=24
DATA_PATH=./data
UPLOADS_PATH=./uploads
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
MAX_FILE_SIZE_MB=10
ALLOWED_IMAGE_EXTENSIONS=jpg,jpeg,png,webp
ALLOWED_DOC_EXTENSIONS=pdf,doc,docx,xls,xlsx,ppt,pptx
EOF
```

### Crear la estructura de carpetas

```bash
mkdir -p data uploads/noticias uploads/docentes uploads/documentos
mkdir -p routes utils middleware models
touch routes/__init__.py utils/__init__.py middleware/__init__.py models/__init__.py
```

### Copiar todos los archivos del documento anterior

Usar los archivos de las secciones 4-18 de este documento:
- `config.py`
- `utils/file_handler.py`
- `utils/uuid_helper.py`
- `utils/pagination.py`
- `utils/validators.py`
- `middleware/auth.py`
- `models/schemas.py`
- `routes/auth.py`
- `routes/noticias.py`
- `routes/docentes.py`
- `routes/faq.py`
- `routes/documentos.py`
- `routes/chatbot.py`
- `main.py`

### Inicializar datos y levantar

```bash
# Ejecutar seed (crea datos de ejemplo)
python seed.py

# Levantar el backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Verificar en navegador:
# http://localhost:8000/docs       ← Swagger UI
# http://localhost:8000/api/v1/health  ← Estado
```

---

## PASO 3 — CONECTAR EL FRONTEND REACT

```bash
# Instalar Node.js si no está
node --version  # Verificar si ya está instalado
# Si no: sudo apt install nodejs npm -y

# Ir al frontend
cd ~/uleam/web-chat
npm install

# Crear archivo de variables de entorno local
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:8000/api/v1
VITE_CHATBOT_URL=http://localhost:8001/api/chat/
VITE_UPLOADS_URL=http://localhost:8000/uploads
EOF

# Levantar el frontend
npm run dev
# Disponible en: http://localhost:5173
```

### Verificar URLs en el código React

```bash
# Buscar si hay URLs hardcodeadas que apunten a otro lugar
grep -r "http" src/ --include="*.ts" --include="*.tsx" | grep -v "localhost"
```

Si aparecen URLs externas, reemplazarlas por las variables de entorno:

```typescript
// Patrón correcto para usar en todos los archivos del frontend:
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";
const CHAT_URL = import.meta.env.VITE_CHATBOT_URL ?? "http://localhost:8001/api/chat/";
```

---

## PASO 4 — VERIFICAR QUE TODO FUNCIONA JUNTO

```bash
# Terminal 1 — Ollama (ya estaba corriendo)
ollama serve

# Terminal 2 — Backend FastAPI
cd ~/uleam/uleam-backend && source env/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 3 — Chatbot Django
cd ~/uleam/chat1 && source env/bin/activate
python manage.py runserver 0.0.0.0:8001

# Terminal 4 — Frontend React
cd ~/uleam/web-chat
npm run dev
```

### Checklist de verificación

```bash
# Ejecutar estos 4 comandos. Todos deben responder con éxito:

curl -s http://localhost:11434/api/tags | python3 -m json.tool
# ✅ Debe mostrar modelos de Ollama

curl -s http://localhost:8000/api/v1/health | python3 -m json.tool
# ✅ Debe mostrar estado OK del backend

curl -s -X POST http://localhost:8001/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "hola"}' | python3 -m json.tool
# ✅ Debe retornar respuesta del chatbot

curl -s http://localhost:5173
# ✅ Debe retornar HTML del frontend
```

---

## SCRIPT DE INICIO — start.sh

Crea este script para arrancar todo con un solo comando:

```bash
cat > ~/uleam/start.sh << 'EOF'
#!/bin/bash
set -e

echo ""
echo "======================================"
echo "  ULEAM El Carmen — Iniciando sistema"
echo "======================================"
echo ""

# 1. Ollama
echo "▶ [1/4] Ollama (IA local)..."
pkill ollama 2>/dev/null; sleep 1
ollama serve > /tmp/ollama.log 2>&1 &
sleep 4
echo "  ✓ http://localhost:11434"

# 2. Backend FastAPI
echo "▶ [2/4] Backend FastAPI..."
cd ~/uleam/uleam-backend
source env/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 > /tmp/fastapi.log 2>&1 &
sleep 3
echo "  ✓ http://localhost:8000"

# 3. Chatbot Django
echo "▶ [3/4] Chatbot Django..."
cd ~/uleam/chat1
source env/bin/activate
python manage.py runserver 0.0.0.0:8001 > /tmp/django.log 2>&1 &
sleep 3
echo "  ✓ http://localhost:8001"

# 4. Frontend React
echo "▶ [4/4] Frontend React..."
cd ~/uleam/web-chat
npm run dev > /tmp/react.log 2>&1 &
sleep 4
echo "  ✓ http://localhost:5173"

echo ""
echo "======================================"
echo "  Sistema listo"
echo ""
echo "  Abre en el navegador:"
echo "  → http://localhost:5173       (sistema completo)"
echo "  → http://localhost:8000/docs  (API backend)"
echo "  → http://localhost:8001       (chatbot directo)"
echo "======================================"
echo ""
echo "  Logs disponibles en:"
echo "  /tmp/ollama.log | /tmp/fastapi.log"
echo "  /tmp/django.log | /tmp/react.log"
echo ""
echo "  Para detener todo: pkill -f 'ollama|uvicorn|manage.py|vite'"
echo ""

# Mantener el script vivo
wait
EOF

chmod +x ~/uleam/start.sh
echo "Script creado. Ejecutar con: bash ~/uleam/start.sh"
```

---

## ESTRUCTURA FINAL DEL PROYECTO EN TU LAPTOP

```
~/uleam/
│
├── start.sh                    ← Arrancar todo con un comando
│
├── chat1/                      ← ✅ YA FUNCIONA
│   ├── env/                    ← Entorno virtual Python
│   ├── pages/                  ← App Django + RAG
│   ├── promo_admin/            ← Config Django
│   ├── documentos/             ← PDFs fuente del chatbot
│   ├── chroma_db/              ← Índice vectorial (auto-generado)
│   ├── manage.py
│   └── .env
│
├── uleam-backend/              ← ⬜ CONSTRUIR CON ESTE DOCUMENTO
│   ├── env/
│   ├── data/                   ← Persistencia JSON
│   ├── uploads/                ← Archivos subidos
│   ├── routes/
│   ├── utils/
│   ├── middleware/
│   ├── models/
│   ├── main.py
│   ├── config.py
│   ├── seed.py
│   └── .env
│
└── web-chat/                   ← ⬜ CONECTAR CON .env.local
    ├── src/
    ├── .env.local              ← Crear este archivo
    └── package.json
```

---

## PUERTOS DEL SISTEMA EN TU LAPTOP

| Puerto | Servicio | Estado |
|--------|----------|--------|
| 11434 | Ollama (Llama 3) | ✅ Corriendo |
| 8001 | Chatbot Django | ✅ Corriendo |
| 8000 | Backend FastAPI | ⬜ Por construir |
| 5173 | Frontend React | ⬜ Por conectar |

---

*ULEAM Backend v1.1.0 — Ubuntu Linux — FastAPI + Django + Ollama + RAG*
