# ULEAM Chatbot Redesign - Design System Documentation

## 🎨 Design System Overview

Este es el sistema de diseño completo para el sitio web institucional de ULEAM Extensión El Carmen con el Asistente Académico integrado.

---

## 1. Color Tokens

### Colores Primarios
```css
--uleam-primary: #0050A0          /* Azul institucional principal */
--uleam-primary-hover: #1740D3    /* Estado hover de acciones primarias */
--uleam-primary-pressed: #003D7A  /* Estado pressed/activo */
```

**Uso:** Botones principales, enlaces activos, FAB del chatbot, indicadores activos.

### Colores de Marca (Brand)
```css
--uleam-brand-deep: #1E1198       /* Azul violeta profundo */
--uleam-brand-bright: #1740D3     /* Azul brillante */
```

**Uso:** 
- `brand-deep`: Acentos sutiles en headers, gradientes, líneas decorativas (nunca como fondo dominante)
- `brand-bright`: Enlaces en contenido, highlights, estados hover interactivos

### Colores de Peligro/Error
```css
--uleam-danger: #E00100            /* Rojo intenso */
--uleam-danger-dark: #5C0006       /* Rojo oscuro */
--uleam-danger-hover: #B00100      /* Estado hover de danger */
```

**Uso:** MODERADO - Solo para errores, validaciones fallidas, acciones críticas. Nunca como fondo dominante.

### Colores de Acento
```css
--uleam-accent-purple: #8A7AF4     /* Morado claro */
--uleam-accent-teal: #0E6A7B       /* Verde azulado */
--uleam-accent-teal-dark: #092D30  /* Verde oscuro */
```

**Uso:**
- `accent-purple`: Focus rings, highlights sutiles
- `accent-teal`: Badges informativos, indicadores de estado "en línea", alerts de éxito
- `accent-teal-dark`: Texto sobre fondos teal

### Superficies (Surfaces)
```css
--uleam-surface: #ffffff           /* Fondo principal */
--uleam-surface-2: #F8F9FA         /* Fondo secundario */
--uleam-surface-3: #F3F4F6         /* Fondo terciario */
```

**Uso:**
- `surface`: Cards, paneles, fondos principales
- `surface-2`: Fondos de secciones alternas, estados hover sutiles
- `surface-3`: Headers de tablas, código, áreas deshabilitadas

### Bordes
```css
--uleam-border: #E5E7EB            /* Bordes normales */
--uleam-border-strong: #C4C4C4     /* Bordes prominentes */
```

### Textos
```css
--uleam-text: #1F2937              /* Texto principal */
--uleam-text-muted: #7A8896        /* Texto secundario/muted */
--uleam-text-inverse: #ffffff      /* Texto sobre fondos oscuros */
```

### Focus Ring
```css
--uleam-focus-ring: #8A7AF4        /* Anillo de enfoque (accesibilidad) */
```

---

## 2. Sombras (Shadows)

```css
--uleam-shadow-1: 0 6px 18px rgba(0, 0, 0, 0.08)   /* Elevación 1 - Cards, hover */
--uleam-shadow-2: 0 10px 28px rgba(0, 0, 0, 0.12)  /* Elevación 2 - Modales, FAB */
```

**Uso:** Aplicar con moderación para dar profundidad. Las sombras son sutiles y no saturadas.

---

## 3. Sistema de Espaciado (8pt Grid)

```css
--spacing-xs: 4px      /* 0.5 unidades */
--spacing-sm: 8px      /* 1 unidad */
--spacing-md: 12px     /* 1.5 unidades */
--spacing-lg: 16px     /* 2 unidades */
--spacing-xl: 24px     /* 3 unidades */
--spacing-2xl: 32px    /* 4 unidades */
--spacing-3xl: 40px    /* 5 unidades */
--spacing-4xl: 48px    /* 6 unidades */
--spacing-5xl: 64px    /* 8 unidades */
```

**Principio:** Todos los espacios deben ser múltiplos de 4px para mantener consistencia visual.

---

## 4. Border Radius (Radios de Borde)

