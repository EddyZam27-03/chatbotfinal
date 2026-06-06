Actúa como un diseñador UI/UX principal (Lead Product Designer) + UI Engineer senior especialista en Bootstrap 5.
Necesito que diseñes un rediseño completo (estilo + UX) para un sitio web institucional universitario y que integres un CHATBOT como widget flotante COMPACTO (tipo burbuja/panel pequeño) en TODAS las páginas.

OBJETIVO GLOBAL
- Modernizar la apariencia (institucional, confiable, limpia, accesible).
- Aumentar conversión al chatbot sin invadir el contenido.
- Mantener consistencia total entre pantallas y componentes.
- Producir especificaciones detalladas (tamaños, espaciado, estados, tokens, microcopy, responsive).

CONTEXTO DE PRODUCTO
- Producto: “Asistente Académico ULEAM — Administración (Extensión El Carmen)”.
- Usuarios: estudiantes, aspirantes, personal administrativo.
- Casos: requisitos, malla curricular, trámites, fechas, contacto.
- Tecnología actual: Django templates + Bootstrap 5.3 + Bootstrap Icons + marked.js para Markdown del bot.
- Pantallas actuales existentes en el proyecto:
  1) Base layout (navbar + footer): base.html
  2) Inicio: index.html
  3) Página Chatbot completa: chatbot.html
  4) FAQ: faq.html
  5) Contacto: contact.html
- Requisito: el widget flotante debe existir en TODAS las páginas, incluso en /chatbot/ (sin duplicar confusión).

REFERENCIA DE PATRÓN
- Widget flotante compacto similar a la imagen de referencia: burbuja (FAB) inferior derecha; al abrir, aparece un panel pequeño con header, mensajes y caja de texto.
- Debe sentirse ligero: ocupa poco, no tapa contenido crítico, se puede mover de vista si estorba (minimizar/cerrar).

PALETA (OBLIGATORIA)
Principales:
- #0050A0 Azul institucional
- #1E1198 Azul violeta profundo
- #1740D3 Azul brillante
Secundarios:
- #E00100 Rojo intenso
- #5C0006 Rojo oscuro
Complementarios:
- #8A7AF4 Morado claro
Acentos:
- #0E6A7B Verde azulado
- #092D30 Verde oscuro
Neutros:
- #7A8896 Gris azulado
- #C4C4C4 Gris claro

ESTILO Y PERSONALIDAD
- “Institucional moderno”: sobrio pero actual (no “SaaS genérico”, no “muy juvenil”).
- Mucho blanco/espacios; el color se usa para jerarquía y acciones.
- Rojo (#E00100) solo para acciones críticas, errores o un CTA puntual. Nunca como fondo dominante.
- Sensación de calidad: bordes suaves, sombras sutiles, transiciones suaves.

TIPOGRAFÍA (DECISIONES)
- Fuente: Inter (o similar sans).
- Tamaños base recomendados:
  - H1: 44px (desktop) / 34px (mobile), weight 800
  - H2: 30px / 24px, weight 700
  - H3: 22px / 20px, weight 700
  - Body: 16px, weight 400–500
  - Small: 13px
- Line-height:
  - títulos: 1.15–1.25
  - cuerpo: 1.5–1.65
- Enlaces: subrayado al hover, y estilo accesible.

ESPACIADO / GRID / RADIOS
- Sistema 8pt:
  - 4, 8, 12, 16, 24, 32, 40, 48, 64
- Contenedor: Bootstrap container (máx 1140–1200).
- Radios:
  - inputs/botones: 12px
  - cards/paneles: 16px
  - widget chat: 18px
  - chips: pill (999px)
- Sombras (muy sutiles):
  - Elevación 1: 0 6px 18px rgba(0,0,0,0.08)
  - Elevación 2: 0 10px 28px rgba(0,0,0,0.12)

ACCESIBILIDAD Y UX (OBLIGATORIO)
- Contraste AA en texto y componentes.
- Estados focus visibles (outline claro) para teclado.
- Targets mínimos 44x44 px.
- Mensajes de error no solo por color: incluir ícono + texto.
- Chat widget debe ser operable con teclado:
  - al abrir: foco al input
  - ESC: cierra panel
  - TAB: navega header → mensajes → input → enviar
- Incluir ARIA:
  - widget como “dialog”/“complementary panel” (según enfoque)
  - lista de mensajes con roles adecuados.

ENTREGABLES QUE DEBES PRODUCIR EN TU RESPUESTA (EN ESTE ORDEN)
1) Design System completo:
   1.1) Tabla de tokens de color por rol (no solo hex sueltos):
        - primary, primary-hover, primary-pressed
        - brand-deep (#1E1198), brand-bright (#1740D3)
        - danger, danger-dark
        - accent-teal, accent-teal-dark
        - surface, surface-2, surface-3
        - border, border-strong
        - text, text-muted, text-inverse
        - focus-ring
   1.2) Tipografía y escala (H1/H2/H3/body/small).
   1.3) Spacing y radios.
   1.4) Shadow tokens.
   1.5) Reglas de uso (cuándo usar cada color).
