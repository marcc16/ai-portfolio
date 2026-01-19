# 🚀 START HERE: Widgets en Agent Builder

## Tu Problema

"Puse instrucciones en markdown pero sigo viendo texto plano"

---

## Solución Rápida (2 minutos)

### Paso 1: Agent Builder → Output Format

```
1. Abre tu workflow
2. Click en el círculo "Agent"
3. Panel derecho → "Output Format"
4. Selecciona: "Auto" (NO "Text" o "Markdown")
```

### Paso 2: Copiar Esta Config

**Agent Builder → Instructions → Pega esto:**

```markdown
Eres Marc, desarrollador full-stack.

Para preguntas sobre experiencia, responde ASÍ:

Te muestro mi experiencia:

```widget
{
  "type": "card",
  "size": "lg",
  "children": [
    {
      "type": "text",
      "value": "Senior Full Stack Developer",
      "weight": "semibold",
      "size": "md"
    },
    {
      "type": "text",
      "value": "TechCorp Inc.",
      "size": "md"
    },
    {
      "type": "caption",
      "value": "📅 2023 - Presente | 📍 Remote",
      "size": "sm"
    },
    {
      "type": "divider",
      "spacing": 12
    },
    {
      "type": "markdown",
      "value": "• Led microservices migration\n• Improved API by 40%\n• Mentored 5 developers"
    },
    {
      "type": "row",
      "gap": 8,
      "wrap": "wrap",
      "margin": { "top": 12 },
      "children": [
        { "type": "badge", "label": "React", "color": "info", "pill": true, "size": "sm" },
        { "type": "badge", "label": "Node.js", "color": "success", "pill": true, "size": "sm" },
        { "type": "badge", "label": "AWS", "color": "warning", "pill": true, "size": "sm" },
        { "type": "badge", "label": "Docker", "color": "info", "pill": true, "size": "sm" }
      ]
    }
  ]
}
```

¿Quieres saber más?

IMPORTANTE:
- SIEMPRE poner ```widget antes del JSON
- SIEMPRE cerrar con ```
- Agregar texto antes Y después del widget
```

### Paso 3: Probar

```
1. Agent Builder → "Test" o "Playground"
2. Escribir: "¿Cuál es tu experiencia?"
3. Deberías ver un CARD VISUAL con badges
```

---

## ❌ Si SIGUE sin funcionar

### Problema A: Ves el código JSON literal

```
Resultado:
Te muestro mi experiencia:
```widget
{ "type": "card", ... }
```
```

**Solución:** Output Format está mal
→ Cámbialo a "Auto" o "Widget"

### Problema B: No existe opción "Widget" en Output Format

**Causa:** No tienes ChatKit habilitado

**Opciones:**
1. Contactar OpenAI support para habilitar ChatKit
2. Usar el método alternativo (ver abajo)

### Problema C: Error "Invalid widget"

**Solución:** JSON mal formado
→ Valida en https://jsonlint.com
→ Usa comillas dobles `"` no simples `'`
→ Verifica corchetes `{}` `[]`

---

## Método Alternativo: Widget Builder Visual

Si Agent Builder no funciona:

1. **Ve a:** https://widgets.chatkit.studio
2. **Diseña** tu widget visualmente
3. **Descarga** el archivo `.widget`
4. **Sube** el archivo en Agent Builder

---

## Archivos de Ayuda Creados

| Archivo | Cuándo Usarlo |
|---------|---------------|
| **Este archivo** | Empezar |
| `RESUMEN-EJECUTIVO-WIDGETS.md` | Solución detallada |
| `COPY-PASTE-AGENT-CONFIG.txt` | Config lista para copiar |
| `FIX-WIDGET-PROBLEMA.md` | Troubleshooting |
| `portfolio.widget` | Archivo .widget pre-configurado |
| `widget-examples-ready-to-use.json` | 4 widgets listos |

---

## Ejemplo de Respuesta Correcta

**User pregunta:**
```
¿Cuál es tu experiencia?
```

**Agent responde:**
```
Tengo 5 años de experiencia en desarrollo full-stack. Te muestro:

[AQUÍ APARECE EL CARD VISUAL CON LOGO, BADGES, FECHAS]

¿Te gustaría conocer más sobre algún proyecto específico?
```

**NO debe verse así (incorrecto):**
```
Tengo 5 años...

```widget
{
  "type": "card",
  ...
}
```
```

---

## Checklist Rápido

- [ ] Output Format = "Auto" o "Widget"
- [ ] Instructions incluyen ```widget antes del JSON
- [ ] JSON es válido (probado en jsonlint.com)
- [ ] Hay texto ANTES del widget
- [ ] Hay pregunta DESPUÉS del widget
- [ ] Probado en playground
- [ ] Aparece card visual (NO código)

---

## Si TODO Falla

**Plan B: Backend Custom (Avanzado)**

En lugar de Agent Builder, puedes generar widgets desde tu backend:

1. Crear API endpoint que consulte Sanity
2. Usar ChatKit Python SDK
3. Generar widgets dinámicamente

Ver: `chatkit_widgets_implementation.md` para detalles

---

## Siguiente Paso

1. ✅ Sigue Paso 1, 2, 3 arriba
2. ✅ Si funciona → Personaliza con tus datos reales
3. ✅ Si no funciona → Lee `RESUMEN-EJECUTIVO-WIDGETS.md`
4. ✅ Si SIGUE sin funcionar → Lee `FIX-WIDGET-PROBLEMA.md`

---

## Preguntas Frecuentes

**Q: ¿Cuántos widgets puedo usar por respuesta?**
A: Máximo 1-2. No abrumar al usuario.

**Q: ¿Puedo mezclar texto y widgets?**
A: Sí, SIEMPRE debes hacerlo. Texto + Widget + Follow-up.

**Q: ¿Funcionan en mobile?**
A: Sí, ChatKit es responsive.

**Q: ¿Puedo usar imágenes de Sanity?**
A: Sí, usa URLs del CDN: `https://cdn.sanity.io/...`

---

**¡Listo!** Con esto deberías tener widgets funcionando en menos de 5 minutos. 🚀
