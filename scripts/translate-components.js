const fs = require('fs');
const path = require('path');

// Diccionario completo de traducciones
const translations = {
    // Secciones
    "About Me": "Sobre Mí",
    "Get to know me better": "Descubre mi perfil",
    "Work Experience": "Experiencia Laboral",
    "My professional journey": "Mi experiencia profesional",
    "Tech Stack": "Stack Tecnológico",
    "The core technologies and frameworks powering my AI solutions.": "Las tecnologías y frameworks que impulsan mis soluciones de IA.",
    "Featured Projects": "Proyectos Destacados",
    "Some of my best work": "Proyectos que generan impacto real",
    "Education": "Educación",
    "My academic background": "Mi formación académica",
    "Certifications": "Certificaciones",
    "Professional credentials and certifications": "Credenciales y certificaciones profesionales",
    "Get In Touch": "Contacto",
    "Ready to transform your workflow? Let's build something extraordinary together.": "¿Listo para automatizar y escalar? Hablemos de cómo puedo ayudarte.",

    // FitAssessmentSection
    "AI Recruiter Tool": "Herramienta IA para Reclutadores",
    "Do I fit the role?": "¿Encajo en el puesto?",
    "Paste a job description below and let my AI Twin honestly analyze if I'm a good match for your team.": "Pega una descripción del trabajo y deja que mi clon IA analice honestamente si soy una buena opción para tu equipo.",
    "Paste job description here (e.g. 'Senior Frontend Engineer at TechCorp...')": "Pega la descripción del trabajo aquí (ej. 'Ingeniero Frontend Senior en TechCorp...')",
    "Analyze Fit": "Analizar Compatibilidad",
    "análisis hoy": "análisis disponibles hoy",

    // AutomationsLibrary
    "Immediate ROI Engine": "Motor de ROI Inmediato",
    "n8n Workflows": "Workflows n8n",
    "I don't just talk about efficiency; I deploy it. This is my personal arsenal of production-ready automations.": "No solo hablo de eficiencia; la implemento. Este es mi arsenal personal de automatizaciones listas para producción.",
    "I can adapt and deploy any of these into your ecosystem within days.": "Puedo adaptar y desplegar cualquiera de estas en tu ecosistema en cuestión de días.",
    "37+ Agents": "37+ Agentes",
    "High ROI": "Alto ROI",
    "n8n Native": "Nativo n8n",
    "Automation System": "Sistema de Automatización",
    "Core Function": "Función Principal",
    "Complexity": "Complejidad",
    "Stack & APIs": "Stack y APIs",
    "Est. ROI": "ROI Estimado",
    "Customize for my business": "Quiero implementar IA",

    // Otros textos comunes
    "Live Demo": "Ver demo",
    "View Project": "Ver Proyecto",
    "Read More": "Leer Más",
    "Learn More": "Saber Más",
    "Contact Me": "Contáctame",
    "Send Message": "Enviar Mensaje",
    "Loading...": "Cargando...",
    "Error": "Error",
    "Success": "Éxito",
    "More": "Más",

    // Meses
    "January": "Enero",
    "February": "Febrero",
    "March": "Marzo",
    "April": "Abril",
    "May": "Mayo",
    "June": "Junio",
    "July": "Julio",
    "August": "Agosto",
    "September": "Septiembre",
    "October": "Octubre",
    "November": "Noviembre",
    "December": "Diciembre",
    "Present": "Presente",

    // Tipos de empleo
    "Full-time": "Tiempo completo",
    "Part-time": "Medio tiempo",
    "Contract": "Contrato",
    "Freelance": "Freelance",
    "Remote": "Remoto",

    // Responsabilidades y logros
    "Key Responsibilities:": "Responsabilidades clave:",
    "Achievements:": "Logros destacados:",
    "Achievements & Honors": "Logros y reconocimientos",

    // Textos de UI
    "Open to opportunities": "Disponible para nuevos retos",
    "Chat with AI Twin": "Habla con mi clon IA",
    "Click to open chat": "Haz clic para chatear",
    "Click to close chat": "Haz clic para cerrar",
    "Online": "En línea",
};

function translateFile(filePath) {
    console.log(`📝 Traduciendo: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    let changes = 0;

    for (const [english, spanish] of Object.entries(translations)) {
        const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const newContent = content.replace(regex, spanish);

        if (newContent !== content) {
            const matches = (content.match(regex) || []).length;
            changes += matches;
            content = newContent;
        }
    }

    if (changes > 0) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`   ✅ ${changes} cambios aplicados`);
    } else {
        console.log(`   ⏭️  Sin cambios`);
    }

    return changes;
}

function translateDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    let totalChanges = 0;

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
            totalChanges += translateFile(fullPath);
        }
    }

    return totalChanges;
}

async function main() {
    console.log('🌐 Iniciando traducción de componentes...\n');

    const sectionsDir = path.join(__dirname, '..', 'components', 'sections');
    const totalChanges = translateDirectory(sectionsDir);

    console.log(`\n✅ Traducción completada!`);
    console.log(`   Total de cambios: ${totalChanges}`);
}

main().catch(console.error);