```css
--radius-input: 12px    /* Inputs, botones */
--radius-card: 16px     /* Cards, paneles */
--radius-widget: 18px   /* Chat widget */
--radius-pill: 999px    /* Chips, pills, botones redondeados */
```

---

## 5. Tipografía

### Fuente
**Inter** - Sans-serif moderna, profesional y legible.

### Escala Tipográfica

#### H1
- **Desktop:** 44px, weight 800, line-height 1.15
- **Mobile:** 34px, weight 800, line-height 1.15
- **Uso:** Hero sections, títulos principales de páginas

#### H2
- **Desktop:** 30px, weight 700, line-height 1.25
- **Mobile:** 24px, weight 700, line-height 1.25
- **Uso:** Títulos de secciones

#### H3
- **Desktop:** 22px, weight 700, line-height 1.25
- **Mobile:** 20px, weight 700, line-height 1.25
- **Uso:** Subtítulos, títulos de cards

#### H4
- **Base:** 16px, weight 600, line-height 1.5
- **Uso:** Títulos menores

#### Body / Paragraph
- **Base:** 16px, weight 400-500, line-height 1.65
- **Uso:** Texto de contenido

#### Small
- **Base:** 13px
- **Uso:** Helper text, labels secundarios

#### Extra Small
- **Base:** 11px
- **Uso:** Timestamps, metadata

---

## 6. Componentes

### 6.1 Navbar

**Especificación:**
- Altura: 72px (desktop), 64px (mobile)
- Fondo: Blanco con transparencia 95% cuando no scrolled
- Al scroll: Fondo sólido blanco + shadow-1
- Logo: 48px x 48px, rounded 12px
- Active indicator: Línea inferior (width 50%, height 2px) en color primary

**Estados:**
- Default: Color texto normal
- Hover: Fondo surface-2
- Active: Color primary + indicator

**Responsive:**
- Desktop: Links horizontales
- Mobile: Menú hamburguesa + overlay

---

### 6.2 Botones

#### Primary Button
```
Background: var(--uleam-primary)
Color: var(--uleam-text-inverse)
Padding: 12px 32px
Height: 48px (min)
Radius: 12px
Font: 16px, weight 500

States:
- Hover: Shadow lg + scale(1.05) + bg primary-hover
- Active: bg primary-pressed
- Focus: Ring 2px accent-purple
- Disabled: opacity 50%, cursor not-allowed
```

#### Secondary/Outline Button
```
Background: transparent
Border: 1px solid border-strong
Color: var(--uleam-text)
Padding: 12px 32px
Height: 48px
Radius: 12px

States:
- Hover: Shadow md + bg surface-2
- Focus: Ring 2px accent-purple
```

#### Danger Button
```
Background: var(--uleam-danger)
Color: var(--uleam-text-inverse)
(Resto igual a Primary)

Usar SOLO para acciones destructivas confirmadas
```

---

### 6.3 Inputs y Forms

#### Text Input / Textarea
```
Height: 48px (input), auto (textarea)
Padding: 12px 16px
Radius: 12px
Border: 1px solid var(--uleam-border)
Font: 16px, weight 400

States:
- Focus: Ring 2px accent-purple, border stays
- Error: Border danger, ring danger
- Disabled: bg surface-3, opacity 60%
```

#### Helper Text
```
Font: 13px
Color: text-muted (normal) o danger (error)
Margin-top: 4px
Icon + text para errores
```

#### Select
```
Igual que input
Icono chevron-down a la derecha
```

---

### 6.4 Cards

```
Padding: 24px
Radius: 16px (--radius-card)
Background: surface
Border: 1px solid border
Shadow: none (default)

States:
- Hover: shadow-1 + translate-y(-4px)
```

**Uso:** Servicios, features, items de contenido

---

### 6.5 Chips / Pills

```
Padding: 6px 16px
Radius: pill (999px)
Font: 13-14px, weight 500
Height: 32px (aprox)

Variantes:
- Default: bg surface-2, border 1px border, color primary
- Active: bg primary, color text-inverse

States:
- Hover: shadow-sm, bg ligero cambio
```

