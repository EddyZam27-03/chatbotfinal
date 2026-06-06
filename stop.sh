#!/bin/bash

# Script para detener el sistema ULEAM Chatbot
# Este script detiene el backend y el frontend

echo "🛑 Deteniendo Sistema ULEAM Chatbot..."
echo ""

# Detener backend
echo "📦 Deteniendo Backend..."
BACKEND_PIDS=$(pgrep -f "uvicorn main:app")
if [ -n "$BACKEND_PIDS" ]; then
    echo $BACKEND_PIDS | xargs kill
    echo "   ✅ Backend detenido"
else
    echo "   ℹ️  Backend no estaba ejecutándose"
fi

# Detener frontend
echo "🎨 Deteniendo Frontend..."
FRONTEND_PIDS=$(pgrep -f "npm run dev")
if [ -n "$FRONTEND_PIDS" ]; then
    echo $FRONTEND_PIDS | xargs kill
    echo "   ✅ Frontend detenido"
else
    echo "   ℹ️  Frontend no estaba ejecutándose"
fi

echo ""
echo "✅ Sistema detenido exitosamente!"
