# SOLUCIÓN DEFINITIVA - Supabase en Vercel

## PROBLEMA

```
LOCAL:      ✅ Login funciona
PRODUCCIÓN: ❌ Login NO funciona
```

Credenciales: j.ojedagarcia@icloud.com / 19861628

---

## SOLUCIÓN EN 1 COMANDO

```bash
npm run fix-vercel
```

Sigue las instrucciones en pantalla. **Tiempo: 5-10 minutos**

---

## QUÉ HACE EL SISTEMA

### 1. DIAGNÓSTICO AUTOMÁTICO
- Verifica configuración local
- Verifica bundle de producción
- Detecta si variables están embebidas

### 2. VERIFICACIÓN GUIADA
- Te guía para verificar Vercel Dashboard
- Confirma que variables existan
- Confirma que tengan valores correctos

### 3. SOLUCIÓN AUTOMÁTICA
- Limpia cache local
- Ejecuta redeploy forzado SIN cache
- Verifica resultado automáticamente

### 4. CONFIRMACIÓN FINAL
- Reporta éxito o fallo
- Indica siguiente paso
- Proporciona troubleshooting si falla

---

## ALTERNATIVA: SOLUCIÓN MANUAL

### Paso 1: Diagnóstico

```bash
npm run verify-production
```

Si sale `❌ Variables NO ENCONTRADAS`, continúa.

### Paso 2: Verificar Vercel

1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables

2. Verifica estas 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Cada variable debe tener marcadas:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Paso 3: Redeploy

```bash
npm run redeploy
```

### Paso 4: Verificar

```bash
npm run verify-production
```

Si sale `✅ TODO CORRECTO`, prueba login en producción.

---

## SCRIPTS DISPONIBLES

| Comando | Propósito |
|---------|-----------|
| `npm run fix-vercel` | Script maestro automático ⭐ |
| `npm run verify-production` | Verifica bundle de producción |
| `npm run check-vercel-env` | Verifica Vercel Dashboard |
| `npm run redeploy` | Redeploy forzado SIN cache |
| `vercel logs --follow` | Ver logs en tiempo real |

---

## DOCUMENTACIÓN COMPLETA

| Documento | Para Quién | Contenido |
|-----------|-----------|-----------|
| [INDICE_VERCEL.md](./INDICE_VERCEL.md) | Navegación | Índice de toda la documentación |
| [EMPEZAR-AQUI-VERCEL.md](./EMPEZAR-AQUI-VERCEL.md) | Todos | Guía principal de entrada |
| [QUICK_FIX_VERCEL.md](./QUICK_FIX_VERCEL.md) | Usuarios con prisa | Solución en 3 comandos |
| [PLAN_ACCION_VERCEL.md](./PLAN_ACCION_VERCEL.md) | Usuarios curiosos | Plan completo paso a paso |
| [CHECKLIST_VERCEL.md](./CHECKLIST_VERCEL.md) | Usuarios organizados | Checklist interactivo |
| [scripts/SCRIPTS_VERCEL_README.md](./scripts/SCRIPTS_VERCEL_README.md) | Developers | Documentación técnica |
| [RESUMEN_SISTEMA_DIAGNOSTICO.md](./RESUMEN_SISTEMA_DIAGNOSTICO.md) | Referencia | Overview completo |

---

## ESTRUCTURA DE ARCHIVOS

```
lexyweb/
│
├── README_VERCEL_FIX.md            ← ESTE ARCHIVO (inicio rápido)
├── INDICE_VERCEL.md                 ← Índice de navegación
├── EMPEZAR-AQUI-VERCEL.md           ← Guía principal
├── QUICK_FIX_VERCEL.md              ← Solución rápida
├── PLAN_ACCION_VERCEL.md            ← Plan completo
├── CHECKLIST_VERCEL.md              ← Checklist
├── RESUMEN_SISTEMA_DIAGNOSTICO.md   ← Resumen técnico
│
├── package.json                     ← Scripts npm
│
└── scripts/
    ├── SCRIPTS_VERCEL_README.md     ← Doc de scripts
    ├── fix-vercel-supabase.sh       ← Script maestro ⭐
    ├── verify-production.js         ← Verificar producción
    ├── check-vercel-env.sh          ← Verificar Vercel
    └── redeploy.sh                  ← Redeploy forzado
```

---

## TROUBLESHOOTING RÁPIDO

### Problema: "vercel: command not found"

```bash
npm install -g vercel
```

### Problema: Variables no aparecen después de redeploy

1. Ve a: https://vercel.com/tu-proyecto/settings/general
2. Click "Clear Build Cache"
3. Ejecuta: `npm run redeploy`

### Problema: Error "Missing Supabase environment variables"

```bash
npm run check-vercel-env  # Verificar que estén en Vercel
npm run redeploy          # Redeploy forzado
```

---

## CHECKLIST DE ÉXITO

- [ ] `npm run verify-production` → "✅ TODO CORRECTO"
- [ ] Login funciona en https://www.lexy.plus/login
- [ ] NO hay error 401 en DevTools Console
- [ ] Acceso al dashboard exitoso
- [ ] Login funciona 3 veces consecutivas

**Si TODOS marcados:** 🎉 PROBLEMA RESUELTO

---

## EXPLICACIÓN TÉCNICA BREVE

### ¿Por qué pasa esto?

Next.js embebe las variables `NEXT_PUBLIC_*` en el bundle JavaScript **durante el BUILD**.

Si las variables NO están en Vercel cuando se ejecuta el build:
- El bundle se compila con `undefined`
- Agregar las variables DESPUÉS no sirve
- El bundle YA está compilado

### Solución

FORZAR nuevo build con `vercel --prod --force` para que las variables se embeben.

---

## CONTACTO DE EMERGENCIA

Si después de seguir TODO el problema persiste:

```bash
npm run verify-production > diagnostico-$(date +%Y%m%d-%H%M%S).txt
npm run check-vercel-env >> diagnostico-$(date +%Y%m%d-%H%M%S).txt
```

Comparte:
- Archivo `diagnostico-XXXXXX.txt`
- Screenshot de Vercel Environment Variables
- Screenshot del último deployment
- Output de `npm run fix-vercel`

---

## NAVEGACIÓN

- **Inicio:** Este archivo (README_VERCEL_FIX.md)
- **Índice:** [INDICE_VERCEL.md](./INDICE_VERCEL.md)
- **Guía Principal:** [EMPEZAR-AQUI-VERCEL.md](./EMPEZAR-AQUI-VERCEL.md)
- **Solución Rápida:** [QUICK_FIX_VERCEL.md](./QUICK_FIX_VERCEL.md)

---

**Creado:** 2026-01-27
**Versión:** 1.0
**Proyecto:** lexyweb - Lexy.plus
