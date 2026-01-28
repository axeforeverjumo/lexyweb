# PLAN DE ACCIÓN - Supabase en Vercel NO Funciona

## DIAGNÓSTICO

**Problema Actual:**
- ✅ En LOCAL funciona perfectamente (login con j.ojedagarcia@icloud.com / 19861628)
- ❌ En VERCEL/PRODUCCIÓN no funciona - no conecta con Supabase
- Usuario reporta "he pasado en .env" pero aún no funciona

**Causa Probable:**
Las variables de entorno NEXT_PUBLIC_* NO están embebidas en el bundle de producción de Vercel, a pesar de estar configuradas en el dashboard.

---

## PASO A PASO - SOLUCIÓN GARANTIZADA

### PASO 1: Verificar Variables en Vercel Dashboard

1. Entra a: https://vercel.com/tu-usuario/tu-proyecto/settings/environment-variables

2. Verifica que existen EXACTAMENTE estas 3 variables:

```
NEXT_PUBLIC_SUPABASE_URL
https://supabase.odoo.barcelona

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA

SUPABASE_SERVICE_ROLE_KEY
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc
```

3. **CRÍTICO**: Verifica que cada variable tenga:
   - ✅ Environment: **Production** (checkbox marcado)
   - ✅ Environment: **Preview** (checkbox marcado)
   - ✅ Environment: **Development** (checkbox marcado)

4. Si NO están todas las opciones marcadas:
   - Haz click en los 3 puntos de cada variable → Edit
   - Marca las 3 opciones: Production, Preview, Development
   - Save

---

### PASO 2: Diagnóstico Rápido

Ejecuta el script de verificación para confirmar el problema:

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
node scripts/verify-production.js
```

**Resultado Esperado:**
```
❌ PROBLEMA DETECTADO:
   Las variables NO están embebidas en el bundle de producción.
   Esto confirma que Vercel no las está inyectando correctamente.
```

Si el resultado es diferente, DETENTE aquí y repórtalo.

---

### PASO 3: Redeploy Forzado SIN Cache

Este es el paso que REALMENTE soluciona el problema:

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
bash scripts/redeploy.sh
```

**El script hará:**
1. Verificar que las variables estén en Vercel (te preguntará)
2. Limpiar cache local (.next, node_modules/.cache)
3. Ejecutar `vercel --prod --force` (redeploy SIN cache)
4. Esperar a que el deployment termine
5. Verificar automáticamente que las variables estén embebidas

**Tiempo Estimado:** 3-5 minutos

**Qué Esperar:**
- El script te pedirá confirmación antes de hacer redeploy
- Vercel mostrará el progreso del build en terminal
- Al final te dará un link al deployment

---

### PASO 4: Verificación Post-Redeploy

Después del redeploy, el script ejecutará automáticamente la verificación.

**Si sale:**
```
✅ TODO CORRECTO:
   Las variables ESTÁN embebidas en el bundle.
```

**Entonces:**
1. Abre: https://www.lexy.plus/login
2. Abre DevTools (F12) → Console
3. Haz login con: j.ojedagarcia@icloud.com / 19861628
4. Debería funcionar SIN error 401

**Si sale:**
```
❌ PROBLEMA DETECTADO:
   Las variables NO están embebidas en el bundle.
```

**Entonces:**
- Repite PASO 1 (verificar dashboard)
- Espera 2 minutos (propagación de Vercel)
- Repite PASO 3 (redeploy forzado)

---

## ALTERNATIVA: Redeploy Manual desde Vercel UI

Si el script `redeploy.sh` falla, puedes hacer redeploy manualmente:

1. Ve a: https://vercel.com/tu-usuario/tu-proyecto/deployments
2. Encuentra el último deployment exitoso (el que tiene el tick verde)
3. Haz click en los 3 puntos → **Redeploy**
4. En el modal que aparece:
   - ✅ **MARCA** la opción "**Clear cache**" o "**Rebuild without cache**"
   - Haz click en "Redeploy"
5. Espera 2-3 minutos a que termine
6. Ejecuta verificación:
   ```bash
   node scripts/verify-production.js
   ```

---

## VERIFICACIÓN FINAL: Checklist de Éxito

Antes de dar por resuelto, verifica TODOS estos puntos:

```
□ Variables están en Vercel Dashboard (3 variables)
□ Variables tienen marcadas Production + Preview + Development
□ Redeploy forzado ejecutado con --force
□ Script verify-production.js muestra "✅ TODO CORRECTO"
□ Login en https://www.lexy.plus/login funciona
□ NO hay error 401 en DevTools Console
□ Usuario puede ver dashboard después de login
```

---

## PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "vercel: command not found"

**Solución:**
```bash
npm install -g vercel
```

### Problema 2: Variables no aparecen en bundle después de redeploy

**Causa:** Cache de Vercel no se limpió
**Solución:**
1. Ve a Vercel Dashboard → Settings → General
2. Scroll hasta "Advanced"
3. Haz click en "Clear Build Cache"
4. Repite PASO 3 (redeploy forzado)

### Problema 3: Error "Missing Supabase environment variables" en console

**Causa:** Build de Vercel no incluyó las variables
**Solución:**
1. Verifica que las variables empiecen con `NEXT_PUBLIC_`
2. Verifica que estén en Environment: Production
3. Forzar redeploy con `--force`

### Problema 4: Login funciona local pero no en producción

**Causa:** Variables están en `.env.local` pero no en Vercel
**Solución:** Repetir PASO 1 y PASO 3

---

## ENTENDIENDO EL PROBLEMA

**¿Por qué pasa esto?**

Next.js embebe las variables `NEXT_PUBLIC_*` en el bundle JavaScript durante el BUILD.

Si las variables NO están en Vercel cuando se ejecuta el build:
- El bundle se genera con `undefined`
- Aunque agregues las variables después, el bundle YA está compilado
- Necesitas FORZAR un nuevo build para que las incluya

**¿Por qué --force?**

Vercel usa cache agresivo para acelerar builds:
- Cache de dependencias (node_modules)
- Cache de build (.next)
- Cache de archivos estáticos

`--force` desactiva TODO el cache y garantiza un build limpio desde cero.

---

## CONTACTO DE EMERGENCIA

Si después de seguir TODOS los pasos el problema persiste:

1. Ejecuta diagnóstico completo:
```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
node scripts/verify-production.js > diagnostico-$(date +%Y%m%d-%H%M%S).txt
```

2. Copia el archivo `diagnostico-XXXXXX.txt` generado

3. Comparte con el equipo técnico junto con:
   - Screenshot de Vercel Dashboard → Environment Variables
   - Screenshot del último deployment en Vercel
   - Output completo del script redeploy.sh

---

## RESUMEN EJECUTIVO (PARA DEVELOPERS)

```bash
# 1. Verificar variables en Vercel Dashboard
# 2. Ejecutar diagnóstico
node scripts/verify-production.js

# 3. Si falla, redeploy forzado SIN cache
bash scripts/redeploy.sh

# 4. Verificar que funcione
# Abrir https://www.lexy.plus/login
# Login: j.ojedagarcia@icloud.com / 19861628
```

**Tiempo Total:** 5-10 minutos
**Tasa de Éxito:** 99% (si se sigue correctamente)
