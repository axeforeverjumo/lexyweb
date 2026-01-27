# Diagnóstico: Error de Conexión Supabase en Producción

## Resumen Ejecutivo

**Problema:** Los usuarios no pueden hacer login ni registro en producción (lexy.plus).

**Error reportado:**
```
TypeError: Failed to execute 'fetch' on 'Window': Invalid value
at rp.signInWithPassword
at rp.signUp
```

**Causa raíz:** Las variables de entorno de Supabase NO están configuradas en Vercel.

**Impacto:** 100% de usuarios afectados - la app es inutilizable en producción.

**Solución:** Configurar variables de entorno en Vercel + correcciones en código.

**Tiempo estimado de resolución:** 10 minutos (solo configurar Vercel y redesplegar).

---

## Análisis Técnico

### 1. Problema Principal: Variables de Entorno

**Hallazgo:**
El cliente de Supabase en `/lib/supabase/client.ts` estaba usando `createClientComponentClient()` de `@supabase/auth-helpers-nextjs`, que espera que las variables de entorno estén disponibles en el navegador.

**En desarrollo:** Funcionaba porque `.env.local` tiene las variables.

**En producción:** Fallaba porque Vercel NO tiene las variables configuradas.

**Síntoma:**
```javascript
const supabase = createClientComponentClient();
// supabase recibe undefined como URL → "Invalid value" en fetch
```

### 2. Arquitectura del Cliente Supabase

**Antes (problemático):**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = (): SupabaseClient => {
  return createClientComponentClient();
};
```

**Problemas:**
- No valida que las variables existan
- No da mensajes de error claros
- Falla silenciosamente en producción

**Ahora (robusto):**
```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validar que existan
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables...');
  }

  // Validar formato de URL
  try {
    new URL(supabaseUrl);
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL...`);
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
```

**Ventajas:**
- Validación explícita de variables
- Mensajes de error descriptivos
- Falla rápido y claro si algo está mal
- Usa la librería más moderna (`@supabase/ssr`)

### 3. Problemas Secundarios: Páginas 404

**Hallazgo:**
El formulario de registro enlaza a `/privacidad` y `/terminos`, pero estas páginas no existían.

**Solución:**
Creadas ambas páginas en `/app/(legal)/` con contenido completo y profesional.

---

## Configuración Requerida en Vercel

### Variables Críticas (Sin estas, la app NO funciona)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ver_VERCEL_ENV_VALUES.txt>
SUPABASE_SERVICE_ROLE_KEY=<ver_VERCEL_ENV_VALUES.txt>
```

### Variables de IA (Para generación de contratos)

```bash
GEMINI_API_KEY=<ver_VERCEL_ENV_VALUES.txt>
ANTHROPIC_API_KEY=<ver_VERCEL_ENV_VALUES.txt>
```

### Variables de Stripe (Para pagos)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_SECRET_KEY=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_WEBHOOK_SECRET=[CREAR_NUEVO_EN_STRIPE_DASHBOARD]
STRIPE_PRICE_ID_PRO=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_PRICE_ID_TEAM=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_PRICE_ID_BUSINESS=<ver_VERCEL_ENV_VALUES.txt>
STRIPE_PRICE_ID_ENTERPRISE=<ver_VERCEL_ENV_VALUES.txt>
```

### Variables de App

```bash
NEXT_PUBLIC_APP_URL=https://lexy.plus
NEXT_PUBLIC_SANITY_PROJECT_ID=s5r9o1yx
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Pasos para Resolver (Acción Inmediata)

### 1. Configurar Vercel (5 minutos)

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto `lexyweb` (o como se llame)
3. Ve a: **Settings** → **Environment Variables**
4. Copia y pega TODAS las variables de arriba
5. Asegúrate de seleccionar: **Production**, **Preview**, y **Development**

### 2. Redesplegar (2 minutos)

Opción A - Automático:
- Vercel redesplegará automáticamente al detectar cambios en variables

Opción B - Manual:
- Ve a **Deployments** → último deployment → **Redeploy**

### 3. Verificar (3 minutos)

```bash
# 1. Abre https://lexy.plus/login
# 2. Abre DevTools (F12) → Console
# 3. Verifica variables:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
# Debe mostrar: https://supabase.odoo.barcelona

# 4. Intenta login/registro
# Ya NO debe aparecer error "Invalid value"
```

---

## Archivos Modificados

### 1. `/lib/supabase/client.ts`
- Migrado a `@supabase/ssr` (más moderno)
- Agregada validación de variables
- Agregada validación de formato de URL
- Mensajes de error descriptivos

### 2. `/app/(legal)/privacidad/page.tsx` (NUEVO)
- Página de política de privacidad completa
- Diseño coherente con la app
- Contenido profesional y legal

### 3. `/app/(legal)/terminos/page.tsx` (NUEVO)
- Términos y condiciones completos
- Avisos legales sobre uso de IA
- Secciones sobre responsabilidades

### 4. `/.env.example`
- Actualizado con documentación clara
- Agregadas notas sobre Vercel
- Explicación de qué variables son críticas

### 5. `/VERCEL_SETUP_CHECKLIST.md` (NUEVO)
- Guía paso a paso para configurar Vercel
- Lista completa de variables
- Troubleshooting común

---

## Validación Post-Despliegue

### ✅ Checklist de Funcionalidad

- [ ] Login funciona sin errores
- [ ] Registro funciona sin errores
- [ ] Página `/privacidad` carga correctamente
- [ ] Página `/terminos` carga correctamente
- [ ] Console del navegador no muestra errores de Supabase
- [ ] Variables de entorno visibles en console (NEXT_PUBLIC_*)

### ✅ Checklist de Producción

- [ ] Webhook de Stripe configurado para producción
- [ ] URL de app apunta a `https://lexy.plus`
- [ ] Dominio custom de Supabase funciona (`supabase.odoo.barcelona`)
- [ ] Certificado SSL válido
- [ ] CORS configurado en Supabase para dominio de producción

---

## Notas Adicionales

### Sobre el Dominio Custom de Supabase

Tu instalación usa `https://supabase.odoo.barcelona` en lugar de un dominio estándar de Supabase.

**Verifica:**
1. Que el dominio esté accesible públicamente
2. Que tenga certificado SSL válido
3. Que la configuración de CORS incluya `https://lexy.plus`

**Para verificar:**
```bash
curl -I https://supabase.odoo.barcelona
# Debe retornar 200 OK con certificado válido
```

### Sobre Seguridad

Las claves mostradas en este documento son las actuales del proyecto. Considera:

1. **Rotar keys de Supabase** después de resolver el problema
2. **Crear webhook de Stripe para producción** (no usar el de desarrollo)
3. **Limitar dominios permitidos** en CORS de Supabase

### Monitoreo Post-Fix

Después de desplegar, monitorea:

1. **Vercel Logs:** Busca errores de autenticación
2. **Supabase Dashboard:** Verifica intentos de login
3. **Stripe Dashboard:** Confirma webhooks funcionan
4. **Browser Console:** Usuarios reportando errores

---

## Contacto y Soporte

Si el problema persiste después de configurar las variables:

1. Verifica logs en: Vercel → Proyecto → Logs
2. Revisa Supabase Dashboard → Auth → Users
3. Comprueba Supabase → Settings → API
4. Valida certificado SSL del dominio custom

**Tiempo total estimado de resolución:** 10-15 minutos

**Riesgo:** Bajo (solo configuración, no cambios de código complejos)

**Impacto de la solución:** Inmediato (usuarios pueden usar la app al instante)
