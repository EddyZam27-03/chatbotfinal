# Especificación Técnica del Backend - Sistema ULEAM

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Stack Tecnológico Recomendado](#stack-tecnológico-recomendado)
3. [Modelos de Datos](#modelos-de-datos)
4. [API Endpoints](#api-endpoints)
5. [Autenticación y Seguridad](#autenticación-y-seguridad)
6. [Almacenamiento de Archivos](#almacenamiento-de-archivos)
7. [Integración con Frontend](#integración-con-frontend)

---

## Visión General

Sistema de gestión académica para ULEAM con área pública (estudiantes) y área privada (administradores).

**Módulos principales:**
- Gestión de Documentos
- Gestión de Docentes
- Gestión de Noticias
- Chatbot/FAQ
- Autenticación de Administradores

---

## Stack Tecnológico Recomendado

### Opción 1: Node.js + Express + PostgreSQL
```
- Runtime: Node.js 18+
- Framework: Express.js
- ORM: Prisma o Sequelize
- Base de datos: PostgreSQL 14+
- Almacenamiento: AWS S3 / Cloudinary / MinIO
- Autenticación: JWT + bcrypt
```

### Opción 2: Python + FastAPI + PostgreSQL
```
- Runtime: Python 3.10+
- Framework: FastAPI
- ORM: SQLAlchemy
- Base de datos: PostgreSQL 14+
- Almacenamiento: AWS S3 / Cloudinary
- Autenticación: JWT + passlib
```

### Opción 3: Laravel + MySQL
```
- Runtime: PHP 8.1+
- Framework: Laravel 10+
- ORM: Eloquent
- Base de datos: MySQL 8+
- Almacenamiento: Laravel Storage (S3/local)
- Autenticación: Laravel Sanctum
```

---

## Modelos de Datos

### 1. Usuario Administrador
```typescript
interface AdminUser {
  id: string;              // UUID
  username: string;        // Único, ej: "admin"
  email: string;           // Único
  password_hash: string;   // Bcrypt hash
  nombre_completo: string;
  rol: 'superadmin' | 'admin' | 'editor';
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  ultimo_acceso: Date | null;
}
```

**SQL Schema:**
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'editor',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso TIMESTAMP NULL
);

CREATE INDEX idx_admin_username ON admin_users(username);
CREATE INDEX idx_admin_email ON admin_users(email);
```

---

### 2. Documentos
```typescript
interface Documento {
  id: string;              // UUID
  titulo: string;          // Requerido
  descripcion: string;     // Opcional
  categoria: string;       // Reglamentos, Mallas, Calendarios, etc.
  archivo_url: string;     // URL del archivo
  archivo_nombre: string;  // Nombre original del archivo
  archivo_size: number;    // Tamaño en bytes
  archivo_tipo: string;    // MIME type (application/pdf, etc.)
  activo: boolean;
  fecha_subida: Date;
  ultima_modificacion: Date;
  created_by: string;      // UUID del admin que lo creó
}
```

**SQL Schema:**
```sql
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100) NOT NULL,
  archivo_url TEXT NOT NULL,
  archivo_nombre VARCHAR(255) NOT NULL,
  archivo_size INTEGER NOT NULL,
  archivo_tipo VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_doc_categoria ON documentos(categoria);
CREATE INDEX idx_doc_activo ON documentos(activo);
CREATE INDEX idx_doc_fecha ON documentos(fecha_subida DESC);
```

**Categorías válidas:**
- Reglamentos
- Mallas
- Calendarios
- Admisión
- Aranceles
- Otros

**Formatos permitidos:**
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- PowerPoint (.ppt, .pptx)

---

### 3. Docentes
```typescript
interface Docente {
  id: string;              // UUID
  nombre: string;          // Requerido
  email: string;           // Opcional, para contacto
  foto_url: string;        // URL de la imagen
  materias: string;        // Texto separado por comas
  especialidad: string;    // Opcional
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;      // UUID del admin
}
```

**SQL Schema:**
```sql
CREATE TABLE docentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  foto_url TEXT,
  materias TEXT NOT NULL,
  especialidad VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_docente_activo ON docentes(activo);
CREATE INDEX idx_docente_nombre ON docentes(nombre);
```

**Formatos de imagen permitidos:**
- JPG/JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

---

### 4. Noticias
```typescript
interface Noticia {
  id: string;              // UUID
  titulo: string;          // Requerido
  imagen_url: string;      // URL de imagen destacada
  descripcion: string;     // Contenido completo
  categoria: string;       // Infraestructura, Logros, etc.
  activo: boolean;
  fecha: Date;             // Fecha de publicación
  created_at: Date;
  updated_at: Date;
  created_by: string;      // UUID del admin
}
```

**SQL Schema:**
```sql
CREATE TABLE noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  imagen_url TEXT,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_noticia_categoria ON noticias(categoria);
CREATE INDEX idx_noticia_activo ON noticias(activo);
CREATE INDEX idx_noticia_fecha ON noticias(fecha DESC);
```

**Categorías válidas:**
- Infraestructura
- Logros Estudiantiles
- Convenios
- Eventos
- Académico
- Investigación

---

### 5. FAQ (Preguntas Frecuentes)
```typescript
interface FAQItem {
  id: string;              // UUID
  pregunta: string;        // Requerido
  respuesta: string;       // Requerido
  categoria: string;       // Admisión, Académico, Trámites, etc.
  orden: number;           // Para ordenar dentro de categoría
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}
```

**SQL Schema:**
```sql
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faq_categoria ON faq_items(categoria);
CREATE INDEX idx_faq_orden ON faq_items(orden);
```

---

### 6. Chatbot Knowledge Base
```typescript
interface KnowledgeItem {
  id: string;              // UUID
  keywords: string[];      // Array de palabras clave
  respuesta: string;       // Respuesta del chatbot
  categoria: string;       // Categorización
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}
```

**SQL Schema (PostgreSQL con JSONB):**
```sql
CREATE TABLE chatbot_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keywords JSONB NOT NULL,  -- ["matrícula", "inscripción", "registro"]
  respuesta TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chatbot_keywords ON chatbot_knowledge USING GIN(keywords);
CREATE INDEX idx_chatbot_categoria ON chatbot_knowledge(categoria);
```

---

## API Endpoints

### Base URL
```
Producción: https://api.uleam.edu.ec/v1
Desarrollo: http://localhost:3000/api/v1
```

---

### 🔐 Autenticación

#### POST /auth/login
Inicio de sesión de administrador.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@uleam.edu.ec",
      "nombre_completo": "Administrador Sistema",
      "rol": "superadmin"
    }
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "error": "Credenciales inválidas"
}
```

---

#### POST /auth/logout
Cerrar sesión (opcional, depende de si mantienes tokens en blacklist).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

#### GET /auth/me
Obtener información del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@uleam.edu.ec",
    "nombre_completo": "Administrador Sistema",
    "rol": "superadmin"
  }
}
```

---

### 📄 Documentos

#### GET /documentos
Listar documentos (público y admin).

**Query Parameters:**
```
?categoria=Reglamentos    // Filtro por categoría
&activo=true              // Solo activos (público)
&search=academico         // Búsqueda en título/descripción
&page=1                   // Página (default: 1)
&limit=10                 // Items por página (default: 10)
&sort=fecha_subida        // Campo de ordenamiento
&order=desc               // asc | desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "titulo": "Reglamento Académico 2024",
        "descripcion": "Normativa vigente",
        "categoria": "Reglamentos",
        "archivo_url": "https://...",
        "archivo_nombre": "reglamento-2024.pdf",
        "archivo_size": 2400000,
        "archivo_tipo": "application/pdf",
        "activo": true,
        "fecha_subida": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

#### GET /documentos/:id
Obtener un documento específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titulo": "Reglamento Académico 2024",
    "descripcion": "Normativa vigente",
    "categoria": "Reglamentos",
    "archivo_url": "https://...",
    "archivo_nombre": "reglamento-2024.pdf",
    "archivo_size": 2400000,
    "archivo_tipo": "application/pdf",
    "activo": true,
    "fecha_subida": "2024-01-15T10:30:00Z"
  }
}
```

---

#### POST /admin/documentos
Crear documento (requiere autenticación).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
```
titulo: "Reglamento Académico 2024"
descripcion: "Normativa vigente"
categoria: "Reglamentos"
activo: true
archivo: [File]
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titulo": "Reglamento Académico 2024",
    "archivo_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Validaciones:**
