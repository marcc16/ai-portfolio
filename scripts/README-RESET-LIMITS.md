# Reset Rate Limits Tool

Herramienta de desarrollo para resetear límites de mensajes en Redis (Upstash).

⚠️ **SOLO DISPONIBLE EN MODO DESARROLLO** (`NODE_ENV=development`)

---

## 🚀 Uso Rápido

### Opción 1: Navegador

Simplemente visita en tu navegador:

```
http://localhost:3000/api/dev/reset-limits
```

### Opción 2: cURL (Terminal Linux/Mac/WSL)

```bash
# Resetear usuario actual o IP
curl http://localhost:3000/api/dev/reset-limits

# Resetear TODO (todos los usuarios y guests)
curl http://localhost:3000/api/dev/reset-limits?all=true

# Resetear usuario específico de Clerk
curl "http://localhost:3000/api/dev/reset-limits?userId=user_2abc123xyz"

# Resetear IP específica
curl "http://localhost:3000/api/dev/reset-limits?ip=192.168.1.1"

# Resetear por patrón de Redis
curl "http://localhost:3000/api/dev/reset-limits?pattern=messages:user:*"
```

### Opción 3: Script Bash (Linux/Mac/WSL)

```bash
# Resetear usuario actual
./scripts/reset-limits.sh

# O explícitamente
./scripts/reset-limits.sh current

# Resetear TODO
./scripts/reset-limits.sh all

# Resetear usuario específico
./scripts/reset-limits.sh user user_2abc123xyz

# Resetear IP específica
./scripts/reset-limits.sh ip 192.168.1.1

# Resetear por patrón
./scripts/reset-limits.sh pattern "messages:user:*"

# Ver ayuda
./scripts/reset-limits.sh help
```

### Opción 4: Script PowerShell (Windows)

```powershell
# Resetear usuario actual
.\scripts\reset-limits.ps1

# Resetear TODO
.\scripts\reset-limits.ps1 all

# Resetear usuario específico
.\scripts\reset-limits.ps1 user user_2abc123xyz

# Resetear IP específica
.\scripts\reset-limits.ps1 ip 192.168.1.1

# Resetear por patrón
.\scripts\reset-limits.ps1 pattern "messages:user:*"

# Ver ayuda
.\scripts\reset-limits.ps1 help
```

---

## 📋 Modos de Reset

### 1. **Current (Default)** - Reset Usuario/IP Actual

```bash
GET /api/dev/reset-limits
```

Resetea:
- Los límites del usuario autenticado actualmente (si está logueado)
- Los límites de la IP actual (para guests)

**Uso típico:** Desarrollo local cuando quieres resetear tu propio contador.

---

### 2. **User** - Reset Usuario Específico de Clerk

```bash
GET /api/dev/reset-limits?userId=user_2abc123xyz
```

Resetea:
- Límites de chat del usuario especificado
- Límites de análisis de trabajo del usuario

**Uso típico:** Resetear límites de una cuenta de prueba específica.

**Cómo obtener el userId:**
1. Ir a [Clerk Dashboard](https://dashboard.clerk.com/)
2. Users → Seleccionar usuario → Copiar User ID
3. O inspectar en el código: `const { userId } = useUser()`

---

### 3. **IP** - Reset Guest por IP

```bash
GET /api/dev/reset-limits?ip=192.168.1.1
```

Resetea:
- Límites de guest con esa IP específica
- Útil para resetear desde otra máquina en tu red local

**Uso típico:** Testing multi-dispositivo.

---

### 4. **All** - Reset TODO

```bash
GET /api/dev/reset-limits?all=true
```

Resetea:
- TODOS los límites de TODOS los usuarios
- TODOS los límites de TODOS los guests
- Usa patrones `messages:*` y `job-analysis:*`

**Uso típico:** Limpiar todo y empezar desde cero.

⚠️ **PRECAUCIÓN:** Esto elimina todos los contadores en Redis.

---

### 5. **Pattern** - Reset por Patrón de Redis

```bash
GET /api/dev/reset-limits?pattern=messages:user:*
```

Resetea todas las claves que coincidan con el patrón de Redis.

**Patrones útiles:**
- `messages:*` - Todos los mensajes
- `messages:user:*` - Solo usuarios autenticados
- `messages:guest:*` - Solo guests
- `job-analysis:*` - Todos los análisis de trabajo
- `*:*:2026-01-19` - Todo del día específico

**Múltiples patrones:**
```bash
GET /api/dev/reset-limits?pattern=messages:user:*,job-analysis:user:*
```

---

## 🔍 Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Rate limits reset successfully",
  "resetInfo": {
    "date": "2026-01-19",
    "mode": "user",
    "userId": "user_2abc123xyz"
  },
  "deletedKeys": [
    "messages:user:user_2abc123xyz:2026-01-19",
    "job-analysis:user:user_2abc123xyz:2026-01-19"
  ],
  "deletedCount": 2,
  "info": {
    "chatMessages": "Reset to max (3 for guest, 5 for free user, 10 for recruiter)",
    "jobAnalyses": "Reset to max (1 for guest, 3 for free user, 5 for recruiter)"
  },
  "examples": {
    "resetCurrentUser": "/api/dev/reset-limits",
    "resetSpecificUser": "/api/dev/reset-limits?userId=user_2xxx",
    "resetSpecificIP": "/api/dev/reset-limits?ip=192.168.1.1",
    "resetAll": "/api/dev/reset-limits?all=true",
    "resetPattern": "/api/dev/reset-limits?pattern=messages:user:*"
  }
}
```

---

## 🗂️ Estructura de Claves en Redis

### Chat Messages

```
messages:guest:<guestId:IP>:<YYYY-MM-DD>   → Valor: número de mensajes usados
messages:user:<userId>:<YYYY-MM-DD>        → Valor: número de mensajes usados
```

**Ejemplos:**
```
messages:guest:guest_1705680000_abc123:192.168.1.1:2026-01-19
messages:user:user_2abc123xyz:2026-01-19
```

### Job Analysis

```
job-analysis:guest:<guestId:IP>:<YYYY-MM-DD>   → Valor: número de análisis usados
job-analysis:user:<userId>:<YYYY-MM-DD>        → Valor: número de análisis usados
```

---

## 🛠️ Debugging

### Ver todas las claves en Redis

```bash
# Conectar a Redis (si tienes acceso local)
redis-cli -h <host> -p <port> -a <password>

