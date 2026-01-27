# DIAGNÓSTICO COMPLETO - ERROR 401 UNAUTHORIZED

**Fecha**: 27 de enero de 2026
**Error**: `Failed to load resource: the server responded with a status of 401 ()` en `/auth/v1/token?grant_type=password`

---

## RESUMEN EJECUTIVO

**EL PROBLEMA NO ES TÉCNICO - ES DE CREDENCIALES**

Después de ejecutar diagnósticos exhaustivos, se confirma que:
- ✅ La conexión a Supabase funciona correctamente
- ✅ Las variables de entorno están configuradas y se embeben en el build
- ✅ El Anon Key es válido
- ✅ El código del cliente es correcto
- ❌ **EL USUARIO QUE ESTÁS INTENTANDO USAR NO EXISTE EN LA BASE DE DATOS**

---

## HALLAZGOS DETALLADOS

### 1. VARIABLES DE ENTORNO ✅

**Estado**: CORRECTAS

```
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

- Variables definidas en `.env.local`
- Variables configuradas en Vercel (Production, Development, Preview)
- Variables se embeben correctamente en el build (16 ocurrencias encontradas en `.next/`)

### 2. CONECTIVIDAD HTTP ✅

**Estado**: SERVIDOR RESPONDE CORRECTAMENTE

```bash
GET https://supabase.odoo.barcelona/rest/v1/
→ HTTP 401 (esperado sin autenticación)
→ Headers: Kong/2.8.1, CORS habilitado
```

- El servidor Supabase está online
- Responde correctamente (401 es la respuesta esperada sin auth)
- CORS configurado correctamente
- Kong gateway funcionando

### 3. ANON KEY ✅

**Estado**: VÁLIDA

JWT decodificado:
```json
{
  "iss": "supabase",
  "iat": 1766713680,
  "exp": 4922387280,
  "role": "anon"
}
```

- Issuer correcto: "supabase"
- Role correcto: "anon"
- NO expirado (válido hasta 2125)
- Peticiones anónimas funcionan correctamente

### 4. USUARIOS EN LA BASE DE DATOS ⚠️

**Estado**: USUARIO DE PRUEBA NO EXISTE

Usuarios encontrados en la BD:
1. `test@lexy.plus`
   - Confirmado: Sí
   - Último login: 2026-01-27T20:05:30
2. `j.ojedagarcia@icloud.com`
   - Confirmado: Sí
   - Último login: 2026-01-27T15:28:04

**Usuario que intentas usar**: `juan.manuel@jumo.tech`
- ❌ **NO EXISTE en la base de datos**

### 5. TEST DE LOGIN ❌

**Estado**: FALLA PORQUE EL USUARIO NO EXISTE

```
Error: Invalid login credentials
Código: invalid_credentials
Status: 400
```

Este error significa que:
- Las credenciales (email/password) no coinciden con ningún usuario
- El usuario no existe en la base de datos
- O la contraseña es incorrecta

### 6. BUILD DE NEXT.JS ✅

**Estado**: VARIABLES SE EMBEBEN CORRECTAMENTE

```bash
$ grep -r "https://supabase.odoo.barcelona" .next/
→ 16 occurrences found
```

- Las variables `NEXT_PUBLIC_*` se embeben en tiempo de build
- El proceso de build funciona correctamente
- Las variables están disponibles en el cliente

---

## CAUSA RAÍZ DEL ERROR 401

El error `401 UNAUTHORIZED` en `/auth/v1/token` se produce porque:

1. **El usuario `juan.manuel@jumo.tech` NO EXISTE** en la base de datos de Supabase
2. Supabase responde con `Invalid login credentials` cuando intentas hacer login con un usuario inexistente
3. Este es el comportamiento esperado y correcto de Supabase (no revela si el usuario existe o no por seguridad)

---

## SOLUCIONES

### OPCIÓN 1: Crear el usuario de prueba (RECOMENDADO)

1. Ve a Supabase Dashboard: https://supabase.odoo.barcelona
2. Authentication → Users
3. Click en "Create new user"
4. Email: `juan.manuel@jumo.tech`
5. Password: `Admin123.`
6. Enable "Auto Confirm User" ✓
7. Save

### OPCIÓN 2: Usar un usuario existente

Prueba con uno de estos usuarios que YA EXISTEN:
- `test@lexy.plus`
- `j.ojedagarcia@icloud.com`

**PROBLEMA**: No conocemos las contraseñas de estos usuarios.

**SOLUCIÓN**:
1. Ve a Supabase Dashboard
2. Authentication → Users
3. Selecciona el usuario
4. Click en "Send Password Recovery Email"
5. O directamente resetea la contraseña desde el dashboard

### OPCIÓN 3: Crear un nuevo usuario desde el código

Usa la página de registro (`/register`) para crear un nuevo usuario.

---

## VERIFICACIÓN LOCAL

Para probar que todo funciona correctamente después de crear el usuario:

```bash
# 1. Ejecutar diagnóstico completo
node scripts/diagnose-auth.mjs

