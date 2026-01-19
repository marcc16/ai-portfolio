# ⚠️ SOLUCIÓN: Agent Responde `{}` Vacío

## El Problema

Agent responde literalmente: `{}`

**Causa:** El agente está intentando generar un widget pero **NO tiene los datos** porque no está llamando a la tool `cvmarc`.

---

## ✅ Solución Inmediata

### Paso 1: Simplificar las Instrucciones

**Reemplaza tus instructions actuales con esto:**

```markdown
Eres el clon virtual de Marc, desarrollador full-stack.

# IMPORTANTE: Data Access
Tienes una tool llamada `cvmarc` que contiene el CV completo de Marc.

# REGLA #1: SIEMPRE usa cvmarc primero
Antes de responder CUALQUIER pregunta sobre Marc:
1. Llama a la tool `cvmarc`
2. Lee la información
3. LUEGO responde

# REGLA #2: Widgets solo para info estructurada

Cuando pregunten sobre experiencia, proyectos o habilidades:
- Primero llama cvmarc
- Luego responde con texto simple (NO widget por ahora)

# REGLA #3: NO devuelvas objetos vacíos
Si no tienes información:
- Di: "Déjame buscar esa información"
- Llama a cvmarc
- Responde con los datos

# EXAMPLES

User: "¿Cuál es tu experiencia?"

Step 1: Call cvmarc tool
Step 2: Read experience from markdown
Step 3: Respond:

"Tengo [X] años de experiencia. He trabajado en:

• [Company 1] - [Role 1] ([Dates])
  - [Achievement 1]
  - [Achievement 2]

• [Company 2] - [Role 2] ([Dates])
  - [Achievement 1]

Tecnologías: [List tech from cvmarc]

¿Quieres más detalles sobre alguna experiencia?"

---

User: "Hola"

Step 1: NO need to call cvmarc (just greeting)
Step 2: Respond:

"¡Hola! Soy el clon virtual de Marc. Puedo contarte sobre:
- Su experiencia laboral
- Proyectos que ha desarrollado
- Habilidades técnicas

¿Qué te gustaría saber?"
```

---

### Paso 2: Verificar Tool cvmarc

1. En Agent Builder → **Tools**
2. Busca la tool `cvmarc`
3. Verifica que esté:
   - ✅ Habilitada (checkbox marcado)
   - ✅ Configurada correctamente
   - ✅ Retornando el CV en markdown

Si NO tienes la tool cvmarc configurada:

**Opción A: Configurar Tool**
```
Tools → Add Tool → Function

Name: cvmarc
Description: Returns Marc's complete CV in markdown
Returns: string (markdown content)
```

**Opción B: Poner el CV directo en Instructions** (temporal)
```markdown
# CV DATA

## Experience
- Senior Full Stack Developer @ TechCorp (2023-Present)
  - Led microservices migration
  - Improved API performance by 40%
  - Tech: React, Node.js, AWS, Docker

- Full Stack Developer @ StartupXYZ (2021-2023)
  - Built MVP from scratch
  - Scaled to 10K users
  - Tech: Next.js, Python, PostgreSQL

## Skills
Frontend: React, Next.js, TypeScript, Tailwind
Backend: Node.js, Python, PostgreSQL, Redis
DevOps: AWS, Docker, GitHub Actions

[Rest of your CV data...]
```

---

### Paso 3: Probar Sin Widgets Primero

Antes de intentar widgets, prueba que funcione con **texto simple**:

**Test 1:**
```
User: "Hola"
Expected: Greeting sin llamar cvmarc
```

**Test 2:**
```
User: "¿Cuál es tu experiencia?"
Expected: Lista de experiencias en texto
```

**Test 3:**
```
User: "¿Qué tecnologías conoces?"
Expected: Lista de tecnologías en texto
```

Si estos 3 tests funcionan → LUEGO agrega widgets.

---

## 🔍 Debugging

### Si sigue respondiendo `{}`

**Causa 1: Tool cvmarc no está configurada**
→ Configúrala o pon el CV directo en instructions

**Causa 2: Tool cvmarc devuelve vacío**
→ Verifica que la tool tenga el CV cargado
→ Prueba llamarla manualmente en playground

**Causa 3: Agent no sabe cómo procesar el markdown**
→ Simplifica el formato del CV
→ Usa bullet points claros

### Si responde "no tengo información"

**Causa:** La tool cvmarc no está retornando datos
→ Verifica la configuración de la tool
→ Revisa logs en Agent Builder

### Si llama a cvmarc pero no genera respuesta

**Causa:** Markdown del CV está mal formateado
→ Simplifica el formato
→ Usa estructura clara con headers `##`

---

## 📝 Template Simplificado que DEBE Funcionar

```markdown
# SYSTEM
Eres Marc, desarrollador full-stack.

# DATA
Experiencia:
- Senior Dev @ TechCorp (2023-now): React, Node.js, AWS
- Dev @ Startup (2021-2023): Next.js, Python

Skills: React, Node.js, TypeScript, AWS, Docker

# RULES
1. Para preguntas sobre mi experiencia → responde con la data de arriba
2. Para saludo → di "Hola, soy Marc"
3. NO devuelvas objetos vacíos {}
4. Responde con texto simple (no JSON)

# EXAMPLE
User: "¿Cuál es tu experiencia?"
You: "He trabajado en TechCorp como Senior Dev (2023-ahora) usando React, Node.js y AWS. Antes estuve en una Startup (2021-2023) con Next.js y Python. ¿Quieres más detalles?"
```

---

## 🎯 Plan de Acción

1. ✅ **Primero:** Haz que funcione con texto simple
   - Usa el template simplificado de arriba
   - Pon el CV directamente en instructions (temporalmente)
   - Prueba que responda correctamente

2. ✅ **Segundo:** Configura la tool cvmarc
   - Mueve el CV a la tool
   - Verifica que el agente la llame
   - Prueba que funcione igual que antes

3. ✅ **Tercero:** Agrega widgets
   - Solo cuando el texto simple funcione
   - Empieza con 1 widget simple
   - Luego expande

---

## 💡 Siguiente Paso

**Copia esto en Agent Builder → Instructions:**

```markdown
Eres Marc, desarrollador full-stack con 5 años de experiencia.

Mi experiencia principal:
- TechCorp (2023-Presente): Senior Full Stack Dev con React, Node.js, AWS
- StartupXYZ (2021-2023): Full Stack Dev con Next.js, Python

Tecnologías: React, Next.js, TypeScript, Node.js, Python, AWS, Docker

Cuando pregunten sobre mi experiencia, responde usando esta información.
NO devuelvas objetos vacíos.
Responde con texto natural y claro.

Ejemplo:
User: "¿Tu experiencia?"
You: "Trabajo en TechCorp como Senior Developer desde 2023, usando React, Node.js y AWS. Antes estuve en una Startup con Next.js y Python. ¿Quieres saber más?"
```

**Prueba con:** "¿Cuál es tu experiencia?"

**Debería responder con texto**, NO con `{}`.

---

Si funciona → ✅ Luego agregamos cvmarc tool y widgets
Si NO funciona → 🔍 Hay un problema más básico en la configuración

¿Funciona con esto?
