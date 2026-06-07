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
        Ejemplo: 'uploads/noticias/uuid.jpg'
    """
    folder.mkdir(parents=True, exist_ok=True)
    file_path = folder / filename

    with open(file_path, "wb") as f:
        f.write(content)

    # Retorna URL relativa que el frontend usará (sin slash inicial)
    # Convertir ruta absoluta a relativa desde el directorio de trabajo
    import os
    cwd = Path.cwd()
    try:
        relative_path = file_path.relative_to(cwd)
    except ValueError:
        # Si file_path no está dentro de cwd, usar el nombre del archivo
        relative_path = Path(file_path.name)
    
    return str(relative_path).replace("\\", "/")


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
