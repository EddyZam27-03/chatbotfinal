# Chatbot Educativo ULEAM - Promoción Carrera de Administración de Empresas  
**Extensión El Carmen - Universidad Laica Eloy Alfaro de Manabí**

Proyecto de titulación para la carrera de Tecnologías de la Información y Comunicación (TIC), 8vo semestre.  
Autor: Maykel Santos  
Tutor: Ing. César Sinchiguano Chiriboga, Mg.

**Objetivo principal**  
Crear un chatbot inteligente que responda preguntas sobre la carrera de Administración de Empresas (requisitos, malla curricular, oportunidades laborales, proceso de admisión, etc.) usando información oficial de la ULEAM, con respuestas 100% precisas y sin alucinaciones, gracias a la técnica **RAG (Retrieval-Augmented Generation)**.

### Características principales
- Respuestas basadas en documentos oficiales (PDFs: malla curricular y descripción general).
- Descarga directa del PDF de la malla cuando se solicita.
- Enlaces oficiales a YouTube (SoftMedia Club) y sitio web de la ULEAM.
- Funciona 100% local (sin APIs pagadas ni nube).
- Backend en Django + LLM local (Llama 3 8B vía Ollama).
- Interfaz simple y responsive (HTML/CSS/JS).

### Requisitos del sistema
- Linux (Ubuntu 22.04 o superior recomendado)
- Python 3.10 o superior
- Ollama instalado (para ejecutar Llama 3 8B localmente)
- RAM mínima recomendada: 8 GB (ideal 16 GB para buen rendimiento)
- Espacio en disco: ~10 GB (modelo Llama 3 8B ocupa ~5 GB)

### Instalación paso a paso (en una nueva computadora Linux)

1. **Actualiza el sistema**
   ```bash
   sudo apt update && sudo apt upgrade -y
