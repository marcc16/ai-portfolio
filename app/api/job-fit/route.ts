import { auth, clerkClient } from "@clerk/nextjs/server";
import { hasRemainingJobAnalyses, incrementJobAnalysisCount } from "@/lib/message-tracking";

// Full CV Content for context
const MY_CV = `
Marc Bau Benavent
AI Strategist & Innovation Specialist | Automatización Inteligente
Email: marcbauteleco@gmail.com | Tel: 601093814
Ubicación: Valencia, España | LinkedIn
Idiomas: Español (Nativo), Inglés (B2)

Perfil Profesional
Especialista en Estrategia de IA e Innovación con experiencia comprobada en sistemas enterprise de alto impacto. Combino expertise técnico (Claude Code, MCP, agentes IA) con visión estratégica para diseñar soluciones que generan ROI medible, optimizan adopción organizacional y aceleran transformación digital.

Capacidades distintivas:
- Estrategia de IA: Análisis de ROI, frameworks de adopción (201-level strategies), roadmaps de implementación, evaluación de casos de uso y priorización por impacto.
- Innovación & Arquitectura: Diseño de sistemas agentic AI, desarrollo de skills personalizados (Claude Code), orquestación multi-agente, integración MCP servers.
- Implementación Enterprise: Automatización inteligente (n8n, RAG, function calling), integraciones complejas (APIs REST/GraphQL), testing automatizado (100+ casos).
- Consultoría & Procesos: Detección de cuellos de botella, propuesta de soluciones escalables, documentación técnica (SOPs, playbooks), gestión de cambio.

Diferenciador: Traducción de conceptos IA complejos (frameworks Google/IBM/Deloitte) a soluciones accionables con métricas de negocio claras (tiempo ahorrado, break-even, adopción sostenida).

Experiencia Profesional

AI Developer | Future Applied Intelligence SL (Enero 2025 – Actualidad)
Estrategia e Innovación:
- Diseño de arquitecturas agentic AI con foco en ROI medible y adopción organizacional.
- Implementación de frameworks de testing automatizado (105 casos) para validación continua de sistemas IA.
- Consultoría en evaluación de casos de uso: priorización por impacto vs esfuerzo, análisis de break-even.

Proyecto 1: Sistema genBI - Business Intelligence con IA
- Desarrollo de sistema de BI con agentes IA conversacionales que permite consultas en lenguaje natural sobre bases de datos PostgreSQL/Supabase usando Model Context Protocol (MCP).
- Creación de framework de testing automatizado con 105 casos de prueba, logrando optimización del sistema mediante reducción de prompts de 8K tokens y documentación exhaustiva de herramientas.
- Integración con Google Sheets para gestión de datos, seguimiento de resultados y métricas de precisión que comparan llamadas esperadas vs reales.
- ROI: 70% reducción en tiempo de análisis de datos, 8K tokens optimizados (ahorro costes), 95%+ precisión en queries.

Proyecto 2: Sistema LeadsAI - Cualificación Automática de Leads B2B
- Automatización completa de recepción, validación, clasificación y enriquecimiento de leads desde múltiples canales (Gmail, formularios web, chat) con procesamiento casi en tiempo real (triggers cada minuto).
- Implementación de cualificación en dos capas: filtros programáticos (validación email, anti-spam, control de duplicados) + clasificación inteligente con Claude Sonnet para detectar spam/phishing vs leads comerciales legítimos.
- Enriquecimiento empresarial automático con OpenAI GPT-4o y Hunter.io extrayendo 70+ puntos de datos (CIF, sector, empleados, stack tecnológico, decisores, competidores) e integración con Odoo CRM.
- ROI: 90% reducción en tiempo de cualificación, 70+ data points enriquecidos automáticamente, 0% leads duplicados.

Proyecto 3: Sistema Alphabet BMW - Procesamiento de Terminaciones de Renting
- Sistema automatizado de clasificación de terminaciones de contratos en 8 tipos con aplicación de jerarquía estricta de prioridades y reglas de negocio complejas específicas por cliente (10+ clientes con tratamientos especiales).
- Procesamiento de comentarios extensos del CRM mediante Anthropic Text Processing (ATP) con custom configurations, búsqueda y procesamiento de 3 tipos de documentos PDF mediante OCR/DAS.
- Arquitectura en subworkflows divididos para procesamiento por lotes optimizado (10 items/lote), gestión de access tokens con caducidad, y sistema Human in the Loop (HITL) para casos complejos que requieren revisión manual.
- ROI: 85% reducción en tiempo de procesamiento, 100% cumplimiento de jerarquía de prioridades, sistema escalable a 50+ clientes.

AI Integration Specialist | AIAutomatiza (Junio 2024 – Noviembre 2024)
Estrategia e Innovación:
- Diseño de arquitectura conversacional multi-criterio con algoritmo de matching inteligente.
- Implementación de sistema RAG (Retrieval-Augmented Generation) con base de conocimiento dinámica.
- Consultoría en optimización de procesos: análisis de cuellos de botella, propuesta de soluciones escalables.

Proyecto destacado: Asistente Virtual IA - Clínica Fernández Blanco (Madrid/Marbella)
- Desarrollo e implementación de sistema completo de asistente conversacional por WhatsApp integrando Claude AI con Zoho CRM, logrando 90%+ de reducción en tiempo de respuesta y gestión 24/7.
- Arquitectura de sistema de asignación inteligente multi-criterio con algoritmo de matching tratamiento-profesional-ubicación-género para 20+ tratamientos y 7+ profesionales con reglas de competencia específicas.
- Motor de disponibilidad con restricciones complejas: cálculo ISO de semanas alternas, horarios únicos por profesional en 2 clínicas, margen de seguridad anti-solapamiento, verificación en tiempo real de múltiples calendarios.
- Gestión automática del ciclo de vida del lead: pipeline WhatsApp → Lead (Zoho) → Contact → Deal → Event con creación silenciosa, conversión automática, eliminación de duplicados y vinculación evento-profesional para Google Calendar.
- Implementación de RAG (Retrieval-Augmented Generation) con base de conocimiento dinámica, function calling con 10+ tools especializadas, y memory management para conversaciones multi-turn.
- Resultados: 85%+ consultas resueltas sin intervención humana, 0% errores en asignación, sistema escalable para 10+ profesionales, ROI recuperado en 3 meses.

Intelligent Automation Specialist | NTT DATA (Abril 2024 – Diciembre 2024)
- Automatización de procesos corporativos (gestión de citas con IA) a nivel enterprise.
- Desarrollo de integraciones mediante APIs REST y plataforma low-code (OutSystems).
- Optimización de reporting y colaboración en proyectos internacionales de transformación digital.
- Consultoría en casos de uso: Evaluación de oportunidades de automatización, análisis de ROI, propuesta de soluciones priorizadas por impacto.

Técnico de Soporte IT | F1-Connecting (Carrefour) (Noviembre 2022 – Abril 2023)
- Resolución de incidencias en cajas de libre servicio (Linux).
- Soporte remoto y monitorización de sistemas críticos.

Proyectos Personales de Innovación

AI Strategy & Adoption Framework (Noviembre 2024 – Actualidad)
- Desarrollo de framework completo de estrategia de IA basado en metodologías Google, IBM y Deloitte.
- Creación de playbooks de adopción organizacional con focus en 201-level strategies (Context Assembly, Quality Judgment, Task Decomposition, Iterative Refinement, Workflow Integration, Frontier Recognition).
- Cálculo de ROI metodología Windowrow: 4 variantes (conservative, full-year, optimistic, break-even) con Excel automatizado para presentación ejecutiva.
- Sistema de evaluación de casos de uso: Matriz impacto vs esfuerzo, priorización por Quick Wins, análisis de compliance (RGPD, EU AI Act).

Custom AI Workspace (Claude Code + Skills + MCP) (Diciembre 2024 – Actualidad)
- Construcción de infraestructura personal de IA con Claude Code como orquestador principal.
- Desarrollo de skills personalizados con progressive disclosure: Brand System, ROI Calculator, Presentation Builder, SOP Creator, MCP Client.
- Implementación de MCP servers para integración con HubSpot, Google Drive, Slack, n8n (progressive loading, no context bloat).
- Sistema de routing inteligente: Query pattern → Agent → Skill con 95%+ precisión.
- Memory system: Sessions, learnings, decisions (continuous learning loop).
- Arquitectura: Agents hierarchy (Strategist, Implementation Architect, Adoption Coach, Learning Synthesizer) con roles claros y tool restrictions.

Agente IA para Automatización de Meta Ads (Enero 2024 – Actualidad)
- Workflow en n8n con análisis de KPIs de campañas de Meta Ads en tiempo real.
- Conexión con CRM y Airtable para reporting automatizado y consultas conversacionales vía Telegram (chat/voz).
- Análisis estratégico: Recomendaciones automáticas de optimización basadas en performance histórico.

Plataforma SaaS de Música Generativa con IA (Junio 2024 – Actualidad)
- Desarrollo de plataforma SaaS con modelos IA open source, despliegue de modelos ML, dashboards de interacción y personalización de UX.
- Stack: Backend en Python + FastAPI, frontend con Next.js + TypeScript.
- Innovación: Integración de modelos generativos con control fino de parámetros para personalización musical.

Competencias Técnicas

Arquitectura & Desarrollo de IA
- Agentic AI: Claude Code, custom agents (routing, orchestration, subagents), agent hierarchy design, tool restrictions, context isolation.
- Skills Development: Progressive disclosure, YAML frontmatter, SKILL.md structure, scripts (Python/TypeScript), references, assets.
- Model Context Protocol (MCP): MCP servers development, SSE/HTTP/stdio transports, progressive loading, tool documentation, gotchas management.
- Automatización Inteligente: n8n, Make, Zapier, Flowise, workflow orchestration, subworkflows, batch processing, HITL (Human in the Loop).
- LLMs & Prompting: Claude AI (Sonnet, Opus), OpenAI GPT-4o, RAG (Retrieval-Augmented Generation), function calling, prompt engineering avanzado, memory management (multi-turn conversations).

Desarrollo de Software
- Programación: Python, JavaScript, TypeScript, Node.js, FastAPI, Next.js, CLI tools development.
- Protocolos: REST/GraphQL, Webhooks, Anthropic Text Processing (ATP), custom configurations.
- Bases de Datos: MySQL, PostgreSQL, Supabase, SQL avanzado, query optimization, Google Sheets automation.

Integración & APIs
- CRM/ERP APIs: Zoho CRM API, Odoo API, HubSpot API, Chatwoot, WhatsApp Business API.
- OCR/DAS: Procesamiento de PDFs, extracción de datos estructurados, custom configurations.
- Testing & QA: Framework de testing automatizado (100+ casos), validation scripts, evals, metrics tracking.
- Documentación: SOPs (Standard Operating Procedures), playbooks, runbooks, technical specs, architecture diagrams.

Estrategia & Consultoría de IA
- Frameworks de Adopción: Google AI, IBM AI Maturity, Deloitte AI Implementation, 201-level adoption strategies (Centaur vs Cyborg, Microsoft study).
- Análisis de ROI: Metodología Windowrow (4 variantes), cálculo de break-even, métricas de impacto (tiempo ahorrado, reducción costes, productividad).
- Evaluación de Casos de Uso: Matriz impacto vs esfuerzo, priorización por Quick Wins, análisis de compliance (RGPD, EU AI Act).
- Gestión de Cambio: Champion Model, communication strategies, sustained adoption, capability building.

Consultoría & Procesos
- Identificación de cuellos de botella y propuesta de soluciones escalables.
- Documentación técnica completa (SOPs, playbooks, runbooks, architecture specs).
- Comunicación efectiva con clientes y equipos multidisciplinares (business + tech).
- Gestión de cambio organizacional y estrategias de adopción sostenida.

Estrategia & Innovación
- Diseño de roadmaps de adopción de IA con foco en Quick Wins y ROI medible.
- Evaluación y priorización de casos de uso (matriz impacto vs esfuerzo).
- Traducción de frameworks complejos (Google/IBM/Deloitte) a soluciones accionables.
- Análisis de compliance (RGPD, EU AI Act) e integración en arquitecturas de IA.

Arquitectura & Desarrollo
- Diseño de sistemas agentic AI con agents hierarchy y routing inteligente.
- Desarrollo de skills personalizados con progressive disclosure (Claude Code).
- Implementación de MCP servers para integración enterprise (HubSpot, Slack, n8n).
- Testing automatizado y optimización de sistemas de IA (framework con 100+ casos).

Valor Diferencial
Puente entre estrategia y ejecución: Capacidad única para diseñar arquitecturas de IA complejas (agents, skills, MCP) mientras mantengo foco en ROI medible, adopción organizacional y cumplimiento normativo. No solo automatizo, transformo procesos con visión estratégica de negocio.

Educación & Certificaciones
- Grado en Ingeniería Telemática – Universitat de València (2023)
- AI Agents Fundamentals – Hugging Face (2025)
- LLM Fundamentals – Hugging Face (2025)
- AI Fluency – Anthropic (2025)

Disponibilidad: Inmediata para proyectos de consultoría estratégica en IA, desarrollo de agentes enterprise, y arquitecturas agentic AI.
`;

