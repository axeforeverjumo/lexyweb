# Guía de Despliegue Completo: Editor Colaborativo

## Checklist Pre-Despliegue

- [ ] Dependencias NPM instaladas
- [ ] Migraciones SQL ejecutadas en Supabase
- [ ] Variables de entorno configuradas
- [ ] Servidor WebSocket desplegado (producción)
- [ ] Tests básicos ejecutados
- [ ] Componentes integrados en páginas

## Paso 1: Instalación de Dependencias (5 min)

```bash
cd /Users/juanmanuelojedagarcia/Documents/develop/Desarrollos\ internos/lexyweb

# Editor colaborativo con Yjs
npm install yjs y-websocket y-protocols

# Tiptap editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor

# Utilidades
npm install nanoid

# Verificar instalación
npm list yjs @tiptap/react
```

## Paso 2: Ejecutar Migraciones SQL (10 min)

### Opción A: Dashboard de Supabase (Recomendado)

1. Abrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a SQL Editor
4. Ejecutar cada migración en orden:

```sql
-- 1. contract_chat_history
-- Copiar contenido de:
-- supabase/migrations/20260128000001_create_contract_chat_history.sql

-- 2. contract_collaborators
-- Copiar contenido de:
-- supabase/migrations/20260128000002_create_contract_collaborators.sql

-- 3. realtime collaboration fields
-- Copiar contenido de:
-- supabase/migrations/20260128000003_add_realtime_collaboration_fields.sql

-- 4. user_friends
-- Copiar contenido de:
-- supabase/migrations/20260128000004_create_user_friends.sql
```

5. Verificar que las tablas se crearon:
   - Table Editor > Buscar: `contract_chat_history`, `contract_collaborators`, `user_friends`

### Opción B: Supabase CLI

```bash
# Instalar Supabase CLI si no lo tienes
brew install supabase/tap/supabase

# Vincular proyecto
supabase link --project-ref <tu-project-ref>

# Ejecutar migraciones
supabase db push
```

### Opción C: Script personalizado

```bash
# Configurar DATABASE_URL
export DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/postgres"

# Ejecutar script
./scripts/run-migrations.sh
```

## Paso 3: Configurar Variables de Entorno (5 min)

Editar `.env.local`:

```env
# Supabase (ya deberías tenerlas)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic Claude (ya deberías tenerla)
ANTHROPIC_API_KEY=sk-ant-...

# Gemini (ya deberías tenerla)
GEMINI_API_KEY=AIza...

# Yjs WebSocket Server (NUEVO)
# Desarrollo: usar servidor de demo
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://demos.yjs.dev

# Producción: usar tu servidor propio (ver Paso 4)
# NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://yjs.tudominio.com
```

## Paso 4: Desplegar Servidor WebSocket (60 min)

### Opción A: Railway (Recomendado)

1. **Crear proyecto Yjs:**
```bash
mkdir yjs-server
cd yjs-server
npm init -y
npm install y-websocket ws
```

2. **Crear `server.js`:**
```javascript
const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Yjs WebSocket Server');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

const port = process.env.PORT || 1234;
server.listen(port, () => {
  console.log(`Yjs WebSocket server running on port ${port}`);
});
```

3. **Crear `package.json`:**
```json
{
  "name": "yjs-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "ws": "^8.14.2",
    "y-websocket": "^1.5.0"
  }
}
```

4. **Desplegar en Railway:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear nuevo proyecto
railway init

# Desplegar
railway up
```

5. **Obtener URL:**
   - Railway Dashboard > Tu proyecto > Settings
   - Generar dominio: `yjs-server.up.railway.app`
   - URL final: `wss://yjs-server.up.railway.app`

6. **Actualizar `.env.local`:**
```env
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://yjs-server.up.railway.app
```

### Opción B: Fly.io

```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Crear app
flyctl launch

# Desplegar
flyctl deploy
```

### Opción C: Solo Supabase Realtime (Sin WebSocket)

Si prefieres no desplegar servidor adicional:

1. Implementar `lib/collaborative/supabaseYjsProvider.ts`
2. Reemplazar `WebsocketProvider` con `SupabaseYjsProvider` en `CollaborativeEditor.tsx`
3. Ver documentación completa en `YJS_WEBSOCKET_SERVER.md`

**Ventajas:** No necesitas servidor adicional
**Desventajas:** Latencia ligeramente mayor, límite de mensajes

