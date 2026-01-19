# 🚀 Quick Start: Widgets en 10 Minutos

Guía paso a paso para agregar widgets premium a tu ChatKit.

---

## ✅ Lo Que Vas a Lograr

**Antes:**
```
User: ¿Cuál es tu experiencia?
Bot: He trabajado en TechCorp como Senior Developer desde 2023...
```

**Después:**
```
User: ¿Cuál es tu experiencia?
Bot: Tengo 5 años de experiencia. Te muestro mi historial:

[Card Premium con logo, badges, fechas, tecnologías]

¿Quieres saber más sobre algún rol específico?
```

---

## 📋 Paso 1: Abrir Agent Builder

1. Ve a https://platform.openai.com/agent-builder
2. Haz login con tu cuenta OpenAI
3. Busca tu workflow: `wf_68e549c569a48190...` (el que está en tu `lib/config.ts`)
4. Click en **"Edit"** o **"Configure"**

---

## 📝 Paso 2: Actualizar Instructions

En la sección **"Instructions"** o **"System Message"**, agrega esto **AL FINAL** de tus instrucciones existentes:

```markdown
---

## WIDGET PRESENTATION RULES

When appropriate, present information using structured widgets for better visual experience.

### When to Use Widgets:

1. **Experience Questions**
   - Patterns: "experiencia", "work history", "where have you worked", "háblame de tu trabajo"
   - Use: Card widget for detailed single experience OR ListView for multiple experiences
   - Always include: company logo, role, dates, location, tech badges

2. **Tech Stack Questions**
   - Patterns: "tecnologías", "tech stack", "what do you know", "habilidades"
   - Use: Card widget with grouped badges (Frontend, Backend, DevOps)
   - Color code: Blue (frontend), Green (backend), Orange (devops)

3. **Project Questions**
   - Patterns: "proyectos", "what have you built", "portfolio", "muéstrame"
   - Use: Card widget with cover image, description, tech badges, CTA buttons
   - Include: "View Live" and "GitHub" buttons if URLs available

### Widget Format Example:

For experience, respond with:
```json
{
  "type": "card",
  "size": "lg",
  "children": [...]
}
```

### Response Structure:
1. **Context** (1-2 lines of intro text)
2. **Widget** (JSON structure)
3. **Follow-up** (ask if user wants more detail)

Example:
```
I have 5 years of full-stack experience. Here's my work history:

[WIDGET JSON HERE]

Would you like to know more about a specific role or the technologies I used?
```

### Important:
- Use widgets for structured data (2+ items, visual content)
- Don't use widgets for simple answers or conversation
- Always provide text context before and after widget
- Ensure image URLs are public and accessible (HTTPS)
```

---

## 📦 Paso 3: Agregar Ejemplos de Conversación

En la sección **"Examples"** o **"Few-Shot Examples"**, agrega estos ejemplos:

### Ejemplo 1: Experiencia

**User:**
```
¿Cuál es tu experiencia laboral?
```

**Assistant:**
```
Tengo 5 años de experiencia en desarrollo full-stack, trabajando en empresas desde startups hasta corporaciones. Te muestro mi historial:
```

Luego agrega el JSON del widget `experience_card_single` del archivo `widget-examples-ready-to-use.json`

### Ejemplo 2: Tech Stack

**User:**
```
¿Qué tecnologías dominas?
```

**Assistant:**
```
Trabajo con un stack moderno a través de todo el ciclo de desarrollo. Aquí está mi tech stack principal:
```

Luego agrega el JSON del widget `tech_stack_grouped` del archivo `widget-examples-ready-to-use.json`

### Ejemplo 3: Proyectos

**User:**
```
Muéstrame tus proyectos
```

**Assistant:**
```
He desarrollado varios proyectos full-stack. Te presento uno de mis proyectos destacados:
```

Luego agrega el JSON del widget `project_featured` del archivo `widget-examples-ready-to-use.json`

---

## 💾 Paso 4: Guardar y Probar

1. Click en **"Save"** o **"Update"** en Agent Builder
2. Ve a la sección de **"Test"** o **"Playground"**
3. Prueba con estas preguntas:
   - "¿Cuál es tu experiencia?"
   - "¿Qué tecnologías conoces?"
   - "Muéstrame tus proyectos"

4. **Deberías ver widgets visuales** en lugar de solo texto

---

## 🎨 Paso 5: Personalizar con Tus Datos Reales

### Para Experiencia Laboral:

Abre `widget-examples-ready-to-use.json` → `experience_card_single` → Reemplaza:

```json
{
  "src": "TU_URL_DE_LOGO",          // Logo de tu empresa desde Sanity
  "alt": "TU EMPRESA Logo",
  "value": "TU PUESTO",              // e.g. "Senior Full Stack Developer"
  "value": "TU EMPRESA",             // e.g. "TechCorp Inc."
  "value": "📅 TUS FECHAS",          // e.g. "Jan 2023 - Present"
  "value": "📍 TU UBICACIÓN",        // e.g. "Remote" o "San Francisco"
  "value": "TUS LOGROS",             // Tus achievements reales
  "label": "TUS_TECH"                // Tus tecnologías
}
```

