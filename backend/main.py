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
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
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

@app.on_event("startup")
async def startup_index_pdfs():
    """Indexa PDFs al iniciar el servidor si la colección está vacía."""
    import os
    from utils.vector_store import index_directory, _get_collection

    data_path = str(settings.DATA_PATH)
    if not os.path.exists(data_path):
        print("[STARTUP] Carpeta data/ no encontrada, omitiendo indexación")
        return

    try:
        collection = _get_collection()
        if collection.count() == 0:
            print("[STARTUP] Indexando PDFs por primera vez...")
            results = index_directory(data_path)
            total = sum(results.values())
            print(f"[STARTUP] Indexación completa: {total} chunks en {len(results)} archivos")
        else:
            print(f"[STARTUP] ChromaDB ya tiene {collection.count()} chunks, omitiendo re-indexación")
    except Exception as e:
        print(f"[STARTUP] Error en indexación: {e} — el chatbot usará fallback de keywords")


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
