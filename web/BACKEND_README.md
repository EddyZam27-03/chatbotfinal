# Guía Rápida - Desarrollo del Backend ULEAM

## 🚀 Inicio Rápido

Este documento te guiará paso a paso para crear el backend del sistema ULEAM.

---

## 📚 Documentación Completa

Ver: **[BACKEND_SPEC.md](./BACKEND_SPEC.md)** - Especificación técnica completa con:
- Todos los endpoints de la API
- Esquemas de base de datos
- Ejemplos de código
- Validaciones y seguridad

---

## 🛠️ Opción 1: Node.js + Express + PostgreSQL (Recomendado)

### Paso 1: Crear proyecto
```bash
mkdir uleam-backend
cd uleam-backend
npm init -y
```

### Paso 2: Instalar dependencias
```bash
npm install express cors helmet morgan bcrypt jsonwebtoken dotenv
npm install multer multer-s3 @aws-sdk/client-s3
npm install pg prisma @prisma/client
npm install --save-dev typescript @types/node @types/express nodemon ts-node
```

### Paso 3: Inicializar Prisma
```bash
npx prisma init
```

### Paso 4: Configurar `prisma/schema.prisma`

Copia los schemas de **BACKEND_SPEC.md** sección "Modelos de Datos"

Ejemplo:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model AdminUser {
  id              String   @id @default(uuid())
  username        String   @unique
  email           String   @unique
  passwordHash    String   @map("password_hash")
  nombreCompleto  String   @map("nombre_completo")
  rol             String   @default("editor")
  activo          Boolean  @default(true)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  ultimoAcceso    DateTime? @map("ultimo_acceso")

  @@map("admin_users")
}

model Documento {
  id                  String   @id @default(uuid())
  titulo              String
  descripcion         String?
  categoria           String
  archivoUrl          String   @map("archivo_url")
  archivoNombre       String   @map("archivo_nombre")
  archivoSize         Int      @map("archivo_size")
  archivoTipo         String   @map("archivo_tipo")
  activo              Boolean  @default(true)
  fechaSubida         DateTime @default(now()) @map("fecha_subida")
  ultimaModificacion  DateTime @updatedAt @map("ultima_modificacion")
  createdBy           String?  @map("created_by")

  @@map("documentos")
}

model Docente {
  id           String   @id @default(uuid())
  nombre       String
  email        String?
  fotoUrl      String?  @map("foto_url")
  materias     String
  especialidad String?
  activo       Boolean  @default(true)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  createdBy    String?  @map("created_by")

  @@map("docentes")
}

model Noticia {
  id          String   @id @default(uuid())
  titulo      String
  imagenUrl   String?  @map("imagen_url")
  descripcion String
  categoria   String
  activo      Boolean  @default(true)
  fecha       DateTime
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  createdBy   String?  @map("created_by")

  @@map("noticias")
}

model FAQItem {
  id        String   @id @default(uuid())
  pregunta  String
  respuesta String
  categoria String
  orden     Int      @default(0)
  activo    Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("faq_items")
}

model ChatbotKnowledge {
  id        String   @id @default(uuid())
  keywords  Json     // Array de palabras clave
  respuesta String
  categoria String
  activo    Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("chatbot_knowledge")
}
```

### Paso 5: Crear base de datos y migrar
```bash
# Crear base de datos PostgreSQL
createdb uleam_db

# Ejecutar migración
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate
```

### Paso 6: Crear estructura del proyecto
```
src/
├── config/
│   ├── database.ts
│   └── auth.ts
├── middleware/
│   ├── auth.ts
│   ├── upload.ts
│   └── errorHandler.ts
├── routes/
│   ├── auth.routes.ts
│   ├── documentos.routes.ts
│   ├── docentes.routes.ts
│   ├── noticias.routes.ts
│   ├── faq.routes.ts
│   └── chatbot.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── documentos.controller.ts
│   ├── docentes.controller.ts
│   └── noticias.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── upload.service.ts
│   └── chatbot.service.ts
└── app.ts
```

### Paso 7: Configurar `.env`
```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/uleam_db"

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_generado_con_openssl
JWT_EXPIRES_IN=24h

# AWS S3 (o Cloudinary)
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_BUCKET=uleam-storage
AWS_REGION=us-east-1

# CORS
CORS_ORIGIN=http://localhost:5173,https://uleam.edu.ec
```

### Paso 8: Crear `src/app.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.routes';
import documentosRoutes from './routes/documentos.routes';
import docentesRoutes from './routes/docentes.routes';
import noticiasRoutes from './routes/noticias.routes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documentos', documentosRoutes);
app.use('/api/v1/admin/documentos', documentosRoutes);
app.use('/api/v1/docentes', docentesRoutes);
app.use('/api/v1/admin/docentes', docentesRoutes);
app.use('/api/v1/noticias', noticiasRoutes);
app.use('/api/v1/admin/noticias', noticiasRoutes);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### Paso 9: Ejemplo de controlador de autenticación

