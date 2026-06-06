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
