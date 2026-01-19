# ✅ Checklist de Deployment en Vercel

## 1. Variables de Entorno Requeridas

Asegúrate de que TODAS estas variables estén configuradas en Vercel Dashboard > Settings > Environment Variables:

### 🔹 Variables Públicas (NEXT_PUBLIC_*)
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clave pública de Clerk
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` - ID del proyecto de Sanity (ej: 0uaez0my)
- [ ] `NEXT_PUBLIC_SANITY_DATASET` - Dataset de Sanity (production)
- [ ] `NEXT_PUBLIC_SANITY_API_VERSION` - Versión de la API (2025-10-15)

### 🔒 Variables Privadas (Secretas)
- [ ] `CLERK_SECRET_KEY` - Clave secreta de Clerk (sk_test_...)
- [ ] `OPENAI_API_KEY` - Clave de OpenAI (sk-proj-...)
- [ ] `UPSTASH_REDIS_REST_URL` - URL de Upstash Redis
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Token de Upstash Redis
- [ ] `NODE_ENV` - Debe ser "production"

### 🔔 Variables Opcionales (Configurar después del primer deployment)
- [ ] `CLERK_WEBHOOK_SECRET` - Se configura DESPUÉS de crear el webhook en Clerk
- [ ] `SANITY_API_TOKEN` - Token de API de Sanity (opcional para draft mode)
- [ ] `SANITY_SERVER_API_TOKEN` - Token servidor de Sanity (opcional)

## 2. Configuración de Build

### ✅ Verificar que:
- [ ] `vercel.json` está creado con la configuración correcta
- [ ] `next.config.mjs` tiene `typescript.ignoreBuildErrors: true`
- [ ] `package.json` tiene el script `"build": "next build"`
- [ ] Todas las dependencias están en `package.json`

### 🔧 Configuración en Vercel Dashboard:
- [ ] Framework Preset: `Next.js`
- [ ] Build Command: `pnpm run build` (o dejar el default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `pnpm install` (o dejar el default)
- [ ] Node Version: 20.x (default)

## 3. Orden de Deployment

### Paso 1: Configurar Variables de Entorno Base
1. Añade todas las variables PÚBLICAS primero
2. Añade todas las variables PRIVADAS (excepto CLERK_WEBHOOK_SECRET)
3. Guarda cada variable en los tres ambientes: Production, Preview, Development

### Paso 2: Primer Deployment
```bash
# Desde tu máquina local
git add .
git commit -m "chore: Configure for Vercel deployment"
git push origin main
```

O desde Vercel Dashboard:
- Deployments > Redeploy

### Paso 3: Verificar Deployment
- [ ] El sitio carga sin errores 500
- [ ] Las imágenes de Sanity se muestran correctamente
- [ ] Clerk login/registro funciona
- [ ] El chat con IA funciona
- [ ] Job Fit Assessment funciona

### Paso 4: Configurar Webhook de Clerk (DESPUÉS del deployment exitoso)
1. Ve a Clerk Dashboard > Webhooks
2. Crea un nuevo endpoint: `https://tu-dominio.vercel.app/api/webhooks/clerk`
3. Selecciona eventos: `user.created`, `subscription.created`, `subscription.updated`
4. Copia el Signing Secret
5. Añádelo como `CLERK_WEBHOOK_SECRET` en Vercel
6. Redesplega el proyecto

## 4. Comandos Útiles de Debugging

### Ver logs en tiempo real:
```bash
vercel logs tu-proyecto-url --follow
```

### Verificar variables de entorno:
```bash
vercel env ls
```

### Pull de variables de entorno para desarrollo:
```bash
vercel env pull .env.local
```

## 5. Errores Comunes y Soluciones

### ❌ Error: "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
**Solución:** Añade la variable en Vercel Dashboard y redesplega

### ❌ Error: "CLERK_WEBHOOK_SECRET not found"
**Solución:** Esta variable es OPCIONAL. Si no tienes el webhook configurado aún, el sitio funcionará igual.

### ❌ Error: "Redis connection failed"
**Solución:** Verifica que UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN estén correctos

### ❌ Error: "OpenAI API Error"
**Solución:** Verifica que OPENAI_API_KEY sea válida y tenga saldo

### ❌ Error 500 en producción pero funciona en local
**Solución:**
1. Revisa los logs: `vercel logs --follow`
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que las variables públicas tengan el prefijo `NEXT_PUBLIC_`

## 6. Post-Deployment

Una vez que el sitio esté funcionando:

- [ ] Configura un dominio personalizado en Vercel
- [ ] Configura SSL (automático en Vercel)
- [ ] Actualiza las URLs de callback en Clerk Dashboard
- [ ] Actualiza el CORS origin en Sanity Dashboard
- [ ] Configura los webhooks de Clerk para billing
- [ ] Verifica Analytics en Vercel Dashboard

## 7. Monitoreo

### Verifica regularmente:
- [ ] Vercel Dashboard > Analytics (tráfico y errores)
- [ ] Vercel Dashboard > Runtime Logs (errores en tiempo real)
- [ ] Upstash Dashboard > Redis metrics (uso de rate limiting)
- [ ] OpenAI Dashboard > Usage (consumo de API)
- [ ] Clerk Dashboard > Users (registros y actividad)

---

## 🆘 Ayuda Adicional

Si sigues teniendo problemas después de seguir este checklist:

1. **Revisa los logs detallados:**
   ```bash
   vercel logs tu-url --follow
   ```

2. **Verifica el build localmente:**
   ```bash
   pnpm run build
   pnpm start
   ```

3. **Compara variables de entorno:**
   ```bash
   vercel env pull .env.vercel
   diff .env.local .env.vercel
   ```

4. **Contacta soporte de Vercel:**
   - Dashboard > Help > Contact Support
   - Incluye logs y descripción del error