**`src/controllers/auth.controller.ts`:**
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        rol: user.rol
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Actualizar último acceso
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { ultimoAcceso: new Date() }
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};
```

### Paso 10: Crear usuario administrador inicial

**`prisma/seed.ts`:**
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@uleam.edu.ec',
      passwordHash,
      nombreCompleto: 'Administrador Sistema',
      rol: 'superadmin',
      activo: true
    }
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Agregar a `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Ejecutar:
```bash
npx prisma db seed
```

### Paso 11: Ejecutar servidor
```bash
npm run dev
```

---

## 🔧 Opción 2: Python + FastAPI

### Paso 1: Crear proyecto
```bash
mkdir uleam-backend
cd uleam-backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### Paso 2: Instalar dependencias
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary
pip install python-jose[cryptography] passlib[bcrypt]
pip install python-multipart boto3
pip install alembic
```

### Paso 3: Estructura del proyecto
```
app/
├── api/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── documentos.py
│   │   ├── docentes.py
│   │   └── noticias.py
│   └── dependencies.py
├── models/
│   ├── admin_user.py
│   ├── documento.py
│   ├── docente.py
│   └── noticia.py
├── schemas/
│   ├── auth.py
│   └── documento.py
├── services/
│   ├── auth.py
│   └── upload.py
├── database.py
├── config.py
└── main.py
```

### Paso 4: Ejemplo básico de FastAPI

**`app/main.py`:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="ULEAM API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://uleam.edu.ec"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
from app.api.routes import auth, documentos, docentes, noticias

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(documentos.router, prefix="/api/v1/documentos", tags=["documentos"])
app.include_router(docentes.router, prefix="/api/v1/docentes", tags=["docentes"])
app.include_router(noticias.router, prefix="/api/v1/noticias", tags=["noticias"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## 📊 Testing del Backend

### Probar con cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Listar documentos:**
```bash
curl http://localhost:3000/api/v1/documentos?activo=true
```

**Crear documento (con token):**
```bash
curl -X POST http://localhost:3000/api/v1/admin/documentos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "titulo=Test Document" \
  -F "categoria=Reglamentos" \
  -F "archivo=@document.pdf"
```

### Probar con Postman

1. Importar colección desde BACKEND_SPEC.md
2. Crear variable de entorno `API_URL`
3. Probar cada endpoint

---

## 🔗 Integración con Frontend

### Actualizar Frontend

En el frontend React ya creado, actualizar:

**`.env`:**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

**Ejemplo de integración en componente:**
```typescript
// En DocenteManagement.tsx
import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Cliente axios configurado

// Reemplazar useState con mock data por llamada al backend:
useEffect(() => {
  const fetchDocentes = async () => {
    try {
      const response = await api.get('/admin/docentes');
      setDocentes(response.data.data.items);
    } catch (error) {
      console.error('Error fetching docentes:', error);
    }
  };
  
  fetchDocentes();
}, []);

// En handleSave del formulario:
const handleSave = async () => {
  const formData = new FormData();
  formData.append('nombre', formData.nombre);
  formData.append('materias', formData.materias);
  if (selectedFile) {
    formData.append('foto', selectedFile);
  }

  try {
    await api.post('/admin/docentes', formData);
    navigate('/admin/docentes');
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar');
  }
};
```

---

## 📝 Checklist de Desarrollo

- [ ] Base de datos creada y migrada
- [ ] Usuario admin creado (admin/admin123)
- [ ] Endpoints de autenticación funcionando
- [ ] Endpoints de documentos (GET público, POST/PUT/DELETE admin)
- [ ] Endpoints de docentes
- [ ] Endpoints de noticias
- [ ] Upload de archivos configurado (S3/Cloudinary/local)
- [ ] CORS configurado correctamente
- [ ] JWT funcionando
- [ ] Validaciones implementadas
- [ ] Probado con frontend

---

## 🚀 Próximos Pasos

1. **Desarrollar el backend** siguiendo esta guía
2. **Probar endpoints** con Postman/cURL
3. **Integrar con frontend** actualizando las llamadas mock
4. **Deploy en producción** (Heroku, AWS, DigitalOcean, etc.)

---

## 📞 Soporte

- Ver documentación completa: **BACKEND_SPEC.md**
- Revisar código del frontend: `/workspaces/default/code/src/`

---

**¡Éxito con el desarrollo!** 🎓
