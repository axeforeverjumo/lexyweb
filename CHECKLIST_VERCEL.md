# CHECKLIST - Supabase en Vercel

## PROBLEMA

```
✅ Login funciona en LOCAL
❌ Login NO funciona en PRODUCCIÓN (Vercel)
```

---

## SOLUCIÓN RÁPIDA

### Opción A: Script Automático (RECOMENDADO)

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
npm run fix-vercel
```

Sigue las instrucciones del script. Tiempo: 5-10 minutos.

---

### Opción B: Manual (Control Total)

#### PASO 1: Diagnóstico

```bash
npm run verify-production
```

**¿Qué resultado obtuviste?**

- [ ] ✅ Variables ESTÁN en producción → El problema es otro (CORS, red, etc.)
- [ ] ❌ Variables NO ESTÁN en producción → Continúa con PASO 2

---

#### PASO 2: Verificar Vercel Dashboard

1. [ ] Abre: https://vercel.com/tu-proyecto/settings/environment-variables

2. [ ] Verifica que existan ESTAS 3 VARIABLES:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

3. [ ] Verifica que cada variable tenga ESTOS VALORES:

```
NEXT_PUBLIC_SUPABASE_URL:
https://supabase.odoo.barcelona

NEXT_PUBLIC_SUPABASE_ANON_KEY:
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA

SUPABASE_SERVICE_ROLE_KEY:
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc
```

4. [ ] Verifica que cada variable tenga marcadas:
   - [ ] Production
   - [ ] Preview
   - [ ] Development

5. [ ] Si falta alguna o está incorrecta:
   - [ ] Agrégala/corrígela AHORA
   - [ ] Asegúrate de marcar las 3 opciones

---

#### PASO 3: Redeploy Forzado

```bash
npm run redeploy
```

**Checklist interno del script:**

- [ ] Confirmas que variables están en Vercel Dashboard
- [ ] Script limpia cache local
- [ ] Script ejecuta `vercel --prod --force`
- [ ] Esperas a que deployment termine (2-3 min)
- [ ] Script verifica automáticamente el resultado

---

#### PASO 4: Verificación Final

```bash
npm run verify-production
```

**¿Qué resultado obtuviste?**

- [ ] ✅ Variables ESTÁN en producción → Continúa con PASO 5
- [ ] ❌ Variables NO ESTÁN en producción → Ver "TROUBLESHOOTING"

---

#### PASO 5: Probar Login

1. [ ] Abre: https://www.lexy.plus/login

2. [ ] Abre DevTools (F12) → Console

3. [ ] Haz login con:
   - Email: j.ojedagarcia@icloud.com
   - Password: 19861628

4. [ ] Verifica resultado:
   - [ ] ✅ Login exitoso, acceso a dashboard → PROBLEMA RESUELTO
   - [ ] ❌ Error 401 → Ver "TROUBLESHOOTING"
   - [ ] ❌ Otro error → Ver "TROUBLESHOOTING"

---

## TROUBLESHOOTING

### Problema: Variables NO están en producción después de redeploy

**Checklist de solución:**

1. [ ] Ve a: https://vercel.com/tu-proyecto/settings/general
2. [ ] Scroll hasta "Advanced"
3. [ ] Click "Clear Build Cache"
4. [ ] Ejecuta: `npm run redeploy`
5. [ ] Ejecuta: `npm run verify-production`

---

### Problema: "vercel: command not found"

```bash
npm install -g vercel
```

---

### Problema: Variables están en Vercel pero NO en bundle

**Posibles causas:**

1. [ ] Variables no empiezan con `NEXT_PUBLIC_` (las públicas)
2. [ ] Variables no tienen marcado "Production"
3. [ ] Cache de Vercel no se limpió

**Solución:**

1. [ ] Verifica PASO 2 completo
2. [ ] Limpia cache de Vercel (ver arriba)
3. [ ] Ejecuta: `npm run redeploy`

---

### Problema: Login sigue fallando después de TODO

**Checklist de diagnóstico avanzado:**

1. [ ] Variables están en Vercel Dashboard
2. [ ] Variables tienen valores correctos
3. [ ] Variables tienen marcadas Production + Preview + Development
4. [ ] `npm run verify-production` muestra "✅ TODO CORRECTO"
5. [ ] Login en LOCAL funciona
6. [ ] Login en PRODUCCIÓN NO funciona

**Si TODOS los checkboxes están marcados:**

El problema NO son las variables. Posibles causas alternativas:

- [ ] CORS bloqueado por Supabase
- [ ] Firewall/Red bloqueando requests
- [ ] Configuración de Supabase incorrecta
- [ ] Usuario no existe en base de datos de producción

**Siguiente paso:**

```bash
vercel logs --follow
```

Haz login en producción y observa los logs en tiempo real.

---

## VERIFICACIÓN FINAL DE ÉXITO

**Marca TODOS estos checkboxes para confirmar que el problema está resuelto:**

- [ ] `npm run verify-production` muestra "✅ TODO CORRECTO"
- [ ] Puedes abrir https://www.lexy.plus/login sin errores
- [ ] Puedes hacer login con j.ojedagarcia@icloud.com / 19861628
- [ ] NO hay error 401 en DevTools Console
- [ ] Puedes acceder al dashboard después de login
- [ ] El login funciona consistentemente (prueba 3 veces)

**Si TODOS están marcados:** 🎉 PROBLEMA RESUELTO

---

## COMANDOS DE REFERENCIA

```bash
# Script maestro (recomendado)
npm run fix-vercel

# Verificar bundle de producción
npm run verify-production

# Verificar variables en Vercel
npm run check-vercel-env

# Redeploy forzado SIN cache
npm run redeploy

# Ver logs de Vercel
vercel logs --follow
```

---

## DOCUMENTACIÓN COMPLETA

- **Inicio rápido:** [EMPEZAR-AQUI-VERCEL.md](./EMPEZAR-AQUI-VERCEL.md)
- **Guía corta:** [QUICK_FIX_VERCEL.md](./QUICK_FIX_VERCEL.md)
- **Plan completo:** [PLAN_ACCION_VERCEL.md](./PLAN_ACCION_VERCEL.md)
- **Scripts:** [scripts/SCRIPTS_VERCEL_README.md](./scripts/SCRIPTS_VERCEL_README.md)