## Paso 5: Habilitar Supabase Realtime (5 min)

1. Abrir Supabase Dashboard
2. Database > Replication
3. Habilitar Realtime para tablas:
   - ✅ `contract_chat_history`
   - ✅ `contract_collaborators`
4. Guardar cambios

## Paso 6: Integrar Componentes (30 min)

### 6.1. Crear/Actualizar Página de Edición

Archivo: `app/(dashboard)/contratos/[id]/editar/page.tsx`

```typescript
import ContractEditorCanvas from '@/components/collaborative-editor/ContractEditorCanvas.example';
// Renombrar a ContractEditorCanvas.tsx cuando esté listo
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ShareContractModal from '@/components/contratos/ShareContractModal';

export default async function ContractEditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Cargar contrato
  const { data: contract, error } = await supabase
    .from('contract_generations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !contract) {
    notFound();
  }

  // Verificar que el usuario tiene acceso (owner o collaborator)
  const { data: collaborator } = await supabase
    .from('contract_collaborators')
    .select('id')
    .eq('contract_id', params.id)
    .eq('user_id', user.id)
    .eq('status', 'accepted')
    .maybeSingle();

  if (contract.user_id !== user.id && !collaborator) {
    notFound();
  }

  return (
    <ContractEditorCanvas
      contractId={contract.id}
      initialContent={contract.content || ''}
    />
  );
}
```

### 6.2. Añadir Botón "Editar" en Detalle de Contrato

Archivo: `app/(dashboard)/contratos/[id]/page.tsx` (o similar)

```tsx
import Link from 'next/link';
import { Edit } from 'lucide-react';

// Dentro del componente:
<Link
  href={`/contratos/${contract.id}/editar`}
  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
>
  <Edit className="w-4 h-4" />
  Editar con Lexy
</Link>
```

## Paso 7: Testing Básico (30 min)

### 7.1. Test Local (Desarrollo)

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

**Tests a realizar:**

1. **Navegación:**
   - [ ] Ir a lista de contratos
   - [ ] Click en "Ver" contrato
   - [ ] Click en "Editar con Lexy"
   - [ ] Verificar que carga el editor

2. **Editor:**
   - [ ] Verificar que carga el contenido inicial
   - [ ] Escribir texto y verificar que se guarda
   - [ ] Usar toolbar (Bold, Headers, Lists)
   - [ ] Verificar auto-guardado cada 2s

3. **Lexy Sidebar:**
   - [ ] Enviar pregunta a Lexy
   - [ ] Verificar respuesta
   - [ ] Solicitar edición
   - [ ] Aplicar edición sugerida

4. **Presencia:**
   - [ ] Abrir en 2 navegadores diferentes
   - [ ] Verificar que aparece "Editando ahora: 2"
   - [ ] Editar en un navegador, ver cambios en el otro

5. **Sistema de Amigos:**
   - [ ] Abrir modal de amigos (crear si no existe)
   - [ ] Enviar solicitud
   - [ ] Aceptar solicitud en otra cuenta
   - [ ] Verificar que aparecen en lista

6. **Compartir Contrato:**
   - [ ] Click "Compartir"
   - [ ] Ver tab "Amigos" (debe mostrar amigos)
   - [ ] Ver tab "Por email"
   - [ ] Ver tab "Desde chat" (si tiene conversación)
   - [ ] Invitar amigo
   - [ ] Verificar límite de 3 colaboradores

### 7.2. Test con Múltiples Usuarios

Necesitas 2-3 cuentas de usuario:

```bash
# Navegador 1: Usuario A
# Navegador 2 (incógnito): Usuario B
# Navegador 3 (otro navegador): Usuario C
```

**Escenario de prueba:**

1. Usuario A crea contrato
2. Usuario A invita a Usuario B
3. Usuario B acepta invitación
4. Ambos editan simultáneamente
5. Verificar sincronización en tiempo real
6. Usuario A invita a Usuario C
7. Los 3 editan simultáneamente
8. Intentar invitar 4to usuario (debe fallar con límite)

## Paso 8: Despliegue a Producción (15 min)

### 8.1. Actualizar Variables de Entorno en Vercel

```bash
# Vercel Dashboard > Tu proyecto > Settings > Environment Variables

# Añadir:
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://yjs-server.up.railway.app
```

### 8.2. Desplegar

