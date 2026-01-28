# Scripts de Diagnóstico y Solución - Vercel + Supabase

Esta carpeta contiene scripts para diagnosticar y solucionar el problema de variables de entorno de Supabase en Vercel.

## Scripts Principales

### 1. fix-vercel-supabase.sh (RECOMENDADO)

**Script maestro automático que ejecuta TODO el proceso.**

```bash
bash scripts/fix-vercel-supabase.sh
# o
npm run fix-vercel
```

**Qué hace:**
1. Verifica configuración local (.env.local)
2. Verifica que variables NO están en bundle de producción
3. Te guía para verificar Vercel Dashboard
4. Limpia cache local
5. Ejecuta redeploy forzado con `vercel --prod --force`
6. Espera propagación de Vercel
7. Verifica que variables se embebieron correctamente
8. Te indica si el problema se solucionó

**Cuándo usarlo:** SIEMPRE como primer recurso.

**Tiempo:** 5-10 minutos

---

### 2. verify-production.js

**Verifica si las variables de Supabase están embebidas en el bundle de producción.**

```bash
node scripts/verify-production.js
# o
npm run verify-production
```

**Qué hace:**
1. Descarga HTML de https://www.lexy.plus/login
2. Extrae todos los archivos JS del bundle
3. Busca en cada archivo:
   - `https://supabase.odoo.barcelona` (SUPABASE_URL)
   - La ANON_KEY completa
   - Error "Missing Supabase environment variables"
4. Reporta si las variables están o no embebidas

**Salida esperada (problema confirmado):**
```
❌ PROBLEMA DETECTADO:
   Las variables NO están embebidas en el bundle de producción.
   Esto confirma que Vercel no las está inyectando correctamente.
```

**Salida esperada (todo bien):**
```
✅ TODO CORRECTO:
   Las variables ESTÁN embebidas en el bundle.
```

**Cuándo usarlo:**
- Como diagnóstico inicial
- Después de cada redeploy para verificar que funcionó

**Exit Codes:**
- `0` = Variables encontradas (éxito)
- `1` = Variables NO encontradas (problema confirmado)

---

### 3. redeploy.sh

**Ejecuta redeploy forzado SIN cache en Vercel.**

```bash
bash scripts/redeploy.sh
# o
npm run redeploy
```

**Qué hace:**
1. Verifica estado de git (te pregunta si quieres commitear cambios)
2. Muestra las variables que deben estar en Vercel Dashboard
3. Te pide confirmación manual de que están configuradas
4. Limpia cache local (.next, node_modules/.cache)
5. Ejecuta `vercel --prod --force`
6. Espera a que confirmes que el deployment terminó
7. Ejecuta `verify-production.js` automáticamente

**Cuándo usarlo:**
- Después de agregar/modificar variables en Vercel Dashboard
- Cuando `verify-production.js` confirma que variables NO están

**Tiempo:** 3-5 minutos (mayoría es esperar el build de Vercel)

**IMPORTANTE:**
- Requiere Vercel CLI instalado: `npm install -g vercel`
- Requiere login en Vercel: `vercel login`

---

### 4. check-vercel-env.sh

**Verifica las variables directamente desde Vercel usando Vercel CLI.**

```bash
bash scripts/check-vercel-env.sh
# o
npm run check-vercel-env
```

**Qué hace:**
1. Verifica que Vercel CLI esté instalado
2. Usa `vercel env ls` para obtener lista de variables
3. Usa `vercel env pull` para obtener valores
4. Compara valores con los esperados
5. Reporta si cada variable está correcta, faltante o incorrecta

**Salida esperada (todo bien):**
```
✅ TODAS LAS VARIABLES CORRECTAS

Las variables están configuradas en Vercel.
```

**Salida esperada (problema):**
```
❌ PROBLEMA DETECTADO

Algunas variables están mal configuradas o faltantes.
```

**Cuándo usarlo:**
- Para verificar que las variables están en Vercel Dashboard
- Antes de hacer redeploy
- Como doble verificación de que las variables existen

**Requisitos:**
- Vercel CLI instalado: `npm install -g vercel`
- Login en Vercel: `vercel login`

**Exit Codes:**
- `0` = Todas las variables correctas
- `1` = Alguna variable faltante o incorrecta

---

## Flujo de Trabajo Recomendado

### Caso 1: Primera vez que detectas el problema

```bash
# 1. Script maestro (hace TODO automáticamente)
npm run fix-vercel
```

Si el script maestro falla o quieres más control:

```bash
# 2. Diagnóstico manual
npm run verify-production

# 3. Si confirma problema, redeploy
npm run redeploy

# 4. Verificar que funcionó
npm run verify-production
```

### Caso 2: Acabas de agregar/modificar variables en Vercel

```bash
# 1. Verificar que variables están en Vercel
npm run check-vercel-env

# 2. Si están correctas, redeploy
npm run redeploy

# 3. Verificar que se embebieron
npm run verify-production
```

### Caso 3: Quieres verificar estado actual de producción

```bash
# Solo verificar bundle de producción
npm run verify-production
```

---

## Comandos Útiles Adicionales

```bash
# Ver logs de Vercel en tiempo real
vercel logs --follow

# Ver último deployment
vercel ls

# Ver variables de entorno (requiere estar en el proyecto)
vercel env ls production

# Limpiar cache de build en Vercel (desde dashboard)
# Settings → General → Advanced → Clear Build Cache
```

---

## Troubleshooting

### Error: "vercel: command not found"

```bash
npm install -g vercel
```

### Error: "You need to log in to Vercel"

```bash
vercel login
```

### Script se queda esperando en "Esperando a que termine el build"

1. Ve a: https://vercel.com/tu-proyecto/deployments
2. Verifica estado del último deployment
3. Si está en "Building", espera
4. Si está en "Ready", presiona Enter en el script
5. Si está en "Error", revisa los logs

### verify-production.js falla con error de red

Posibles causas:
1. https://www.lexy.plus está caído (poco probable)
2. Firewall bloqueando requests
3. Problema temporal de red

Solución:
- Espera 1 minuto y vuelve a ejecutar
- Verifica que puedas abrir https://www.lexy.plus en el navegador

### Variables están en Vercel pero verify-production dice que NO

Esto significa que el BUILD no incluyó las variables.

Solución:
1. Ve a Vercel Dashboard → Settings → General
2. Scroll hasta "Advanced"
3. Click "Clear Build Cache"
4. Ejecuta `npm run redeploy`

---

## Explicación Técnica

### ¿Por qué --force?

Vercel usa cache agresivo para acelerar builds:
- Cache de dependencias (node_modules)
- Cache de build (.next)
- Cache de archivos estáticos

`--force` desactiva TODO el cache y garantiza un build limpio desde cero.

### ¿Por qué las variables se embeben durante el build?

Next.js reemplaza `process.env.NEXT_PUBLIC_*` con sus valores literales durante el build (webpack define plugin).

Ejemplo:
```typescript
// Antes del build (código fuente)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Después del build (bundle)
const url = "https://supabase.odoo.barcelona";
```

Si la variable NO existe durante el build:
```typescript
// Bundle
const url = undefined;
```

Por eso agregar las variables DESPUÉS del build no sirve.

---

## Archivos Relacionados

- [EMPEZAR-AQUI-VERCEL.md](../EMPEZAR-AQUI-VERCEL.md) - Guía rápida de inicio
- [QUICK_FIX_VERCEL.md](../QUICK_FIX_VERCEL.md) - Solución en 3 comandos
- [PLAN_ACCION_VERCEL.md](../PLAN_ACCION_VERCEL.md) - Plan completo paso a paso
