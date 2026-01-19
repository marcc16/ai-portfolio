# 🎨 ChatKit Widgets Premium - Documentación Completa

Mejora la UI de tu chat con widgets visuales premium para experiencia, proyectos y tech stack.

---

## 📁 Archivos Creados

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| **[QUICK-START-WIDGETS.md](./QUICK-START-WIDGETS.md)** | ⭐ **Empieza aquí** - Guía paso a paso (10 min) | Primera vez implementando |
| **[widget-examples-ready-to-use.json](./widget-examples-ready-to-use.json)** | Widgets listos para copiar/pegar | Copiar código JSON directo |
| **[CHATKIT-WIDGETS-README.md](./CHATKIT-WIDGETS-README.md)** | Guía completa con teoría | Entender cómo funcionan |
| **[chatkit_widgets_design.md](./chatkit_widgets_design.md)** | 6 diseños premium detallados | Inspiración y personalización |
| **[chatkit_widgets_implementation.md](./chatkit_widgets_implementation.md)** | Guía técnica avanzada | Backend custom |

---

## 🚀 Start Here: Implementación en 3 Pasos

### 1️⃣ Lee la Guía Rápida (5 min)

```bash
# Abre este archivo:
prompts/QUICK-START-WIDGETS.md
```

Te explica exactamente qué hacer en Agent Builder.

### 2️⃣ Copia Widgets Listos (2 min)

```bash
# Abre este archivo:
prompts/widget-examples-ready-to-use.json
```

Contiene 4 widgets listos para usar:
- Experiencia laboral (Card detallado)
- Tech Stack (Grid agrupado)
- Proyecto destacado (Card con imagen)
- Lista de experiencias (ListView compacto)

### 3️⃣ Personaliza con tus Datos (3 min)

Reemplaza:
- URLs de logos con tus imágenes de Sanity
- Nombres de empresas y roles
- Tecnologías y badges
- Descripciones y logros

---

## 🎯 ¿Qué Son los Widgets?

Los widgets son componentes visuales ricos que ChatKit puede mostrar:

### Antes (Solo Texto):
```
User: ¿Cuál es tu experiencia?
Bot: Trabajé en TechCorp como Senior Developer desde 2023...
```

### Después (Con Widget):
```
User: ¿Cuál es tu experiencia?
Bot: Tengo 5 años de experiencia. Te muestro mi historial:

╔══════════════════════════════════════════╗
║  [LOGO]  Senior Full Stack Developer     ║
║          TechCorp Inc.          [Current]║
║          📅 Jan 2023 - Present           ║
║          📍 Remote                        ║
║  ────────────────────────────────────────║
║  • Led microservices migration           ║
║  • Improved API by 40%                   ║
║  • Mentored 5 devs                       ║
║  ────────────────────────────────────────║
║  [React] [Node.js] [AWS] [Docker]        ║
╚══════════════════════════════════════════╝

¿Quieres saber más sobre algún rol?
```

---

## 📊 Widgets Disponibles

### 1. Experiencia Laboral Card
**Cuándo:** Usuario pregunta sobre experiencia específica
**Incluye:** Logo, rol, fechas, ubicación, badges tech, logros
**Archivo:** `widget-examples-ready-to-use.json` → `experience_card_single`

### 2. Tech Stack Agrupado
**Cuándo:** Usuario pregunta "¿Qué tecnologías conoces?"
**Incluye:** Badges agrupados (Frontend/Backend/DevOps)
**Archivo:** `widget-examples-ready-to-use.json` → `tech_stack_grouped`

### 3. Proyecto Featured
**Cuándo:** Usuario pregunta "Muéstrame tus proyectos"
**Incluye:** Imagen cover, descripción, tech badges, botones CTA
**Archivo:** `widget-examples-ready-to-use.json` → `project_featured`

### 4. Lista de Experiencias
**Cuándo:** Usuario pregunta "¿Dónde has trabajado?"
**Incluye:** ListView compacto con múltiples experiencias
**Archivo:** `widget-examples-ready-to-use.json` → `experience_list_compact`

---

## 🎨 Diseño & Estilo

### Paleta de Colores (Coherente con Portfolio)

```typescript
const colors = {
  primary: "#3b82f6",      // Azul - Acciones, Frontend
  success: "#10b981",      // Verde - Current, Backend
  warning: "#f59e0b",      // Ámbar - Featured, DevOps
  danger: "#ef4444",       // Rojo - Importante
  muted: "#64748b"         // Gris - Texto secundario
};
```

### Componentes Usados

- **Card**: Container principal
- **Row/Col**: Layout flexbox
- **Text/Title**: Tipografía
- **Badge**: Pills de tecnologías
- **Image**: Logos y covers
- **Button**: CTAs (View Live, GitHub)
- **Divider**: Separadores visuales
- **Markdown**: Listas con bullets

