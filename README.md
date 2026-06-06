# ULEAM Chatbot - Sistema Completo

Sistema de chatbot académico para la ULEAM Extensión El Carmen, compuesto por un backend FastAPI y un frontend React/TypeScript.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación del Backend](#instalación-del-backend)
- [Instalación del Frontend](#instalación-del-frontend)
- [Ejecución del Sistema](#ejecución-del-sistema)
- [Credenciales de Acceso](#credenciales-de-acceso)
- [API Endpoints](#api-endpoints)
- [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

### Backend
- Python 3.10 o superior
- pip (gestor de paquetes de Python)
- Entorno virtual de Python (recomendado)

### Frontend
- Node.js 18 o superior
- npm o yarn (gestor de paquetes de Node.js)

---

## Estructura del Proyecto

```
Chat (3)/
├── backend/              # Backend FastAPI
│   ├── config.py         # Configuración del sistema
│   ├── main.py           # Punto de entrada del servidor
│   ├── seed.py           # Script de inicialización de datos
│   ├── .env              # Variables de entorno del backend
│   ├── requirements.txt  # Dependencias de Python
│   ├── middleware/       # Middleware de autenticación
│   ├── models/           # Modelos Pydantic
│   ├── routes/           # Rutas API
│   ├── utils/            # Utilidades
│   └── data/             # Archivos JSON de datos
└── web/                  # Frontend React
    ├── .env              # Variables de entorno del frontend
    ├── package.json      # Dependencias de Node.js
    └── src/
        ├── app/
        │   ├── config/   # Configuración de API
        │   ├── services/ # Servicios API
        │   └── components/ # Componentes React
        └── main.tsx      # Punto de entrada
```

---

## Instalación del Backend

### 1. Navegar al directorio del backend

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/backend
```

### 2. Crear entorno virtual de Python

```bash
python3 -m venv venv
```

### 3. Activar el entorno virtual

```bash
source venv/bin/activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Ejecutar el script de inicialización de datos

```bash
python seed.py
```

Este script creará:
- Usuario administrador por defecto
- 3 noticias de ejemplo
- 4 docentes de ejemplo
- 5 preguntas frecuentes
- 5 entradas en la knowledge base del chatbot

---

## Instalación del Frontend

### 1. Navegar al directorio del frontend

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar configuración del backend

Asegúrate de que el archivo `.env` en el directorio `web/` contenga:

```
VITE_API_URL=http://localhost:8000
```

---

## Ejecución del Sistema

### Opción 1: Doble Click (Archivos .desktop) - RECOMENDADO

Para facilitar el uso, se han creado archivos de escritorio que permiten iniciar y detener el sistema con doble click:

- **Iniciar Sistema:** Doble click en `Iniciar Sistema.desktop`
- **Detener Sistema:** Doble click en `Detener Sistema.desktop`

**Nota:** Si al hacer doble click te pregunta si quieres confiar en el archivo, selecciona "Permitir ejecución" o "Marcar como confiable".

### Opción 2: Scripts de inicio rápido

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)
./start.sh
```

Para detener:
```bash
./stop.sh
```

### Opción 3: Ejecución en Terminales Separados

#### Terminal 1 - Backend

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

El backend estará disponible en: `http://localhost:8000`

#### Terminal 2 - Frontend

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/web
npm run dev
```

El frontend estará disponible en: `http://localhost:5173` (o el puerto que indique npm)

### Opción 2: Ejecución en Segundo Plano (Background)

#### Backend en segundo plano

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/backend
source venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
```

#### Frontend en segundo plano

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/web
nohup npm run dev > frontend.log 2>&1 &
```

### Verificar que el sistema está funcionando

1. **Backend:** Abre `http://localhost:8000/api/v1/health` en tu navegador
   - Deberías ver un JSON con el estado del sistema y conteos de datos

2. **Frontend:** Abre `http://localhost:5173` en tu navegador
   - Deberías ver la interfaz de ULEAM Chatbot

---

## Credenciales de Acceso

### Usuario Administrador

- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** `superadmin`

Estas credenciales se crean automáticamente al ejecutar `seed.py`.

---

## API Endpoints

### Pública (Sin autenticación)

#### Health Check
```
GET /api/v1/health
```

#### Noticias
```
GET /api/v1/noticias
GET /api/v1/noticias/{id}
```

#### Docentes
```
GET /api/v1/docentes
GET /api/v1/docentes/{id}
```

#### FAQ
```
GET /api/v1/faq
GET /api/v1/faq/{id}
```

#### Documentos
```
GET /api/v1/documentos
GET /api/v1/documentos/{id}
```

#### Chatbot
```
POST /api/v1/chatbot/query
Body: { "query": "tu pregunta" }
```

### Autenticación

#### Login
```
POST /api/v1/auth/login
Body: { "username": "admin", "password": "admin123" }
```

#### Logout
```
POST /api/v1/auth/logout
Header: Authorization: Bearer <token>
```

#### Obtener Usuario Actual
```
GET /api/v1/auth/me
Header: Authorization: Bearer <token>
```

### Admin (Requiere autenticación)

#### Noticias
```
POST /api/v1/admin/noticias
PUT /api/v1/admin/noticias/{id}
DELETE /api/v1/admin/noticias/{id}
```

#### Docentes
```
POST /api/v1/admin/docentes
PUT /api/v1/admin/docentes/{id}
DELETE /api/v1/admin/docentes/{id}
```

#### FAQ
```
POST /api/v1/admin/faq
PUT /api/v1/admin/faq/{id}
DELETE /api/v1/admin/faq/{id}
```

#### Documentos
```
POST /api/v1/admin/documentos
PUT /api/v1/admin/documentos/{id}
DELETE /api/v1/admin/documentos/{id}
```

#### Chatbot Knowledge Base
```
POST /api/v1/admin/chatbot/knowledge
PUT /api/v1/admin/chatbot/knowledge/{id}
DELETE /api/v1/admin/chatbot/knowledge/{id}
```

---

## Solución de Problemas

### Error: "python: command not found"

**Solución:** Instala Python 3:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv -y
```

### Error: "node: command not found"

**Solución:** Instala Node.js:
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

### Error: "ModuleNotFoundError: No module named 'dotenv'"

**Solución:** Asegúrate de haber activado el entorno virtual e instalado las dependencias:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Error: "Connection refused" en el frontend

**Solución:** Verifica que el backend esté ejecutándose:
```bash
curl http://localhost:8000/api/v1/health
```

Si no responde, inicia el backend nuevamente.

### Error: "CORS policy" en el navegador

**Solución:** Verifica que el archivo `.env` del backend contenga los orígenes correctos:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

### Error: "bcrypt" en el login

**Solución:** El middleware de autenticación usa bcrypt directo. Si tienes problemas, verifica que el seed.py se haya ejecutado correctamente después de modificar el middleware.

### Reinicializar datos del backend

Si necesitas reinicializar los datos:

```bash
cd backend
source venv/bin/activate
python seed.py
```

**Nota:** Esto sobrescribirá todos los datos existentes.

---

## Detener el Sistema

### Si ejecutas en terminales separados

- Presiona `Ctrl+C` en cada terminal

### Si ejecutas en segundo plano

```bash
# Detener backend
pkill -f "uvicorn main:app"

# Detener frontend
pkill -f "npm run dev"
```

---

## Documentación API Adicional

Una vez que el backend esté ejecutándose, puedes acceder a la documentación interactiva de la API:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo de ULEAM Extensión El Carmen.