**Uso:** Sugerencias del chatbot, filtros de categorías

---

### 6.6 Accordion (FAQ)

```
Item:
- Padding: 24px
- Radius: 16px
- Border: 1px solid border
- Background: surface

Trigger (Header):
- Flex between: título a la izquierda, ícono chevron a la derecha
- Hover: bg surface-2
- Active (abierto): Chevron rotate 180deg

Content:
- Padding: 0 24px 16px 24px (top 0 porque el trigger ya tiene padding)
- Animación: slideDown / slideUp suave
```

---

### 6.7 Alerts

#### Success Alert (usar color teal)
```
Background: rgba(14, 106, 123, 0.1)
Border: 1px solid accent-teal
Color: accent-teal-dark
Icon: CheckCircle2
Padding: 16px
Radius: 12px
```

#### Error Alert
```
Background: rgba(224, 1, 0, 0.1)
Border: 1px solid danger
Color: danger-dark
Icon: AlertCircle
```

---

## 7. Chatbot Widget Flotante (COMPACTO)

### 7.1 Estado Cerrado (FAB)

```
Tamaño: 56px x 56px
Posición: fixed, bottom 20px, right 20px (desktop) | 16px (mobile)
Background: primary
Ícono: Bot, 28px, color text-inverse
Shadow: shadow-2
Radius: 50% (circular)

States:
- Hover: scale(1.05) + bg primary-hover + shadow aumenta
- Active: bg primary-pressed
- Focus: ring 2-3px accent-purple
```

**Tooltip:** "¿Necesitas ayuda?" (opcional)

---

### 7.2 Estado Abierto (Panel Compacto)

```
Desktop:
- Width: 360px
- Height: 520px

Mobile:
- Width: 92vw
- Height: 70vh
- Radius superior: 18-22px (tipo bottom sheet)

Position: fixed, bottom/right igual que FAB
Shadow: shadow-2
Radius: 18px (--radius-widget)
Background: white
```

#### Estructura:

**A) Header**
```
Height: 56px
Padding: 12px 16px
Background: surface
Border-bottom: 1px solid border

Content:
- Left: Avatar (40px circular, bg primary, ícono Bot) + Título + Subtítulo
  - Título: "Asistente Académico" (14px, semibold)
  - Subtítulo: "En línea" + punto verde teal (12px, muted)
- Right: Botón cerrar (X)
```

**B) Sugerencias (opcional, si < 2 mensajes)**
```
Padding: 12px
Border-bottom: 1px solid border
Chips: 3 sugerencias principales
- "Requisitos"
- "Malla"
- "Matrícula"
```

**C) Cuerpo (Mensajes)**
```
Flex-1 (ocupa espacio restante)
Overflow-y: auto
Padding: 12-16px
Background: surface-2

Burbuja Usuario:
- Align: right
- Max-width: 85%
- Padding: 10px 16px
- Radius: 16px, rounded-br-sm (cola)
- Background: primary
- Color: text-inverse
- Font: 15px, line-height 1.5

Burbuja Bot:
- Align: left
- Max-width: 85%
- Padding: 10px 16px
- Radius: 16px, rounded-bl-sm
- Background: surface
- Border: 1px solid border
- Color: text
- Font: 15px, line-height 1.5
- Markdown renderizado (ver estilos específicos en theme.css)

Typing Indicator:
- 3 puntos animados (bounce)
- Color: text-muted
- En burbuja bot sin borde
```

**D) Footer (Input)**
```
Padding: 12px
Border-top: 1px solid border
Background: surface

Input:
- Textarea auto-grow (1-3 líneas)
- Padding: 8px 12px
- Radius: 12px
- Border: 1px solid border
- Max-height: 80px
- Placeholder: "Escribe tu pregunta…"

Botón Enviar:
- Width/Height: 40px
- Radius: 12px
- Background: primary
- Ícono: Send, 18px, color text-inverse
- States: hover scale + disabled opacity
```

---

### 7.3 Markdown en Mensajes del Bot

