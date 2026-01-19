# 🚀 Guía de Despliegue a Vercel

## Paso 1: Preparar el proyecto

### 1.1 Verificar que todo compile
```bash
npm run build
```

### 1.2 Verificar variables de entorno necesarias
Asegúrate de tener estas variables en `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET` (la crearemos después)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Paso 2: Desplegar a Vercel

### 2.1 Instalar Vercel CLI (si no lo tienes)
```bash
npm i -g vercel
```

### 2.2 Login en Vercel
```bash
vercel login
```

### 2.3 Desplegar
```bash
vercel
```

Sigue las instrucciones:
- Set up and deploy? **Yes**
- Which scope? **Tu cuenta personal**
- Link to existing project? **No**
- What's your project's name? **aiportfoilio** (o el nombre que prefieras)
- In which directory is your code located? **./** (presiona Enter)
- Want to override settings? **No**

### 2.4 Configurar variables de entorno en Vercel

Ve a tu proyecto en Vercel Dashboard:
1. Settings → Environment Variables
2. Añade TODAS las variables de tu `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SANITY_PROJECT_ID=0uaez0my
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-15
OPENAI_API_KEY=sk-proj-...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NODE_ENV=production
```

**IMPORTANTE:** Por ahora NO añadas `CLERK_WEBHOOK_SECRET` (la crearemos en el siguiente paso)

### 2.5 Redesplegar con las variables
```bash
vercel --prod
```

## Paso 3: Configurar Webhook de Clerk Billing

### 3.1 Obtener la URL de tu webhook
Tu webhook estará en:
```
https://TU-DOMINIO.vercel.app/api/webhooks/clerk
```

### 3.2 Configurar en Clerk Dashboard

1. Ve a [Clerk Dashboard](https://dashboard.clerk.com)
2. Selecciona tu aplicación
3. Ve a **Webhooks** en el menú lateral
4. Click en **+ Add Endpoint**
5. Configura:
   - **Endpoint URL**: `https://TU-DOMINIO.vercel.app/api/webhooks/clerk`
   - **Subscribe to events**: Selecciona:
     - ✅ `user.created`
     - ✅ `subscription.created`
     - ✅ `subscription.updated`
     - ✅ `subscription.deleted`
6. Click en **Create**

### 3.3 Copiar el Signing Secret

Después de crear el webhook:
1. Click en el webhook que acabas de crear
2. Copia el **Signing Secret** (empieza con `whsec_...`)

### 3.4 Añadir el secret a Vercel

1. Ve a Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Añade una nueva variable:
   - **Name**: `CLERK_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (el que copiaste)
   - **Environment**: Production, Preview, Development (marca todas)
3. Click en **Save**

### 3.5 Redesplegar
```bash
vercel --prod
```

## Paso 4: Configurar Clerk Billing

### 4.1 Activar Billing en Clerk

1. En Clerk Dashboard, ve a **Billing** (menú lateral)
2. Click en **Enable Billing**
3. Configura tu plan "Recruiter":
   - **Name**: Recruiter
   - **Price**: $9.99/month (o el precio que quieras)
   - **Description**: "5 análisis de trabajo por día + mensajes ilimitados"

### 4.2 Actualizar el webhook para detectar el plan correcto

El webhook actual asume que cualquier suscripción activa es "recruiter".
Si necesitas ser más específico, actualiza el código en `app/api/webhooks/clerk/route.ts`:

```typescript
// Línea 76-80, reemplaza con:
if (status === 'active' && activeItem) {
    // Mapea el price_id o product_id al nombre del plan
    const priceId = activeItem.price?.id;
    
    // Reemplaza 'price_xxx' con tu ID real de Stripe/Clerk
    if (priceId === 'price_recruiter_monthly') {
        planName = 'recruiter';
    }
}
```

## Paso 5: Testear el flujo completo

### 5.1 Crear un usuario de prueba
1. Abre tu sitio en producción
2. Regístrate con un email de prueba
3. Verifica que el usuario se crea correctamente

### 5.2 Simular un pago (Modo Test)

En Clerk Dashboard:
1. Ve a **Users**
2. Selecciona tu usuario de prueba
3. Ve a la pestaña **Billing**
4. Click en **Create Test Subscription**
5. Selecciona el plan "Recruiter"

### 5.3 Verificar que el webhook funciona

1. Ve a Clerk Dashboard → Webhooks → Tu webhook
2. Click en la pestaña **Logs**
3. Deberías ver eventos `subscription.created` con status 200
4. Verifica en tu usuario que `publicMetadata.subscriptionPlan` = "recruiter"

### 5.4 Testear los límites

1. Inicia sesión con tu usuario de prueba
2. Verifica que ahora tienes:
   - ✅ 5 análisis de trabajo por día (en vez de 3)
   - ✅ Mensajes ilimitados en el chat

## Paso 6: Configurar dominio personalizado (Opcional)

1. Ve a Vercel Dashboard → Tu proyecto → Settings → Domains
2. Añade tu dominio personalizado
3. Sigue las instrucciones para configurar DNS
4. Actualiza la URL del webhook en Clerk con tu nuevo dominio

## 🎯 Checklist Final

- [ ] Proyecto desplegado en Vercel
- [ ] Todas las variables de entorno configuradas
- [ ] Webhook de Clerk configurado y funcionando
- [ ] Clerk Billing activado con plan "Recruiter"
- [ ] Webhook secret añadido a Vercel
- [ ] Flujo de pago testeado
- [ ] Límites verificados (3 → 5 análisis, mensajes ilimitados)

## 🐛 Troubleshooting

### El webhook no se dispara
- Verifica que la URL es correcta (sin trailing slash)
- Verifica que el `CLERK_WEBHOOK_SECRET` está en Vercel
- Revisa los logs en Clerk Dashboard → Webhooks → Logs

### El plan no se actualiza
- Verifica los logs del webhook en Vercel (Runtime Logs)
- Verifica que el evento `subscription.created` se está recibiendo
- Verifica que `publicMetadata` se está actualizando en Clerk

### Los límites no cambian
- Verifica que el código en `app/actions/create-session.ts` y `app/actions/job-analysis.ts` lee correctamente `publicMetadata.subscriptionPlan`
- Haz un hard refresh (Ctrl+Shift+R) en el navegador

## 📝 Notas

- En modo test, Clerk Billing no cobra dinero real
- Para producción real, necesitarás conectar Stripe
- Los webhooks pueden tardar unos segundos en procesarse
- Siempre verifica los logs en Vercel y Clerk para debugging
