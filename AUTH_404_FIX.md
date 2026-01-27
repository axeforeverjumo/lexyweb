# Fix 404 Error en Rutas de Autenticación (/login, /register, /forgot-password)

## Problema

Las rutas de autenticación (`/login`, `/register`, `/forgot-password`) retornaban 404 en producción (lexy.plus).

## Causa Raíz

El proyecto tenía una estructura mixta incorrecta:

1. **Directorio `app/` en raíz**: Contenía las páginas principales (home, blog, API routes, etc.)
2. **Directorio `src/app/`**: Contenía las nuevas rutas de autenticación

**Next.js solo lee de UNA ubicación:**
- Si existe `app/` en la raíz → Next.js usa ese directorio e IGNORA `src/app/`
- Si NO existe `app/` en la raíz → Next.js usa `src/app/`

Como el proyecto ya tenía `app/` en la raíz con el layout principal y otras páginas, Next.js nunca detectó las páginas de autenticación que estaban en `src/app/(auth)/`.

## Solución Implementada

### 1. Consolidación de Estructura
Movimos TODO el contenido de `src/` a la raíz del proyecto:

```bash
# Movido de src/app/ → app/
app/
  ├── (auth)/
  │   ├── login/page.tsx          ✅ Ahora detectado por Next.js
  │   ├── register/page.tsx       ✅ Ahora detectado por Next.js
  │   ├── forgot-password/page.tsx ✅ Ahora detectado por Next.js
  │   └── layout.tsx
  ├── auth/callback/route.ts
  ├── contratos/
  ├── subscription/
  └── api/

# Movido de src/components/ → components/
components/
  ├── auth/                        ✅ Componentes de autenticación
  ├── contratos/
  ├── dashboard/
  └── ...

# Movido de src/lib/ → lib/
lib/
  ├── auth/                        ✅ Funciones de autenticación
  ├── supabase/                    ✅ Cliente Supabase
  └── ...

# Movido de src/middleware.ts → middleware.ts
middleware.ts                      ✅ Protección de rutas
```

### 2. Actualización de TypeScript Config

Actualizado `tsconfig.json` para que el path alias `@/*` apunte a la raíz:

```json
{
  "paths": {
    "@/*": ["./*"]  // Antes: ["./src/*"]
  }
}
```

### 3. Eliminación de src/

Una vez confirmado que todo funciona, eliminamos el directorio `src/` para evitar confusión futura.

## Verificación

### Build Output

```
Route (app)                                 Size  First Load JS
├ ○ /forgot-password                     2.75 kB         201 kB
├ ○ /login                                2.9 kB         201 kB
├ ○ /register                            3.41 kB         202 kB
```

Las tres rutas ahora aparecen en el build output de Next.js.

### Test Local

```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/login
# Output: HTTP Status: 200 ✅
```

### Middleware

El middleware (`middleware.ts`) se movió a la raíz y se compila correctamente:

```
ƒ Middleware  79.9 kB
```

## Prevención Futura

Para evitar este problema en el futuro:

1. **Nunca mezclar `app/` en raíz con `src/app/`**: Elegir UNA estructura y mantenerla consistente.

2. **Verificar build output**: Siempre revisar que las nuevas rutas aparezcan en el output del build:
   ```bash
   npm run build | grep -E "Route \(app\)"
   ```

3. **Test local antes de deploy**: Probar rutas localmente antes de hacer push a producción:
   ```bash
   npm run build
   npm start
   curl http://localhost:3000/nueva-ruta
   ```

## Archivos Modificados

- `tsconfig.json` - Path alias actualizado
- `app/` - Rutas de auth, contratos, subscription añadidas
- `components/` - Componentes de auth añadidos
- `lib/` - Librerías de auth y Supabase añadidas
- `middleware.ts` - Movido de src/ a raíz
- `src/` - Directorio eliminado

## Estado Final

✅ `/login` funciona
✅ `/register` funciona
✅ `/forgot-password` funciona
✅ Middleware protegiendo rutas
✅ Build exitoso
✅ Estructura unificada en raíz del proyecto

## Deploy a Producción

Después de este commit, hacer deploy a Vercel para que los cambios se reflejen en lexy.plus:

```bash
git add .
git commit -m "fix: corregir 404 en rutas auth moviendo src/ a raíz"
git push origin main
```

Vercel detectará automáticamente los cambios y hará redeploy.
