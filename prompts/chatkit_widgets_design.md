# ChatKit Widgets - Premium UI Design

Diseños de widgets para mejorar la presentación de información en el chat.

## 🎨 Paleta de Colores (Coherente con Portfolio)

```typescript
const colors = {
  primary: "#0f172a",      // slate-900
  secondary: "#f1f5f9",    // slate-100
  accent: "#3b82f6",       // blue-500
  success: "#10b981",      // green-500
  warning: "#f59e0b",      // amber-500
  muted: "#64748b",        // slate-500
};
```

---

## 1. Widget: Experiencia Laboral

### Cuándo usar:
- Usuario pregunta "¿Cuál es tu experiencia?"
- Usuario pregunta "Háblame de tu trabajo en [empresa]"
- Usuario pregunta "¿Dónde has trabajado?"

### Diseño Premium:

```json
{
  "type": "card",
  "size": "lg",
  "children": [
    {
      "type": "row",
      "gap": 16,
      "align": "start",
      "children": [
        {
          "type": "image",
          "src": "https://example.com/logo.png",
          "alt": "Company Logo",
          "width": "56px",
          "height": "56px",
          "radius": "md",
          "fit": "contain"
        },
        {
          "type": "col",
          "gap": 8,
          "flex": 1,
          "children": [
            {
              "type": "row",
              "justify": "between",
              "align": "start",
              "children": [
                {
                  "type": "col",
                  "gap": 4,
                  "children": [
                    {
                      "type": "title",
                      "value": "Senior Full Stack Developer",
                      "size": "md",
                      "weight": "semibold"
                    },
                    {
                      "type": "text",
                      "value": "TechCorp Inc.",
                      "size": "md",
                      "color": { "light": "#64748b", "dark": "#94a3b8" }
                    }
                  ]
                },
                {
                  "type": "badge",
                  "label": "Current",
                  "color": "success",
                  "variant": "soft",
                  "pill": true
                }
              ]
            },
            {
              "type": "row",
              "gap": 12,
              "children": [
                {
                  "type": "caption",
                  "value": "📅 Jan 2023 - Present",
                  "size": "sm",
                  "color": { "light": "#64748b", "dark": "#94a3b8" }
                },
                {
                  "type": "caption",
                  "value": "📍 Remote",
                  "size": "sm",
                  "color": { "light": "#64748b", "dark": "#94a3b8" }
                }
              ]
            },
            {
              "type": "divider",
              "spacing": 12
            },
            {
              "type": "markdown",
              "value": "- Led development of microservices architecture\n- Improved API response time by 40%\n- Mentored 5 junior developers"
            },
            {
              "type": "row",
              "gap": 8,
              "wrap": "wrap",
              "children": [
                { "type": "badge", "label": "React", "color": "info", "variant": "outline", "size": "sm" },
                { "type": "badge", "label": "Node.js", "color": "success", "variant": "outline", "size": "sm" },
                { "type": "badge", "label": "AWS", "color": "warning", "variant": "outline", "size": "sm" },
                { "type": "badge", "label": "Docker", "color": "info", "variant": "outline", "size": "sm" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 2. Widget: Tech Stack (Grid de Skills)

### Cuándo usar:
- Usuario pregunta "¿Qué tecnologías dominas?"
- Usuario pregunta "¿Qué lenguajes conoces?"
- Usuario pregunta "Cuéntame sobre tu stack tecnológico"

### Diseño Premium:

```json
{
  "type": "card",
  "size": "lg",
  "children": [
    {
      "type": "title",
      "value": "💻 Tech Stack",
      "size": "lg",
      "weight": "semibold",
      "margin": { "bottom": 16 }
    },
    {
      "type": "col",
      "gap": 16,
      "children": [
        {
          "type": "col",
          "gap": 8,
          "children": [
            {
              "type": "text",
              "value": "Frontend",
              "size": "sm",
              "weight": "semibold",
              "color": { "light": "#64748b", "dark": "#94a3b8" }
            },
            {
              "type": "row",
              "gap": 8,
              "wrap": "wrap",
              "children": [
                { "type": "badge", "label": "React", "color": "info", "variant": "solid", "pill": true },
                { "type": "badge", "label": "Next.js", "color": "secondary", "variant": "solid", "pill": true },
                { "type": "badge", "label": "TypeScript", "color": "info", "variant": "solid", "pill": true },
                { "type": "badge", "label": "Tailwind", "color": "info", "variant": "solid", "pill": true }
              ]
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "col",
          "gap": 8,
          "children": [
            {
              "type": "text",
              "value": "Backend",
              "size": "sm",
              "weight": "semibold",
              "color": { "light": "#64748b", "dark": "#94a3b8" }
            },
            {
              "type": "row",
              "gap": 8,
              "wrap": "wrap",
              "children": [
                { "type": "badge", "label": "Node.js", "color": "success", "variant": "solid", "pill": true },
                { "type": "badge", "label": "Python", "color": "info", "variant": "solid", "pill": true },
                { "type": "badge", "label": "PostgreSQL", "color": "info", "variant": "solid", "pill": true },
                { "type": "badge", "label": "Redis", "color": "danger", "variant": "solid", "pill": true }
              ]
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "col",
          "gap": 8,
          "children": [
            {
              "type": "text",
              "value": "DevOps & Cloud",
              "size": "sm",
              "weight": "semibold",
              "color": { "light": "#64748b", "dark": "#94a3b8" }
            },
            {
              "type": "row",
              "gap": 8,
              "wrap": "wrap",
              "children": [
                { "type": "badge", "label": "AWS", "color": "warning", "variant": "solid", "pill": true },
                { "type": "badge", "label": "Docker", "color": "info", "variant": "solid", "pill": true },
                { "type": "badge", "label": "GitHub Actions", "color": "secondary", "variant": "solid", "pill": true }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 3. Widget: Proyecto Destacado

### Cuándo usar:
- Usuario pregunta "Muéstrame tus proyectos"
- Usuario pregunta "¿Qué has construido?"
- Usuario pregunta sobre un proyecto específico

### Diseño Premium:

```json
{
  "type": "card",
  "size": "lg",
  "children": [
    {
      "type": "image",
      "src": "https://example.com/project-cover.jpg",
      "alt": "Project Screenshot",
      "width": "100%",
      "aspectRatio": "16/9",
      "radius": "md",
      "fit": "cover",
      "margin": { "bottom": 16 }
    },
    {
      "type": "col",
      "gap": 12,
      "children": [
        {
          "type": "row",
          "justify": "between",
          "align": "start",
          "children": [
            {
              "type": "title",
              "value": "AI Portfolio Builder",
              "size": "lg",
              "weight": "semibold"
            },
            {
              "type": "badge",
              "label": "Featured",
              "color": "warning",
              "variant": "soft",
              "pill": true
            }
          ]
        },
        {
          "type": "caption",
          "value": "🚀 Web Application",
          "size": "sm",
          "color": { "light": "#64748b", "dark": "#94a3b8" }
        },
        {
          "type": "text",
          "value": "A full-stack platform that helps developers create stunning portfolios using AI. Features real-time collaboration, custom theming, and SEO optimization.",
          "size": "md"
        },
        {
          "type": "divider",
          "spacing": 12
        },
        {
          "type": "col",
          "gap": 8,
          "children": [
            {
              "type": "text",
              "value": "🎯 Key Features:",
              "size": "sm",
              "weight": "semibold"
            },
            {
              "type": "markdown",
              "value": "• AI-powered content generation\n• Real-time preview & editing\n• Custom domain support\n• Analytics dashboard"
            }
          ]
        },
        {
          "type": "row",
          "gap": 8,
          "wrap": "wrap",
          "margin": { "top": 12 },
          "children": [
            { "type": "badge", "label": "Next.js", "variant": "outline", "size": "sm" },
            { "type": "badge", "label": "OpenAI", "variant": "outline", "size": "sm" },
            { "type": "badge", "label": "Sanity CMS", "variant": "outline", "size": "sm" },
            { "type": "badge", "label": "Vercel", "variant": "outline", "size": "sm" }
          ]
        },
        {
          "type": "row",
          "gap": 12,
          "margin": { "top": 16 },
          "children": [
            {
              "type": "button",
              "label": "View Live",
              "style": "primary",
              "iconStart": "external-link",
              "onClickAction": {
                "type": "open_url",
                "url": "https://project-demo.com"
              }
            },
            {
              "type": "button",
              "label": "GitHub",
              "style": "secondary",
              "iconStart": "github",
              "onClickAction": {
                "type": "open_url",
                "url": "https://github.com/user/repo"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 4. Widget: Lista de Experiencias (ListView)

### Cuándo usar:
- Usuario pregunta "Muéstrame todas tus experiencias"
- Usuario quiere ver un resumen rápido

### Diseño Premium:

```json
{
  "type": "list_view",
  "limit": 5,
  "status": {
    "text": "3 years of experience",
    "icon": "briefcase"
  },
  "children": [
    {
      "type": "list_view_item",
      "gap": 16,
      "onClickAction": {
        "type": "show_detail",
        "experienceId": "exp_001"
      },
      "children": [
        {
          "type": "image",
          "src": "https://example.com/logo1.png",
          "alt": "Logo",
          "width": "40px",
          "height": "40px",
          "radius": "sm"
        },
        {
          "type": "col",
          "gap": 4,
          "flex": 1,
          "children": [
            {
              "type": "text",
              "value": "Senior Full Stack Developer",
              "weight": "semibold"
            },
            {
              "type": "caption",
              "value": "TechCorp Inc. • 2023 - Present",
              "size": "sm"
            }
          ]
        },
        {
          "type": "badge",
          "label": "Current",
          "color": "success",
          "variant": "soft",
          "size": "sm"
        }
      ]
    },
    {
      "type": "list_view_item",
      "gap": 16,
      "children": [
        {
          "type": "image",
          "src": "https://example.com/logo2.png",
          "alt": "Logo",
          "width": "40px",
          "height": "40px",
          "radius": "sm"
        },
        {
          "type": "col",
          "gap": 4,
          "flex": 1,
          "children": [
            {
              "type": "text",
              "value": "Full Stack Developer",
              "weight": "semibold"
            },
            {
              "type": "caption",
              "value": "StartupXYZ • 2021 - 2023",
              "size": "sm"
            }
          ]
        },
        {
          "type": "icon",
          "name": "chevron-right",
          "color": { "light": "#cbd5e1", "dark": "#475569" },
          "size": "sm"
        }
      ]
    }
  ]
}
```

---

## 5. Widget: Skill Proficiency

### Cuándo usar:
- Usuario pregunta sobre nivel de dominio de una tecnología
- Usuario quiere ver skills con porcentajes

### Diseño Premium:

```json
{
  "type": "card",
  "size": "md",
  "children": [
    {
      "type": "col",
      "gap": 16,
      "children": [
        {
          "type": "row",
          "justify": "between",
          "align": "center",
          "children": [
            {
              "type": "col",
              "gap": 4,
              "children": [
                {
                  "type": "text",
                  "value": "React.js",
                  "weight": "semibold",
                  "size": "md"
                },
                {
                  "type": "caption",
                  "value": "5 years experience",
                  "size": "sm",
                  "color": { "light": "#64748b", "dark": "#94a3b8" }
                }
              ]
            },
            {
              "type": "badge",
              "label": "Expert",
              "color": "success",
              "variant": "solid",
              "pill": true
            }
          ]
        },
        {
          "type": "box",
          "width": "100%",
          "height": "8px",
          "radius": "full",
          "background": { "light": "#e2e8f0", "dark": "#334155" },
          "children": [
            {
              "type": "box",
              "width": "95%",
              "height": "100%",
              "radius": "full",
              "background": "#10b981"
            }
          ]
        },
        {
          "type": "markdown",
          "value": "**Used in:**\n• 8+ production projects\n• Component libraries\n• Performance optimization"
        }
      ]
    }
  ]
}
```

---

## 6. Widget: Certificación

### Cuándo usar:
- Usuario pregunta sobre certificaciones
- Usuario quiere validar credenciales

### Diseño Premium:

```json
{
  "type": "card",
  "size": "md",
  "background": {
    "light": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "dark": "linear-gradient(135deg, #434343 0%, #000000 100%)"
  },
  "children": [
    {
      "type": "col",
      "gap": 12,
      "children": [
        {
          "type": "row",
          "justify": "between",
          "align": "start",
          "children": [
            {
              "type": "icon",
              "name": "award",
              "size": "lg",
              "color": "#ffffff"
            },
            {
              "type": "badge",
              "label": "Verified",
              "color": "success",
              "variant": "solid"
            }
          ]
        },
        {
          "type": "title",
          "value": "AWS Solutions Architect",
          "size": "md",
          "weight": "bold",
          "color": "#ffffff"
        },
        {
          "type": "caption",
          "value": "Amazon Web Services",
          "size": "sm",
          "color": "#e2e8f0"
        },
        {
          "type": "row",
          "gap": 12,
          "margin": { "top": 8 },
          "children": [
            {
              "type": "caption",
              "value": "📅 Issued: Jan 2024",
              "size": "sm",
              "color": "#e2e8f0"
            },
            {
              "type": "caption",
              "value": "🔗 ID: AWS-12345",
              "size": "sm",
              "color": "#e2e8f0"
            }
          ]
        },
        {
          "type": "button",
          "label": "Verify Credential",
          "variant": "outline",
          "block": true,
          "margin": { "top": 12 },
          "onClickAction": {
            "type": "open_url",
            "url": "https://aws.amazon.com/verify"
          }
        }
      ]
    }
  ]
}
```

---

## 🎯 Reglas de Uso

### Cuándo NO usar widgets:
- Respuestas simples de texto
- Conversación casual
- Aclaraciones o preguntas
- Información que cabe en 1-2 líneas

### Cuándo SÍ usar widgets:
- Listar 2+ experiencias laborales
- Mostrar tech stack completo (5+ tecnologías)
- Presentar proyectos con imágenes
- Mostrar certificaciones con badges
- Cualquier información estructurada que beneficie de formato visual

### Mejores prácticas:
1. **Máximo 1-2 widgets por respuesta** - No abrumar al usuario
2. **Siempre agregar contexto textual** antes del widget
3. **Usar colores coherentes** con la paleta del portfolio
4. **Incluir imágenes optimizadas** (WebP, <200KB)
5. **Badges descriptivos** pero concisos
6. **CTAs claros** en botones

---

## 📝 Prompt Instructions para OpenAI Agent

Agregar al workflow de ChatKit:

```
WIDGET USAGE GUIDELINES:

When the user asks about experience, projects, or skills, use structured widgets for better presentation:

1. EXPERIENCE QUESTIONS:
   - "¿Cuál es tu experiencia?" → Use Card widget with company logo, role, dates, tech badges
   - "¿Dónde has trabajado?" → Use ListView widget with all experiences

2. TECH STACK QUESTIONS:
   - "¿Qué tecnologías conoces?" → Use Card widget grouped by category (Frontend/Backend/DevOps)
   - Show badges with pill style, grouped by category

3. PROJECT QUESTIONS:
   - "Muéstrame tus proyectos" → Use Card widget with cover image, description, tech badges, and CTA buttons
   - Include "View Live" and "GitHub" buttons if URLs available

4. SKILLS QUESTIONS:
   - "¿Cuánto sabes de [tech]?" → Use Card widget with proficiency bar and experience years

FORMAT RULES:
- Always intro the widget with 1-2 lines of text context
- Use emojis sparingly (only for icons like 📅 📍 🚀)
- Keep badge labels short (1-2 words max)
- Use "Current" badge for ongoing positions
- Group related info visually

COLORS:
- Primary actions: #3b82f6 (blue)
- Success/Active: #10b981 (green)
- Warning: #f59e0b (amber)
- Muted text: #64748b (slate-500)

Don't use widgets for simple Q&A - only for structured data presentation.
```

---

## 🚀 Implementación

Ver `chatkit_widgets_implementation.md` para instrucciones de implementación en Agent Builder.
