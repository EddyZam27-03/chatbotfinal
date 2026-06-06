from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("titulo", "categoria", "activo", "fecha_subida", "actualizado")
    list_filter = ("categoria", "activo", "fecha_subida")
    search_fields = ("titulo", "descripcion")
    ordering = ("-fecha_subida",)
