# ULEAM - Asistente Académico | Chatbot Institucional

Sitio web institucional moderno para la carrera de Administración de ULEAM Extensión El Carmen, con un asistente académico inteligente integrado.

## 🎯 Características Principales

- ✅ **Chatbot Widget Flotante Compacto** - Asistente disponible en todas las páginas
- ✅ **Página de Chat Completa** - Con historial de conversaciones y sugerencias
- ✅ **Sistema de Diseño Institucional** - Paleta de colores ULEAM, tipografía Inter
- ✅ **Totalmente Responsivo** - Diseñado mobile-first
- ✅ **Accesible** - Cumple WCAG 2.1 AA (contraste, teclado, ARIA)
- ✅ **Renderizado de Markdown** - Tablas, listas, enlaces, código en respuestas del bot
- ✅ **Preguntas Frecuentes** - Con búsqueda y filtros por categoría
- ✅ **Formulario de Contacto** - Validación completa y estados de error

## 🛠️ Tecnologías

- **React 18.3** - Librería UI
- **React Router 7** - Navegación y routing (Data mode)
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework CSS utilitario
- **Radix UI** - Componentes accesibles (Accordion)
- **marked.js** - Parser de Markdown
- **DOMPurify** - Sanitización HTML
- **Lucide React** - Librería de iconos

## 📁 Estructura del Proyecto

```
/src
  /app
    /components
      /layout
        Navbar.tsx          # Navegación principal con scroll behavior
        Footer.tsx          # Footer con info de contacto
      /pages
        Home.tsx            # Página de inicio con hero y servicios
        ChatbotPage.tsx     # Chat completo con historial
        FAQ.tsx             # Preguntas frecuentes con acordeones
        Contact.tsx         # Formulario de contacto
        NotFound.tsx        # Página 404
      /chatbot
        ChatbotWidget.tsx   # Widget flotante compacto
      Root.tsx              # Layout principal con Outlet
    routes.tsx              # Configuración de rutas
    App.tsx                 # Punto de entrada
  /styles
    fonts.css               # Google Fonts (Inter)
    theme.css               # Design tokens CSS + estilos base
    index.css               # Estilos globales
    tailwind.css            # Configuración Tailwind
```

## 🎨 Design System

Ver documentación completa en [`/DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

### Paleta de Colores

**Primarios:**
- `#0050A0` - Azul institucional
- `#1E1198` - Azul violeta profundo
- `#1740D3` - Azul brillante

**Secundarios:**
- `#E00100` - Rojo intenso (uso moderado)
- `#5C0006` - Rojo oscuro

**Acentos:**
- `#8A7AF4` - Morado claro (focus ring)
- `#0E6A7B` - Verde azulado (success, info)
- `#092D30` - Verde oscuro

**Neutros:**
- `#7A8896` - Gris azulado (texto secundario)
- `#C4C4C4` - Gris claro (bordes)

### Tipografía

**Fuente:** Inter (400, 500, 600, 700, 800)

**Escala:**
- H1: 44px (desktop) / 34px (mobile), weight 800
- H2: 30px / 24px, weight 700
- H3: 22px / 20px, weight 700
- Body: 16px, weight 400-500, line-height 1.65

### Espaciado

Sistema 8pt: 4, 8, 12, 16, 24, 32, 40, 48, 64px

### Border Radius

- Inputs/botones: 12px
- Cards: 16px
- Widget: 18px
- Pills: 999px

## 🤖 Chatbot Widget

### Características

- **Compacto:** 360px x 520px (desktop), 92vw x 70vh (mobile)
- **No invasivo:** Se oculta automáticamente en `/chatbot/` para evitar duplicidad
- **Markdown completo:** Renderiza tablas, listas, enlaces, código
- **Accesible:** Navegación por teclado (Tab, Enter, Esc)
- **Sugerencias rápidas:** Chips clicables para preguntas comunes
- **Auto-scroll:** Se desplaza automáticamente al recibir mensajes
- **Sanitización:** Todo el HTML del Markdown es sanitizado con DOMPurify

### Respuestas del Bot

El bot proporciona información sobre:
- Requisitos de ingreso
- Malla curricular
- Proceso de matrícula
- Fechas importantes
- Información de contacto
- Costos y aranceles

## 🚀 Páginas

### 1. Inicio (`/`)
- Hero con CTAs principales
- Servicios académicos (grid de cards)
- Cómo funciona (3 pasos)
- Preguntas populares
- CTA final con gradiente

### 2. Chatbot (`/chatbot`)
- Layout 3 columnas (desktop): Historial | Chat | Sugerencias
- Historial de conversaciones con opción de eliminar
- Empty state con sugerencias grandes
- Markdown rendering completo

### 3. FAQ (`/faq`)
- Buscador de preguntas
- Filtros por categoría (pills)
- Acordeones con animaciones suaves
- CTA al chatbot widget

### 4. Contacto (`/contact`)
- Layout 2 columnas: Info | Formulario
- Validación en tiempo real
- Estados de error con íconos
- Success alert con color teal
- Mapa placeholder

### 5. 404
- Diseño centrado con gradiente
- CTAs: Volver al inicio + Abrir asistente

## ♿ Accesibilidad

- ✅ Contraste AA en todos los textos
- ✅ Focus ring visible (2-3px, color accent-purple)
- ✅ Navegación completa por teclado
- ✅ ARIA labels en elementos interactivos
- ✅ Target size mínimo 44x44px
- ✅ Mensajes de error con ícono + texto (no solo color)
- ✅ Estados focus, hover, active en todos los botones/links

## 📱 Responsive

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

**Comportamiento:**
- Navbar: Hamburger menu en mobile, horizontal en desktop
- Grids: 1 columna (mobile) → 2 (tablet) → 3 (desktop)
- Chatbot widget: Ajuste de tamaño según viewport
- Chatbot page: Sidebar colapsable en mobile

## 🔧 Desarrollo

### Instalación

```bash
npm install
# o
pnpm install
```

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📝 Notas Técnicas

### Routing

Se usa React Router 7 en modo "Data" con `createBrowserRouter`. El layout principal (`Root.tsx`) incluye `Navbar`, `Footer` y condicionalmente el `ChatbotWidget`.

### CSS Tokens

Los colores y espacios están definidos como CSS custom properties en `/src/styles/theme.css`. Usar siempre `var(--uleam-*)` para consistencia.

Ejemplo:
```tsx
style={{ backgroundColor: 'var(--uleam-primary)' }}
```

### Markdown Rendering

El bot usa `marked.js` para parsear Markdown y `DOMPurify` para sanitizar el HTML resultante antes de renderizarlo con `dangerouslySetInnerHTML`.

### Estado del Widget

El widget no se muestra en `/chatbot/` para evitar duplicidad. Esto se controla en `Root.tsx` con:

```tsx
const showWidget = location.pathname !== "/chatbot";
```

## 🎓 Casos de Uso

**Para estudiantes:**
- Consultar requisitos de ingreso
- Ver malla curricular
- Conocer fechas de matrícula
- Obtener información de contacto

**Para aspirantes:**
- Entender el proceso de admisión
- Conocer costos y aranceles
- Preguntar sobre la carrera

**Para administrativos:**
- Reducir consultas repetitivas
- Proporcionar información consistente
- Canal disponible 24/7

## 📄 Licencia

© 2026 ULEAM - Extensión El Carmen. Todos los derechos reservados.

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026
"# web-chat" 
