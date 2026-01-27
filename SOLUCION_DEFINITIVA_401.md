# SOLUCIÓN DEFINITIVA - Error 401 en Login de Producción

## 🎯 DIAGNÓSTICO CONFIRMADO

### ✅ Lo que FUNCIONA
- Backend Supabase: `https://supabase.odoo.barcelona` → ✅ OK
- GoTrue v2.174.0 activo y funcional
- Login desde Node.js → ✅ OK
- Página de login carga → ✅ OK (200 status)

### ❌ PROBLEMA IDENTIFICADO
**Las variables `NEXT_PUBLIC_SUPABASE_*` NO están embebidas en el build de producción.**

Evidencia:
```
Test 2: Buscando referencias a Supabase en el HTML...
  Referencias encontradas: No
  ⚠️  No se encontraron referencias a Supabase en el HTML
```

Esto significa que cuando Next.js hizo el build para producción, las variables de entorno NO estaban disponibles, por lo que el código compilado no tiene acceso a la URL de Supabase ni al anon key.

## 🔧 SOLUCIÓN INMEDIATA

### Opción 1: Redeploy Automático (RECOMENDADO)

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
npm run redeploy
```

Este script hace:
1. Limpia el build anterior
2. Reconstruye localmente (para verificar)
3. Despliega a producción con Vercel

### Opción 2: Redeploy Manual

```bash
# 1. Limpiar build
rm -rf .next

# 2. Rebuild local
npm run build

# 3. Deploy a producción
vercel --prod
```

### Opción 3: Desde Dashboard de Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Verifica que estas variables EXISTAN y tengan marcado **Production**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Si no existen o no tienen "Production" marcado:
   - Agrégalas/edítalas
   - Guarda
6. Ve a **Deployments**
7. Click en el último deployment → **Redeploy**
8. **IMPORTANTE**: Desmarca "Use existing Build Cache"
9. Click en **Redeploy**

## 📋 VALORES DE LAS VARIABLES

Asegúrate de que estas variables estén en Vercel EXACTAMENTE así:

```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA
```

## 🧪 VERIFICACIÓN POST-DEPLOY

1. Espera 30-60 segundos después del deploy
2. Ve a: https://www.lexy.plus/login
3. Abre la consola del navegador (F12)
4. Pega este código:

```javascript
// Verificar que las variables están disponibles
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'presente' : 'MISSING');
```

Si alguna variable aparece como `undefined`, el build no las tomó.

5. Intenta hacer login con:
   - Email: `test@lexy.plus`
   - Password: `Test123456!`

6. Resultados esperados:
   - ✅ Login exitoso → ¡Problema resuelto!
   - ❌ Error 401 → Las variables siguen sin estar en el build
   - ❌ Error 400 "Invalid credentials" → Usuario/password incorrectos

## 🔍 DIAGNÓSTICO AVANZADO

Si después del redeploy sigue dando 401:

```bash
# Ver logs de producción en tiempo real
vercel logs --follow

# O ejecutar verificación automática
npm run check-production
```

## 👤 USUARIOS DISPONIBLES

### Usuario de Prueba (creado hoy)
- Email: `test@lexy.plus`
- Password: `Test123456!`

### Usuario Existente
- Email: `j.ojedagarcia@icloud.com`
- Password: (la que configuraste originalmente)

Si no recuerdas la password del usuario original, puedes resetearla:

```bash
node << 'EOF'
import('@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(
    'https://supabase.odoo.barcelona',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  supabase.auth.admin.listUsers().then(({ data }) => {
    const user = data.users.find(u => u.email === 'j.ojedagarcia@icloud.com');
    if (user) {
      supabase.auth.admin.updateUserById(user.id, {
        password: 'NuevaPassword123!'
      }).then(() => {
        console.log('✅ Password actualizada a: NuevaPassword123!');
      });
    }
  });
});
EOF
```

## 🎯 RESUMEN EJECUTIVO

**Problema**: Variables `NEXT_PUBLIC_SUPABASE_*` no embebidas en build de producción.

**Causa**: Vercel no tenía las variables configuradas cuando se hizo el build, o no se marcaron para "Production".

**Solución**: Configurar variables en Vercel + Redeploy SIN usar build cache.

**Acción inmediata**:
```bash
npm run redeploy
```

**Tiempo estimado**: 2-3 minutos de deploy + 30 segundos de propagación.

---

**Creado**: 2026-01-27
**Autor**: Claude Code
**Estado**: Listo para ejecutar
