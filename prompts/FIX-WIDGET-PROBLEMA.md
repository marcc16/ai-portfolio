# 🔧 Solución: Widgets No Aparecen (Solo Texto Plano)

## ❌ Problema

Configuraste widgets pero sigues viendo **texto plano markdown** en lugar de **widgets visuales**.

---

## ✅ Solución Rápida (5 Minutos)

### Paso 1: Verificar Output Format

1. Abre tu workflow en Agent Builder
2. Click en el nodo **"Agent"** (el círculo del agente)
3. En el panel derecho, busca **"Output Format"**
4. Cámbialo a **"Auto"** o **"Widget"**

**IMPORTANTE:** Si ves solo "Text", "JSON", "Markdown" - NO va a funcionar.

---

### Paso 2: Formato Correcto en Instructions

El problema más común es el formato de cómo escribes el widget.

#### ❌ INCORRECTO (no funciona):

```markdown
Responde con este JSON:
{
  "type": "card",
  "children": [...]
}
```

#### ✅ CORRECTO (funciona):

```markdown
Responde así:

```widget
{
  "type": "card",
  "children": [...]
}
``` (cierra con triple backtick)

Nota: Asegúrate de que "widget" esté después de los tres backticks iniciales.
```

---

### Paso 3: Ejemplo Mínimo que Funciona

Copia esto EXACTAMENTE en tus instructions:

```markdown
# WIDGET EXAMPLE

When user asks "¿Cuál es tu experiencia?", respond with:

He trabajado como desarrollador full-stack por 5 años. Aquí está mi experiencia:

```widget
{
  "type": "card",
  "size": "md",
  "children": [
    {
      "type": "text",
      "value": "Senior Full Stack Developer",
      "weight": "semibold"
    },
    {
      "type": "text",
      "value": "TechCorp Inc. - 2023 hasta ahora"
    }
  ]
}
```

¿Quieres saber más?
```

---

### Paso 4: Probar en Playground

1. En Agent Builder, ve a **"Test"** o **"Playground"**
2. Escribe: "¿Cuál es tu experiencia?"
3. La respuesta debe mostrar un **card visual**, NO texto plano

Si sigue mostrando texto plano:

```
He trabajado como...
```widget
{
  "type": "card",
  ...
}
```
```

**Problema:** El agente está imprimiendo el código literalmente.

**Solución:** El workflow no está configurado para renderizar widgets.

---

## 🔍 Diagnóstico Avanzado

### Problema 1: "Widget" no aparece en Output Format

**Causa:** Tu plan de OpenAI no tiene acceso a Agent Builder con widgets.

**Solución:**
- Verifica que tengas acceso a ChatKit
- Widgets requieren ChatKit habilitado en tu cuenta

### Problema 2: Widget aparece como código JSON

```json
{
  "type": "card",
  "children": [...]
}
```

**Causa:** Output format no está en "Widget" o "Auto".

**Solución:**
1. Agent node → Output Format → "Auto" o "Widget"
2. Guarda el workflow

### Problema 3: Error "Invalid widget structure"

**Causa:** JSON del widget tiene errores de sintaxis.

**Solución:**
1. Valida el JSON en https://jsonlint.com
2. Verifica que uses comillas dobles `"` no simples `'`
3. Verifica que todos los corchetes estén cerrados `{}`

---

## 📝 Template Completo que Funciona

Copia esto en Agent Builder → Instructions:

```markdown
Eres el clon virtual de Marc, un desarrollador full-stack.

# RESPONSE RULES

Para preguntas sobre experiencia o habilidades, SIEMPRE usa este formato:

[Texto intro de 1-2 líneas]

```widget
{
  "type": "card",
  "size": "lg",
  "children": [
    {
      "type": "title",
      "value": "[Tu título aquí]",
      "size": "md",
      "weight": "semibold"
    },
    {
      "type": "text",
      "value": "[Tu texto aquí]"
    }
  ]
}
```

[Pregunta de seguimiento]

# EXAMPLES

User: "¿Cuál es tu experiencia?"