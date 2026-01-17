# 🚨 Solución: Datos en Local pero No en Producción

Este documento explica cómo resolver el problema cuando tienes datos en Sanity local pero no aparecen en producción.

## 🔍 Diagnóstico del Problema

Si solo ves el icono del chat y "Job Fit Assessment" en producción, significa que:
- ✅ La aplicación está funcionando
- ✅ Los componentes que no dependen de Sanity se muestran correctamente
- ❌ Los datos de Sanity no se están cargando en producción

## 🎯 Solución Rápida (3 Pasos)

### Paso 1: Verificar Variables de Entorno en Producción

Las variables de entorno en producción deben apuntar al dataset correcto:

**En Vercel:**
1. Ve a [vercel.com](https://vercel.com) → Tu proyecto → Settings → Environment Variables
2. Verifica/Agrega:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-10-15
   ```
3. **IMPORTANTE:** Haz un redeploy después de agregar/modificar variables

**En Netlify:**
1. Ve a [app.netlify.com](https://app.netlify.com) → Tu sitio → Site settings → Environment variables
2. Agrega las mismas variables
3. Guarda y haz un redeploy

**En Otro Servicio:**
Busca la sección de "Environment Variables" o "Config" y agrega las variables.

### Paso 2: Verificar que el Dataset de Producción Exista

```bash
# Lista todos los datasets
sanity dataset list

# Si no existe "production", créalo
sanity dataset create production
```

### Paso 3: Importar Datos al Dataset de Producción

#### Opción A: Si ya tienes los archivos .ndjson en la carpeta Data

```bash
cd Data
import-all.bat production
```

#### Opción B: Exportar desde Local e Importar a Producción

1. **Exportar desde tu dataset local** (reemplaza "development" con tu dataset local):
   ```bash
   # Exportar todo el dataset
   sanity dataset export development --output ./Data/exported-local.ndjson
   ```

2. **Importar al dataset de producción**:
   ```bash
   # Desde la carpeta Data
   cd Data
   sanity dataset import exported-local.ndjson production --replace
   ```

#### Opción C: Importar desde los archivos de muestra

Si no exportaste tus datos personalizados, puedes usar los archivos de muestra:

```bash
cd Data
import-all.bat production
```

Luego personaliza el contenido en Sanity Studio (`/studio`).

## 🔧 Verificación Paso a Paso

### 1. Verificar Variables de Entorno en Local

Crea o revisa `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-15
```

**Nota:** En local puedes usar `development`, pero en producción debe ser `production`.

### 2. Verificar que los Datos Existan en Producción

```bash
# Login en Sanity (si no lo has hecho)
sanity login

# Ver proyectos
sanity projects list

# Ver datasets del proyecto
sanity dataset list

# Ver documentos en producción
sanity documents query "count(*[])" --dataset production
```

### 3. Verificar en Sanity Studio

1. Inicia el servidor: `npm run dev`
2. Ve a `http://localhost:3000/studio`
3. En el selector de dataset (arriba a la derecha), selecciona `production`
4. Verifica que veas todos tus documentos

### 4. Verificar Variables de Entorno en Producción

**Si usas Vercel:**
- Dashboard → Tu Proyecto → Settings → Environment Variables
- Verifica que todas las variables `NEXT_PUBLIC_*` estén configuradas
- **IMPORTANTE:** Después de cambiar variables, haz un redeploy

**Si usas Netlify:**
- Dashboard → Tu Sitio → Site settings → Environment variables
- Agrega todas las variables necesarias
- Guarda y redeploya

### 5. Verificar CORS en Sanity

1. Ve a [manage.sanity.io](https://manage.sanity.io)
2. Selecciona tu proyecto → API → CORS Origins
3. Agrega:
   - `http://localhost:3000` (para desarrollo)
   - Tu dominio de producción (ej: `https://tu-dominio.vercel.app`)

## 🐛 Solución de Problemas

### Problema: "Las secciones no aparecen después de importar"

**Solución:**
1. Verifica que el dataset en producción tenga datos:
   ```bash
   sanity documents query "*[_type == 'skill']" --dataset production
   ```

2. Verifica que las variables de entorno en producción sean correctas
3. Haz un redeploy completo después de cambiar variables
4. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)

### Problema: "Error al importar datos"

**Solución:**
1. Verifica que estés autenticado:
   ```bash
   sanity login
   ```

2. Verifica el project ID:
   ```bash
   sanity projects list
   ```

3. Verifica que el dataset exista:
   ```bash
   sanity dataset list
   ```

### Problema: "Variables de entorno no funcionan en producción"

**Solución:**
1. Asegúrate de que las variables empiecen con `NEXT_PUBLIC_` si se usan en el cliente
2. Reinicia/Redespliega la aplicación después de cambiar variables
3. Verifica que no haya espacios extras en los valores
4. En Vercel, verifica que estén configuradas para el entorno correcto (Production, Preview, Development)

### Problema: "Los datos aparecen en Studio pero no en la app"

**Solución:**
1. Verifica que los documentos estén "Published" (no en draft)
2. Verifica que el dataset en `.env.local` sea el mismo que en producción
3. Revisa la consola del navegador para ver errores de API
4. Verifica que CORS esté configurado correctamente

## 📝 Checklist Completo

- [ ] Variables de entorno configuradas en producción
- [ ] Dataset "production" existe en Sanity
- [ ] Datos importados al dataset "production"
- [ ] Variables de entorno empiezan con `NEXT_PUBLIC_` si son necesarias en cliente
- [ ] CORS configurado en Sanity para el dominio de producción
- [ ] Redeploy hecho después de cambiar variables
- [ ] Documentos están "Published" (no en draft)
- [ ] Verificado en Sanity Studio que los datos existen en "production"

## 🚀 Comandos Rápidos de Referencia

```bash
# Ver datasets
sanity dataset list

# Crear dataset production (si no existe)
sanity dataset create production

# Exportar desde local
sanity dataset export development --output ./Data/exported.ndjson

# Importar a producción
sanity dataset import ./Data/exported.ndjson production --replace

# O importar todos los archivos de muestra
cd Data
import-all.bat production

# Verificar datos en producción
sanity documents query "count(*[])" --dataset production
```

## 💡 Consejo Final

**Para evitar este problema en el futuro:**
1. Siempre usa el mismo dataset (`production`) en local y producción
2. O mantén ambos datasets sincronizados regularmente
3. Configura las variables de entorno ANTES del primer deploy
4. Documenta qué dataset usar en cada entorno

---

¿Necesitas más ayuda? Revisa:
- [Data/README.md](./Data/README.md) - Guía completa de importación
- [Data/export-to-production.md](./Data/export-to-production.md) - Guía de exportación
- [README.md](./README.md) - Documentación general del proyecto
