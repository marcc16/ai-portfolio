# 🎨 ChatKit Widgets - Guía Práctica

Mejora la UI del chat con widgets premium para experiencia, proyectos y skills.

---

## 🎯 ¿Qué Son los Widgets?

Los widgets son componentes visuales ricos que ChatKit puede mostrar en lugar de texto plano. Permiten:

- ✅ **Cards** con imágenes, badges y botones
- ✅ **Listas** organizadas con iconos
- ✅ **Badges** de tecnologías coloridos
- ✅ **Botones** interactivos (View Live, GitHub)
- ✅ **Progres bars** para mostrar proficiencia

---

## 📸 Ejemplos Visuales

### Antes (Solo Texto):
```
User: ¿Cuál es tu experiencia?
Assistant: He trabajado como Senior Full Stack Developer en TechCorp desde 2023.
Utilizo React, Node.js, AWS y Docker. También trabajé en StartupXYZ de 2021 a 2023.
```

### Después (Con Widgets):
```
User: ¿Cuál es tu experiencia?
Assistant: Tengo 5 años de experiencia en desarrollo full-stack. Aquí te muestro mi trayectoria:

[WIDGET: Card Premium con logo de empresa, badges de tecnologías, fechas, ubicación]

¿Te gustaría saber más sobre algún rol específico?
```

---

##  implementación

### ⚠️ Importante: Limitación Actual

**Los widgets de ChatKit se generan desde el BACKEND (workflow de OpenAI)**, no desde el frontend React.

Tienes 2 opciones:

---

## 🚀 Opción 1: Actualizar Agent Builder (Más Fácil)

Tu workflow actual: `wf_68e549c569a48190bf4e861854c273630d447668bfdd5642`

### Pasos:

1. **Ir a Agent Builder**
   ```
   https://platform.openai.com/agent-builder
   ```

2. **Seleccionar tu Workflow**
   - Busca el workflow ID: `wf_68e549c569a48190...`
   - Click en "Edit"

3. **Actualizar Instructions**

   Agrega estas instrucciones al agente:

   ```markdown
   ## WIDGET USAGE RULES

   When user asks about experience, projects, or skills, respond with structured widgets:

   ### EXPERIENCE QUESTIONS
   Pattern: "¿Cuál es tu experiencia?", "Where have you worked?"

   Response:
   1. Brief intro text (1-2 lines)
   2. Widget JSON (see examples below)
   3. Follow-up question

   Widget format for single experience:
   {
     "type": "card",
     "size": "lg",
     "children": [...]
   }

   ### TECH STACK QUESTIONS
   Pattern: "¿Qué tecnologías conoces?", "What's your stack?"

   Show grouped badges by category (Frontend, Backend, DevOps)

   ### PROJECT QUESTIONS
   Pattern: "Muéstrame tus proyectos", "What have you built?"

   Include: cover image, description, tech badges, CTA buttons
   ```

4. **Agregar Ejemplos de Conversación**

   En la sección "Examples", agrega:

   ```
   User: ¿Cuál es tu experiencia?

   Assistant: Tengo 5 años de experiencia en desarrollo full-stack. Te muestro mi historial:

   [Aquí incluir JSON del widget de experiencia del archivo chatkit_widgets_design.md]

   ¿Te gustaría conocer más sobre algún rol en particular?
   ```

5. **Guardar y Probar**
   - Click "Save"
   - Prueba en el playground de Agent Builder
   - Si funciona, ya está activo en tu app

---

## 🛠️ Opción 2: Custom Backend con Python SDK (Avanzado)

Si quieres control total, puedes crear tu propio backend que genere widgets dinámicamente desde Sanity.

### Requisitos:
- Servidor Python con FastAPI
- ChatKit Python SDK
- Acceso a Sanity API

### Estructura:

```python
from chatkit import ChatKitServer, Card, Text, Badge, Row, Col, Image

class MyPortfolioChatServer(ChatKitServer):
    async def respond(self, thread, input, context):
        user_message = input.text

        # Detectar pregunta sobre experiencia
        if "experiencia" in user_message.lower():
            # Consultar Sanity
            experiences = await self.fetch_from_sanity("experience")

            # Generar widget
            widget = Card(
                size="lg",
                children=[
                    Row(
                        gap=16,
                        children=[
                            Image(
                                src=experiences[0].logo_url,
                                width="56px",
                                height="56px"
                            ),
                            Col(
                                gap=8,
                                children=[
                                    Text(
                                        value=experiences[0].position,
                                        weight="semibold"
                                    ),
                                    Text(
                                        value=experiences[0].company
                                    )
                                ]
                            )
                        ]
                    )
                ]
            )

            yield widget
```

