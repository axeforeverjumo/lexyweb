# Comandos de Desarrollo

Comandos útiles para trabajar con el sistema de edición colaborativa.

## Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000

# Ver logs en tiempo real
npm run dev -- --turbo
```

## Abrir Modos de Edición

### Modo "Editar con Lexy"
```bash
# Reemplaza [id] con el ID de tu contrato
open http://localhost:3000/contratos/[id]/editar
```

### Modo "Edición Colaborativa"
```bash
# Reemplaza [id] con el ID de tu contrato
open http://localhost:3000/contratos/[id]/editar-colaborativo
```

### Vista de Detalle (con botones)
```bash
# Ver los dos botones
open http://localhost:3000/contratos/[id]
```

## Testing Multi-Usuario

### Con 2 navegadores diferentes

```bash
# Terminal 1: Navegador Chrome
open -a "Google Chrome" http://localhost:3000/contratos/[id]/editar

# Terminal 2: Navegador Safari (modo privado)
open -a Safari http://localhost:3000/contratos/[id]/editar
```

### Con Chrome en modo incógnito
```bash
# Ventana normal
open -a "Google Chrome" http://localhost:3000/contratos/[id]/editar

# Ventana incógnito (login con otro usuario)
open -a "Google Chrome" --args --incognito http://localhost:3000/contratos/[id]/editar
```

## Debugging

### Ver logs de WebSocket (Yjs)
```javascript
// En Chrome DevTools Console
localStorage.debug = 'y-websocket:*'
// Recargar página
```

### Ver logs de Supabase Realtime
```javascript
// En Chrome DevTools Console
localStorage.setItem('supabase.debug', 'true')
// Recargar página
```

### Limpiar cache de Yjs
```javascript
// En Chrome DevTools Console
indexedDB.deleteDatabase('lexy-contract-[id]')
// Recargar página
```

## Crear Contratos de Prueba

```bash
# Usar API directamente
curl -X POST http://localhost:3000/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Contrato de Prueba",
    "idioma": "es",
    "contenido_markdown": "# Contrato de Prueba\n\nEste es un contrato para testing."
  }'
```

## Ver Estado de Base de Datos

### Contratos
```sql
-- En Supabase SQL Editor
SELECT id, titulo, estado, created_at
FROM contract_generations
ORDER BY created_at DESC
LIMIT 10;
```

### Colaboradores
```sql
-- Ver colaboradores de un contrato
SELECT cc.*, p.full_name
FROM contract_collaborators cc
JOIN profiles p ON cc.user_id = p.id
WHERE cc.contract_id = '[id]';
```

### Presencia en Tiempo Real
```sql
-- Ver quién está editando
SELECT cc.*, p.full_name, cc.last_seen_at
FROM contract_collaborators cc
JOIN profiles p ON cc.user_id = p.id
WHERE cc.contract_id = '[id]'
  AND cc.last_seen_at > NOW() - INTERVAL '1 minute';
```

### Chat de Lexy
```sql
-- Ver historial de chat
SELECT id, role, content, edit_suggestion, created_at
FROM contract_chat_history
WHERE contract_id = '[id]'
ORDER BY created_at DESC
LIMIT 20;
```

## Archivos Clave

```bash
# Componentes principales
components/collaborative-editor/ContractEditorWithLexy.tsx
components/collaborative-editor/CollaborativeEditorWrapper.tsx
components/collaborative-editor/CollaborativeEditor.tsx
components/collaborative-editor/LexyAssistantSidebar.tsx

# Rutas
app/(dashboard)/contratos/[id]/editar/page.tsx
app/(dashboard)/contratos/[id]/editar-colaborativo/page.tsx

# Vista de detalle con botones
components/contratos/ContractDetailView.tsx
```

## Build y Deploy

```bash
# Build local
npm run build

# Verificar errores
npm run lint

# Type check
npx tsc --noEmit
```

## Limpiar y Reinstalar

```bash
# Limpiar cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar dependencias
npm install

# Iniciar de nuevo
npm run dev
```

## Hot Reload Issues

Si los cambios no se reflejan:

```bash
# Método 1: Forzar rebuild
rm -rf .next
npm run dev

# Método 2: Actualizar solo archivo específico
touch components/collaborative-editor/ContractEditorWithLexy.tsx
```

## Verificar Dependencias

```bash
# Ver versiones instaladas
npm list @tiptap/react @tiptap/starter-kit yjs y-websocket

# Actualizar dependencias
npm update @tiptap/react @tiptap/starter-kit
```

## Logs Útiles

### Ver llamadas API
```bash
# Terminal donde corre npm run dev
# Las llamadas a /api/* aparecerán aquí
```

### Ver errores de compilación
```bash
# Terminal donde corre npm run dev
# Los errores TypeScript aparecerán aquí
```

## Shortcuts de Chrome DevTools

```
Cmd+Shift+C    - Inspeccionar elemento
Cmd+Option+J   - Abrir console
Cmd+Option+I   - Abrir DevTools
Cmd+R          - Recargar página
Cmd+Shift+R    - Recargar sin cache
```

## Testing Rápido

```bash
# Test completo del flujo
open http://localhost:3000/login
# 1. Login con usuario 1
# 2. Crear contrato
# 3. Click "Editar con Lexy"
# 4. Preguntar a Lexy
# 5. Aplicar cambio
# 6. Abrir en incógnito con usuario 2
# 7. Verificar sincronización
```

## Problemas Comunes

### "Module not found" en build
```bash
# Instalar dependencias faltantes
npm install react-is styled-components
```

### WebSocket no conecta
```bash
# Verificar que el servidor esté corriendo
# Verificar firewall
# Verificar URL en código (debe ser wss://)
```

### Lexy no responde
```bash
# Verificar API key de Claude
# Ver logs en /api/claude/contract-assist
# Verificar Supabase connection
```

### Sincronización no funciona
```bash
# Verificar mismo contractId en ambos navegadores
# Verificar WebSocket provider conectado
# Ver logs de Yjs en console
```

## Variables de Entorno

```bash
# Ver .env.local
cat .env.local

# Variables requeridas
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
```

## Recursos

- **Next.js Docs**: https://nextjs.org/docs
- **Tiptap Docs**: https://tiptap.dev/docs
- **Yjs Docs**: https://docs.yjs.dev/
- **Supabase Docs**: https://supabase.com/docs

## Soporte

Para bugs o preguntas:
1. Ver TESTING_CHECKLIST.md
2. Ver logs en console
3. Verificar red en DevTools
4. Contactar equipo de desarrollo
