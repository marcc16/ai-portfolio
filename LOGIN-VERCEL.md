# 🔐 Login en Vercel CLI - Instrucciones

## Por favor, ejecuta estos comandos en tu terminal:

### 1. Abre una NUEVA terminal (CMD, PowerShell, o WSL)

### 2. Navega al directorio del proyecto:
```bash
cd /mnt/c/Users/Marcc16/Desktop/aiportfoilio
# O en Windows: cd C:\Users\Marcc16\Desktop\aiportfoilio
```

### 3. Ejecuta el comando de login:
```bash
vercel login
```

### 4. Selecciona tu método de autenticación:
- **Recomendado:** "Continue with GitHub" (ya que conectaste Vercel con GitHub)
- Presiona ENTER

### 5. Se abrirá tu navegador:
- Confirma la autenticación
- Autoriza Vercel CLI

### 6. Verás un mensaje de éxito:
```
> Success! GitHub authentication complete for ...
```

### 7. Verifica que estás logueado:
```bash
vercel whoami
```

Deberías ver tu nombre de usuario de Vercel (marcc16).

### 8. Lista tus proyectos:
```bash
vercel list
```

Deberías ver tu proyecto del portfolio en la lista.

---

## Después del login, avísame y continuaremos con los logs

Una vez que hayas completado el login exitosamente, dime "listo" o "completado" y continuaremos revisando los logs de tu deployment.
