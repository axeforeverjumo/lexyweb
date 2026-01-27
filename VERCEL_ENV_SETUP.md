# Configuración de Variables de Entorno en Vercel

## PROBLEMA IDENTIFICADO

El error `TypeError: Failed to execute 'fetch' on 'Window': Invalid value` ocurre porque las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` no están disponibles en el cliente de producción.

## CAUSA RAÍZ

Las variables de entorno con prefijo `NEXT_PUBLIC_` en Next.js se **embeben en tiempo de build**, no en runtime. Esto significa que:

1. Si las variables no están presentes cuando Vercel ejecuta `npm run build`, el bundle resultante tendrá `undefined` hardcodeado
2. Añadir las variables DESPUÉS del build no tiene efecto
3. Necesitas **redeploy** después de configurar las variables

## SOLUCIÓN: Configurar Variables en Vercel

### Paso 1: Acceder a la configuración del proyecto

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona el proyecto `lexyweb`
3. Ve a **Settings** → **Environment Variables**

### Paso 2: Añadir las variables requeridas

Añade estas **3 variables** exactamente como aparecen aquí:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://supabase.odoo.barcelona
Environments: ✓ Production ✓ Preview ✓ Development
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA
Environments: ✓ Production ✓ Preview ✓ Development
```

```
SUPABASE_SERVICE_ROLE_KEY
Value: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc
Environments: ✓ Production ✓ Preview ✓ Development
```

### Paso 3: CRÍTICO - Redeploy

**Después de añadir las variables, DEBES hacer un redeploy:**

```bash
git commit --allow-empty -m "fix: trigger redeploy with env vars configured"
git push
```

### Paso 4: Verificación

Abre https://www.lexy.plus/login en el navegador con DevTools abierto (F12).

**Consola sin errores = Éxito ✅**

## DEBUGGING

Si sigue sin funcionar después del redeploy:

1. **Verificar variables en el build de Vercel**
   - Ve al deployment en Vercel
   - Busca en el log: "Environments: .env.local"
   - Debe listar tus variables

2. **Probar localmente**
   ```bash
   npm run build
   npm start
   # http://localhost:3000/login
   ```

3. **Inspeccionar bundle de producción**
   - DevTools → Sources
   - Busca "NEXT_PUBLIC_SUPABASE_URL"
   - Si ves la URL → OK
   - Si ves undefined → variables NO están en el build