**Estilos aplicados (ya en theme.css):**
- **Párrafos:** margin-bottom 8px
- **Listas:** padding-left 20px, margin 8px 0
- **Enlaces:** color brand-bright, underline on hover, focus ring
- **Tablas:**
  - Width 100%
  - Border 1px solid border
  - Radius 8px
  - Header: bg surface-3, font-weight 600
  - Zebra rows: surface-2
  - Cell padding: 8-10px
- **Código inline:** bg surface-3, padding 2px 6px, radius 4px, monospace
- **Bloques de código:** bg surface-3, padding 12px, radius 8px, overflow-x auto

---

### 7.4 Comportamiento del Widget

**Interacciones:**
- Click FAB → Abre panel + focus en input + mensaje de bienvenida (si es primera vez)
- Enter → Envía mensaje
- Shift+Enter → Nueva línea
- ESC → Cierra panel
- TAB → Navega por header, mensajes, input, botón enviar

**Scroll:**
- Auto-scroll al final cuando llega mensaje nuevo
- Botón "Ir abajo" aparece si usuario scrollea arriba (offset > 100px)

**Persistencia:**
- Si usuario cierra, NO reabrir automáticamente en la sesión
- Opcional: recordar estado abierto/cerrado en sessionStorage

**Seguridad:**
- Markdown sanitizado con DOMPurify antes de renderizar

---

### 7.5 Widget en Página /chatbot/

**Decisión:** El widget NO se muestra en /chatbot/ para evitar duplicidad de interfaces de chat.

**Justificación:** 
- En /chatbot/ el usuario ya tiene una interfaz completa de chat con historial y sugerencias
- Mostrar el widget causaría confusión: ¿dos chats simultáneos?
- Mejor UX: una interfaz de chat clara por contexto

**Implementación:** Condicional en Root.tsx basado en pathname

---

## 8. Páginas

### 8.1 Inicio (Home)

**Objetivo:** Presentar el asistente, generar confianza, motivar a usar el chatbot.

**Secciones:**

1. **Hero**
   - Badge: "Información institucional verificada" (surface-2, primary text)
   - H1: "Asistente Académico ULEAM"
   - Subtítulo: Descripción de propósito
   - CTAs: Primary "Abrir Asistente" + Secondary "Ver FAQ"
   - Padding: 64px vertical (desktop), 48px (mobile)

2. **Servicios Académicos** (bg surface-2)
   - Grid: 3 columnas (desktop), 2 (tablet), 1 (mobile)
   - Cards de servicios con ícono, título, descripción, link "Consultar"
   - Hover: shadow-1 + translate-y(-4px)

3. **Cómo Funciona** (bg surface)
   - 3 pasos con números grandes circulares
   - Texto centrado

4. **Preguntas Populares** (bg surface-2)
   - Grid 2 columnas (desktop), 1 (mobile)
   - Botones clicables que llevan al chatbot con pregunta pre-cargada
   - Ícono MessageSquare + texto

5. **CTA Final** (bg surface)
   - Contenedor con gradiente primary → brand-bright
   - Texto blanco
   - Botón blanco con texto primary

---

### 8.2 Chatbot Página Completa

**Objetivo:** Conversación larga, historial, sugerencias extendidas.

**Layout Desktop:**
```
┌─────────────┬────────────────────┬────────────┐
│  Historial  │    Chat Principal  │ Sugerencias│
│   260px     │      Flexible      │   280px    │
└─────────────┴────────────────────┴────────────┘
```

**Layout Mobile:**
- Chat full-width
- Historial: sidebar colapsable (toggle con botón menú)
- Sugerencias: solo visible en desktop XL (xl:block)

**Componentes:**
- Sidebar historial: lista de conversaciones, botón "Nueva conversación", botón delete por item
- Chat: header con título conversación + estado, mensajes, input fijo abajo (sticky)
- Sugerencias: lista de chips clicables

**Estados:**
- Empty state: ícono Bot grande + texto + chips de sugerencias
- Conversación activa: mensajes + typing indicator
- Error: mensaje de error + botón "Reintentar"

---

### 8.3 FAQ

