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
