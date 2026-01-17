# ⚙️ Configurar Variables de Entorno en Producción

## 📋 Información de tu Proyecto Sanity

```
Project ID: 0uaez0my
Dataset: production
API Version: 2025-10-15
```

## ✅ Estado Actual

- ✅ Dataset "production" existe
- ✅ Dataset tiene 104 documentos (datos presentes)
- ✅ Variables de entorno locales están configuradas correctamente
- ❌ **Variables de entorno en PRODUCCIÓN no están configuradas**

## 🚀 Solución: Configurar Variables en Producción

### Si usas Vercel:

1. Ve a [vercel.com](https://vercel.com) y selecciona tu proyecto
2. Ve a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = 0uaez0my
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_SANITY_API_VERSION = 2025-10-15
```

4. **IMPORTANTE:** Marca estas variables para todos los entornos:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. **Haz un REDEPLOY:**
   - Ve a **Deployments**
   - Encuentra el último deployment
   - Haz clic en los 3 puntos (⋯) → **Redeploy**
   - O haz un nuevo commit y push

### Si usas Netlify:

1. Ve a [app.netlify.com](https://app.netlify.com) y selecciona tu sitio
2. Ve a **Site settings** → **Environment variables**
3. Agrega las siguientes variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = 0uaez0my
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_SANITY_API_VERSION = 2025-10-15
```

4. **Haz un REDEPLOY:**
   - Ve a **Deploys**
   - Haz clic en **Trigger deploy** → **Deploy site**

### Si usas otra plataforma:

Busca la sección de "Environment Variables" o "Config" y agrega las mismas variables. Luego haz un redeploy.

## 🔍 Verificar que Funcione

Después de configurar las variables y hacer el redeploy:

1. Espera a que el deployment termine (2-5 minutos)
2. Visita tu sitio en producción
3. Deberías ver todas las secciones:
   - ✅ Hero con tu nombre y foto
   - ✅ About
   - ✅ Skills
   - ✅ Experience
   - ✅ Projects
   - ✅ Education
   - ✅ Certifications
   - ✅ Achievements
   - ✅ Blog
   - ✅ Contact

## 🐛 Si aún no funciona:

1. **Verifica CORS en Sanity:**
   - Ve a [manage.sanity.io](https://manage.sanity.io)
   - Selecciona tu proyecto (0uaez0my)
   - Ve a **API** → **CORS Origins**
   - Agrega tu dominio de producción (ej: `https://tu-dominio.vercel.app`)

2. **Verifica que las variables estén bien escritas:**
   - No debe haber espacios al inicio o final
   - Deben empezar con `NEXT_PUBLIC_` (son importantes para el cliente)

3. **Limpia la caché del navegador:**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

4. **Verifica en la consola del navegador:**
   - Abre las Developer Tools (F12)
   - Ve a la pestaña Console
   - Busca errores relacionados con Sanity

## ✅ Checklist Final

- [ ] Variables de entorno agregadas en producción
- [ ] Variables marcadas para todos los entornos (Production, Preview, Development)
- [ ] Redeploy realizado después de agregar variables
- [ ] CORS configurado en Sanity para el dominio de producción
- [ ] Verificado que el sitio funciona correctamente

---

**Una vez que hagas esto, tu portfolio debería mostrar todos los datos en producción.** 🚀