export const maxDuration = 30;

/**
 * Get user's subscription plan from Clerk
 */
async function getUserPlan(userId: string): Promise<"free" | "recruiter"> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check if user has active subscription to "recruiter" plan
    // @ts-ignore
    const subscriptions = user.organizationMemberships || [];
    const hasRecruiterPlan = subscriptions.some(
      (membership: any) => membership.organization?.publicMetadata?.plan === "recruiter"
    );

    if (hasRecruiterPlan) return "recruiter";

    // Also check public metadata for manual assignments
    const plan = user.publicMetadata?.subscriptionPlan as string | undefined;
    if (plan === "recruiter") return "recruiter";

    // Check private metadata (set by Clerk Billing webhooks)
    const privateMetadataPlan = user.privateMetadata?.subscriptionPlan as string | undefined;
    if (privateMetadataPlan === "recruiter") return "recruiter";

    return "free";
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "free";
  }
}

/**
 * Get analysis limit based on user status and plan
 * - Anonymous: 1 analysis per day
 * - Logged in (free): 3 analyses per day
 * - Paid (recruiter): 5 analyses per day
 */
function getAnalysisLimit(isGuest: boolean, plan: "free" | "recruiter"): number {
  if (isGuest) return 1;
  if (plan === "recruiter") return 5;
  return 3; // free authenticated users
}

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json();
    const { userId } = await auth();
    const isGuest = !userId;

    // Get user's plan if authenticated
    const plan = userId ? await getUserPlan(userId) : "free";
    const analysisLimit = getAnalysisLimit(isGuest, plan);

    // Get identifier for tracking
    let identifier: string;
    if (userId) {
      identifier = userId;
    } else {
      // For guests, use IP address
      const forwarded = req.headers.get("x-forwarded-for");
      const isDev = process.env.NODE_ENV === "development";
      identifier = forwarded ?? (isDev ? "86.106.2.121" : "127.0.0.1");
    }

    // Check daily analysis limit
    const { allowed, remaining, limit } = await hasRemainingJobAnalyses(
      identifier,
      isGuest,
      analysisLimit
    );

    if (!allowed) {
      const errorMessage = isGuest
        ? `Has alcanzado el límite de ${limit} análisis diario. Inicia sesión para obtener ${getAnalysisLimit(false, "free")} análisis al día.`
        : plan === "recruiter"
          ? `Has alcanzado el límite de ${limit} análisis diarios. Vuelve mañana para continuar.`
          : `Has alcanzado el límite de ${limit} análisis diarios. Actualiza a Recruiter para obtener ${getAnalysisLimit(false, "recruiter")} análisis al día.`;

      return new Response(
        JSON.stringify({
          error: errorMessage,
          rateLimitExceeded: true,
          remaining: 0,
          limit
        }),
        { status: 429 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Eres un experto reclutador de IA. Respondes SOLO en formato JSON válido y SIEMPRE en español.
            
            La estructura del objeto JSON debe ser EXACTAMENTE:
            {
              "matchScore": número (0-100),
              "summary": string (breve, honesto pero persuasivo, 2-3 frases en español),
              "strengths": string[] (3-4 habilidades clave que coinciden, en español),
              "gaps": string[] (2-3 áreas de mejora pero formuladas constructivamente, en español),
              "verdict": "Alta Compatibilidad" | "Compatibilidad Potencial" | "Baja Compatibilidad"
            }
            
            IMPORTANTE: Toda la respuesta debe estar en español, incluyendo summary, strengths, gaps y verdict.`
          },
          {
            role: "user",
            content: `
            ANALIZA LA COMPATIBILIDAD DEL CANDIDATO basándote en el CV proporcionado y la Descripción del Puesto.
            
            CV DEL CANDIDATO:
            ${MY_CV}
    
            DESCRIPCIÓN DEL PUESTO:
            ${jobDescription}
    
            INSTRUCCIONES:
            1. Analiza la compatibilidad basándote en habilidades y experiencia.
            2. SÉ HONESTO pero BENEFICIOSO: Destaca habilidades transferibles. Si conoce Python/FastAPI pero el puesto pide Django, trátalo como una fortaleza/brecha menor.
            3. LA SALIDA DEBE SER UN ÚNICO OBJETO JSON VÁLIDO.
            4. TODO EL CONTENIDO DEBE ESTAR EN ESPAÑOL (summary, strengths, gaps, verdict).
            `
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Use JSON.parse with confidence as we strictly requested json_object
    const object = JSON.parse(content);

    // Increment analysis count after successful analysis
    await incrementJobAnalysisCount(identifier, isGuest, analysisLimit);

    // Get updated usage for response
    const updatedUsage = await hasRemainingJobAnalyses(identifier, isGuest, analysisLimit);

    return Response.json({
      ...object,
      usage: {
        remaining: updatedUsage.remaining,
        limit: updatedUsage.limit,
      }
    });
  } catch (error) {
    console.error('Job Fit API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze job fit' }), { status: 500 });
  }
}
