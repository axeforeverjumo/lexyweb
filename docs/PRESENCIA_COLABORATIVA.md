# Presencia Colaborativa en Tiempo Real

Implementación de presencia de usuarios en tiempo real usando **Yjs Awareness**, sin depender de Supabase Realtime.

## Arquitectura

### Componentes Principales

1. **CollaborativeEditor.tsx**: Editor principal con Yjs y Tiptap
2. **EditorPresenceBar.tsx**: Barra de presencia con avatares de usuarios
3. **CollaborativeEditorWrapper.tsx**: Wrapper con header y navegación
4. **Heartbeat API**: Actualización de `last_seen_at` en base de datos

### Tecnologías Usadas

- **Yjs**: CRDT para sincronización de documentos
- **y-websocket**: WebSocket provider para Yjs
- **Yjs Awareness API**: Sistema de presencia nativo de Yjs
- **Tiptap**: Editor WYSIWYG con soporte colaborativo
- **CollaborationCursor**: Extensión de Tiptap para cursores colaborativos

## Flujo de Presencia

### 1. Inicialización

```typescript
// CollaborativeEditor.tsx - línea 56+
const wsProvider = new WebsocketProvider(
  'wss://demos.yjs.dev', // TODO: Reemplazar por servidor propio
  `lexy-contract-${contractId}`,
  ydoc
);

const awareness = wsProvider.awareness;
```

### 2. Establecer Estado Local

```typescript
awareness.setLocalState({
  user: {
    id: currentUser.id,
    name: currentUser.name,
    color: getUserColor(currentUser.id),
    avatar_url: currentUser.avatar || null,
  },
  cursor: null, // Actualizado automáticamente por Tiptap
});
```

### 3. Escuchar Cambios de Awareness

```typescript
awareness.on('change', () => {
  const states = Array.from(awareness.getStates().entries());
  const otherUsers = states
    .filter(([clientId]) => clientId !== awareness.clientID)
    .map(([_, state]) => ({
      user_id: state.user?.id,
      full_name: state.user?.name,
      avatar_url: state.user?.avatar_url,
      color: state.user?.color,
      last_seen: Date.now(),
    }));

  setCollaborators(otherUsers);
});
```

### 4. Heartbeat en Base de Datos

```typescript
// Actualizar cada 30 segundos
const interval = setInterval(() => {
  fetch(`/api/contracts/${contractId}/collaborators/heartbeat`, {
    method: 'POST',
    body: JSON.stringify({ user_id: currentUser.id }),
  });
}, 30000);
```

## Límite de Colaboradores

El sistema verifica el límite de 3 usuarios simultáneos:

```typescript
wsProvider.on('sync', (isSynced: boolean) => {
  if (isSynced) {
    const connectedCount = awareness.getStates().size;

    if (connectedCount > maxCollaborators) {
      alert('Este contrato ya tiene 3 usuarios editando.');
      wsProvider.destroy();
      return;
    }
  }
});
```

## Características Visuales

### Barra de Presencia

- Avatares de usuarios conectados
- Colores únicos por usuario (determinísticos basados en user_id)
- Indicador pulsante de "activo"
- Tooltip con nombre completo al hover
- Contador de espacios disponibles
- Alerta cuando se alcanza el límite

### Cursores Colaborativos

Tiptap CollaborationCursor muestra:
- Cursor en color del usuario
- Etiqueta con nombre del usuario
- Posición en tiempo real

## API Endpoints

### POST /api/contracts/[id]/collaborators/heartbeat

Actualiza `last_seen_at` para un colaborador.

**Request:**
```json
{
  "user_id": "uuid-del-usuario"
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-01-28T10:30:00.000Z"
}
```

**Comportamiento:**
- Si el colaborador no existe, lo crea automáticamente
- Actualiza `last_seen_at` y `updated_at`
- Requiere autenticación

## Rutas

### Vista de Detalle de Contrato
`/contratos/[id]`

Botón: **"Edición Colaborativa (Tiempo Real)"**

### Editor Colaborativo
`/contratos/[id]/editar-colaborativo`

- Verificación de permisos (owner o colaborador)
- Modo solo lectura para viewers
- Header con botón de volver
- Editor con presencia en tiempo real

## Pruebas

### Requisitos

- 2-3 navegadores diferentes (Chrome, Firefox, Safari)
- Cuentas de usuario diferentes
- Contrato existente

### Pasos de Prueba

1. **Usuario 1 (Chrome)**:
   - Iniciar sesión
   - Abrir contrato: `/contratos/[id]`
   - Click en "Edición Colaborativa (Tiempo Real)"
   - Verificar que aparece "Solo tú" en barra de presencia

