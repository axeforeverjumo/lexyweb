# SISTEMA DE DIAGNÓSTICO Y SOLUCIÓN - RESUMEN COMPLETO

## PROBLEMA IDENTIFICADO

**Situación:**
- ✅ Login funciona en LOCAL (http://localhost:3000)
- ❌ Login NO funciona en PRODUCCIÓN (https://www.lexy.plus)
- Usuario: j.ojedagarcia@icloud.com / Password: 19861628

**Causa Raíz:**
Las variables de entorno `NEXT_PUBLIC_*` NO se embeben en el bundle de producción porque Vercel no las tiene disponibles durante el BUILD, o el cache está impidiendo que se actualicen.

---

## SOLUCIÓN CREADA

Se ha creado un sistema completo de diagnóstico y solución automatizado con 4 scripts principales y 5 documentos de guía.

---

## ESTRUCTURA DE ARCHIVOS

```
lexyweb/
│
├── EMPEZAR-AQUI-VERCEL.md          ← EMPIEZA AQUÍ (guía principal)
├── QUICK_FIX_VERCEL.md              ← Solución en 3 comandos
├── PLAN_ACCION_VERCEL.md            ← Plan completo paso a paso
├── CHECKLIST_VERCEL.md              ← Checklist visual interactivo
├── RESUMEN_SISTEMA_DIAGNOSTICO.md   ← Este archivo
│
├── package.json                     ← Scripts npm configurados
│
└── scripts/
    ├── SCRIPTS_VERCEL_README.md     ← Documentación de scripts
    ├── fix-vercel-supabase.sh       ← Script maestro automático ⭐
    ├── verify-production.js         ← Verifica bundle de producción
    ├── check-vercel-env.sh          ← Verifica Vercel Dashboard
    └── redeploy.sh                  ← Redeploy forzado SIN cache
```

---

## SCRIPTS CREADOS

### 1. fix-vercel-supabase.sh ⭐ (RECOMENDADO)

**Script maestro que ejecuta TODO el proceso automáticamente.**

```bash
npm run fix-vercel
```

**Qué hace:**
1. ✅ Verifica configuración local (.env.local)
2. ✅ Verifica que variables NO están en producción
3. ✅ Guía verificación de Vercel Dashboard
4. ✅ Limpia cache local
5. ✅ Ejecuta redeploy forzado con `--force`
6. ✅ Espera propagación (30s)
7. ✅ Verifica resultado automáticamente
8. ✅ Reporta éxito o fallo con instrucciones

**Tiempo:** 5-10 minutos
**Nivel:** Principiante-friendly

---

### 2. verify-production.js

**Verifica si variables están embebidas en bundle de producción.**

```bash
npm run verify-production
```

**Qué hace:**
1. Descarga HTML de https://www.lexy.plus/login
2. Extrae todos los archivos JS del bundle
3. Busca en cada archivo:
   - `https://supabase.odoo.barcelona`
   - ANON_KEY completa
   - Error "Missing Supabase"
4. Reporta si variables están embebidas o no

**Salida:**
```
✅ SUPABASE_URL encontrada
✅ SUPABASE_ANON_KEY encontrada
✅ TODO CORRECTO
```

o

```
❌ Variables NO ENCONTRADAS
👉 Ejecuta: npm run redeploy
```

**Uso:**
- Diagnóstico inicial
- Verificación post-redeploy

---

### 3. check-vercel-env.sh

**Verifica variables directamente en Vercel Dashboard usando CLI.**

```bash
npm run check-vercel-env
```

**Qué hace:**
1. Usa `vercel env ls` y `vercel env pull`
2. Compara con valores esperados
3. Reporta si cada variable está correcta, faltante o incorrecta

**Requiere:**
- Vercel CLI: `npm install -g vercel`
- Login: `vercel login`

---

### 4. redeploy.sh

**Ejecuta redeploy forzado SIN cache.**

```bash
npm run redeploy
```

**Qué hace:**
1. Verifica git status (opción de commit)
2. Confirma que variables están en Vercel
3. Limpia cache local
4. Ejecuta `vercel --prod --force`
5. Espera confirmación de deployment
6. Ejecuta `verify-production.js` automáticamente

**Tiempo:** 3-5 minutos

---

## DOCUMENTOS DE GUÍA

### 1. EMPEZAR-AQUI-VERCEL.md

**Guía principal de entrada.**

Contiene:
- Solución automática (1 comando)
- Solución manual (4 pasos)
- Scripts disponibles
- Troubleshooting
- Explicación técnica

**Para quién:** Todos los usuarios

---

### 2. QUICK_FIX_VERCEL.md

**Guía ultra rápida en 3 comandos.**

Contiene:
- Solución en 3 comandos
- 3 opciones si no funciona
- Comandos útiles
- Explicación breve

**Para quién:** Usuarios con prisa o experiencia

---

### 3. PLAN_ACCION_VERCEL.md

**Plan completo paso a paso con explicaciones detalladas.**

Contiene:
- Diagnóstico del problema
- Paso a paso con 6 fases
- Alternativa de redeploy manual
- Checklist de éxito
- Problemas comunes y soluciones
- Explicación técnica profunda
- Contacto de emergencia

**Para quién:** Usuarios que quieren entender TODO

---

### 4. CHECKLIST_VERCEL.md

**Checklist visual interactivo con checkboxes.**

Contiene:
- Checklist paso a paso con [ ]
- Opción A: Script automático
- Opción B: Manual con checkboxes
- Troubleshooting con checklists
- Verificación final de éxito

**Para quién:** Usuarios que prefieren seguir listas

---

### 5. scripts/SCRIPTS_VERCEL_README.md

**Documentación completa de todos los scripts.**

Contiene:
- Descripción detallada de cada script
- Qué hace cada uno
- Cuándo usarlo
- Salidas esperadas
- Exit codes
- Flujo de trabajo recomendado
- Comandos útiles
- Troubleshooting
- Explicación técnica

**Para quién:** Developers y técnicos

---

## FLUJO DE TRABAJO RECOMENDADO

### Para Usuarios Normales

```bash
# 1. Ejecuta el script maestro
npm run fix-vercel

# 2. Sigue las instrucciones en pantalla

# 3. Prueba login en:
# https://www.lexy.plus/login
```

**Tiempo:** 5-10 minutos

---

### Para Usuarios Técnicos

```bash
# 1. Diagnóstico
npm run verify-production

# 2. Si confirma problema, redeploy
npm run redeploy

# 3. Verificar resultado
npm run verify-production

# 4. Probar login
# https://www.lexy.plus/login
```

**Tiempo:** 5-7 minutos

---

### Para Desarrolladores

```bash
# 1. Verificar local
cat .env.local | grep NEXT_PUBLIC_SUPABASE

# 2. Verificar Vercel
npm run check-vercel-env

# 3. Verificar producción
npm run verify-production

# 4. Si falla, redeploy forzado
npm run redeploy

# 5. Ver logs
vercel logs --follow
```

**Tiempo:** 10-15 minutos (análisis completo)

---

## COMANDOS NPM CONFIGURADOS

Todos los scripts están registrados en `package.json`:

```json
{
  "scripts": {
    "fix-vercel": "bash scripts/fix-vercel-supabase.sh",
    "verify-production": "node scripts/verify-production.js",
    "check-vercel-env": "bash scripts/check-vercel-env.sh",
    "redeploy": "bash scripts/redeploy.sh"
  }
}
```

---

## EXPLICACIÓN TÉCNICA

### ¿Por qué pasa esto?

Next.js embebe las variables `NEXT_PUBLIC_*` en el bundle JavaScript durante el BUILD usando webpack define plugin.

**Ejemplo:**

```typescript
// Código fuente
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Bundle (si variable existe)
const url = "https://supabase.odoo.barcelona";

// Bundle (si variable NO existe)
const url = undefined;
```

Si las variables NO están en Vercel cuando se ejecuta el build:
- El bundle se compila con `undefined`
- Agregar las variables DESPUÉS no sirve
- El bundle YA está compilado

**Solución:** FORZAR nuevo build con `vercel --prod --force`

---

### ¿Por qué --force?

Vercel usa cache agresivo:
- Cache de dependencias (node_modules)
- Cache de build (.next)
- Cache de archivos estáticos

`--force` desactiva TODO el cache y garantiza build limpio desde cero.

---

### ¿Cómo verify-production.js funciona?

1. Descarga HTML de https://www.lexy.plus/login
2. Parsea HTML buscando `<script src="...">` tags
3. Descarga cada archivo JS del bundle
4. Busca strings literales:
   - `https://supabase.odoo.barcelona`
   - JWT completo de ANON_KEY
5. Si encuentra ambos → Variables embebidas ✅
6. Si NO encuentra → Variables NO embebidas ❌

---

## TROUBLESHOOTING COMÚN

### "vercel: command not found"

```bash
npm install -g vercel
```

---

### Variables no aparecen después de redeploy

**Causa:** Cache de Vercel no se limpió

**Solución:**
1. Ve a: https://vercel.com/tu-proyecto/settings/general
2. Scroll hasta "Advanced"
3. Click "Clear Build Cache"
4. Ejecuta: `npm run redeploy`

---

### Error "Missing Supabase environment variables" en console

**Causa:** Variables NO embebidas en build

**Solución:**
1. Verifica variables en Vercel Dashboard
2. Asegúrate que empiecen con `NEXT_PUBLIC_`
3. Asegúrate que tengan marcado "Production"
4. Ejecuta: `npm run redeploy`

---

### Login funciona local pero no producción

**Verificación:**

```bash
# 1. Variables locales correctas
cat .env.local | grep NEXT_PUBLIC_SUPABASE

# 2. Variables en Vercel correctas
npm run check-vercel-env

# 3. Variables en bundle correctas
npm run verify-production
```

Si TODOS son correctos pero login falla:
- El problema NO son las variables
- Posible CORS, red, o configuración Supabase
- Ejecuta: `vercel logs --follow` mientras haces login

---

## CHECKLIST DE ÉXITO FINAL

Marca TODOS estos checkboxes:

- [ ] `npm run verify-production` muestra "✅ TODO CORRECTO"
- [ ] Puedes abrir https://www.lexy.plus/login
- [ ] Puedes hacer login con j.ojedagarcia@icloud.com / 19861628
- [ ] NO hay error 401 en DevTools Console
- [ ] Accedes al dashboard después de login
- [ ] Login funciona 3 veces seguidas (consistencia)

**Si TODOS marcados:** 🎉 PROBLEMA RESUELTO

---

## CONTACTO DE EMERGENCIA

Si después de seguir TODO el sistema el problema persiste:

1. Ejecuta diagnóstico completo:

```bash
npm run verify-production > diagnostico-$(date +%Y%m%d-%H%M%S).txt
npm run check-vercel-env >> diagnostico-$(date +%Y%m%d-%H%M%S).txt
vercel env ls production >> diagnostico-$(date +%Y%m%d-%H%M%S).txt
```

2. Comparte el archivo `diagnostico-XXXXXX.txt`

3. Incluye:
   - Screenshot de Vercel Dashboard → Environment Variables
   - Screenshot del último deployment en Vercel
   - Output completo de `npm run fix-vercel`
   - Logs de console del navegador (F12)

---

## RECURSOS

- **Script maestro:** `npm run fix-vercel`
- **Verificación:** `npm run verify-production`
- **Redeploy:** `npm run redeploy`
- **Logs:** `vercel logs --follow`

**Documentación:**
- [EMPEZAR-AQUI-VERCEL.md](./EMPEZAR-AQUI-VERCEL.md)
- [QUICK_FIX_VERCEL.md](./QUICK_FIX_VERCEL.md)
- [PLAN_ACCION_VERCEL.md](./PLAN_ACCION_VERCEL.md)
- [CHECKLIST_VERCEL.md](./CHECKLIST_VERCEL.md)
- [scripts/SCRIPTS_VERCEL_README.md](./scripts/SCRIPTS_VERCEL_README.md)