- titulo: requerido, máx 255 caracteres
- categoria: requerido, debe estar en lista válida
- archivo: requerido, formatos: pdf|doc|docx|xls|xlsx|ppt|pptx, máx 10MB

---

#### PUT /admin/documentos/:id
Actualizar documento.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data (todos opcionales excepto lo que se quiera cambiar):**
```
titulo: "Nuevo título"
descripcion: "Nueva descripción"
categoria: "Mallas"
activo: false
archivo: [File]  // Opcional, solo si se quiere cambiar el archivo
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titulo": "Nuevo título",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

#### DELETE /admin/documentos/:id
Eliminar documento.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Documento eliminado correctamente"
}
```

---

#### DELETE /admin/documentos/bulk
Eliminar múltiples documentos.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "3 documentos eliminados correctamente"
}
```

---

### 👨‍🏫 Docentes

#### GET /docentes
Listar docentes (público solo activos, admin todos).

**Query Parameters:**
```
?activo=true              // Filtro por estado
&search=carlos            // Búsqueda en nombre/materias
&page=1
&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "nombre": "Dr. Carlos Mendoza",
        "email": "carlos.mendoza@uleam.edu.ec",
        "foto_url": "https://...",
        "materias": "Administración Estratégica, Gestión Empresarial",
        "especialidad": "Administración Estratégica",
        "activo": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