2. **Usuario 2 (Firefox)**:
   - Iniciar sesión con cuenta diferente
   - Abrir mismo contrato
   - Click en "Edición Colaborativa (Tiempo Real)"
   - Verificar que aparece avatar de Usuario 1
   - Verificar que Usuario 1 ve avatar de Usuario 2

3. **Usuario 3 (Safari)**:
   - Iniciar sesión con tercera cuenta
   - Abrir mismo contrato
   - Verificar presencia de 2 usuarios
   - Verificar mensaje "(0 espacios disponibles)"

4. **Usuario 4 (Intento)**:
   - Intentar abrir el editor
   - Debe recibir alerta: "Este contrato ya tiene 3 usuarios editando"

5. **Pruebas de Edición**:
   - Usuario 1 escribe texto
   - Verificar que Usuario 2 y 3 ven cambios en tiempo real
   - Verificar cursores visibles con colores únicos
   - Verificar nombres de usuarios en tooltips de cursores

6. **Pruebas de Desconexión**:
   - Usuario 2 cierra pestaña
   - Verificar que desaparece en 5-10 segundos
   - Usuario 4 puede ahora unirse (hay espacio)

### Comandos de Prueba

```bash
# Terminal 1: Monitorear heartbeats
tail -f /ruta/a/logs/servidor.log | grep heartbeat

# Terminal 2: Inspeccionar awareness state
# En DevTools del navegador:
window.wsProvider.awareness.getStates()

# Terminal 3: Verificar base de datos
psql -d lexyweb -c "SELECT contract_id, user_id, last_seen_at FROM contract_collaborators ORDER BY last_seen_at DESC LIMIT 10;"
```

## Configuración

### Variables de Entorno

Ninguna variable adicional requerida. Usa credenciales existentes de Supabase.

### WebSocket Server

**IMPORTANTE**: Actualmente usando servidor público de Yjs:
```
wss://demos.yjs.dev
```

**⚠️ NO USAR EN PRODUCCIÓN**

Para producción, desplegar servidor Yjs propio:

```bash
# Opción 1: y-websocket server
npm install -g y-websocket
y-websocket --port 1234

# Opción 2: Servidor personalizado
# Ver: https://github.com/yjs/y-websocket/tree/master/bin
```

Actualizar URL en `CollaborativeEditor.tsx`:
```typescript
const wsProvider = new WebsocketProvider(
  'wss://tu-servidor.com', // Tu servidor Yjs
  `lexy-contract-${contractId}`,
  ydoc
);
```

## Colores de Usuarios

Los colores se asignan de forma determinística basándose en el `user_id`:

```typescript
const USER_COLORS = [
  '#FF6B6B', // Rojo
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul
  '#FFA07A', // Coral
  '#98D8C8', // Mint
  '#F7DC6F', // Amarillo
  '#BB8FCE', // Púrpura
  '#85C1E2', // Sky
];

function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}
```

Esto garantiza que:
- Mismo usuario = siempre mismo color
- Usuarios diferentes = colores diferentes (en la medida de lo posible)

## Troubleshooting

### Problema: Usuarios no aparecen en barra de presencia

**Causa posible**: Awareness no sincronizado

**Solución**:
```typescript
// Verificar en DevTools:
wsProvider.awareness.getStates().size // Debe ser > 1

// Forzar update:
awareness.setLocalState(awareness.getLocalState());
```

### Problema: Cursor de colaborador no visible

**Causa posible**: CollaborationCursor no configurado

**Solución**:
```typescript
// Verificar en editor extensions:
editor.extensionManager.extensions.find(ext => ext.name === 'collaborationCursor')
```

### Problema: Alert de límite no funciona

**Causa posible**: sync event no se dispara

**Solución**:
```typescript
// Mover verificación a 'synced' property:
if (wsProvider.synced) {
  // Check count
}
```

### Problema: Heartbeat no actualiza base de datos

**Causa posible**: Endpoint no autenticado

**Solución**:
```bash
# Verificar auth en API route:
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
```

## Próximos Pasos

1. **Desplegar servidor Yjs propio** (producción)
2. **Metricas de colaboración**: tiempo de sesión, ediciones por usuario
3. **Notificaciones**: "Usuario X se unió/salió"
4. **Historial de cambios**: track de quién hizo qué cambio
5. **Permisos granulares**: editor vs. comentador vs. viewer
6. **Sincronización persistente**: guardar estado Yjs en BD

## Referencias

- [Yjs Documentation](https://docs.yjs.dev/)
- [Yjs Awareness API](https://docs.yjs.dev/api/about-awareness)
- [Tiptap Collaboration](https://tiptap.dev/collaboration)
- [y-websocket Provider](https://github.com/yjs/y-websocket)
