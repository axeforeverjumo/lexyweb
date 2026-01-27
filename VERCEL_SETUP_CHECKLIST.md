# Checklist de Configuración de Vercel para Lexy

## Problema Diagnosticado

**Error:** `TypeError: Failed to execute 'fetch' on 'Window': Invalid value`

**Causa:** Las variables de entorno de Supabase NO están configuradas en Vercel, lo que causa que el cliente de Supabase reciba valores `undefined` y falle al intentar conectarse.

## Solución Implementada

1. Actualizado `lib/supabase/client.ts` para:
   - Usar `createBrowserClient` de `@supabase/ssr` (más moderno y robusto)
   - Validar que las variables de entorno existan
   - Validar que la URL de Supabase sea válida
   - Proporcionar mensajes de error claros

2. Creadas páginas legales faltantes:
   - `/privacidad` - Política de privacidad
   - `/terminos` - Términos y condiciones

3. Actualizado `.env.example` con documentación clara

## Variables de Entorno Requeridas en Vercel

### Paso 1: Acceder a la Configuración
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `lexyweb`
3. Ve a **Settings** → **Environment Variables**

### Paso 2: Configurar Variables de Supabase (CRÍTICO)

Estas son las variables más importantes. Sin ellas, el login/registro NO funcionará:

**IMPORTANTE:** Los valores reales están en el archivo `VERCEL_ENV_VALUES.txt` (local, NO subido a Git).

```bash
# URL de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona

# Anon Key (clave pública de Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ver_VERCEL_ENV_VALUES.txt>

# Service Role Key (clave privada - solo backend)
SUPABASE_SERVICE_ROLE_KEY=<ver_VERCEL_ENV_VALUES.txt>
```

**IMPORTANTE:**
- Las variables con `NEXT_PUBLIC_` son visibles en el navegador (necesario para cliente)
- Copia y pega EXACTAMENTE como aparecen arriba
- Verifica que no haya espacios al inicio o final

### Paso 3: Configurar Variables de IA

```bash
# Gemini AI
GEMINI_API_KEY=<ver_VERCEL_ENV_VALUES.txt>

# Claude AI
ANTHROPIC_API_KEY=<ver_VERCEL_ENV_VALUES.txt>
```

### Paso 4: Configurar Variables de Stripe

```bash
# Claves públicas
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<ver_VERCEL_ENV_VALUES.txt>

# Claves privadas
STRIPE_SECRET_KEY=<ver_VERCEL_ENV_VALUES.txt>

# Webhook (configura uno nuevo para producción en Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_PRODUCTION_KEY_HERE

# Price IDs
STRIPE_PRICE_ID_PRO=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_PRICE_ID_TEAM=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_PRICE_ID_BUSINESS=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_PRICE_ID_ENTERPRISE=<ver_VERCEL_ENV_VALUES.txt>
```

**NOTA sobre Stripe Webhook:**
- El valor actual `whsec_PLACEHOLDER_USE_STRIPE_CLI` es solo para desarrollo
- Para producción, necesitas crear un webhook en [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
- Endpoint: `https://lexy.plus/api/stripe/webhook`
- Eventos necesarios: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### Paso 5: Configurar Variables de App

```bash
# URL de producción
NEXT_PUBLIC_APP_URL=https://lexy.plus

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=s5r9o1yx
NEXT_PUBLIC_SANITY_DATASET=production
```

## Verificación Post-Despliegue

Después de configurar las variables:

### 1. Redesplegar
```bash
# Vercel redesplegará automáticamente, o puedes forzarlo con:
vercel --prod
```

### 2. Verificar en Consola del Navegador
1. Abre `https://lexy.plus/login`
2. Abre DevTools (F12) → Console
3. Escribe:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
   ```
4. Deberías ver:
   ```
   https://supabase.odoo.barcelona
   eyJ0eXAiOiJKV1QiLCJhbGc...
   ```

### 3. Probar Login
1. Ve a `https://lexy.plus/login`
2. Intenta iniciar sesión con credenciales válidas
3. NO debería aparecer el error de "Invalid value"

### 4. Probar Registro
1. Ve a `https://lexy.plus/register`
2. Intenta crear una cuenta nueva
3. Verifica que los links de términos y privacidad funcionan (ahora existen)

## Errores Comunes

### Error: "Invalid value" persiste
**Causa:** Variables no configuradas o mal copiadas
**Solución:**
1. Verifica en Vercel que las variables existan
2. Comprueba que no tengan espacios al inicio/final
3. Redesplega el proyecto

### Error: "Missing environment variables"
**Causa:** Falta alguna variable requerida
**Solución:** El error te dirá cuál falta. Agrégala en Vercel.

### Error: Variables no se actualizan
**Causa:** Cambios en variables requieren redespliegue
**Solución:** Ve a Deployments → Redeploy

## Seguridad

- Las claves que ves arriba son de desarrollo/prueba
- Para producción, considera rotar las keys de Supabase
- NUNCA expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente
- Las variables `NEXT_PUBLIC_*` son visibles en el navegador (es normal)

## Soporte

Si después de seguir estos pasos sigues teniendo problemas:

1. Verifica logs en Vercel → tu proyecto → Logs
2. Comprueba que el dominio `supabase.odoo.barcelona` esté accesible
3. Verifica configuración de CORS en Supabase
4. Revisa que la base de datos de Supabase esté activa

## Cambios en el Código

### Archivos Modificados
- `/lib/supabase/client.ts` - Cliente robusto con validación
- `/.env.example` - Documentación actualizada

### Archivos Creados
- `/app/(legal)/privacidad/page.tsx` - Política de privacidad
- `/app/(legal)/terminos/page.tsx` - Términos y condiciones
- `/VERCEL_SETUP_CHECKLIST.md` - Este documento
