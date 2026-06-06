from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🌐 Sitio web principal (app pages, versión mejorada)
    path('', include('pages.urls')),

    # ❌ No incluir la carpeta 'chatbot' antigua
    # path('chat/', include('chatbot.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

