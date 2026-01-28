# ÍNDICE RÁPIDO - Documentación de Solución Vercel + Supabase

## SITUACIÓN

Login funciona en LOCAL pero NO en PRODUCCIÓN (Vercel).

---

## SOLUCIÓN MÁS RÁPIDA

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
npm run fix-vercel
```

Sigue las instrucciones. Tiempo: 5-10 minutos.

---

## DOCUMENTACIÓN

### Para Usuarios Nuevos

**1. [EMPEZAR-AQUI-VERCEL.md](./EMPEZAR-AQUI-VERCEL.md)**
- Punto de entrada principal
- Solución automática + manual
- Troubleshooting completo
- Para: TODOS los usuarios

### Para Usuarios con Prisa

**2. [QUICK_FIX_VERCEL.md](./QUICK_FIX_VERCEL.md)**
- Solución en 3 comandos
- Sin explicaciones largas
- Para: Usuarios con experiencia

### Para Usuarios que Quieren Entender

**3. [PLAN_ACCION_VERCEL.md](./PLAN_ACCION_VERCEL.md)**
- Plan completo paso a paso
- Explicaciones detalladas
- 6 pasos con contexto
- Para: Usuarios curiosos

### Para Usuarios que Siguen Listas

**4. [CHECKLIST_VERCEL.md](./CHECKLIST_VERCEL.md)**
- Checklist interactivo con [ ]
- Paso a paso con verificación
- Para: Usuarios organizados

### Para Desarrolladores

**5. [scripts/SCRIPTS_VERCEL_README.md](./scripts/SCRIPTS_VERCEL_README.md)**
- Documentación técnica de scripts
- Exit codes
- Flujos de trabajo
- Para: Developers

### Resumen del Sistema

**6. [RESUMEN_SISTEMA_DIAGNOSTICO.md](./RESUMEN_SISTEMA_DIAGNOSTICO.md)**
- Overview completo
- Estructura de archivos
- Explicación técnica
- Para: Referencia general

---

## SCRIPTS DISPONIBLES

```bash
# Script maestro (RECOMENDADO)
npm run fix-vercel

# Verificar bundle de producción
npm run verify-production

# Verificar variables en Vercel Dashboard
npm run check-vercel-env

# Redeploy forzado SIN cache
npm run redeploy

# Ver logs en tiempo real
vercel logs --follow
```

---

## FLUJO SEGÚN PERFIL

### Usuario Normal

```bash
npm run fix-vercel
# Sigue instrucciones
```

### Usuario Técnico

```bash
npm run verify-production    # Diagnóstico
npm run redeploy             # Si falla
npm run verify-production    # Verificar
```

### Desarrollador

```bash
cat .env.local | grep NEXT_PUBLIC_SUPABASE  # Local
npm run check-vercel-env                     # Vercel
npm run verify-production                    # Producción
npm run redeploy                             # Redeploy
vercel logs --follow                         # Logs
```

---

## ARCHIVOS CREADOS

### Documentos
- EMPEZAR-AQUI-VERCEL.md
- QUICK_FIX_VERCEL.md
- PLAN_ACCION_VERCEL.md
- CHECKLIST_VERCEL.md
- RESUMEN_SISTEMA_DIAGNOSTICO.md
- INDICE_VERCEL.md (este archivo)

### Scripts
- scripts/fix-vercel-supabase.sh (maestro)
- scripts/verify-production.js
- scripts/check-vercel-env.sh
- scripts/redeploy.sh (actualizado)
- scripts/SCRIPTS_VERCEL_README.md

### Configuración
- package.json (actualizado con scripts npm)

---

## VARIABLES NECESARIAS EN VERCEL

```
NEXT_PUBLIC_SUPABASE_URL
https://supabase.odoo.barcelona

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA

SUPABASE_SERVICE_ROLE_KEY
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc
```

Cada variable debe tener marcadas:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## TROUBLESHOOTING RÁPIDO

### Variables no aparecen después de redeploy

1. https://vercel.com/tu-proyecto/settings/general
2. "Clear Build Cache"
3. `npm run redeploy`

### "vercel: command not found"

```bash
npm install -g vercel
```

### Error "Missing Supabase environment variables"

```bash
npm run check-vercel-env  # Verificar Vercel
npm run redeploy          # Redeploy
```

---

## CHECKLIST DE ÉXITO

- [ ] `npm run verify-production` muestra "✅ TODO CORRECTO"
- [ ] Login funciona en https://www.lexy.plus/login
- [ ] NO hay error 401 en DevTools Console
- [ ] Acceso al dashboard exitoso

🎉 PROBLEMA RESUELTO

---

## CONTACTO DE EMERGENCIA

Si nada funciona:

```bash
npm run verify-production > diagnostico-$(date +%Y%m%d-%H%M%S).txt
npm run check-vercel-env >> diagnostico-$(date +%Y%m%d-%H%M%S).txt
```

Comparte el archivo `diagnostico-XXXXXX.txt` con:
- Screenshot de Vercel Environment Variables
- Screenshot del último deployment
- Output de `npm run fix-vercel`
