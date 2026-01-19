# ⚙️ Configuración de Variables de Entorno en Vercel

## Opción 1: Desde Vercel Dashboard (MÁS RÁPIDO) ⭐

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `ai-portfolio`
3. Ve a **Settings** → **Environment Variables**
4. Añade las siguientes variables una por una:

### Variables Públicas (marca: Production, Preview, Development)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
pk_test_... (tu clave pública)
```

```
NEXT_PUBLIC_SANITY_PROJECT_ID
0uaez0my
```

```
NEXT_PUBLIC_SANITY_DATASET
production
```

```
NEXT_PUBLIC_SANITY_API_VERSION
2025-10-15
```

### Variables Privadas (marca: Production, Preview, Development)

```
CLERK_SECRET_KEY
sk_test_... (tu clave secreta)
```

```
OPENAI_API_KEY
sk-proj-... (tu clave de OpenAI)
```

```
UPSTASH_REDIS_REST_URL
https://... (tu URL de Upstash)
```

```
UPSTASH_REDIS_REST_TOKEN
... (tu token de Upstash)
```

```
NODE_ENV
production
```

5. Click en **Save** después de cada variable

## Opción 2: Desde CLI (Alternativa)

Ejecuta estos comandos uno por uno:

```bash
# Públicas
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Pega: pk_test_Y2xvc2UtZmluY2gtNzMuY2xlcmsuYWNjb3VudHMuZGV2JA

vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
# Pega: 0uaez0my

vercel env add NEXT_PUBLIC_SANITY_DATASET production
# Pega: production

vercel env add NEXT_PUBLIC_SANITY_API_VERSION production
# Pega: 2025-10-15

# Privadas
vercel env add CLERK_SECRET_KEY production
# Pega: sk_test_...

vercel env add OPENAI_API_KEY production
# Pega: sk-proj-...

vercel env add UPSTASH_REDIS_REST_URL production
# Pega: https://...

vercel env add UPSTASH_REDIS_REST_TOKEN production
# Pega: ...

vercel env add NODE_ENV production
# Pega: production
```

## ⚠️ IMPORTANTE: CLERK_WEBHOOK_SECRET

**NO añadas esta variable todavía**. La añadiremos después de configurar el webhook en Clerk Dashboard.

## 🔄 Después de añadir las variables

Redesplegar el proyecto:

```bash
vercel --prod
```

O desde Vercel Dashboard:
- Ve a **Deployments**
- Click en los 3 puntos del último deployment
- Click en **Redeploy**

## ✅ Verificar que funcionó

1. Ve a tu URL de Vercel (ej: `https://ai-portfolio-xxx.vercel.app`)
2. Verifica que el sitio carga correctamente
3. Intenta registrarte/iniciar sesión (Clerk debe funcionar)
4. Verifica que el chat funciona
5. Verifica que las secciones del portfolio cargan (Sanity debe funcionar)

## 🐛 Si algo no funciona

1. Ve a Vercel Dashboard → Tu proyecto → **Runtime Logs**
2. Busca errores relacionados con variables de entorno
3. Verifica que todas las variables están configuradas correctamente
4. Redesplega el proyecto

## 📝 Siguiente paso

Una vez que el sitio funcione correctamente, configuraremos el webhook de Clerk Billing siguiendo la guía `DEPLOYMENT-GUIDE.md` (Paso 3).