2) Componentes (spec detallada por componente):
   - Navbar (altura, estados, active indicator, comportamiento al scroll)
   - Botones (primary/secondary/outline/ghost/danger) con:
     - altura (px), padding, radius, íconos, estados hover/active/focus/disabled
   - Inputs/textarea/select:
     - altura, padding, border, focus ring, error state, helper text
   - Cards:
     - padding, border, hover, iconografía
   - Chips (sugerencias):
     - tamaños, estados, densidad
   - Alerts (success/info/warn/error)
   - Tabs o pills (para FAQ si aplica)
   - Loader / skeleton
   - Typing indicator (3 dots) para el bot
3) Pantallas (wireframe descrito + especificación visual + responsive):
   A) Inicio (index)
   B) Chatbot página completa (chatbot)
   C) FAQ (faq)
   D) Contacto (contact)
   E) Base layout (navbar/footer)
   Para cada pantalla incluye:
   - Objetivo de la pantalla
   - Jerarquía (títulos, subtítulos, CTAs)
   - Secciones (orden, contenido)
   - Componentes usados (y por qué)
   - Interacciones clave (hover, click, scroll)
   - Estados vacíos/errores (si aplica)
   - Responsive (mobile/tablet/desktop) con reglas específicas
4) Chatbot Widget Flotante COMPACTO (MÁXIMA PRIORIDAD):
   - Estado cerrado (FAB)
   - Estado abierto (panel compacto)
   - Estado minimizado (si propones)
   - Tamaños exactos desktop/mobile
   - Microcopy (textos sugeridos)
   - Gestión de “no estorbar” (espacio con cookie banner, etc.)
   - Reglas cuando el usuario está en /chatbot/ (para evitar duplicar)
5) Checklist final QA:
   - accesibilidad, contraste, teclado
   - coherencia visual
   - performance (no animaciones pesadas)
   - responsive y safe-area iOS
6) Opcional pero deseable: especificación implementable en Bootstrap:
   - clases recomendadas
   - estructura HTML sugerida (sin escribir código extenso; solo estructura y clases)
   - variables CSS sugeridas (:root tokens)

============================
REGLAS CONCRETAS DE COLOR (DEBES DEFINIR ESTO MUY CLARO)
- Primary action (botones principales, enlaces activos, FAB): #0050A0
- Hover/realce interactivo: #1740D3
- Secciones “deep” (headers sutiles, fondos muy suaves): usar #1E1198 en gradientes leves o líneas/acento, no como bloque oscuro dominante.
- Danger/error/CTA crítico: #E00100 con moderación; y #5C0006 para pressed o texto.
- Acentos informativos: #0E6A7B y #092D30 (ej: chips “Tip”, badges informativos).
- Neutros: #7A8896 para texto secundario, #C4C4C4 para bordes.
- Superficies: proponer tonos muy claros derivados (ej. surface: blanco, surface-2: gris muy claro).
- Focus ring: proponer un color visible, compatible, basado en #8A7AF4 o #1740D3 (pero accesible).

