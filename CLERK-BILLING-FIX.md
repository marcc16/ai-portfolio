# Guía para Arreglar el Problema de Sincronización de Billing

## Problema Identificado

Los webhooks de Clerk están llegando correctamente, pero el plan no se actualiza en tu aplicación. Esto se debe a:

1. **Eventos no escuchados**: Tu webhook solo escuchaba `subscription.created` y `subscription.updated`, pero Clerk envía eventos más específicos como `subscriptionItem.active`
2. **Falta de logging**: No había forma de debuggear qué estaba pasando

## Solución Implementada

He actualizado el webhook (`/app/api/webhooks/clerk/route.ts`) para:

1. ✅ Escuchar más eventos de billing:
   - `subscription.created`
   - `subscription.updated`
   - `subscriptionItem.active` ← **Este es el importante**
   - `subscriptionItem.created`
   - `subscriptionItem.updated`
   - `subscriptionItem.canceled`
   - `subscriptionItem.ended`

2. ✅ Agregar logging extensivo para debug
3. ✅ Manejar correctamente las cancelaciones

## Pasos para Resolver el Problema

### 1. Actualizar Eventos en Clerk Dashboard

Ve a tu [Clerk Dashboard → Webhooks](https://dashboard.clerk.com) y asegúrate de que tu webhook esté suscrito a estos eventos:

**Eventos requeridos:**
- ✅ `subscription.created`
- ✅ `subscription.updated`
- ✅ `subscriptionItem.active` ← **IMPORTANTE: Agrega este**
- ✅ `subscriptionItem.created`
- ✅ `subscriptionItem.updated`
- ✅ `subscriptionItem.canceled`
- ✅ `subscriptionItem.ended`

### 2. Desplegar el Código Actualizado

```bash
# Commit y push de los cambios
git add .
git commit -m "fix: mejorar manejo de webhooks de Clerk Billing"
git push
```

Vercel desplegará automáticamente los cambios.

### 3. Probar la Actualización del Plan

#### Opción A: Simular un Webhook desde Clerk

1. Ve a Clerk Dashboard → Webhooks → Tu webhook
2. Click en "Testing"
3. Selecciona el evento `subscriptionItem.active`
4. Envía el webhook de prueba
5. Revisa los logs en Vercel para ver el output

#### Opción B: Actualizar Manualmente el Metadata

Mientras tanto, puedes actualizar manualmente el plan del usuario:

1. Ve a Clerk Dashboard → Users
2. Encuentra tu usuario
3. Click en "Metadata" → "Public Metadata"
4. Agrega o actualiza:
   ```json
   {
     "subscriptionPlan": "recruiter"
   }
   ```
5. Guarda los cambios
6. **IMPORTANTE**: Cierra sesión y vuelve a iniciar sesión en tu portfolio

#### Opción C: Cancelar y Volver a Suscribirse

Si las opciones anteriores no funcionan:

1. Cancela la suscripción actual en Clerk
2. Espera a que se procese la cancelación
3. Vuelve a suscribirte al plan Recruiter
4. Esta vez el webhook `subscriptionItem.active` debería procesarse correctamente

### 4. Verificar los Logs

Una vez desplegado, los logs en Vercel mostrarán:

```
=== CLERK WEBHOOK RECEIVED ===
Event Type: subscriptionItem.active
Event Data: {...}
=== PROCESSING BILLING EVENT ===
User ID from event: user_xxxxx
SubscriptionItem status: active
Setting plan to recruiter (subscriptionItem.active)
Updating user user_xxxxx metadata to plan: recruiter
✅ Successfully updated user user_xxxxx plan to recruiter
Verified publicMetadata: { subscriptionPlan: 'recruiter' }
=== WEBHOOK PROCESSING COMPLETE ===
```

### 5. Verificar que Funciona

1. Cierra sesión en tu portfolio
2. Vuelve a iniciar sesión
3. Intenta enviar más de 5 mensajes en el chat
4. Deberías poder enviar hasta 10 mensajes

## Debugging Adicional

Si después de estos pasos sigue sin funcionar:

### Ver los Logs del Webhook en Vercel

```bash
# Instala Vercel CLI si no la tienes
npm i -g vercel

# Login
vercel login

# Ver logs en tiempo real
vercel logs --follow
```

### Verificar el Plan del Usuario Actual

Crea un endpoint temporal para verificar:

```typescript
// app/api/debug/user-plan/route.ts
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return NextResponse.json({
    userId,
    publicMetadata: user.publicMetadata,
    privateMetadata: user.privateMetadata,
  });
}
```

Luego visita: `https://tu-dominio.com/api/debug/user-plan`

## Notas Importantes

1. **Cache de Clerk**: Clerk puede cachear los datos del usuario. Cerrar sesión y volver a iniciar sesión fuerza una recarga.

2. **Eventos en Orden**: Cuando pagas, Clerk envía múltiples eventos en este orden:
   - `paymentAttempt.created`
   - `paymentAttempt.updated`
   - `subscriptionItem.active` ← Este actualiza el plan
   - `subscription.updated`

3. **Verificación**: Siempre verifica en Clerk Dashboard que el `publicMetadata.subscriptionPlan` del usuario esté en `"recruiter"`

## Contacto

Si después de seguir todos estos pasos el problema persiste, necesitaremos:
1. Los logs completos del webhook desde Vercel
2. El `publicMetadata` actual del usuario desde Clerk Dashboard
3. Los eventos exactos que se están enviando desde Clerk
