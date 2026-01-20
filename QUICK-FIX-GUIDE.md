# Script de Verificación Rápida

Este script te permite verificar rápidamente el estado de tu suscripción.

## Pasos Rápidos para Resolver el Problema

### 1. Verifica tu Plan Actual

Visita (mientras estás logueado):
```
https://marcaidev.it.com/api/debug/user-plan
```

Deberías ver algo como:
```json
{
  "userId": "user_xxxxx",
  "detectedPlan": "recruiter",  // ← Debe decir "recruiter"
  "messageLimit": 10,
  "analysisLimit": 5,
  "metadata": {
    "public": {
      "subscriptionPlan": "recruiter"  // ← Debe decir "recruiter"
    }
  }
}
```

### 2. Si `detectedPlan` NO es "recruiter"

#### Opción A: Actualizar Manualmente en Clerk Dashboard

1. Ve a https://dashboard.clerk.com
2. Click en "Users" en el menú lateral
3. Encuentra tu usuario (busca por email)
4. Click en tu usuario
5. Ve a la pestaña "Metadata"
6. En "Public Metadata", agrega o edita:
   ```json
   {
     "subscriptionPlan": "recruiter"
   }
   ```
7. Click "Save"
8. **IMPORTANTE**: Cierra sesión en tu portfolio y vuelve a iniciar sesión

#### Opción B: Usar el Script de Reset

```bash
# Desde la raíz del proyecto
cd c:\Users\Marcc16\Desktop\aiportfoilio

# Ejecutar el script de reset de límites
# Este script también puede actualizar el plan
node scripts/reset-limits.js
```

### 3. Actualizar Eventos del Webhook en Clerk

1. Ve a https://dashboard.clerk.com
2. Click en "Webhooks" en el menú lateral
3. Click en tu webhook (https://marcaidev.it.com/api/webhooks/clerk)
4. Ve a "Subscribed events"
5. Asegúrate de que estos eventos estén seleccionados:
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `subscriptionItem.active` ← **IMPORTANTE**
   - ✅ `subscriptionItem.created`
   - ✅ `subscriptionItem.updated`
   - ✅ `subscriptionItem.canceled`
   - ✅ `subscriptionItem.ended`

### 4. Desplegar los Cambios

```bash
# Commit y push
git add .
git commit -m "fix: mejorar webhooks de Clerk Billing"
git push
```

Vercel desplegará automáticamente.

### 5. Probar el Webhook Manualmente

1. Ve a Clerk Dashboard → Webhooks → Tu webhook
2. Click en "Testing"
3. Selecciona el evento `subscriptionItem.active`
4. Click "Send Example"
5. Ve a Vercel → Logs para ver el output

### 6. Verificar que Funciona

1. Cierra sesión en https://marcaidev.it.com
2. Vuelve a iniciar sesión
3. Ve al chat
4. Intenta enviar más de 5 mensajes
5. Deberías poder enviar hasta 10 mensajes sin problemas

## Solución Temporal: Resetear Límites Manualmente

Si necesitas usar el chat AHORA mientras arreglas el webhook:

1. Ve a: https://marcaidev.it.com/api/dev/reset-limits
2. Esto reseteará tus límites diarios
3. Podrás enviar mensajes de nuevo

**Nota**: Esto solo resetea los contadores, no arregla el problema del plan.

## Debugging Avanzado

### Ver Logs en Tiempo Real (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ver logs en tiempo real
vercel logs --follow
```

### Verificar Upstash Redis

1. Ve a https://console.upstash.com
2. Click en tu database
3. Ve a "Data Browser"
4. Busca keys que empiecen con `messages:user:` o `job-analysis:user:`
5. Verifica los contadores

### Verificar Variables de Entorno en Vercel

1. Ve a Vercel Dashboard
2. Click en tu proyecto
3. Settings → Environment Variables
4. Verifica que estas variables existan:
   - `CLERK_WEBHOOK_SECRET`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Contacto de Emergencia

Si nada de esto funciona, necesitaré:

1. **Screenshot del endpoint de debug**:
   - https://marcaidev.it.com/api/debug/user-plan

2. **Screenshot de Clerk Dashboard**:
   - Tu usuario → Metadata tab

3. **Logs del webhook desde Vercel**:
   - Vercel → Logs → Filtra por "CLERK WEBHOOK"

4. **Lista de eventos suscritos**:
   - Clerk Dashboard → Webhooks → Tu webhook → Subscribed events