# Listar todas las claves de mensajes
KEYS messages:*

# Listar todas las claves de análisis
KEYS job-analysis:*

# Ver valor de una clave específica
GET messages:user:user_2abc123xyz:2026-01-19
```

### Ver límites actuales sin resetear

```bash
# En el navegador, inspecciona la respuesta de:
# Network tab → /api/chatkit/session → Response

# O usa el hook getMessageUsage en tu código:
import { getMessageUsage } from "@/app/actions/create-session";

const usage = await getMessageUsage();
console.log(usage);
// { remaining: 3, limit: 5, allowed: true, plan: "free" }
```

---

## 📝 Casos de Uso Comunes

### Desarrollo Local

```bash
# Cada vez que quieras probar el límite de mensajes
./scripts/reset-limits.sh
```

### Testing de Planes

```bash
# 1. Resetear usuario
./scripts/reset-limits.sh user user_2test123

# 2. Enviar exactamente 5 mensajes (plan free)
# 3. Verificar que el 6to mensaje muestre "Límite alcanzado"

# 4. Actualizar plan a recruiter en Clerk Dashboard
# 5. Resetear de nuevo
./scripts/reset-limits.sh user user_2test123

# 6. Verificar que ahora permite 10 mensajes
```

### Testing Multi-Usuario

```bash
# Terminal 1: Usuario A
./scripts/reset-limits.sh user user_2aaa

# Terminal 2: Usuario B
./scripts/reset-limits.sh user user_2bbb

# Terminal 3: Guest con IP específica
./scripts/reset-limits.sh ip 192.168.1.100
```

### Limpieza Completa

```bash
# Al final del día o sprint
./scripts/reset-limits.sh all
```

---

## ⚙️ Configuración

El endpoint usa estas variables de entorno:

```env
NODE_ENV=development                    # Requerido: debe ser "development"
UPSTASH_REDIS_REST_URL=https://...      # URL de tu Redis Upstash
UPSTASH_REDIS_REST_TOKEN=...            # Token de autenticación
```

---

## 🔒 Seguridad

- ✅ **Solo funciona en desarrollo** (`NODE_ENV=development`)
- ✅ **Bloqueado en producción** (retorna 403 Forbidden)
- ✅ **Requiere Redis configurado** (retorna 500 si no está)
- ✅ **No afecta datos de Clerk** (solo Redis)
- ✅ **No afecta Sanity CMS** (solo Redis)

---

## 🚨 Troubleshooting

### "This endpoint is only available in development mode"

**Solución:** Asegúrate de que `NODE_ENV=development` en tu `.env.local`

```bash
echo "NODE_ENV=development" >> .env.local
```

---

### "Redis is not configured"

**Solución:** Agrega las credenciales de Upstash Redis a `.env.local`

```bash
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

Obtén las credenciales en: https://console.upstash.com/

---

### Script no ejecutable (Linux/Mac)

**Solución:**

```bash
chmod +x scripts/reset-limits.sh
```

---

### PowerShell: "execution of scripts is disabled"

**Solución:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### jq: command not found (script bash)

**Solución:**

```bash
# Ubuntu/Debian
sudo apt-get install jq

# Mac
brew install jq
```

El script funciona sin `jq`, pero la salida se ve mejor con él.

---

## 📚 Referencias

- **Endpoint:** `app/api/dev/reset-limits/route.ts`
- **Message Tracking:** `lib/message-tracking.ts`
- **Create Session:** `app/actions/create-session.ts`
- **Rate Limit Config:** `lib/ratelimit.ts`

---

## 💡 Tips

1. **Alias útil** (bash):
   ```bash
   alias reset-chat="curl -s http://localhost:3000/api/dev/reset-limits | jq"
   echo 'alias reset-chat="curl -s http://localhost:3000/api/dev/reset-limits | jq"' >> ~/.bashrc
   ```

2. **Función PowerShell**:
   ```powershell
   function Reset-ChatLimits {
       Invoke-RestMethod http://localhost:3000/api/dev/reset-limits | ConvertTo-Json
   }
   ```

3. **Package.json script**:
   ```json
   {
     "scripts": {
       "reset-limits": "curl http://localhost:3000/api/dev/reset-limits"
     }
   }
   ```
   Entonces: `npm run reset-limits`

---

¿Preguntas? Revisa el código en `app/api/dev/reset-limits/route.ts` o abre un issue.