Ver [Advanced ChatKit Integration](https://platform.openai.com/docs/guides/custom-chatkit) para más detalles.

---

## 📝 Widgets Disponibles

He creado diseños premium para:

1. **Experiencia Laboral** - Card con logo, fechas, tech badges
2. **Tech Stack** - Grid de badges agrupados por categoría
3. **Proyectos** - Card con imagen, descripción, CTAs
4. **Skills Proficiency** - Card con progress bar
5. **Certificaciones** - Card con badge de verified
6. **Lista de Experiencias** - ListView compacto

Ver `chatkit_widgets_design.md` para el código JSON completo de cada widget.

---

## 🎨 Guía de Estilo

### Colores (Coherentes con tu Portfolio):

```typescript
{
  primary: "#3b82f6",    // Azul - Acciones primarias
  success: "#10b981",    // Verde - Current, Active
  warning: "#f59e0b",    // Ámbar - Featured, Important
  danger: "#ef4444",     // Rojo - Crítico
  muted: "#64748b"       // Gris - Texto secundario
}
```

### Badges:
- **Tecnologías**: `variant="outline"`, `pill=true`, `size="sm"`
- **Estados**: `variant="soft"`, `pill=true` (Current, Featured)
- **Categorías**: `variant="solid"`, `pill=true`

### Imágenes:
- **Logos de empresa**: 40-56px, radius "md"
- **Project covers**: aspectRatio "16/9", radius "md"
- **Optimizar**: WebP, <200KB

---

## ✅ Cuándo Usar Widgets

### SÍ usar para:
- ✅ Listar 2+ experiencias laborales
- ✅ Mostrar tech stack (5+ tecnologías)
- ✅ Presentar proyectos con imágenes
- ✅ Mostrar certificaciones
- ✅ Cualquier info estructurada

### NO usar para:
- ❌ Respuestas simples (1-2 líneas)
- ❌ Conversación casual
- ❌ Preguntas de aclaración
- ❌ Información que cabe en texto plano

---

## 🧪 Testing

### 1. Probar en Agent Builder Playground

```
User: ¿Cuál es tu experiencia?
```

Deberías ver un card con:
- Logo de empresa
- Nombre del rol
- Fechas y ubicación
- Badges de tecnologías
- Badge "Current" si aplica

### 2. Probar en tu App Local

```bash
npm run dev
# Abrir http://localhost:3000
# Abrir chat y preguntar sobre experiencia
```

### 3. Verificar en Consola

Los widgets se renderizan como componentes React dentro de ChatKit. Inspecciona con DevTools para ver la estructura.

---

## 📚 Recursos

### Documentación Oficial:
- [ChatKit Widgets Guide](https://platform.openai.com/docs/guides/chatkit-widgets)
- [Widget Builder](https://widgets.chatkit.studio) - Diseñador visual
- [ChatKit Python SDK](https://github.com/openai/chatkit-python)

### Ejemplos:
- Ver `chatkit_widgets_design.md` para 6 diseños premium
- Ver `chatkit_widgets_implementation.md` para guía detallada

### Widget Builder (Visual):
1. Ve a https://widgets.chatkit.studio
2. Arrastra componentes (Card, Text, Badge, Image)
3. Personaliza estilos
4. Copia JSON generado
5. Úsalo en Agent Builder

---

## 🚨 Troubleshooting

### Widget no se muestra
1. Verifica que el JSON esté bien formado
2. Revisa que el agente esté configurado para usar widgets
3. Comprueba que las URLs de imágenes sean accesibles (HTTPS)

### Imágenes no cargan
- Asegúrate de usar URLs públicas (no `localhost`)
- Usa Sanity CDN para imágenes: `https://cdn.sanity.io/...`
- Optimiza imágenes (WebP, <200KB)

### Colores no coinciden con portfolio
- Usa la paleta definida en la guía de estilo
- Para dark mode, define ambos: `{ light: "#...", dark: "#..." }`

### Badges demasiado grandes
- Usa `size="sm"` para tech badges
- Usa `pill=true` para bordes redondeados
- Limita a 4-6 badges por fila

---

## 💡 Próximos Pasos

1. **Fase 1** ✅ - Diseños creados (chatkit_widgets_design.md)
2. **Fase 2** ⏳ - Actualizar Agent Builder con instrucciones
3. **Fase 3** ⏳ - Probar en playground de Agent Builder
4. **Fase 4** ⏳ - Ajustar estilos según feedback
5. **Fase 5** ⏳ - (Opcional) Migrar a custom backend si necesitas más control

---

## 🤝 Contribuir

¿Tienes ideas para más widgets? Agrega diseños a `chatkit_widgets_design.md`:

- Timeline de experiencia
- Gráfico de skills (radar chart si ChatKit lo soporta)
- Testimonials con fotos
- Contact form embebido
- Calendar availability

---

## 📞 Soporte

- **Agent Builder**: https://platform.openai.com/agent-builder
- **ChatKit Docs**: https://platform.openai.com/docs/guides/chatkit
- **Widget Builder**: https://widgets.chatkit.studio

---

**¡Listo!** Ahora tu chat tendrá una UI premium que impresionará a reclutadores y visitantes. 🚀