============================
DISEÑO DETALLADO DEL WIDGET COMPACTO (ESPECIFICACIÓN OBLIGATORIA)
Quiero que diseñes el widget como si fuera un componente listo para producción.

1) POSICIÓN Y COMPORTAMIENTO GLOBAL
- Ubicación: inferior derecha.
- Margen a bordes:
  - Desktop: 20px
  - Mobile: 16px y respetar safe-area (iOS)
- Debe NO tapar elementos críticos:
  - Si hay botón “scroll to top” u otro FAB, define jerarquía y offset.
  - Si aparece banner de cookies, el widget se desplaza hacia arriba automáticamente (o se superpone con margen).
- Persistencia:
  - si el usuario lo cierra, no reabrir automáticamente.
  - si lo abre, recordar abierto durante la sesión (opcional).

2) ESTADO CERRADO (FAB)
- Tamaño: 56px x 56px (desktop), 56–60px (mobile)
- Estilo:
  - fondo: primary (#0050A0)
  - ícono robot blanco (Bootstrap icon o similar)
  - sombra Elevación 2
  - borde/halo sutil (opcional) con #8A7AF4 al hover
- Estados:
  - hover: subir un poco la elevación + cambiar a #1740D3
  - active: volver a #1E1198 o un pressed de #0050A0
  - focus: ring visible (2–3px)
- Tooltip:
  - “Asistente” / “¿Necesitas ayuda?” (decidir microcopy)

3) ESTADO ABIERTO (PANEL COMPACTO)
- Tamaño Desktop (compacto, no enorme):
  - ancho: 340px (máx 360px)
  - alto: 480px (máx 520px)
- Tamaño Mobile:
  - modo “mini sheet”: 92–96% ancho, alto 60–72vh
  - radio superior grande (18–22px)
- Estructura del panel:
  A) Header (altura 56px)
     - Izquierda: icono + “Asistente Académico”
     - Subtítulo pequeño: “En línea” + punto verde azulado (#0E6A7B) o neutral accesible
     - Derecha: botones (minimizar) y (cerrar)
     - Fondo: surface con borde inferior (border)
  B) Cuerpo (mensajes)
     - padding 12–16px
     - scroll suave
     - botón “Ir abajo” aparece si el usuario scrollea arriba
  C) Footer (input)
     - contenedor con borde superior
     - input/textarea auto-grow (1–3 líneas)
     - botón enviar 40–44px alto
     - fila de chips de sugerencias (3–5) arriba del input o debajo del header:
       - “Requisitos”
       - “Malla”
       - “Matrícula”
       - “Fechas”
       - “Contacto”
- Tipografía dentro del chat:
  - usuario/bot 14–15px, line-height 1.5
- Burbuja usuario:
  - alineada derecha
  - fondo: #0050A0 (o #1740D3) con texto blanco si el contraste es AA
  - radius 16px con “cola” sutil (opcional)
- Burbuja bot:
  - alineada izquierda
  - fondo: surface-2
  - borde izquierdo o header line en #8A7AF4 o #1740D3 (muy sutil)
- Timestamp (opcional): 11–12px en text-muted

4) MARKDOWN DEL BOT (CRÍTICO)
Define estilos de Markdown dentro de mensajes del bot:
- Tablas:
  - ancho 100%, border 1px suave
  - header con fondo surface-3
  - zebra rows
  - padding de celdas 8–10px
- Listas:
  - espaciado vertical consistente
  - bullets visibles, buen indent
- Enlaces:
  - color #1740D3, subrayado al hover, focus visible
- Bloques de código (si ocurren):
  - fondo neutro suave, fuente monoespaciada, scroll horizontal
- Nota de seguridad UX:
  - recomendar sanitizar HTML del Markdown para evitar inyección.

5) INTERACCIONES Y MICROCOPY (MUY DETALLADO)
- Cuando abro el panel:
  - foco en input
  - si es primera vez: mostrar mensaje de bienvenida del bot:
    “Hola, soy tu Asistente Académico. Pregúntame sobre requisitos, malla curricular o trámites.”
- Placeholder del input:
  - “Escribe tu pregunta…”
- Estado “escribiendo”:
  - texto pequeño “El asistente está escribiendo…” + animación 3 puntos