---

## ✅ Checklist de Implementación

- [ ] Leer QUICK-START-WIDGETS.md
- [ ] Abrir Agent Builder
- [ ] Actualizar Instructions con reglas de widgets
- [ ] Agregar 3 ejemplos de conversación con widgets
- [ ] Guardar y probar en playground
- [ ] Personalizar con datos reales de Sanity
- [ ] Obtener URLs de imágenes desde Sanity CDN
- [ ] Probar en app local (`npm run dev`)
- [ ] Verificar que funciona en dark/light mode
- [ ] Optimizar imágenes (<200KB)

---

## 🧪 Testing

### 1. Test en Agent Builder Playground

```
User: ¿Cuál es tu experiencia?
```
✅ Debería aparecer Card con logo y badges

```
User: ¿Qué tecnologías conoces?
```
✅ Debería aparecer tech stack agrupado

```
User: Muéstrame tus proyectos
```
✅ Debería aparecer card con imagen del proyecto

### 2. Test en App Local

```bash
npm run dev
# Abrir http://localhost:3000
# Abrir chat y hacer las mismas preguntas
```

---

## 🚨 Troubleshooting Rápido

### Widget no aparece
→ Verifica JSON en JSONLint.com
→ Asegúrate de guardarlo en Agent Builder
→ Revisa que esté en respuesta del Assistant, no User

### Imágenes no cargan
→ Usa Sanity CDN: `https://cdn.sanity.io/...`
→ No uses `localhost`
→ Verifica que la imagen exista en Sanity Studio

### Badges muy grandes
→ Agrega `"size": "sm"` y `"pill": true`

### Colores no se ven bien
→ Usa objetos con dark/light:
```json
{ "color": { "light": "#64748b", "dark": "#94a3b8" } }
```

---

## 📚 Recursos Externos

- **[Widget Builder](https://widgets.chatkit.studio)** - Diseñador visual de widgets
- **[ChatKit Docs](https://platform.openai.com/docs/guides/chatkit-widgets)** - Documentación oficial
- **[Agent Builder](https://platform.openai.com/agent-builder)** - Configurar tu workflow
- **[Sanity Image URLs](https://www.sanity.io/docs/image-urls)** - Cómo obtener URLs de imágenes

---

## 💡 Tips & Best Practices

1. **Empieza simple**: Implementa solo 1 widget primero
2. **Texto + Widget**: Siempre combina widgets con contexto textual
3. **No abuses**: Solo usa widgets cuando mejoren la experiencia
4. **Optimiza imágenes**: WebP, <200KB, Sanity CDN
5. **Prueba en ambos modos**: Dark y Light mode
6. **Usa placeholders primero**: Prueba con imágenes de `via.placeholder.com`
7. **Luego reemplaza con reales**: Usa tus imágenes de Sanity

---

## 🎯 Cuando Usar Widgets

### ✅ SÍ usar para:
- Listar 2+ experiencias laborales
- Mostrar tech stack completo (5+ tecnologías)
- Presentar proyectos con imágenes
- Mostrar certificaciones
- Cualquier información estructurada

### ❌ NO usar para:
- Respuestas simples (1-2 líneas)
- Conversación casual
- Preguntas de aclaración
- Info que cabe en texto plano

---

## 🚀 Roadmap (Futuras Mejoras)

### Fase 1: ✅ Diseño (Completado)
- Diseños de widgets premium creados
- JSON listos para usar
- Documentación completa

### Fase 2: ⏳ Implementación Básica
- Actualizar Agent Builder
- Probar en playground
- Personalizar con datos reales

### Fase 3: ⏳ Integración con Sanity
- Crear API endpoint que consulte Sanity
- Generar widgets dinámicos en tiempo real
- Tool function en Agent Builder

### Fase 4: ⏳ Widgets Avanzados
- Progress bars para skills
- Timeline de experiencia
- Testimonials con fotos
- Contact form embebido

---

## 📞 Soporte

- **Documentación**: Lee CHATKIT-WIDGETS-README.md para más detalles
- **Quick Start**: QUICK-START-WIDGETS.md para comenzar rápido
- **Ejemplos**: widget-examples-ready-to-use.json para código listo
- **Diseños**: chatkit_widgets_design.md para inspiración

---

## 🎉 Resultado Final

Después de implementar esto, tu chat tendrá:

✅ **UI premium** que impresiona a reclutadores
✅ **Presentación visual** de experiencia y proyectos
✅ **Badges coloridos** de tecnologías
✅ **Cards interactivos** con imágenes y CTAs
✅ **Estilo coherente** con tu portfolio

---

**¡Empieza con [QUICK-START-WIDGETS.md](./QUICK-START-WIDGETS.md) y tendrás widgets en 10 minutos!** 🚀
