# 🎯 Resumen: Cómo Hacer que Funcionen los Widgets

## El Problema

Pusiste instrucciones en Agent Builder pero el chat sigue mostrando **texto plano** en lugar de **widgets visuales**.

---

## La Solución (3 Pasos)

### 1️⃣ Configurar Output Format en Agent Builder

```
Agent Builder → Tu Workflow → Click en nodo "Agent" → Panel derecho
```

Busca: **"Output Format"**
Selecciona: **"Auto"** (permite texto Y widgets)

Si no ves "Auto" o "Widget" como opción, tu cuenta no tiene ChatKit habilitado.

---

### 2️⃣ Formato Correcto en Instructions

**Copia esto en Agent Builder → Instructions:**

```markdown
Eres el clon virtual de Marc, desarrollador full-stack.

Cuando pregunten sobre experiencia, responde así:

Tengo 5 años de experiencia. Te muestro mi historial:

```widget
{
  "type": "card",
  "size": "lg",
  "children": [
    {
      "type": "text",
      "value": "Senior Full Stack Developer @ TechCorp",
      "weight": "semibold"
    },
    {
      "type": "caption",
      "value": "2023 - Present",
      "size": "sm"
    },
    {
      "type": "divider",
      "spacing": 12
    },
    {
      "type": "row",
      "gap": 8,
      "wrap": "wrap",
      "children": [
        { "type": "badge", "label": "React", "color": "info", "pill": true },
        { "type": "badge", "label": "Node.js", "color": "success", "pill": true },
        { "type": "badge", "label": "AWS", "color": "warning", "pill": true }
      ]
    }
  ]
}
```

¿Quieres saber más?
```

**CRÍTICO:**
- Usa triple backtick + "widget": ` ```widget `
- Cierra con triple backtick: ` ``` `
- JSON válido (usa https://jsonlint.com para verificar)

---

### 3️⃣ Probar

1. Agent Builder → "Test" o "Playground"
2. Escribe: "¿Cuál es tu experiencia?"
3. Deberías ver un **card visual** con badges

Si ves el código JSON literal → Revisa que Output Format esté en "Auto" o "Widget"

---

## Alternativa: Widget Builder Visual

Si no funciona, usa el Widget Builder:

1. Ve a: https://widgets.chatkit.studio
2. Diseña tu widget visualmente
3. Click "Download .widget file"
4. Sube el archivo en Agent Builder

---

## Archivos Creados para Ti

| Archivo | Para Qué |
|---------|----------|
| `COPY-PASTE-AGENT-CONFIG.txt` | Config lista para copiar |
| `FIX-WIDGET-PROBLEMA.md` | Troubleshooting detallado |
| `portfolio.widget` | Archivo .widget pre-configurado |
| `widget-examples-ready-to-use.json` | Ejemplos de widgets |

---

## Si SIGUE sin funcionar

**Posibles causas:**

1. **No tienes ChatKit habilitado**
   - Verifica en https://platform.openai.com/settings
   - Contacta con OpenAI support

2. **Tu workflow no soporta widgets**
   - Crea un nuevo workflow desde cero
   - Asegúrate de que sea tipo "ChatKit Agent"

3. **Frontend no renderiza widgets**
   - Verifica que estés usando `@openai/chatkit-react`
   - Revisa que el `control` de useChatKit esté conectado
   - Mira la consola del navegador por errores

---

## Ejemplo Mínimo que DEBE Funcionar

**Instructions:**
```markdown
When asked about experience, respond EXACTLY like this:

Aquí está mi experiencia:

```widget
{
  "type": "card",
  "children": [
    {
      "type": "text",
      "value": "Senior Developer"
    }
  ]
}
```
```

**Test:** "¿Cuál es tu experiencia?"

**Resultado esperado:** Card con texto "Senior Developer"

---

## Documentación Oficial

- ChatKit Widgets: https://platform.openai.com/docs/guides/chatkit-widgets
- Widget Builder: https://widgets.chatkit.studio
- Agent Builder: https://platform.openai.com/docs/guides/agent-builder

---

## Siguiente Paso

1. ✅ Verifica Output Format = "Auto" o "Widget"
2. ✅ Copia el ejemplo mínimo en Instructions
3. ✅ Prueba en playground
4. ✅ Si funciona → Personaliza con tus datos
5. ✅ Si no funciona → Lee FIX-WIDGET-PROBLEMA.md

---

**Sources:**
- [Agent Builder | OpenAI API](https://platform.openai.com/docs/guides/agent-builder)
- [What is the .widget format? - OpenAI Community](https://community.openai.com/t/what-is-the-widget-format/1361247)
- [Node reference | OpenAI API](https://platform.openai.com/docs/guides/node-reference)
- [ChatKit widgets](https://platform.openai.com/docs/guides/chatkit-widgets)
