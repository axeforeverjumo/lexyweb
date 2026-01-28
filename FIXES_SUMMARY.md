# Editor Colaborativo - Resumen de Correcciones

## Estado Actual

✅ **Código corregido**: Cambios aplicados y listos
⏳ **Migración DB pendiente**: Necesita aplicarse manualmente
🔧 **Configuración lista**: Modo fallback habilitado

## Errores Corregidos

### 1. Error 500 - Heartbeat Endpoint

**Problema:**
```
Error: infinite recursion detected in policy for relation "contract_collaborators"
POST /api/contracts/.../heartbeat 500
```

**Causa:** La política RLS de Supabase tenía recursión infinita al consultar la misma tabla dentro de su propia política.

**Solución:** Funciones `security definer` que evitan la recursión.

**Acción requerida:** Aplicar migración SQL a la base de datos.

### 2. WebSocket Connection Failed

**Problema:**
```
WebSocket connection to 'wss://demos.yjs.dev/...' failed
```

**Causa:** El servidor público de Yjs es poco fiable y está frecuentemente caído.

**Solución:** Modo fallback que funciona sin WebSocket.

**Estado:** ✅ Implementado y configurado automáticamente.

## Pasos para Completar la Corrección

### Paso 1: Aplicar Migración de Base de Datos

**El SQL ya está en tu portapapeles.** Solo necesitas:

1. Abrir Supabase SQL Editor:
   - URL: https://supabase.odoo.barcelona/project/_/sql
   - O navegar a: Dashboard > SQL Editor

2. Pegar el SQL (Cmd+V)

3. Hacer clic en "Run" o "Ejecutar"

**Si necesitas copiar el SQL de nuevo:**
```bash
cat supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql | pbcopy
```

### Paso 2: Reiniciar el Servidor de Desarrollo

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar:
npm run dev
```

### Paso 3: Probar el Editor

1. Abrir: http://localhost:3000/contratos/93b9f8be-bd6b-417d-883c-91bfa5c6d86d/editar-colaborativo

2. Verificar:
   - ✓ El editor carga sin errores 500
   - ✓ No hay errores de WebSocket en consola
   - ✓ Puedes editar el texto
   - ✓ El auto-guardado funciona (cada 2 segundos)
   - ✓ El botón "Guardar cambios" funciona

## Archivos Modificados

### Nuevos Archivos

```
lib/config/collaboration.ts                  # Configuración de colaboración
supabase/migrations/...rls.sql               # Corrección de RLS
scripts/fix-rls-policy.sh                    # Script helper
scripts/test-heartbeat.sh                    # Script de prueba
COLLABORATIVE_EDITOR_FIX.md                  # Documentación técnica
```

### Archivos Modificados

```
components/collaborative-editor/CollaborativeEditor.tsx   # Soporte modo fallback
.env.local                                               # Config colaboración
```

## Configuración Actual

En `.env.local` se ha añadido:
```bash
NEXT_PUBLIC_COLLABORATION_MODE=fallback
```

**Modos disponibles:**

| Modo | Descripción | Requiere WebSocket |
|------|-------------|-------------------|
| `fallback` | Editor local (recomendado) | No |
| `websocket` | Colaboración tiempo real | Sí |
| `disabled` | Editor deshabilitado | N/A |

## Cómo Funciona Ahora

### Modo Fallback (Actual)

1. Usuario abre el editor
2. Editor carga en modo local (sin WebSocket)
3. Usuario edita el documento
4. Cambios se auto-guardan cada 2 segundos
5. Usuario puede guardar manualmente
6. No hay colaboración en tiempo real

### Ventajas del Modo Fallback

- ✅ Funciona sin servidores externos
- ✅ Sin dependencias de red
- ✅ Más rápido y confiable
- ✅ Ideal para edición individual
- ✅ Sin límite de usuarios simultáneos

## Habilitar Colaboración en Tiempo Real (Opcional)

Si en el futuro quieres colaboración en tiempo real:

### Opción A: Servidor Local (Desarrollo)

```bash
# Instalar servidor y-websocket
npm install -g y-websocket

# Ejecutar servidor
PORT=1234 npx y-websocket
```

Luego actualizar `.env.local`:
```bash
NEXT_PUBLIC_COLLABORATION_MODE=websocket
NEXT_PUBLIC_YJS_WEBSOCKET_URL=ws://localhost:1234
```

### Opción B: Servidor Demo Público (Pruebas)

```bash
# En .env.local
NEXT_PUBLIC_COLLABORATION_MODE=websocket
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://y-demos.vercel.app
```

⚠️ **No usar en producción** - servidores demo no son confiables.

### Opción C: Servidor Propio (Producción)

Desplegar servidor `y-websocket` en tu infraestructura y configurar:
```bash
NEXT_PUBLIC_COLLABORATION_MODE=websocket
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://tu-servidor.com
```

### Opción D: Servicios Comerciales

- **Liveblocks**: https://liveblocks.io
- **PartyKit**: https://partykit.io

## Verificación Rápida

### Test 1: Migración Aplicada

```bash
# Debe devolver 200 (autenticado) o 401 (no autenticado)
# NO debe devolver 500
./scripts/test-heartbeat.sh
```

### Test 2: Editor Funciona

1. Abrir navegador en modo privado
2. Iniciar sesión
3. Abrir un contrato
4. Hacer clic en "Editar colaborativamente"
5. Escribir algo
6. Verificar que se guarda

### Test 3: Sin Errores en Consola

Abrir DevTools (F12) y verificar:
- ✓ No hay errores 500
- ✓ No hay errores de WebSocket (está OK el warning de fallback)
- ✓ Aparece: `[Editor] Running in fallback mode`

## Troubleshooting

### Error: Aún recibo 500 en heartbeat

**Causa:** Migración no aplicada.
**Solución:** Ejecutar SQL en Supabase SQL Editor.

### Error: Editor no carga

**Causa:** Servidor no reiniciado.
**Solución:** Detener (Ctrl+C) y reiniciar (`npm run dev`).

### Error: No puedo editar

**Causa:** Permisos de usuario.
**Solución:** Verificar que eres el propietario del contrato.

### Warning: WebSocket connection failed

**Estado:** ✅ Normal en modo fallback.
**Acción:** Ninguna - el editor funciona sin WebSocket.

## Logs del Servidor

Para ver qué está pasando:
```bash
# Ver logs del servidor de desarrollo
tail -f /private/tmp/claude/-Users-...-lexyweb/tasks/*.output
```

## Próximos Pasos

1. ✅ Código corregido (ya hecho)
2. ⏳ Aplicar migración SQL (necesitas hacer)
3. ⏳ Reiniciar servidor dev (después de migración)
4. ⏳ Probar editor (verificar que funciona)

## Despliegue a Producción

Antes de desplegar:

1. Aplicar migración a Supabase de producción
2. Configurar variables de entorno en Vercel:
   ```
   NEXT_PUBLIC_COLLABORATION_MODE=fallback
   ```
3. Desplegar código
4. Probar en staging primero

## Documentación Adicional

- **Técnica**: `COLLABORATIVE_EDITOR_FIX.md`
- **Configuración**: `lib/config/collaboration.ts`
- **Migración**: `supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql`

## Soporte

Si algo no funciona:

1. Verificar que la migración se aplicó correctamente
2. Verificar `.env.local` tiene `NEXT_PUBLIC_COLLABORATION_MODE=fallback`
3. Reiniciar el servidor de desarrollo
4. Revisar logs del servidor
5. Revisar consola del navegador (F12)

---

**Última actualización:** 2026-01-28
**Estado:** Listo para aplicar migración
