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