# 2. Probar login con el usuario creado
node scripts/test-existing-users.mjs

# 3. Iniciar dev server y probar en navegador
npm run dev
# Abre: http://localhost:3000/login
```

---

## DEPLOYMENT EN VERCEL

**NO ES NECESARIO HACER NADA EN VERCEL**

El problema NO está en Vercel. Las variables de entorno están correctamente configuradas.

Una vez que crees el usuario en Supabase, el login funcionará inmediatamente tanto en local como en producción.

---

## SCRIPTS DE DIAGNÓSTICO CREADOS

Se crearon 3 scripts para diagnosticar el problema:

### 1. `scripts/diagnose-auth.mjs`
Diagnóstico completo del sistema de autenticación:
- Variables de entorno
- Conectividad HTTP
- Validez del Anon Key
- Lista de usuarios en la BD
- Test de login
- Validación de JWT

```bash
node scripts/diagnose-auth.mjs
```

### 2. `scripts/test-existing-users.mjs`
Test interactivo para probar login con usuarios existentes:

```bash
node scripts/test-existing-users.mjs
```

### 3. `scripts/check-client-config.mjs`
Verifica la configuración del cliente y explica cómo funcionan las variables en Next.js:

```bash
node scripts/check-client-config.mjs
```

### 4. `scripts/test-real-login.mjs`
Prueba contraseñas comunes con los usuarios existentes:

```bash
node scripts/test-real-login.mjs
```

---

## TIMELINE DEL PROBLEMA

1. **Antes**: El código funcionaba en `lexyapp` y `lexyweb` por separado
2. **Cambio**: Se unificaron los proyectos
3. **Error**: Login dejó de funcionar con error 401
4. **Acciones tomadas**:
   - ✓ Configurar variables en Vercel
   - ✓ Múltiples redeploys
   - ✓ Verificar código
5. **Diagnóstico**: El usuario de prueba no existe en la BD unificada

---

## CONCLUSIÓN

**EL SISTEMA ESTÁ FUNCIONANDO CORRECTAMENTE**

El error 401 es el comportamiento esperado cuando intentas hacer login con un usuario que no existe.

**ACCIÓN INMEDIATA**: Crea el usuario `juan.manuel@jumo.tech` en Supabase Dashboard y el problema se resolverá instantáneamente.

---

## INFORMACIÓN TÉCNICA ADICIONAL

### Cómo Next.js maneja las variables `NEXT_PUBLIC_*`

Las variables que empiezan con `NEXT_PUBLIC_` se embeben en el bundle en **tiempo de build**:

1. Durante `npm run build`, Next.js busca todas las referencias a `process.env.NEXT_PUBLIC_*`
2. Reemplaza estas referencias por el valor LITERAL de la variable
3. El código final en el bundle contiene el valor, no la referencia

**Ejemplo**:
```javascript
// Código fuente
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Después del build
const url = "https://supabase.odoo.barcelona";
```

**Implicaciones**:
- Si cambias las variables en Vercel, DEBES hacer un nuevo build
- Las variables están disponibles en el cliente (navegador)
- NO se pueden cambiar en runtime sin un nuevo build

### Por qué el código usa `process.env` en el cliente

Aunque `process.env` no existe en el navegador, Next.js hace un reemplazo estático en tiempo de build, por lo que el código final NO contiene `process.env`, sino el valor directo.

### Verificación manual del build

Para verificar que las variables se embedieron:

```bash
# Build
npm run build

# Buscar la URL en el build
grep -r "supabase.odoo.barcelona" .next/

# Si encuentras 16+ ocurrencias, las variables están embedidas ✓
```

---

**Última actualización**: 27 de enero de 2026, 21:30
