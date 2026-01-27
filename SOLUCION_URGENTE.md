# SOLUCIÓN URGENTE: Error de Login en Producción

## ¿Qué Pasó?

Los usuarios no pueden hacer login ni registro en producción (lexy.plus).

**Error:** `TypeError: Failed to execute 'fetch' on 'Window': Invalid value`

## Causa

Las variables de entorno de Supabase NO están configuradas en Vercel.

## Solución Rápida (10 minutos)

### 1. Abre Vercel

1. Ve a: https://vercel.com/dashboard
2. Busca tu proyecto (probablemente se llama `lexyweb` o `lexy`)
3. Click en el proyecto
4. Ve a: **Settings** → **Environment Variables**

### 2. Agrega TODAS estas variables

**Abre el archivo con los valores reales:**

👉 **`VERCEL_ENV_VALUES.txt`** (archivo local, NO subido a Git)

Ese archivo contiene TODAS las variables con sus valores reales copiados de tu `.env.local`.

**IMPORTANTE:**
- Selecciona: **Production**, **Preview**, **Development** (las 3 opciones)
- NO agregues espacios antes o después de los valores
- Copia cada variable en un campo separado

### 3. Redesplegar

Opción A (Automático):
- Vercel redesplegará automáticamente en unos segundos

Opción B (Manual):
- Ve a la pestaña **Deployments**
- Click en el deployment más reciente
- Click en **Redeploy**

### 4. Verificar

Espera 2-3 minutos y luego:

1. Abre: https://lexy.plus/login
2. Intenta hacer login
3. Ya NO debe salir el error

## ¿Qué se Arregló en el Código?

### 1. Cliente de Supabase Mejorado
- Ahora valida que las variables existan
- Da mensajes de error claros si algo está mal
- Usa la librería más moderna de Supabase

### 2. Páginas Creadas
- `/privacidad` - Ahora existe (antes daba 404)
- `/terminos` - Ahora existe (antes daba 404)

### 3. Documentación
- `VERCEL_SETUP_CHECKLIST.md` - Guía detallada
- `DIAGNOSTICO_SUPABASE.md` - Análisis técnico completo
- `scripts/verify-env.js` - Script para verificar variables

## Herramientas Útiles

### Verificar Variables Localmente
```bash
npm run verify-env
```

Esto te dice qué variables faltan o están mal configuradas.

### Desplegar Cambios
```bash
git pull
npm run build
# Si el build funciona, hacer push
git push
```

## Si el Problema Persiste

1. **Verifica que el dominio Supabase funcione:**
   ```bash
   curl -I https://supabase.odoo.barcelona
   ```
   Debe retornar 200 OK

2. **Revisa logs en Vercel:**
   - Ve a tu proyecto en Vercel
   - Click en **Logs** o **Functions**
   - Busca errores relacionados con Supabase

3. **Verifica en el navegador:**
   - Abre https://lexy.plus/login
   - Abre DevTools (F12) → Console
   - Ejecuta:
     ```javascript
     console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
     ```
   - Debe mostrar: `https://supabase.odoo.barcelona`
   - Si muestra `undefined`, las variables NO se configuraron correctamente

4. **Webhook de Stripe (opcional, solo para pagos):**
   - El webhook actual es de prueba
   - Para producción, crea uno nuevo en Stripe Dashboard
   - URL: `https://lexy.plus/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.*`

## Archivos Importantes

- `VERCEL_SETUP_CHECKLIST.md` - Guía paso a paso detallada
- `DIAGNOSTICO_SUPABASE.md` - Análisis técnico completo
- `.env.example` - Plantilla de variables
- `lib/supabase/client.ts` - Cliente de Supabase mejorado

## Contacto

Si necesitas ayuda:
1. Revisa los logs en Vercel
2. Verifica que el dominio custom de Supabase funcione
3. Comprueba que las variables estén exactamente como se muestran arriba