- Errores:
  - si falla backend: “No pude conectarme. Verifica tu conexión o intenta en unos segundos.” + botón “Reintentar”
- Empty state:
  - si no hay conversación: panel con icono + 3 sugerencias clicables.
- Atajos:
  - Enter envía, Shift+Enter nueva línea (si textarea)
- Minimizar:
  - reduce a una “bandeja” pequeña (pill) que diga “Chat abierto” y un botón expandir; o vuelve al FAB pero con badge “1”
- Badge de notificación:
  - si llega respuesta y está minimizado: puntito o número (muy sutil, accesible)

6) REGLAS EN /CHATBOT/ (PÁGINA COMPLETA)
Como el widget está en todas las páginas:
- En /chatbot/ el widget debe:
  - o bien desactivarse (no mostrado) para evitar duplicidad
  - o mostrarse pero con CTA “Volver al chat completo” y sin permitir dos chats simultáneos
Define cuál es mejor y justifícalo.

============================
PANTALLAS: DETALLE MUY PROFUNDO

A) INICIO (index)
- Objetivo: presentar el asistente y dar confianza.
- Secciones (proponer contenido y jerarquía):
  1) Hero:
     - H1 fuerte
     - subtítulo claro
     - CTA primary “Abrir asistente”
     - CTA secondary “Ver FAQ”
     - prueba social/confianza: “Información institucional” (badge)
  2) Servicios académicos:
     - cards (3–6)
     - cada card con icono + texto + link “Consultar”
  3) Cómo funciona:
     - 3 pasos con iconos
  4) Preguntas populares:
     - 6 items con botón “Preguntar” (abre widget con texto precargado)
  5) CTA final:
     - banner con fondo suave y botón primary
- Responsive:
  - en mobile: hero centrado, cards 1 por fila, CTAs full-width.
- UI details:
  - especifica paddings, espacios, y cómo se ve cada card en hover.

B) CHATBOT (página completa /chatbot/)
- Objetivo: conversación larga + sugerencias + historial.
- Desktop:
  - layout 3 columnas
  - define anchuras:
    - historial: 260px
    - chat: flexible
    - sugerencias: 280px
  - header del chat con título y acciones
  - input fijo abajo (sticky) con borde superior
- Mobile:
  - chat full width
  - historial como offcanvas
  - sugerencias como acordeón arriba o drawer
- Estados:
  - nuevo chat
  - conversación activa
  - error
  - loading
- Markdown: coherencia con widget.

C) FAQ (faq)
- Objetivo: autoservicio.
- Header con buscador.
- Categorías con pills.
- Acordeones:
  - define tamaño de título, espaciado, íconos expand/collapse
- CTA a widget:
  - “¿No encontraste tu respuesta? Pregunta al asistente” (abre widget)

D) CONTACTO (contact)
- Objetivo: canal formal y confiable.
- Layout 2 columnas:
  - izquierda: datos institucionales (iconos + texto)
  - derecha: formulario
- Validación:
  - helper text
  - error con texto + borde rojo suave (no saturado)
  - success alert verde azulado (usar #0E6A7B en lugar de verde puro)
- CTA alterno: abrir widget para preguntas rápidas.

E) BASE (navbar/footer)
- Navbar:
  - altura 72px desktop / 64px mobile
  - active link indicator (subrayado o pill)
  - comportamiento al scroll (de transparente a sólido)
- Footer:
  - columnas: enlaces, contacto, legal
  - contraste perfecto

============================
SALIDA (FORMATO DE RESPUESTA)
- Usa encabezados claros y tablas.
- Incluye medidas exactas (px), padding, radios, y estados.
- Incluye microcopy y ejemplos de contenido.
- Incluye recomendaciones de implementación en Bootstrap (clases sugeridas).
- NO te quedes en “descripciones genéricas”: necesito especificación casi lista para construir.

RESULTADO ESPERADO
Quiero terminar con:
- Un mini manual de marca UI
- Un set de componentes reutilizables
- Un diseño definido para cada pantalla
- Un widget flotante compacto definido a nivel producción (con estados y responsive)