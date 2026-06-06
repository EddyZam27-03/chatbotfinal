from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone


class Document(models.Model):
    CATEGORIAS = [
        ("malla", "Malla Curricular"),
        ("requisitos", "Requisitos de Ingreso"),
        ("cronograma", "Cronograma Académico"),
        ("general", "Información General"),
        ("otros", "Otros Documentos"),
    ]

    titulo = models.CharField(max_length=200, verbose_name="Título del documento")
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    archivo = models.FileField(
        upload_to="documentos/%Y/%m/",
        verbose_name="Archivo",
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "pdf",
                    "doc",
                    "docx",
                    "xls",
                    "xlsx",
                    "ppt",
                    "pptx",
                ]
            )
        ],
    )
    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS,
        default="general",
        verbose_name="Categoría",
    )
    fecha_subida = models.DateTimeField(default=timezone.now, verbose_name="Fecha de subida")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Documento"
        verbose_name_plural = "Documentos"
        ordering = ["-fecha_subida"]

    def __str__(self) -> str:
        return self.titulo
