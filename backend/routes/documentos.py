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