---

#### POST /admin/docentes
Crear docente.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
```
nombre: "Dr. Carlos Mendoza"
email: "carlos.mendoza@uleam.edu.ec"  // Opcional
materias: "Administración Estratégica, Gestión Empresarial"
especialidad: "Administración Estratégica"  // Opcional
activo: true
foto: [File]  // Opcional
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Dr. Carlos Mendoza",
    "foto_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Validaciones:**
- nombre: requerido, máx 255 caracteres
- materias: requerido
- foto: formatos jpg|jpeg|png|webp, máx 2MB

---

#### PUT /admin/docentes/:id
Actualizar docente.

#### DELETE /admin/docentes/:id
Eliminar docente.

#### DELETE /admin/docentes/bulk
Eliminar múltiples docentes.

---

### 📰 Noticias

#### GET /noticias
Listar noticias (público solo activas, admin todas).

**Query Parameters:**
```
?categoria=Eventos        // Filtro por categoría
&activo=true              // Filtro por estado
&search=convenio          // Búsqueda en título/descripción
&fecha_desde=2024-01-01   // Filtro fecha desde
&fecha_hasta=2024-12-31   // Filtro fecha hasta
&page=1
&limit=10
&sort=fecha               // fecha | created_at
&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "titulo": "Inauguración de Nuevas Instalaciones",
        "imagen_url": "https://...",
        "descripcion": "La Universidad ULEAM...",
        "categoria": "Infraestructura",
        "activo": true,
        "fecha": "2024-04-15",
        "created_at": "2024-04-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

#### POST /admin/noticias
Crear noticia.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
```
titulo: "Inauguración de Nuevas Instalaciones"
descripcion: "La Universidad ULEAM celebró..."
categoria: "Infraestructura"
fecha: "2024-04-15"  // Formato: YYYY-MM-DD
activo: true
imagen: [File]  // Opcional
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titulo": "Inauguración de Nuevas Instalaciones",
    "imagen_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Validaciones:**
- titulo: requerido, máx 255 caracteres
- descripcion: requerido
- categoria: requerido, debe estar en lista válida
- fecha: formato YYYY-MM-DD
- imagen: formatos jpg|jpeg|png|webp, máx 2MB

---

#### PUT /admin/noticias/:id
Actualizar noticia.

#### DELETE /admin/noticias/:id
Eliminar noticia.

#### DELETE /admin/noticias/bulk
Eliminar múltiples noticias.

---

### ❓ FAQ

#### GET /faq
Listar preguntas frecuentes (público solo activas).

**Query Parameters:**
```
?categoria=Admisión
&activo=true
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "pregunta": "¿Cuáles son los requisitos de ingreso?",
      "respuesta": "Los requisitos son...",
      "categoria": "Admisión",
      "orden": 1,
      "activo": true
    }
  ]
}
```

---

#### POST /admin/faq
Crear pregunta FAQ.

#### PUT /admin/faq/:id
Actualizar FAQ.

#### DELETE /admin/faq/:id
Eliminar FAQ.

---

### 🤖 Chatbot

#### POST /chatbot/query
Consulta al chatbot.

**Request:**
```json
{
  "query": "¿Cuáles son los requisitos de matrícula?"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "respuesta": "Los requisitos de matrícula son...",
    "fuente": "chatbot_knowledge",
    "confianza": 0.95
  }
}
```

**Algoritmo recomendado:**
1. Normalizar query (lowercase, remover acentos)
2. Buscar en chatbot_knowledge por keywords (JSONB `@>` operator)
3. Si no hay match, buscar en FAQ
4. Si no hay match, retornar respuesta genérica

---

## Autenticación y Seguridad

### JWT Token

**Payload:**
```json
{
  "sub": "user-uuid",
  "username": "admin",
  "rol": "superadmin",
  "iat": 1234567890,
  "exp": 1234654290  // 24 horas
}
```

**Secret Key:**
- Usar variable de entorno: `JWT_SECRET`
- Generar con: `openssl rand -base64 64`

**Expiración:**
- Access Token: 24 horas
- Refresh Token (opcional): 7 días

---

### Hashing de Contraseñas

**Bcrypt:**
```javascript
// Node.js
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
const isMatch = await bcrypt.compare(password, hash);
```

```python
# Python
from passlib.hash import bcrypt
hash = bcrypt.hash(password)
is_match = bcrypt.verify(password, hash)
```

---

### Rate Limiting

**Recomendaciones:**
```
/auth/login: 5 intentos por 15 minutos por IP
/chatbot/query: 30 requests por minuto por IP
Rutas admin: 100 requests por minuto por token
Rutas públicas: 300 requests por minuto por IP
```

---

### CORS

**Configuración:**
```javascript
// Express.js
const cors = require('cors');
app.use(cors({
  origin: ['https://uleam.edu.ec', 'http://localhost:5173'],
  credentials: true
}));
```

---

## Almacenamiento de Archivos

### Opción 1: AWS S3

**Configuración:**
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1'
});

// Upload
const params = {
  Bucket: 'uleam-documentos',
  Key: `documentos/${uuid}.pdf`,
  Body: fileBuffer,
  ContentType: 'application/pdf',
  ACL: 'public-read'
};
const result = await s3.upload(params).promise();
const url = result.Location;
```