**Objetivo:** Autoservicio, búsqueda rápida de información.

**Estructura:**
1. Header con buscador (input con ícono Search)
2. Filtros de categoría (pills: Todos, Admisión, Carrera, Matrícula, Trámites)
3. Acordeones con preguntas (Radix UI Accordion)
4. CTA a widget: "¿No encontraste tu respuesta? Pregunta al asistente"

**Acordeón:**
- Categoría (badge pequeño) + pregunta (título semibold)
- Ícono chevron rotable
- Respuesta con line-height 1.65

---

### 8.4 Contacto

**Objetivo:** Canal formal para consultas que requieren respuesta humana.

**Layout:**
- Desktop: 2 columnas (info + formulario)
- Mobile: 1 columna (info arriba, form abajo)

**Información de contacto:**
- Cards con ícono + título + contenido
- MapPin, Phone, Mail, Clock

**Formulario:**
- Campos: Nombre*, Email*, Teléfono (opcional), Asunto*, Mensaje*
- Validación en tiempo real
- Helper text + íconos para errores
- Botón submit con loading state
- Success alert (teal) al enviar

**Validaciones:**
- Email: regex válido
- Teléfono: regex numérico (si se llena)
- Mensaje: min 10 caracteres

**CTA alternativo:** Banner con "¿Necesitas respuesta inmediata? Abrir Asistente"

---

### 8.5 404 Not Found

**Diseño:**
- Centrado vertical
- 404 grande con gradiente primary → brand-bright
- Título + descripción
- Botones: "Volver al Inicio" + "Buscar en el Asistente"

---

## 9. Footer

**Estructura:**
- 3 columnas (desktop): Brand, Enlaces, Contacto
- Mobile: 1 columna apilada

**Contenido:**
- Brand: Logo + nombre + descripción corta
- Enlaces: Inicio, Asistente, FAQ, Contacto
- Contacto: MapPin + dirección, Phone + teléfono, Mail + correo

**Copyright:** Texto centrado, separado con border-top

---

## 10. Accesibilidad (OBLIGATORIO)

### Contraste
- Todos los textos cumplen AA (4.5:1 mínimo para texto normal, 3:1 para texto grande)
- Verificado: text sobre surface ✓, text-inverse sobre primary ✓

### Teclado
- Todos los elementos interactivos son navegables con TAB
- Focus ring visible (2-3px, accent-purple o focus-ring)
- Estados focus en todos los botones, inputs, links, chips
- Widget: ESC cierra, Enter envía, TAB navega

### ARIA
- Widget: role="dialog" + aria-label="Asistente Académico"
- Botones: aria-label cuando no hay texto visible (ej: ícono cerrar)
- Inputs: labels asociados con htmlFor
- Estados dinámicos: aria-live para mensajes del bot (implícito en DOM updates)

### Target Size
- Mínimo 44x44px para todos los elementos interactivos
- Botones: 48px height mínimo
- FAB: 56px x 56px
- Chips: 32px height mínimo

### Mensajes de Error
- No solo color: siempre ícono AlertCircle + texto descriptivo
- Color danger + ícono rojo

---

## 11. Responsive

### Breakpoints (Tailwind defaults)
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### Reglas Clave:
- **Mobile First:** Estilos base para mobile, añadir complejidad en breakpoints mayores
- **Navbar:** Hamburger < md, horizontal >= md
- **Grids:** 1 col mobile → 2 tablet → 3 desktop
- **Chatbot Widget:** 92vw mobile, 360px desktop
- **Chatbot Page:** Sidebar colapsable < lg, 3 columnas >= xl
- **Typography:** H1/H2/H3 reducen tamaño en mobile (ver tokens)
- **Padding/Spacing:** Reducir en mobile (ej: py-16 md:py-20)

---

## 12. Performance

### Optimizaciones:
- **Imágenes:** Usar lazy loading cuando sea apropiado
- **Animaciones:** Transiciones CSS simples (transform, opacity), no animaciones JS pesadas
- **Markdown:** Parsing on-demand, sanitización eficiente
- **Scroll:** useRef + scrollIntoView en lugar de librerías pesadas