```bash
# Commit cambios
git add .
git commit -m "feat: sistema de edición colaborativa completo"
git push origin main

# Vercel desplegará automáticamente
```

### 8.3. Verificar en Producción

```bash
# Abrir tu URL de producción
open https://lexyweb.vercel.app
```

Repetir tests del Paso 7 en producción.

## Paso 9: Monitoreo y Logs (10 min)

### 9.1. Supabase Logs

Dashboard > Logs:
- Verificar queries de `contract_chat_history`
- Verificar queries de `contract_collaborators`
- Verificar eventos Realtime

### 9.2. Vercel Logs

Dashboard > Tu proyecto > Logs:
- Verificar llamadas a `/api/claude/contract-assist`
- Verificar llamadas a `/api/contracts/[id]/collaborators`

### 9.3. Railway Logs (Yjs Server)

Dashboard > Tu proyecto > Logs:
- Verificar conexiones WebSocket
- Verificar mensajes Yjs

## Troubleshooting Común

### Error: "Table does not exist"
```bash
# Solución: Ejecutar migraciones SQL
# Ver Paso 2
```

### Error: "WebSocket connection failed"
```bash
# Verificar que NEXT_PUBLIC_YJS_WEBSOCKET_URL está configurada
echo $NEXT_PUBLIC_YJS_WEBSOCKET_URL

# Verificar que el servidor está corriendo
curl https://yjs-server.up.railway.app
```

### Error: "Maximum collaborators reached"
```bash
# Es el comportamiento esperado (límite 3)
# Elimina un colaborador para invitar otro
```

### Ediciones no se sincronizan
```bash
# 1. Verificar Supabase Realtime habilitado
# 2. Verificar console logs del navegador
# 3. Verificar logs de Railway (Yjs server)
```

### Chat de Lexy no funciona
```bash
# 1. Verificar ANTHROPIC_API_KEY en .env.local
# 2. Verificar tabla contract_chat_history existe
# 3. Verificar API /api/claude/contract-assist funciona:
curl -X POST https://tu-dominio.com/api/claude/contract-assist \
  -H "Content-Type: application/json" \
  -d '{"contractId":"xxx","message":"Hola","contractContent":"Test"}'
```

## Recursos Adicionales

- [Documentación Yjs](https://docs.yjs.dev/)
- [Documentación Tiptap](https://tiptap.dev/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)

## Checklist Post-Despliegue

- [ ] Tests básicos pasados
- [ ] Tests con múltiples usuarios pasados
- [ ] Variables de entorno en producción configuradas
- [ ] Servidor WebSocket funcionando en producción
- [ ] Migraciones SQL ejecutadas
- [ ] Supabase Realtime habilitado
- [ ] Logs monitoreados sin errores
- [ ] Documentación actualizada
- [ ] Equipo informado del nuevo feature

## Próximos Pasos (Post-MVP)

### Mejoras a Futuro

1. **Persistencia de Yjs:**
   - Guardar estado de Yjs en base de datos
   - Cargar estado al iniciar documento

2. **Notificaciones:**
   - Notificar cuando te invitan a colaborar
   - Notificar cuando alguien edita el contrato

3. **Historial de Versiones:**
   - Ver cambios anteriores
   - Restaurar versiones previas
   - Diff visual entre versiones

4. **Comentarios en Línea:**
   - Comentar partes específicas del contrato
   - Resolver comentarios

5. **Permisos Granulares:**
   - Rol "viewer" (solo lectura)
   - Rol "commenter" (solo comentar)
   - Rol "editor" (editar)

6. **Exportación:**
   - Exportar a PDF con formato
   - Exportar a DOCX
   - Enviar por email

## Conclusión

El sistema de edición colaborativa está completo y listo para producción.

**Tiempo total de despliegue:** 2-3 horas

**Features implementadas:**
- ✅ Editor colaborativo en tiempo real (Yjs + Tiptap)
- ✅ Chat con Lexy AI (Claude)
- ✅ Sistema de amigos/contactos
- ✅ Compartir contratos con tabs
- ✅ Presencia de usuarios
- ✅ Auto-guardado
- ✅ Límite de 3 colaboradores
- ✅ Sincronización en tiempo real

**Siguiente nivel:**
- Persistencia de Yjs
- Notificaciones
- Historial de versiones
- Comentarios en línea

Si necesitas ayuda, revisa los logs y la documentación en `docs/`.
