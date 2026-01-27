# Solución al Error 401 en Login de Producción

## Diagnóstico Completo

### ✅ Confirmado que Funciona
1. Backend de Supabase en `https://supabase.odoo.barcelona` funciona correctamente
2. Usuario de prueba creado: `test@lexy.plus` / `Test123456!`
3. Login funciona desde Node.js
4. Variables de entorno en `.env.local` son correctas
5. El servidor está en `GoTrue v2.174.0`

### 🔍 Causa Probable del Error 401

El error `401 Unauthorized` en producción (https://www.lexy.plus/login) puede deberse a:

#### 1. Variables de Entorno NO Refrescadas en Vercel
**Problema**: Vercel requiere un REDEPLOY después de cambiar variables de entorno.

**Solución**:
```bash
# Opción A: Redeploy desde CLI
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb
vercel --prod

# Opción B: Forzar redeploy desde dashboard
# 1. Ve a https://vercel.com/dashboard
# 2. Selecciona tu proyecto
# 3. Ve a Deployments
# 4. Click en el último deployment → "Redeploy"
```

#### 2. Variables Configuradas Solo para Preview, No para Production
**Problema**: Las variables pueden estar en "Preview" pero no en "Production".

**Solución**:
1. Ve a: https://vercel.com/dashboard → Tu proyecto → Settings → Environment Variables
2. Para CADA variable, verifica que tengan marcado:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
3. Si alguna NO tiene "Production" marcado:
   - Edita la variable
   - Marca "Production"
   - Save
   - Redeploy

#### 3. Variables NEXT_PUBLIC_ No Embebidas en Build
**Problema**: Next.js embebe las variables `NEXT_PUBLIC_*` en tiempo de BUILD, no de runtime.

**Solución**:
```bash
# Limpiar cache y rebuild
rm -rf .next
npm run build
vercel --prod
```

#### 4. CORS Bloqueando Requests desde Producción
**Problema**: Supabase puede estar bloqueando requests desde `www.lexy.plus`.

**Solución**: Verificar configuración CORS en Supabase.

## Pasos de Solución Inmediatos

### PASO 1: Verificar Variables en Vercel

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Login
vercel login

# Ver variables de entorno
vercel env ls
```

**Verificar que existan**:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://supabase.odoo.barcelona`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### PASO 2: Redeploy Completo

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb

# Limpiar todo
rm -rf .next

# Rebuild local (para verificar)
npm run build

# Deploy a producción
vercel --prod
```

### PASO 3: Verificar el Deploy

1. Espera a que termine el deploy
2. Ve a la URL de producción: https://www.lexy.plus/login
3. Abre la consola del navegador (F12)
4. Intenta hacer login con: `test@lexy.plus` / `Test123456!`
5. Observa el error en Network:
   - Si sigue siendo 401: hay un problema de configuración
   - Si es 400 con "Invalid credentials": el usuario no existe o contraseña incorrecta
   - Si funciona: ¡problema resuelto!

### PASO 4: Diagnóstico Avanzado (si sigue fallando)

Si después del redeploy sigue dando 401, ejecuta esto:

```bash
# Ver logs de producción
vercel logs --follow

# O desde dashboard:
# https://vercel.com/dashboard → Proyecto → Logs
```

Busca mensajes de error relacionados con Supabase.

## Verificación de Variables en Build de Producción

Para verificar que las variables están embebidas en producción:

1. Ve a: https://www.lexy.plus/login
2. Abre la consola del navegador
3. Pega este código:

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'presente' : 'MISSING');
```

Si alguna variable aparece como `undefined`, el problema es que no están embebidas en el build.

## Solución Temporal: Crear Usuario Nuevo

Mientras tanto, puedes crear un usuario nuevo directamente desde Supabase:

```bash
node << 'EOF'
import('@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(
    'https://supabase.odoo.barcelona',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Vw7Aopd8gGRIoQA6vMZeFKq1Xyt0JdI6645EijHR2Pc',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Cambiar email y password aquí
  supabase.auth.admin.createUser({
    email: 'tu@email.com',
    password: 'TuPassword123!',
    email_confirm: true
  }).then(({ data, error }) => {
    if (error) console.error('Error:', error.message);
    else console.log('Usuario creado:', data.user.email);
  });
});
EOF
```

## Resumen de Acciones

1. ✅ Verificar variables en Vercel: `vercel env ls`
2. ✅ Limpiar build: `rm -rf .next`
3. ✅ Rebuild: `npm run build`
4. ✅ Redeploy: `vercel --prod`
5. ✅ Probar login con: `test@lexy.plus` / `Test123456!`
6. ✅ Revisar logs: `vercel logs --follow`

## Contacto con el Usuario Original

Para el usuario `j.ojedagarcia@icloud.com`, puedes:

1. Resetear la contraseña desde Supabase Admin
2. O crear uno nuevo con email/password conocidos

```bash
# Resetear password del usuario existente
node << 'EOF'
import('@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(
    'https://supabase.odoo.barcelona',
    'SERVICE_ROLE_KEY',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  supabase.auth.admin.listUsers().then(({ data }) => {
    const user = data.users.find(u => u.email === 'j.ojedagarcia@icloud.com');
    if (user) {
      supabase.auth.admin.updateUserById(user.id, {
        password: 'NuevaPassword123!'
      }).then(() => console.log('Password actualizada'));
    }
  });
});
EOF
```

---

**Próximo paso**: Ejecutar PASO 1 y PASO 2 para redeploy completo.
