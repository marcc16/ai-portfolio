# 🚀 Desplegar en Vercel - Guía Rápida

## ✅ Todo está listo para desplegar

He configurado todo lo necesario para que el proyecto funcione correctamente en Vercel:

### 📝 Archivos creados/actualizados:
- ✅ `vercel.json` - Configuración optimizada para Vercel
- ✅ `.nvmrc` - Especifica Node.js 20.18.1 para Vercel
- ✅ `package.json` - Actualizado con engines de Node >= 20.9.0
- ✅ `app/sso-callback/page.tsx` - Corregido el error de pre-rendering de Clerk
- ✅ `CHECKLIST-VERCEL.md` - Checklist completo de deployment

### 🔧 Problemas corregidos:
1. ✅ Error de pre-rendering de SSO callback con Clerk
2. ✅ Configuración de versión de Node.js
3. ✅ Configuración de timeout para funciones API (30 segundos)
4. ✅ CORS headers para las API routes
5. ✅ Redirect para /studio

---

## 🎯 Pasos para desplegar AHORA

### 1️⃣ Commit y Push de los cambios

```bash
git add .
git commit -m "fix: Configure project for Vercel deployment with Clerk fix"
git push origin main
```

### 2️⃣ Verifica las variables de entorno en Vercel

Ve a tu proyecto en Vercel Dashboard y asegúrate de que tienes TODAS estas variables configuradas:

#### Variables Públicas:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

#### Variables Privadas:
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NODE_ENV` = `production`

**Nota:** `CLERK_WEBHOOK_SECRET` NO es necesaria para el primer deployment.

### 3️⃣ Vercel automáticamente detectará el push

- Vercel detectará automáticamente el push a `main`
- Iniciará el build automáticamente
- Usará Node.js 20.x gracias al archivo `.nvmrc`

### 4️⃣ Monitorea el deployment

Ve a tu Vercel Dashboard:
```
https://vercel.com/marcc16/[tu-proyecto]
```

Observa:
- ✅ El build debe completarse sin errores
- ✅ El deployment debe mostrar "Ready"
- ✅ Puedes ver los logs en tiempo real

---

## ✅ Verificar que todo funciona

Una vez desplegado, verifica:

1. **Página principal:**
   - Ve a tu URL de Vercel: `https://[tu-proyecto].vercel.app`
   - Verifica que carga sin errores

2. **Imágenes de Sanity:**
   - Las imágenes del portfolio deben cargar correctamente

3. **Autenticación con Clerk:**
   - Haz clic en "Sign In" o "Sign Up"
   - Verifica que el flujo de autenticación funciona

4. **Chat con IA:**
   - Inicia sesión
   - Abre el chat
   - Envía un mensaje
   - Verifica que responde

5. **Job Fit Assessment:**
   - Ve a la sección de "Fit Assessment"
   - Pega una descripción de trabajo
   - Verifica que analiza correctamente

---

## 🐛 Si algo falla

### Ver los logs en tiempo real:
```bash
vercel logs --follow
```

### O desde el Dashboard:
1. Ve a Vercel Dashboard
2. Tu proyecto > Deployments
3. Haz clic en el último deployment
4. Ve a "Runtime Logs"

### Errores comunes:

#### ❌ "Missing environment variable"
**Solución:** Ve a Settings > Environment Variables y añade la variable faltante

#### ❌ Error 500 en producción
**Solución:** Revisa los Runtime Logs para ver el error específico

#### ❌ "Cannot find module"
**Solución:** Asegúrate de que todas las dependencias estén en `package.json`

---

## 🎨 Siguientes pasos (DESPUÉS del primer deployment exitoso)

### 1. Configurar Dominio Personalizado (Opcional)
```
Vercel Dashboard > Settings > Domains
```

### 2. Configurar Webhook de Clerk para Billing
```
1. Ve a Clerk Dashboard > Webhooks
2. Crea un endpoint: https://tu-dominio.vercel.app/api/webhooks/clerk
3. Eventos: user.created, subscription.created, subscription.updated
4. Copia el Signing Secret
5. Añádelo como CLERK_WEBHOOK_SECRET en Vercel
6. Redesplega
```

### 3. Actualizar URLs en Clerk
```
Clerk Dashboard > Paths > Update:
- Authorized redirect URLs
- Sign-in URL
- Sign-up URL
- After sign-in URL
```

### 4. Actualizar CORS en Sanity
```
Sanity Dashboard > API > CORS Origins
Añade: https://tu-dominio.vercel.app
```

---

## 📊 Monitoreo Continuo

Una vez en producción, monitorea:

1. **Vercel Analytics:**
   - Tráfico y performance
   - Errores y crashes

2. **Vercel Runtime Logs:**
   - Errores en tiempo real
   - API calls

3. **Upstash Dashboard:**
   - Uso de Redis
   - Rate limiting metrics

4. **OpenAI Dashboard:**
   - Consumo de API
   - Costos

5. **Clerk Dashboard:**
   - Usuarios registrados
   - Autenticaciones

---

## 🆘 ¿Necesitas ayuda?

1. Revisa `CHECKLIST-VERCEL.md` para más detalles
2. Consulta los logs: `vercel logs --follow`
3. Verifica que todas las variables de entorno estén configuradas
4. Contacta soporte de Vercel si persiste el problema

---

## ✨ ¡Listo!

Tu proyecto está configurado correctamente. Solo necesitas:
1. Hacer commit y push
2. Verificar que las variables de entorno estén en Vercel
3. Esperar que el deployment termine
4. ¡Disfrutar de tu portfolio en producción! 🎉