**Estructura de carpetas:**
```
s3://uleam-storage/
  ├── documentos/
  │   ├── {uuid}.pdf
  │   └── {uuid}.docx
  ├── docentes/
  │   ├── {uuid}.jpg
  │   └── {uuid}.png
  └── noticias/
      ├── {uuid}.jpg
      └── {uuid}.webp
```

---

### Opción 2: Cloudinary

```javascript
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Upload
const result = await cloudinary.uploader.upload(file.path, {
  folder: 'uleam/documentos',
  resource_type: 'auto',
  public_id: uuid
});
const url = result.secure_url;
```

---

### Opción 3: Almacenamiento Local (Desarrollo)

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uuid = generateUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uuid}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Formato no permitido'));
    }
  }
});
```

---

## Integración con Frontend

### Variables de Entorno (.env)

**Frontend:**
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
```

**Backend:**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/uleam_db
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=24h

# AWS S3
AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET=uleam-storage
AWS_REGION=us-east-1

# O Cloudinary
CLOUDINARY_NAME=uleam
CLOUDINARY_KEY=123456789012345
CLOUDINARY_SECRET=abcdefghijklmnopqrstuvwxyz12

# CORS
CORS_ORIGIN=http://localhost:5173,https://uleam.edu.ec
```

---

### Cliente API (Frontend)

**Ejemplo con Axios:**
```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uleam-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('uleam-admin-token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Uso en componentes:**
```typescript
// Listar documentos
const response = await api.get('/documentos', {
  params: { categoria: 'Reglamentos', activo: true }
});
const documentos = response.data.data.items;

// Crear documento
const formData = new FormData();
formData.append('titulo', 'Nuevo documento');
formData.append('categoria', 'Reglamentos');
formData.append('archivo', file);

const response = await api.post('/admin/documentos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

## Comandos de Desarrollo

### Inicializar Base de Datos

**PostgreSQL:**
```bash
# Crear base de datos
createdb uleam_db

# Ejecutar migraciones (Prisma)
npx prisma migrate dev

# Seed inicial
npx prisma db seed
```

**MySQL:**
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE uleam_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Laravel migrations
php artisan migrate
php artisan db:seed
```

---

### Seed de Datos Iniciales

**Usuario administrador por defecto:**
```sql
INSERT INTO admin_users (username, email, password_hash, nombre_completo, rol, activo)
VALUES (
  'admin',
  'admin@uleam.edu.ec',
  '$2b$10$...hash_de_admin123...',  -- bcrypt de "admin123"
  'Administrador Sistema',
  'superadmin',
  true
);
```

---

## Testing

### Endpoints a Testear

1. **Autenticación:**
   - Login con credenciales correctas
   - Login con credenciales incorrectas
   - Acceso a rutas protegidas sin token
   - Acceso con token expirado

2. **CRUD Documentos:**
   - Crear con archivo válido
   - Crear con archivo inválido (formato/tamaño)
   - Listar con filtros
   - Actualizar
   - Eliminar
   - Bulk delete

3. **Validaciones:**
   - Campos requeridos
   - Longitud máxima
   - Formatos de archivo
   - Categorías válidas

---

## Despliegue

### Checklist de Producción

- [ ] Variables de entorno configuradas
- [ ] Base de datos con backups automáticos
- [ ] SSL/HTTPS configurado
- [ ] CORS correctamente configurado
- [ ] Rate limiting habilitado
- [ ] Logging configurado (Winston/Morgan)
- [ ] Monitoreo de errores (Sentry)
- [ ] Almacenamiento de archivos en cloud (S3/Cloudinary)
- [ ] Compresión de respuestas (gzip)
- [ ] Helmet.js para seguridad (Node.js)

---

## Contacto y Soporte

Para dudas sobre la implementación del backend:
- Revisar esta especificación
- Consultar documentación oficial de las tecnologías elegidas
- Validar contra el frontend actual en `/workspaces/default/code`

---

**Versión:** 1.0.0  
**Fecha:** Mayo 2026  
**Proyecto:** Sistema Académico ULEAM - Extensión El Carmen
