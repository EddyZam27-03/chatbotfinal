"""
routes/chatbot.py
──────────────────
Endpoints del Chatbot:

PÚBLICO:
  POST /chatbot/query              → Consulta al chatbot (usa Ollama LLM con contexto de PDFs)

ADMIN (requiere JWT):
  GET    /admin/chatbot            → Ver knowledge base
  POST   /admin/chatbot            → Agregar respuesta
  PUT    /admin/chatbot/{id}       → Editar respuesta
  DELETE /admin/chatbot/{id}       → Eliminar respuesta

ALGORITMO:
  Usa Ollama API con modelo llama3:8b para generar respuestas
  Usa contexto de PDFs en carpeta data/ para respuestas más precisas
"""

import json
import os
import requests
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
from utils.vector_store import semantic_search, index_directory
from utils.uuid_helper import generate_uuid

router = APIRouter(tags=["Chatbot"])

# Configuración de Ollama
OLLAMA_API_URL = "http://127.0.0.1:11434/api/chat"
OLLAMA_MODEL = "llama3:8b"

# Directorio de PDFs
PDFS_DIRECTORY = os.path.join(os.path.dirname(__file__), "..", "data")

# System prompt para el asistente de ULEAM
SYSTEM_PROMPT = (
    "Eres el Asistente Virtual de la carrera de Administración en la ULEAM, Extensión El Carmen. "
    "Tu objetivo es ayudar a estudiantes con requisitos, malla curricular, matrículas, horarios y trámites. "
    "IMPORTANTE: Si la respuesta contiene datos comparativos, materias o pasos, "
    "utiliza TABLAS de Markdown o LISTAS con viñetas. Sé profesional, conciso y amable. "
    "Usa el contexto proporcionado para responder con información precisa de los documentos oficiales."
)


# ─── PÚBLICO ─────────────────────────────────────────────────────────────────

@router.post("/chatbot/query", summary="Consultar al chatbot")
def chatbot_query(body: ChatbotQuery):
    """
    Procesa una consulta del usuario usando Ollama LLM (llama3:8b) con contexto de PDFs.

    Pasos:
    1. Busca fragmentos relevantes en los PDFs
    2. Envía la consulta con contexto a la API de Ollama
    3. Usa un system prompt personalizado para ULEAM
    4. Retorna la respuesta generada por el LLM
    """
    try:
        # Buscar contexto relevante en los PDFs usando búsqueda semántica
        relevant_contexts = semantic_search(body.query, max_results=5)
        
        # Construir el contexto para el prompt
        context_text = ""
        if relevant_contexts:
            context_text = "\n\n".join([
                f"De {ctx['filename']}: {ctx['text']}" 
                for ctx in relevant_contexts
            ])
        
        # Construir el prompt con contexto
        user_message = body.query
        if context_text:
            user_message = f"Contexto de documentos oficiales:\n{context_text}\n\nPregunta: {body.query}"
        
        # Construir mensajes con historial (máximo últimos 10 mensajes)
        messages_to_send = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        for msg in body.history[-10:]:
            messages_to_send.append({"role": msg.role, "content": msg.content})
        
        messages_to_send.append({"role": "user", "content": user_message})
        
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": OLLAMA_MODEL,
                "messages": messages_to_send,
                "stream": False
            },
            timeout=120
        )

        if response.status_code == 200:
            result = response.json()
            bot_reply = result.get("message", {}).get("content", "")
            
            return {
                "success": True,
                "data": {
                    "respuesta": bot_reply,
                    "fuente": "ollama_llm_with_pdfs",
                    "confianza": 1.0,
                    "categoria": "llm_generated",
                    "contexto_usado": len(relevant_contexts) > 0,
                },
            }
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Error al conectar con Ollama: {response.status_code}"
            )
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Timeout al conectar con Ollama. Verifica que el servicio esté corriendo."
        )
    except requests.exceptions.ConnectionError:
        # Ollama no está disponible — buscar en knowledge base local como fallback
        items = read_json(settings.FILE_CHATBOT)
        query_lower = body.query.lower()
        for item in items:
            if item.get("activo") and any(
                kw.lower() in query_lower for kw in item.get("keywords", [])
            ):
                return {
                    "success": True,
                    "data": {
                        "respuesta": item["respuesta"],
                        "fuente": "knowledge_base_fallback",
                        "confianza": 0.7,
                        "categoria": item.get("categoria"),
                        "contexto_usado": False,
                    },
                }
        raise HTTPException(
            status_code=503,
            detail="El servicio de IA no está disponible en este momento. Por favor intenta más tarde.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la consulta: {str(e)}"
        )


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


@router.post("/admin/chatbot/reindex", summary="[Admin] Re-indexar PDFs en ChromaDB")
def admin_reindexar_pdfs(
    current_user: Annotated[dict, Depends(get_current_user)],
):
    """
    Re-indexa todos los PDFs de backend/data/ en ChromaDB.
    Ejecutar después de subir nuevos PDFs desde el admin de Django.
    """
    results = index_directory(PDFS_DIRECTORY)
    total = sum(results.values())
    return {
        "success": True,
        "message": f"Re-indexación completa. {total} chunks en {len(results)} archivos.",
        "data": results,
    }
