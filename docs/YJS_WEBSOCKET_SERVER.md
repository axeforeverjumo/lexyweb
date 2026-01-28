# Servidor WebSocket para Yjs

El editor colaborativo actual usa un servidor de demostración público (`wss://demos.yjs.dev`). **NO ES APTO PARA PRODUCCIÓN**.

## Opciones para Producción

### Opción 1: Servidor Yjs Auto-Hospedado (Recomendado)

Usa el paquete oficial `y-websocket-server`:

```bash
# Crear servidor separado
mkdir yjs-server && cd yjs-server
npm init -y
npm install y-websocket ws
```

**server.js:**
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

**Ejecutar:**
```bash
node server.js
```

**Desplegar en:**
- Vercel (como API route con WebSocket)
- Railway
- Fly.io
- VPS propio

### Opción 2: Usar Supabase Realtime + Yjs Provider Custom

Crear un provider custom que use Supabase Realtime en lugar de WebSocket:

**lib/collaborative/supabaseYjsProvider.ts:**
```typescript
import * as Y from 'yjs';
import { createClient } from '@/lib/supabase/client';

export class SupabaseYjsProvider {
  private ydoc: Y.Doc;
  private channel: any;
  private contractId: string;

  constructor(contractId: string, ydoc: Y.Doc) {
    this.contractId = contractId;
    this.ydoc = ydoc;

    const supabase = createClient();
    this.channel = supabase.channel(`yjs:${contractId}`);

    // Listen for remote updates
    this.channel
      .on('broadcast', { event: 'update' }, ({ payload }) => {
        Y.applyUpdate(this.ydoc, new Uint8Array(payload.update));
      })
      .subscribe();

    // Send local updates
    this.ydoc.on('update', (update: Uint8Array) => {
      this.channel.send({
        type: 'broadcast',
        event: 'update',
        payload: { update: Array.from(update) },
      });
    });
  }

  destroy() {
    this.channel.unsubscribe();
  }
}
```

**Ventajas:**
- No necesita servidor WebSocket adicional
- Usa infraestructura de Supabase
- Más simple de desplegar

**Desventajas:**
- Supabase Realtime tiene límites de mensajes (500 por segundo)
- Latencia ligeramente mayor que WebSocket directo

### Opción 3: Hybrid (Recomendado para este proyecto)

Usar Supabase Realtime SOLO para:
- Presencia de usuarios
- Notificaciones de cambios

Y WebSocket Yjs para:
- Sincronización del documento

Esto es lo que está implementado actualmente.

## Configuración Actual

El código en `CollaborativeEditor.tsx` usa:
```typescript
const wsProvider = new WebsocketProvider(
  'wss://demos.yjs.dev',  // ⚠️ CAMBIAR EN PRODUCCIÓN
  `lexy-contract-${contractId}`,
  ydoc
);
```

## Cambiar a Producción

1. **Desplegar servidor Yjs:**
```bash
# En servidor (Railway, Fly.io, etc.)
git clone https://github.com/yjs/y-websocket
cd y-websocket
npm install
PORT=1234 npm start
```

2. **Actualizar URL en código:**
```typescript
const wsProvider = new WebsocketProvider(
  'wss://yjs.tudominio.com',  // Tu servidor
  `lexy-contract-${contractId}`,
  ydoc
);
```

3. **Añadir variable de entorno:**
```env
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://yjs.tudominio.com
```

4. **Usar en código:**
```typescript
const wsProvider = new WebsocketProvider(
  process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL!,
  `lexy-contract-${contractId}`,
  ydoc
);
```

## Persistencia de Documentos Yjs

Para guardar el estado de Yjs en base de datos:

```typescript
// Cuando se actualiza el documento
ydoc.on('update', async (update: Uint8Array) => {
  await supabase
    .from('contract_yjs_state')
    .upsert({
      contract_id: contractId,
      yjs_state: Array.from(update),
      updated_at: new Date().toISOString(),
    });
});

// Al cargar el documento
const { data } = await supabase
  .from('contract_yjs_state')
  .select('yjs_state')
  .eq('contract_id', contractId)
  .single();

if (data?.yjs_state) {
  Y.applyUpdate(ydoc, new Uint8Array(data.yjs_state));
}
```

## Migración SQL para Persistencia

```sql
CREATE TABLE contract_yjs_state (
  contract_id UUID PRIMARY KEY REFERENCES contract_generations(id) ON DELETE CASCADE,
  yjs_state BYTEA NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Monitoreo

```typescript
wsProvider.on('status', (event: { status: string }) => {
  console.log('WebSocket status:', event.status);
  // 'connected', 'disconnected', 'connecting'
});

wsProvider.on('sync', (isSynced: boolean) => {
  console.log('Document synced:', isSynced);
});
```

## Troubleshooting

### Error: "WebSocket connection failed"
- Verificar que el servidor Yjs esté ejecutándose
- Verificar URL correcta (ws:// para http, wss:// para https)
- Verificar firewall y CORS

### Error: "Too many users"
- Implementar límite de colaboradores en servidor
- Verificar lógica de maxCollaborators

### Latencia alta
- Verificar ubicación del servidor WebSocket
- Considerar usar CDN para WebSocket (Cloudflare Workers)
- Optimizar tamaño de updates

## Recursos

- [Yjs Docs](https://docs.yjs.dev/)
- [y-websocket GitHub](https://github.com/yjs/y-websocket)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
