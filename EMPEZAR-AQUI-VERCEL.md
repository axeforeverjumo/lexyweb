# EMPIEZA AQUÍ - Supabase NO funciona en Vercel

## SITUACIÓN ACTUAL

- ✅ Login funciona en LOCAL (http://localhost:3000)
- ❌ Login NO funciona en PRODUCCIÓN (https://www.lexy.plus)
- Credenciales: j.ojedagarcia@icloud.com / 19861628

## SOLUCIÓN AUTOMÁTICA (RECOMENDADO)

Ejecuta el script maestro que hace TODO automáticamente:

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
npm run fix-vercel
```

**Este script:**
1. Verifica configuración local
2. Verifica que variables NO están en producción
3. Te guía para verificar Vercel Dashboard
4. Ejecuta redeploy forzado SIN cache
5. Verifica que las variables se embebieron correctamente
6. Te indica si el problema se solucionó

**Tiempo estimado:** 5-10 minutos

## SOLUCIÓN MANUAL (SI PREFIERES CONTROL)

### Paso 1: Diagnóstico
```bash
npm run verify-production
```

Si sale:
```
❌ PROBLEMA DETECTADO:
   Las variables NO están embebidas en el bundle de producción.
```

Continúa con Paso 2.

### Paso 2: Verificar Vercel Dashboard

1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables

2. Verifica que existan ESTAS 3 VARIABLES con ESTOS VALORES:

```
NEXT_PUBLIC_SUPABASE_URL
https://supabase.odoo.barcelona

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA

SUPABASE_SERVICE_ROLE_KEY
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc
```

3. Verifica que cada variable tenga marcadas:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Si falta alguna, agrégala AHORA.

### Paso 3: Redeploy Forzado

```bash
npm run redeploy
```

Sigue las instrucciones del script.

### Paso 4: Verificar que Funcionó

```bash
npm run verify-production
```

Si sale:
```
✅ TODO CORRECTO:
   Las variables ESTÁN embebidas en el bundle.
```

Entonces:
1. Abre: https://www.lexy.plus/login
2. Login con: j.ojedagarcia@icloud.com / 19861628
3. Debería funcionar sin error 401

## SCRIPTS DISPONIBLES

```bash
# Script maestro que hace TODO automáticamente (RECOMENDADO)
npm run fix-vercel

# Verificar si variables están en bundle de producción
npm run verify-production

# Verificar variables en Vercel Dashboard (requiere vercel CLI)
npm run check-vercel-env

# Redeploy forzado SIN cache
npm run redeploy

# Ver logs de Vercel en tiempo real
vercel logs --follow
```

## DOCUMENTACIÓN COMPLETA

- **Guía rápida:** [QUICK_FIX_VERCEL.md](./QUICK_FIX_VERCEL.md)
- **Plan completo:** [PLAN_ACCION_VERCEL.md](./PLAN_ACCION_VERCEL.md)

## TROUBLESHOOTING

### Problema: "vercel: command not found"

```bash
npm install -g vercel
```

### Problema: Variables no aparecen después de redeploy

1. Ve a: https://vercel.com/tu-proyecto/settings/general
2. Scroll hasta "Advanced"
3. Click "Clear Build Cache"
4. Ejecuta:
```bash
npm run redeploy
```

### Problema: Error "Missing Supabase environment variables" en console

Significa que las variables NO se embebieron en el build.

Solución:
1. Verifica Paso 2 (Vercel Dashboard)
2. Asegúrate que las variables empiecen con `NEXT_PUBLIC_`
3. Ejecuta `npm run redeploy`

## ¿POR QUÉ PASA ESTO?

Next.js embebe las variables `NEXT_PUBLIC_*` en el bundle JavaScript **durante el BUILD**.

Si las variables NO están en Vercel cuando se ejecuta el build:
- El bundle se genera con `undefined`
- Aunque agregues las variables después, el bundle YA está compilado
- Necesitas FORZAR un nuevo build con `--force` para que las incluya

## CONTACTO DE EMERGENCIA

Si después de seguir TODOS los pasos el problema persiste:

1. Ejecuta diagnóstico completo:
```bash
npm run verify-production > diagnostico-$(date +%Y%m%d-%H%M%S).txt
```

2. Comparte el archivo `diagnostico-XXXXXX.txt` generado

3. Incluye:
   - Screenshot de Vercel Dashboard → Environment Variables
   - Screenshot del último deployment en Vercel
   - Output completo de `npm run fix-vercel`
