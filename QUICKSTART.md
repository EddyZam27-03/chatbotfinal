# 🚀 Guía Rápida de Inicio - ULEAM Chatbot

## Ejecución Inmediata (Si ya está todo instalado)

### Opción 1: Doble Click - MÁS FÁCIL

**Para iniciar:** Doble click en `Iniciar Sistema.desktop`

**Para detener:** Doble click en `Detener Sistema.desktop`

### Opción 2: Scripts automáticos

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)
./start.sh
```

Para detener:
```bash
./stop.sh
```

### Opción 2: Ejecución manual

**Terminal 1 - Backend:**
```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/web
npm run dev
```

---

## Primera Instalación

### Backend

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
```

### Frontend

```bash
cd /home/valhalla/Descargas/Chat\ \(3\)/web
npm install
```

---

## URLs de Acceso

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/v1/health

---

## Credenciales

- **Usuario:** admin
- **Contraseña:** admin123

---

## Verificar Funcionamiento

```bash
curl http://localhost:8000/api/v1/health
```

Deberías ver un JSON con el estado del sistema.

---

## ¿Problemas?

Revisa el README.md completo para solución de problemas detallada.
