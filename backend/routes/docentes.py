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
