# SOLUCIÓN RÁPIDA - Supabase NO Funciona en Vercel

## PROBLEMA
Login funciona en local pero NO en producción (Vercel).

## SOLUCIÓN EN 3 COMANDOS

```bash
# 1. Verificar que el problema son las variables
npm run verify-production

# 2. Si falla, redeploy forzado SIN cache
npm run redeploy

# 3. Probar login en producción
# https://www.lexy.plus/login
# Email: j.ojedagarcia@icloud.com
# Password: 19861628
```

## SI NO FUNCIONA

### Opción A: Verificar Variables en Vercel Dashboard

1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables

2. Verifica que existan ESTAS 3 VARIABLES:

```
NEXT_PUBLIC_SUPABASE_URL = https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ0eXAi...
SUPABASE_SERVICE_ROLE_KEY = eyJ0eXAi...
```

3. Verifica que cada una tenga marcadas:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Si falta alguna, agrégala y ejecuta:
```bash
npm run redeploy
```

### Opción B: Redeploy Manual desde Vercel UI

1. Ve a: https://vercel.com/tu-proyecto/deployments
2. Click en los 3 puntos del último deployment → Redeploy
3. ✅ **MARCA "Clear cache"**
4. Click "Redeploy"
5. Espera 3 minutos
6. Prueba login

### Opción C: Limpiar Cache de Vercel

1. Ve a: https://vercel.com/tu-proyecto/settings/general
2. Scroll hasta "Advanced"
3. Click "Clear Build Cache"
4. Ejecuta:
```bash
npm run redeploy
```

## EXPLICACIÓN RÁPIDA

Las variables `NEXT_PUBLIC_*` se embeben en el bundle JavaScript durante el BUILD.

Si las variables no están en Vercel cuando se hace el build:
- El bundle se compila con `undefined`
- Agregar las variables después NO sirve
- Necesitas FORZAR un nuevo build con `--force`

## COMANDOS ÚTILES

```bash
# Verificar si variables están en bundle de producción
npm run verify-production

# Verificar variables en Vercel Dashboard (requiere vercel CLI)
bash scripts/check-vercel-env.sh

# Redeploy forzado SIN cache
npm run redeploy

# Ver logs de Vercel en tiempo real
vercel logs --follow
```

## RESULTADO ESPERADO

Después del redeploy exitoso:

```
✅ SUPABASE_URL encontrada en bundle
✅ SUPABASE_ANON_KEY encontrada en bundle
✅ Login funciona en producción
```

## DOCUMENTACIÓN COMPLETA

Ver: [PLAN_ACCION_VERCEL.md](./PLAN_ACCION_VERCEL.md)
