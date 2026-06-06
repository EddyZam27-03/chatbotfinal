#!/bin/bash

# Script de inicio rápido para el sistema ULEAM Chatbot
# Este script inicia el backend y el frontend automáticamente

echo "🚀 Iniciando Sistema ULEAM Chatbot..."
echo ""

# Directorio del proyecto
PROJECT_DIR="/home/valhalla/Descargas/Chat (3)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/web"

# Función para detener procesos en puerto específico
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo "   ⚠️  Puerto $port ocupado (PID: $pid). Deteniendo proceso..."
        kill -9 $pid 2>/dev/null
        sleep 1
        echo "   ✅ Puerto $port liberado"
    fi
}

# Verificar y liberar puerto 8000 si está ocupado
echo "📦 Verificando puerto 8000..."
kill_port 8000

# Verificar si el backend está ejecutándose
if curl -s http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend ya está ejecutándose en http://localhost:8000"
else
    echo "📦 Iniciando Backend..."
    cd "$BACKEND_DIR"
    
    # Activar entorno virtual si existe
    if [ -d "venv" ]; then
        source venv/bin/activate
        echo "   ✓ Entorno virtual activado"
    else
        echo "   ❌ Error: Entorno virtual no encontrado. Ejecuta: cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi
    
    # Iniciar backend en segundo plano
    nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "   ✓ Backend iniciado (PID: $BACKEND_PID)"
    
    # Esperar a que el backend esté listo
    echo "   ⏳ Esperando a que el backend esté listo..."
    for i in {1..30}; do
        if curl -s http://localhost:8000/api/v1/health > /dev/null 2>&1; then
            echo "   ✅ Backend listo en http://localhost:8000"
            break
        fi
        sleep 1
    done
fi

echo ""

# Verificar y liberar puerto 5173 si está ocupado
echo "🎨 Verificando puerto 5173..."
kill_port 5173

# Verificar si el frontend está ejecutándose
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend ya está ejecutándose en http://localhost:5173"
else
    echo "🎨 Iniciando Frontend..."
    cd "$FRONTEND_DIR"
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "   ⚠️  Dependencias no instaladas. Ejecutando npm install..."
        npm install
        if [ $? -ne 0 ]; then
            echo "   ❌ Error al instalar dependencias del frontend"
            exit 1
        fi
        echo "   ✅ Dependencias instaladas"
    fi
    
    # Verificar si vite está disponible
    if ! command -v npx &> /dev/null; then
        echo "   ❌ Error: npx no encontrado. Asegúrate de tener Node.js instalado"
        exit 1
    fi
    
    # Iniciar frontend en segundo plano
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "   ✓ Frontend iniciado (PID: $FRONTEND_PID)"
    echo "   ⏳ Esperando a que el frontend esté listo..."
    sleep 5
    echo "   ✅ Frontend listo en http://localhost:5173"
fi

echo ""
echo "🎉 Sistema iniciado exitosamente!"
echo ""
echo "📍 URLs de acceso:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs (Swagger): http://localhost:8000/docs"
echo "   - Health Check: http://localhost:8000/api/v1/health"
echo ""
echo "🔐 Credenciales de administrador:"
echo "   - Usuario: admin"
echo "   - Contraseña: admin123"
echo ""
echo "📝 Logs:"
echo "   - Backend: $BACKEND_DIR/backend.log"
echo "   - Frontend: $FRONTEND_DIR/frontend.log"
echo ""
echo "⏹️  Para detener el sistema, ejecuta: ./stop.sh"
