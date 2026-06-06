# Guía de Implementación - ULEAM Chatbot

Esta guía te ayudará a entender y personalizar el proyecto según tus necesidades.

## 📋 Índice

1. [Personalizar Respuestas del Bot](#1-personalizar-respuestas-del-bot)
2. [Agregar Nuevas Páginas](#2-agregar-nuevas-páginas)
3. [Modificar Colores](#3-modificar-colores)
4. [Agregar Nuevas Preguntas FAQ](#4-agregar-nuevas-preguntas-faq)
5. [Conectar Backend Real](#5-conectar-backend-real)
6. [Deployment](#6-deployment)

---

## 1. Personalizar Respuestas del Bot

### Ubicación de la Lógica

Las respuestas están en dos archivos:
- `/src/app/components/chatbot/ChatbotWidget.tsx` (línea ~62-140)
- `/src/app/components/pages/ChatbotPage.tsx` (línea ~90-160)

### Agregar Nueva Respuesta

```typescript
// En la función generateBotResponse()

if (q.includes('nueva_palabra') || q.includes('otra_palabra')) {
  return `**Título de la Respuesta**

Contenido en Markdown:
- Punto 1
- Punto 2

| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato 1    | Dato 2    |

¿Otra pregunta?`;
}
```

### Formato de Respuestas

El bot soporta **Markdown completo**:

```markdown
**Negrita**
*Cursiva*

# Título
## Subtítulo

- Lista item 1
- Lista item 2

1. Numerada 1
2. Numerada 2

[Enlace](https://url.com)

| Tabla | Columna |
|-------|---------|
| Dato  | Valor   |

`código inline`

```
bloque de código
```
```

### Modificar Sugerencias

En ambos archivos, edita el array `SUGGESTIONS`:

```typescript
const SUGGESTIONS = [
  'Tu nueva sugerencia 1',
  'Tu nueva sugerencia 2',
  'Tu nueva sugerencia 3',
  // ... más
];
```

---

## 2. Agregar Nuevas Páginas

### Paso 1: Crear el Componente

Crea `/src/app/components/pages/TuPagina.tsx`:

```tsx
export function TuPagina() {
  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 style={{ color: 'var(--uleam-text)' }}>Tu Título</h1>
          <p style={{ color: 'var(--uleam-text-muted)' }}>Descripción</p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        {/* Tu contenido aquí */}
      </section>
    </div>
  );
}
```

### Paso 2: Agregar Ruta

En `/src/app/routes.tsx`:

```tsx
import { TuPagina } from "./components/pages/TuPagina";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // ... rutas existentes
      { path: "tu-ruta", Component: TuPagina },
    ],
  },
]);
```

### Paso 3: Agregar al Navbar

En `/src/app/components/layout/Navbar.tsx`:

```tsx
const navLinks = [
  // ... enlaces existentes
  { path: '/tu-ruta', label: 'Tu Página' },
];
```

---

## 3. Modificar Colores

### Opción 1: Cambiar Tokens CSS (Recomendado)

Edita `/src/styles/theme.css`:

```css
:root {
  /* Cambiar color primario */
  --uleam-primary: #TU_COLOR;
  --uleam-primary-hover: #TU_COLOR_HOVER;
  --uleam-primary-pressed: #TU_COLOR_PRESSED;
  
  /* Otros colores... */
}
```

**Ventaja:** Todos los componentes se actualizan automáticamente.

### Opción 2: Personalizar por Componente

```tsx
// En cualquier componente
<button
  style={{ backgroundColor: '#TU_COLOR' }}
  className="..."
>
  Texto
</button>
```

### Verificar Contraste

Usa herramientas como:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

**Mínimo AA:** 4.5:1 para texto normal, 3:1 para texto grande.

---

## 4. Agregar Nuevas Preguntas FAQ

Edita `/src/app/components/pages/FAQ.tsx`:

```tsx
const faqs: FAQItem[] = [
  {
    category: 'Admisión', // o crea nueva: 'Tu Categoría'
    question: '¿Tu nueva pregunta?',
    answer: 'Tu respuesta detallada aquí.',
  },
  // ... más preguntas
];
```

### Agregar Nueva Categoría

```tsx
// Las categorías se generan automáticamente del array faqs
// Solo agrega items con category: 'Nueva Categoría'
```

---

## 5. Conectar Backend Real

### 5.1 Crear API Endpoint

Ejemplo con Express.js:

```javascript
// backend/server.js
app.post('/api/chat', async (req, res) => {
  const { message, conversationId } = req.body;
  
  // Tu lógica (IA, base de datos, etc.)
  const response = await generateAIResponse(message);
  
  res.json({
    message: response,
    conversationId: conversationId || generateNewId(),
  });
});
```

### 5.2 Actualizar Frontend

En `ChatbotWidget.tsx` y `ChatbotPage.tsx`:

```tsx
const handleSendMessage = async (text?: string) => {
  const messageText = text || input.trim();
  if (!messageText) return;

  // Agregar mensaje del usuario
  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: messageText,
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  try {
    // Llamada API real
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageText,
        conversationId: currentConversationId,
      }),
    });

    const data = await response.json();

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: data.message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    // Manejo de error
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: 'No pude conectarme. Verifica tu conexión o intenta en unos segundos.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};
```

### 5.3 Variables de Entorno

Crea `.env` en la raíz:

```bash
VITE_API_URL=http://localhost:3000/api
# o
VITE_API_URL=https://tu-backend.com/api
```

Usa en el código:

```tsx
const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/chat`, { ... });
```

---

## 6. Deployment

### 6.1 Build del Proyecto

```bash
npm run build
# Genera carpeta /dist
```

### 6.2 Opciones de Hosting

#### Vercel (Recomendado para React)

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
# netlify.toml en raíz
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://tu-usuario.github.io/tu-repo"
}

# Deploy
npm run deploy
```

#### Servidor Propio (Nginx)

```nginx
server {
  listen 80;
  server_name tu-dominio.com;
  root /var/www/uleam/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 🔧 Personalizaciones Comunes

### Cambiar Logo

En `Navbar.tsx` y `Footer.tsx`:

```tsx
// Reemplaza el div con imagen
<img 
  src="/tu-logo.png" 
  alt="ULEAM" 
  className="w-12 h-12"
/>
```

### Cambiar Fuente

En `/src/styles/fonts.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=TuFuente:wght@400;500;600;700;800&display=swap');
```

En `/src/styles/theme.css`:

```css
body {
  font-family: 'TuFuente', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Agregar Analíticas

```tsx
// En /src/app/App.tsx
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Google Analytics
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=TU_ID';
    script.async = true;
    document.head.appendChild(script);

    window.gtag = function() { dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'TU_ID');
  }, []);

  return <RouterProvider router={router} />;
}
```

### Modificar Metadata

En `/index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ULEAM - Asistente Académico</title>
  <meta name="description" content="Tu descripción SEO" />
  <meta property="og:title" content="ULEAM Asistente" />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="/og-image.png" />
</head>
```

---

## 🐛 Troubleshooting

### El widget no aparece

Verifica:
1. Estás en una ruta diferente a `/chatbot/`
2. No hay errores en consola
3. El componente `ChatbotWidget` está importado en `Root.tsx`

### Markdown no renderiza

Verifica:
1. `marked` y `dompurify` están instalados
2. La clase `.bot-message-content` tiene estilos en `theme.css`
3. Estás usando `dangerouslySetInnerHTML` correctamente

### Estilos no se aplican

Verifica:
1. Variables CSS están definidas en `:root`
2. Usas `var(--uleam-*)` correctamente
3. Tailwind está configurado (no debería haber problema con Tailwind 4)

### El router no funciona

Verifica:
1. Importas de `react-router` (no `react-router-dom`)
2. Usas `RouterProvider` en `App.tsx`
3. Las rutas tienen `Component` (mayúscula)

---

## 📚 Recursos Adicionales

### Documentación

- [React Router v7](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Marked.js](https://marked.js.org/)

### Herramientas de Diseño

- [Coolors](https://coolors.co/) - Paletas de colores
- [Type Scale](https://typescale.com/) - Escalas tipográficas
- [Figma](https://figma.com/) - Diseño UI/UX

### Testing de Accesibilidad

- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)

---

## 🤝 Soporte

Para dudas específicas de implementación, revisa:
1. `/DESIGN_SYSTEM.md` - Sistema de diseño completo
2. `/README.md` - Documentación general
3. Comentarios en el código fuente

---

**¡Buena suerte con tu implementación!** 🚀