---

## 13. Checklist Final QA

### Antes de Deploy:
- [ ] Todos los colores siguen la paleta definida
- [ ] Contraste AA en todos los textos
- [ ] Focus visible en todos los elementos interactivos
- [ ] Widget funciona en todas las páginas (excepto /chatbot/)
- [ ] Markdown renderiza correctamente (tablas, listas, enlaces)
- [ ] Formularios validan correctamente
- [ ] Responsive en mobile, tablet, desktop
- [ ] No hay errores de consola
- [ ] Safe-area respetada en iOS (bottom widget)
- [ ] Animaciones suaves (no jank)
- [ ] Tipografía consistente (Inter cargada)

---

## 14. Implementación Técnica

### Stack:
- **React 18.3** + TypeScript
- **React Router 7** (Data mode)
- **Tailwind CSS 4** (con tokens CSS personalizados)
- **Radix UI** (Accordion, otros primitivos)
- **marked.js** (Markdown parsing)
- **DOMPurify** (Sanitización HTML)
- **Lucide React** (Iconos)

### Estructura de Archivos:
```
/src
  /app
    /components
      /layout
        Navbar.tsx
        Footer.tsx
      /pages
        Home.tsx
        ChatbotPage.tsx
        FAQ.tsx
        Contact.tsx
        NotFound.tsx
      /chatbot
        ChatbotWidget.tsx
      Root.tsx
    routes.tsx
    App.tsx
  /styles
    fonts.css
    theme.css (tokens CSS)
    index.css
    tailwind.css
```

### CSS Tokens:
- Definidos en `/src/styles/theme.css`
- Usar `var(--uleam-*)` en estilos inline o Tailwind arbitrary values
- Ejemplo: `style={{ backgroundColor: 'var(--uleam-primary)' }}`

---

## 15. Microcopy y Contenido

### Widget:
- Placeholder: "Escribe tu pregunta…"
- Bienvenida: "Hola, soy tu Asistente Académico. Pregúntame sobre requisitos, malla curricular o trámites."
- Typing: "El asistente está escribiendo…"
- Error: "No pude conectarme. Verifica tu conexión o intenta en unos segundos."

### Botones:
- Primary CTA: "Abrir Asistente", "Iniciar Conversación"
- Secondary: "Ver FAQ", "Volver al Inicio"
- Links: "Consultar", "Preguntar"

### Tono:
- **Formal pero cercano:** Institucional sin ser rígido
- **Claro y directo:** Sin jerga técnica innecesaria
- **Útil:** Cada texto debe guiar al usuario

---

## 16. Notas de Diseño para Devs

### Espaciado Consistente:
Usar tokens de spacing en lugar de valores arbitrarios. Ejemplo:
```jsx
// ✅ Correcto
<div className="p-6">  // 24px = spacing-xl

// ❌ Evitar
<div className="p-[23px]">
```

### Colores:
Siempre usar variables CSS. Ejemplo:
```jsx
// ✅ Correcto
style={{ color: 'var(--uleam-primary)' }}

// ❌ Evitar
style={{ color: '#0050A0' }}
```

### Radius:
```jsx
// ✅ Correcto para inputs
className="rounded-xl"  // 12px

// ✅ Correcto para cards
className="rounded-[var(--radius-card)]"  // 16px
```

### Transiciones:
```jsx
// ✅ Patrón estándar
className="transition-all hover:shadow-lg hover:scale-105"
```

---

## 🎉 Conclusión

Este design system proporciona una base sólida, consistente y accesible para el sitio web de ULEAM. Todos los componentes están pensados para reutilización, escalabilidad y mantenimiento a largo plazo.

**Características clave:**
✅ Paleta institucional profesional
✅ Chatbot widget compacto y no invasivo
✅ Sistema de espaciado 8pt consistente
✅ Accesibilidad AA compliant
✅ Responsive mobile-first
✅ Markdown styling completo
✅ Componentes reutilizables

---

**Versión:** 1.0
**Fecha:** Marzo 2026
**Autor:** Lead Product Designer + UI Engineer
