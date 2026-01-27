# Scripts de Diagnóstico de Autenticación Supabase

Este directorio contiene scripts de diagnóstico para resolver problemas de autenticación con Supabase.

## Scripts Disponibles

### 1. `diagnose-auth.mjs` - Diagnóstico Completo

Ejecuta una batería completa de tests para verificar cada parte del sistema de autenticación.

```bash
node scripts/diagnose-auth.mjs
```

**Lo que verifica:**
- ✓ Variables de entorno (`.env.local`)
- ✓ Conectividad HTTP con Supabase
- ✓ Validez del Anon Key
- ✓ Usuarios en la base de datos
- ✓ Test de login
- ✓ Validación de JWT

**Cuándo usar:**
- Cuando el login no funciona y no sabes por qué
- Para verificar la configuración inicial
- Después de hacer cambios en las variables de entorno

---

### 2. `create-test-user.mjs` - Crear Usuario de Prueba

Crea el usuario `juan.manuel@jumo.tech` con contraseña `Admin123.` directamente en Supabase.

```bash
node scripts/create-test-user.mjs
```

**Lo que hace:**
- Verifica si el usuario ya existe
- Si no existe, lo crea con email confirmado automáticamente
- Muestra las credenciales de login

**Cuándo usar:**
- Cuando necesitas crear un usuario de prueba rápidamente
- Cuando el diagnóstico muestra que el usuario no existe

---

### 3. `verify-login.mjs` - Verificar Login

Verifica que el login funciona con el usuario creado.

```bash
node scripts/verify-login.mjs
```

**Lo que hace:**
- Intenta hacer login con `juan.manuel@jumo.tech`
- Muestra los detalles de la sesión si funciona
- Reporta el error si falla

**Cuándo usar:**
- Después de crear el usuario de prueba
- Para verificar que todo funciona antes de probar en el navegador

---

### 4. `test-existing-users.mjs` - Test con Usuarios Existentes

Test interactivo para probar login con cualquier usuario de la base de datos.

```bash
node scripts/test-existing-users.mjs
```

**Lo que hace:**
- Lista los usuarios detectados en la base de datos
- Te pide la contraseña de cada usuario
- Intenta hacer login con las credenciales proporcionadas

**Cuándo usar:**
- Cuando quieres probar con usuarios existentes
- Cuando conoces las contraseñas de otros usuarios

---

### 5. `test-real-login.mjs` - Probar Contraseñas Comunes

Prueba contraseñas comunes con los usuarios existentes.

```bash
node scripts/test-real-login.mjs
```

**Lo que hace:**
- Lista usuarios en la BD
- Prueba contraseñas comunes (`Admin123.`, `password`, etc.)
- Reporta si alguna contraseña funciona

**Cuándo usar:**
- Cuando no recuerdas la contraseña de un usuario
- Para verificar si alguna contraseña común funciona

---

### 6. `check-client-config.mjs` - Verificar Configuración del Cliente

Verifica la configuración del cliente y explica cómo funcionan las variables `NEXT_PUBLIC_*` en Next.js.

```bash
node scripts/check-client-config.mjs
```

**Lo que verifica:**
- Variables en `.env.local`
- Código del cliente (`lib/supabase/client.ts`)
- Instrucciones para verificar el build
- Instrucciones específicas para Vercel

**Cuándo usar:**
- Cuando sospechas que las variables no se están embediendo en el build
- Para entender cómo funciona la configuración de Supabase en Next.js

---

## Flujo de Trabajo Recomendado

### Problema: Login da error 401

1. **Diagnosticar el problema**
   ```bash
   node scripts/diagnose-auth.mjs
   ```

2. **Si el usuario no existe, créalo**
   ```bash
   node scripts/create-test-user.mjs
   ```

3. **Verificar que el login funciona**
   ```bash
   node scripts/verify-login.mjs
   ```

4. **Probar en el navegador**
   ```bash
   npm run dev
   # Abre http://localhost:3000/login
   # Usa: juan.manuel@jumo.tech / Admin123.
   ```

---

## Requisitos

Todos los scripts requieren:
- Node.js 18+
- Dependencias instaladas (`npm install`)
- Variables de entorno configuradas en `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (solo para crear usuarios)

---

## Solución de Problemas

### "SUPABASE_SERVICE_ROLE_KEY no está configurada"

El Service Role Key es necesario solo para `create-test-user.mjs`.

**Solución:**
1. Ve a Supabase Dashboard → Settings → API
2. Copia el Service Role Key (¡NO el Anon Key!)
3. Añádelo a `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aquí
   ```

### "Invalid login credentials"

Esto significa que:
- El usuario no existe, O
- La contraseña es incorrecta

**Solución:**
1. Ejecuta `diagnose-auth.mjs` para ver qué usuarios existen
2. Si el usuario no existe, créalo con `create-test-user.mjs`
3. Si existe pero olvidaste la contraseña, resetéala en Supabase Dashboard

### "El servidor responde con 401"

Si el diagnóstico muestra HTTP 401 al conectar a Supabase, es **normal**.
El servidor responde 401 cuando no proporcionas autenticación, lo cual es el comportamiento esperado.

---

## Información Adicional

Todos los scripts incluyen:
- ✓ Salida con colores para fácil lectura
- ✓ Manejo de errores detallado
- ✓ Instrucciones paso a paso
- ✓ Explicaciones de los resultados

Para más información sobre el diagnóstico completo, ver:
`DIAGNOSTICO-AUTH-COMPLETO.md` en la raíz del proyecto.

---

**Última actualización**: 27 de enero de 2026