### Para Tech Stack:

Edita el widget `tech_stack_grouped` y agrupa TUS tecnologías reales:

- **Frontend**: Tu stack frontend real
- **Backend**: Tu stack backend real
- **DevOps**: Tus herramientas DevOps reales

### Para Proyectos:

Usa las imágenes desde Sanity CDN:
```json
{
  "src": "https://cdn.sanity.io/images/YOUR_PROJECT_ID/...",
  "value": "Tu Proyecto Real",
  "value": "Tu descripción real"
}
```

---

## 🔗 Paso 6: Obtener URLs de Imágenes desde Sanity

### Para Logos de Empresa:

1. Ve a tu Sanity Studio: `http://localhost:3000/studio`
2. Abre una experiencia (Experience)
3. Click derecho en el logo → "Copy image URL"
4. Usa esa URL en el widget

### Para Proyectos:

1. Ve a Projects en Sanity Studio
2. Abre un proyecto
3. Click derecho en Cover Image → "Copy image URL"
4. Usa esa URL en el widget

### Formato de URL:
```
https://cdn.sanity.io/images/<PROJECT_ID>/<DATASET>/<IMAGE_ID>-<WIDTH>x<HEIGHT>.<FORMAT>
```

---

## 🧪 Testing Checklist

Prueba en tu app local (`npm run dev`):

- [ ] Abrir chat
- [ ] Preguntar "¿Cuál es tu experiencia?"
- [ ] Verificar que aparece un Card con logo y badges
- [ ] Preguntar "¿Qué tecnologías conoces?"
- [ ] Verificar badges agrupados por categoría
- [ ] Preguntar "Muéstrame tus proyectos"
- [ ] Verificar imagen del proyecto y botones

---

## 🎨 Personalización de Colores

En los JSON de widgets, cambia los colores para que coincidan con tu brand:

```json
{
  "color": {
    "light": "#TU_COLOR_HEX",
    "dark": "#TU_COLOR_HEX_DARK"
  }
}
```

### Paleta Recomendada (Coherente con Portfolio):

```json
{
  "primary": "#3b82f6",      // Azul
  "success": "#10b981",      // Verde
  "warning": "#f59e0b",      // Ámbar
  "danger": "#ef4444",       // Rojo
  "muted": "#64748b"         // Gris
}
```

---

## 🚨 Troubleshooting

### Problema: Widget no aparece

**Solución:**
1. Verifica que el JSON esté bien formado (usa JSONLint.com)
2. Revisa que agregaste el widget en la respuesta del Assistant, no del User
3. Asegúrate de guardar cambios en Agent Builder

### Problema: Imágenes no cargan

**Solución:**
1. Verifica que las URLs sean públicas (HTTPS)
2. Usa Sanity CDN: `cdn.sanity.io`, no `localhost`
3. Comprueba que las imágenes existan en Sanity Studio

### Problema: Badges muy grandes

**Solución:**
```json
{
  "type": "badge",
  "label": "React",
  "size": "sm",        // Agregar esto
  "pill": true         // Agregar esto
}
```

### Problema: Widget se ve diferente en dark/light mode

**Solución:**
Usa colores adaptativos:
```json
{
  "color": {
    "light": "#64748b",
    "dark": "#94a3b8"
  }
}
```

---

## 📚 Archivos de Referencia

| Archivo | Para Qué Sirve |
|---------|----------------|
| `CHATKIT-WIDGETS-README.md` | Guía completa con teoría |
| `widget-examples-ready-to-use.json` | Widgets listos para copiar |
| `chatkit_widgets_design.md` | 6 diseños premium detallados |
| `QUICK-START-WIDGETS.md` | Esta guía (inicio rápido) |

---

## ✨ Resultado Final

Después de seguir estos pasos, tu chat tendrá:

✅ **Cards premium** con logos y badges
✅ **Tech stack visual** agrupado por categorías
✅ **Proyectos con imágenes** y CTAs
✅ **Listas compactas** para múltiples items
✅ **Estilo coherente** con tu portfolio

---

## 🎯 Próximos Pasos Opcionales

1. **Agregar más tipos de widgets:**
   - Certificaciones con badge de verified
   - Skills con progress bars
   - Timeline de experiencia

2. **Conectar con Sanity dinámicamente:**
   - Crear API endpoint que consulte Sanity
   - Hacer que el agente llame a ese endpoint
   - Generar widgets dinámicos con datos reales en tiempo real

3. **Optimizar imágenes:**
   - Convertir a WebP
   - Comprimir a <200KB
   - Usar responsive images

---

## 💡 Tips Finales

- **Empieza simple**: Implementa solo el widget de experiencia primero
- **Prueba iterativamente**: Guarda, prueba, ajusta, repite
- **Usa Widget Builder**: https://widgets.chatkit.studio para diseñar visualmente
- **No abuses**: Solo usa widgets cuando realmente mejoren la experiencia
- **Texto + Widget**: Siempre combina widgets con contexto textual

---

**¡Listo!** En menos de 10 minutos deberías tener widgets funcionando. 🚀

¿Problemas? Revisa el troubleshooting o consulta la documentación completa en `CHATKIT-WIDGETS-README.md`
