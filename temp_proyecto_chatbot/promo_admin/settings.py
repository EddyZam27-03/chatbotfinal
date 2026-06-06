"""
Django settings for promo_admin project.

Configuración optimizada para desarrollo local del proyecto ULEAM Chatbot.
Autor: Maykel
"""

from pathlib import Path
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# =========================================
# RUTA BASE DEL PROYECTO
# =========================================
BASE_DIR = Path(__file__).resolve().parent.parent


# =========================================
# CONFIGURACIONES BÁSICAS
# =========================================
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'fallback-solo-desarrollo')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']


# =========================================
# APLICACIONES INSTALADAS
# =========================================
INSTALLED_APPS = [
    # Apps de Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Apps del proyecto
    'pages',     # 🧭 App de las páginas base del sitio
    'documents', # 📄 Gestión de documentos (subida desde admin)
]


# =========================================
# MIDDLEWARE
# =========================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =========================================
# CONFIGURACIÓN DE URLS Y WSGI
# =========================================
ROOT_URLCONF = 'promo_admin.urls'
WSGI_APPLICATION = 'promo_admin.wsgi.application'


# =========================================
# CONFIGURACIÓN DE PLANTILLAS (TEMPLATES)
# =========================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'pages/templates/pages',  # ✅ ruta exacta donde está base.html
            BASE_DIR / 'templates',              # 🌍 opcional global
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# =========================================
# BASE DE DATOS
# =========================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# =========================================
# VALIDADORES DE CONTRASEÑA
# =========================================
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# =========================================
# INTERNACIONALIZACIÓN
# =========================================
LANGUAGE_CODE = 'es-ec'           # Español Ecuador 🇪🇨
TIME_ZONE = 'America/Guayaquil'   # Zona horaria correcta
USE_I18N = True
USE_TZ = True


# =========================================
# ARCHIVOS ESTÁTICOS (CSS, JS, IMG)
# =========================================
STATIC_URL = '/static/'

# Rutas adicionales para buscar archivos estáticos
STATICFILES_DIRS = [
    BASE_DIR / "static",  # 📁 Carpeta global con logo, CSS, etc.
]

# Carpeta donde se recopilan los archivos estáticos en producción
STATIC_ROOT = BASE_DIR / "staticfiles"


# =========================================
# ARCHIVOS DE USUARIO (SUBIDAS)
# =========================================
MEDIA_URL = "/data/"
# BASE_DIR = temp_proyecto_chatbot/
# BASE_DIR.parent = raíz del repo
# BASE_DIR.parent / "backend" / "data" = carpeta compartida con FastAPI
MEDIA_ROOT = BASE_DIR.parent / "backend" / "data"


# =========================================
# CONFIGURACIÓN FINAL
# =========================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

