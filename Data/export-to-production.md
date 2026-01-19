# 📤 Exportar Datos de Local a Producción

Esta guía te ayudará a exportar los datos de tu dataset local de Sanity e importarlos al dataset de producción.

## 🔍 Paso 1: Verificar tu Configuración Actual

Primero, verifica qué dataset estás usando localmente:

1. Revisa tu archivo `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_SANITY_DATASET=development  # o el nombre de tu dataset local
   ```

2. Verifica qué datasets tienes disponibles:
   ```bash
   sanity dataset list
   ```

## 📥 Paso 2: Exportar Datos del Dataset Local

### Opción A: Exportar Todo el Dataset

```bash
# Exportar todo el dataset local (reemplaza 'development' con tu dataset local)
sanity dataset export development --output-dir ./Data/exported

# O exportar a un archivo NDJSON
sanity dataset export development --output ./Data/exported-data.ndjson
```

### Opción B: Exportar Tipos Específicos

Si solo quieres exportar ciertos tipos de documentos:

1. Usa la herramienta Vision en Sanity Studio (`http://localhost:3000/studio`)
2. Abre la pestaña "Vision"
3. Ejecuta queries para cada tipo y copia los resultados:

```groq
// Exportar skills
*[_type == "skill"]

// Exportar profile
*[_id == "singleton-profile"]

// Exportar experience
*[_type == "experience"]

// Exportar education
*[_type == "education"]

// Exportar projects
*[_type == "project"]

// Exportar blog
*[_type == "blog"]

// Exportar services
*[_type == "service"]

// Exportar achievements
*[_type == "achievement"]

// Exportar certifications
*[_type == "certification"]

// Exportar testimonials
*[_type == "testimonial"]

// Exportar siteSettings
*[_id == "singleton-siteSettings"]
```

## 📤 Paso 3: Importar al Dataset de Producción

### Verificar Variables de Entorno para Producción

Asegúrate de que tu `.env.local` (o las variables de entorno en producción) apunten al dataset correcto:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production  # Asegúrate que sea "production"
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-15
```

### Crear el Dataset de Producción (si no existe)

```bash
# Verificar si el dataset existe
sanity dataset list

# Si no existe "production", créalo
sanity dataset create production
```

### Importar los Datos

Si exportaste todo el dataset:

```bash
# Importar desde el directorio exportado
sanity dataset import ./Data/exported/data.ndjson production --replace

# O desde el archivo NDJSON
sanity dataset import ./Data/exported-data.ndjson production --replace
```

Si exportaste tipos específicos, puedes usar el script de importación:

```bash
cd Data
import-all.bat production
```

O manualmente (en el orden correcto):

```bash
cd Data

# Importar en orden (importante para referencias!)
sanity dataset import skills.ndjson production --replace
sanity dataset import profile.ndjson production --replace
sanity dataset import education.ndjson production --replace
sanity dataset import experience.ndjson production --replace
sanity dataset import projects.ndjson production --replace
sanity dataset import blog.ndjson production --replace
sanity dataset import services.ndjson production --replace
sanity dataset import achievements.ndjson production --replace
sanity dataset import certifications.ndjson production --replace
sanity dataset import testimonials.ndjson production --replace
sanity dataset import siteSettings.ndjson production --replace
sanity dataset import contact.ndjson production --replace
sanity dataset import navigation.ndjson production --replace
```

## 🔐 Paso 4: Verificar Variables de Entorno en Producción

Si tu aplicación está desplegada (Vercel, Netlify, etc.), asegúrate de configurar las variables de entorno:

### En Vercel:
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com)
2. Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = tu-project-id
   - `NEXT_PUBLIC_SANITY_DATASET` = production
   - `NEXT_PUBLIC_SANITY_API_VERSION` = 2025-10-15

### En Netlify:
1. Ve a tu proyecto en [Netlify Dashboard](https://app.netlify.com)
2. Site settings → Environment variables
3. Agrega las mismas variables

### En Otros Servicios:
Busca la sección de "Environment Variables" o "Config" y agrega las variables `NEXT_PUBLIC_*`

## ✅ Paso 5: Verificar que Funcione

1. Verifica en Sanity Studio:
   ```bash
   # Asegúrate de estar en el proyecto correcto
   npm run dev
   # Visita http://localhost:3000/studio
   ```

2. Verifica en la aplicación:
   ```bash
   npm run dev
   # Visita http://localhost:3000
   # Deberías ver todas las secciones ahora
   ```

3. Si estás en producción, haz un redeploy después de configurar las variables de entorno.

## 🐛 Solución de Problemas

### "Dataset not found"
```bash
# Crea el dataset primero
sanity dataset create production
```

### "Unable to find project"
```bash
# Verifica que estés autenticado
sanity login

# Verifica tu project ID
sanity projects list
```

### "Authentication required"
```bash
sanity login
```

### Las secciones siguen sin aparecer

1. Verifica que los datos estén en el dataset correcto:
   ```bash
   # En Sanity Studio, ve a Vision y ejecuta:
   count(*[])
   # Debería mostrar el número de documentos
   ```

2. Verifica que las variables de entorno estén configuradas:
   ```bash
   # En desarrollo, verifica .env.local
   cat .env.local
   ```

3. Limpia la caché de Next.js:
   ```bash
   rm -rf .next
   npm run dev
   ```

4. Verifica que los documentos estén publicados (si usas draft mode):
   - Ve a Sanity Studio
   - Asegúrate de que todos los documentos tengan el estado "Published"

## 📝 Notas Importantes

- ⚠️ El flag `--replace` sobrescribirá documentos existentes con el mismo `_id`
- 🔄 El orden de importación importa (skills primero, luego documentos que los referencian)
- 🔐 Asegúrate de que las variables de entorno en producción apunten al dataset correcto
- 🌐 Después de configurar variables de entorno en producción, haz un redeploy
