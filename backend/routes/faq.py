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
