Diseña un sistema web “Asistente Académico ULEAM — Administración (Extensión El Carmen)”.

Áreas:

Público (estudiantes)
Rutas:
/ Home
/chatbot/ Chat UI
/faq/ FAQ
/contact/ Contacto
Requisito: No mostrar links al admin.
Privado (administrador)
Ruta:
/admin/
Requisito: solo acceso por URL, sin botones/links en el área pública.
El administrador gestiona Documentos: crear/editar/desactivar y subir archivos (pdf/doc/docx/xls/xlsx/ppt/pptx).

Objetivo del diseño
Crear UI institucional moderna y clara para el sitio público.
Crear UI para administración que sea visual y funcionalmente similar a Django Admin (misma estructura/UX), con branding general (logo/tipografía), sin especificar colores.
Entregar pantallas y componentes listos para desarrollo (desktop/tablet/mobile).
Tipografía
Usa una tipografía sans-serif moderna (Inter o equivalente). Define jerarquías:

H1, H2, H3
Body
Small/captions
A) Sitio público (pantallas)
Pantalla A1: Home (/)
Hero
Imagen institucional (placeholder) con overlay suave
Título: “Asistente Académico ULEAM”
Subtítulo: “Información oficial de la Carrera de Administración — Extensión El Carmen”
CTAs:
Botón principal: “Probar Chatbot”
Botón secundario: “Preguntas frecuentes”
Sección: Servicios Académicos (3 cards)
Card 1: Requisitos
Card 2: Malla Curricular
Card 3: Cronograma Cada card con icono, título, descripción y hover elevación.
Pantalla A2: Chatbot (/chatbot/)
Objetivo: experiencia tipo chat clara, con soporte para respuestas del bot en Markdown.

Layout Desktop (3 columnas)
Sidebar izquierda: Historial
Título: “Historial”
Lista de items clicables (preguntas recientes o conversaciones)
Estado vacío: “Aún no hay conversaciones”
Columna central: Chat
Card principal con:
Área de mensajes con scroll (altura fija)
Input de texto + botón enviar
Mensaje inicial del bot:
“¡Hola! Puedes preguntar por requisitos, malla curricular, fechas o admisión.”
Sidebar derecha: Sugerencias
Título: “Sugerencias”
Botones de sugerencia (quick prompts):
“Requisitos de ingreso”
“Ver malla curricular”
“Fecha de inicio de clases”
Mensajes
Burbujas diferenciadas:
Mensaje del bot alineado a la izquierda
Mensaje del usuario alineado a la derecha
Estados:
Loading: “El bot está escribiendo…” con dots/skeleton
Error: “Error de conexión” + botón “Reintentar”
Markdown:
Diseñar estilos de listas, negritas, links y tablas
Tabla con header destacado, bordes sutiles, spacing legible
Mobile
Layout apilado
Historial y Sugerencias como tabs: “Chat / Historial / Sugerencias” (o acordeón)
Pantalla A3: FAQ (/faq/)
Acordeón con 6–10 preguntas frecuentes (placeholder).
Cada item expandible, fácil de escanear.
Pantalla A4: Contacto (/contact/)
Card con:
Unidad
Correo
Horario
Opcional: mapa o links institucionales.
B) Admin (privado) — idéntico en UX a Django Admin (sin link desde el sitio)
Principio clave
El admin no debe aparecer en la navegación pública.
Se accede escribiendo /admin/.
Objetivo visual
Reproducir el patrón Django Admin:
Header superior con acciones de usuario
Breadcrumbs
List views con tabla + buscador + filtros
Forms con layout de fieldsets
Mensajes tipo “Django messages”
Acciones masivas (“Actions”, “Go”)
Paginación estándar
Pantalla B1: Admin Login (/admin/)
Caja centrada
Logo institucional (placeholder)
Título: “Iniciar sesión”
Inputs:
Username
Password
Botón: “Log in”
Mensaje de error (credenciales inválidas) con estilo claro y discreto
Pantalla B2: Admin Index (home)
Sección “Applications”
Lista de apps con links, enfocándose en:
Documents
Documents (link a listado)
Mantener estilo similar a Django: bloques simples, tipografía clara, poco “decorativo”.
Pantalla B3: Document changelist (listado)
Título: “Select document to change”

Elementos obligatorios (Django-like):

Buscador (arriba)
Botón “ADD DOCUMENT” (arriba derecha)
Tabla con columnas:
Título
Categoría
Activo
Fecha de subida
Última actualización
Checkbox por fila + checkbox header
Dropdown “Actions” + botón “Go”
Sidebar de filtros a la derecha (“Filter”):
Categoría
Activo
Fecha de subida (rangos)
Paginación al final
Estados:

Empty state: “No hay documentos. Sube el primero.”
Loading (skeleton)
Error state (banner discreto)
Pantalla B4: Document add/edit form
Título: “Add document” / “Change document”

Formulario con campos:

Título (required)
Descripción (textarea)
Categoría (select)
Archivo (file input)
Activo (checkbox)
Acciones (abajo, estilo Django):

Save
Save and add another
Save and continue editing
Cancel (opcional)
Delete (solo en edit) con confirm modal
Ayudas del campo archivo:

Mostrar formatos permitidos: pdf, doc, docx, xls, xlsx, ppt, pptx
Mostrar el nombre del archivo seleccionado
Componentes (librería / design system)
Crea componentes reutilizables con variantes y estados:

Navbar público + footer
Botones (primary/secondary/outline/danger + hover/focus/disabled/loading)
Inputs (default/focus/error)
Cards (servicios / chat / sidebar)
Chat bubble (bot/usuario)
Loading indicator (dots/skeleton)
Tabla Markdown (estilos de table)
Accordion (FAQ)
Admin table (Django-like)
Admin filter sidebar
Admin forms (fieldsets / help text)
Alerts tipo “messages” (success/error/warning/info)
Modal confirm (delete)
Toast/flash message (guardado exitoso)
Breakpoints
Desktop 1440 (principal)
Tablet 768
Mobile 390
Notas para handoff (anotaciones en Figma)
El chat consume POST /chatbot/api/ y recibe { reply: string }.
El bot puede devolver Markdown con tablas/listas; el diseño debe soportarlo.
El admin solo se accede por /admin/ y no debe tener acceso desde el sitio público.
Entregables
Página “Components”
Página “Public screens (Desktop/Tablet/Mobile)”
Página “Admin screens (Desktop/Tablet/Mobile)”
Prototype con navegación del sitio público (sin link al admin).