# Sistema de Edición Colaborativa

Este directorio contiene los componentes del sistema de edición colaborativa de contratos con dos modos distintos:

## Modos de Edición

### 1. Editar con Lexy (AI Asistida + Tiempo Real)

**Ruta**: `/contratos/[id]/editar`

**Componente**: `ContractEditorWithLexy.tsx`

**Características**:
- Sidebar de Lexy (450px izquierda) con chat IA
- Editor colaborativo (flex-1 derecha)
- Asistencia IA para sugerencias y ediciones automáticas
- Edición colaborativa en tiempo real con Yjs
- Presencia de usuarios (avatares + cursores)
- Toolbar de formato
- Auto-guardado cada 2 segundos

**Layout**:
```
┌──────────────────────────────────────────┐
│  Editar con Lexy - [Título Contrato]    │
├────────────────┬─────────────────────────┤
│ Lexy Sidebar   │ Collaborative Editor    │
│ (450px)        │ (flex-1)                │
│                │                         │
│ Chat con IA    │ • Editor Yjs            │
│ Sugerencias    │ • Presencia bar         │
│ Auto-edición   │ • Toolbar               │
│                │ • Cursores              │
└────────────────┴─────────────────────────┘
```

**Uso**:
```tsx
<ContractEditorWithLexy
  contractId="abc123"
  initialContent="# Mi Contrato..."
  maxCollaborators={3}
  readOnly={false}
/>
```

### 2. Edición Colaborativa (Google Docs Style)

**Ruta**: `/contratos/[id]/editar-colaborativo`

**Componente**: `CollaborativeEditorWrapper.tsx`

**Características**:
- Solo editor (pantalla completa, sin Lexy)
- Edición colaborativa en tiempo real con Yjs
- Presencia de usuarios (avatares + cursores)
- Toolbar de formato
- Auto-guardado cada 2 segundos
- **SIN** chat de IA

**Layout**:
```
┌──────────────────────────────────────────┐
│  Edición Colaborativa - [Título]        │
├──────────────────────────────────────────┤
│ Presencia Bar                            │
├──────────────────────────────────────────┤
│ Toolbar                                  │
├──────────────────────────────────────────┤
│                                          │
│ Editor Colaborativo                      │
│ (pantalla completa)                      │
│                                          │
└──────────────────────────────────────────┘
```

**Uso**:
```tsx
<CollaborativeEditorWrapper
  contractId="abc123"
  initialContent="# Mi Contrato..."
  readOnly={false}
/>
```

## Componentes Compartidos

### CollaborativeEditor.tsx

Editor base con Tiptap + Yjs para edición colaborativa en tiempo real.

**Características**:
- Yjs CRDT para sincronización sin conflictos
- WebSocket provider (usando `wss://demos.yjs.dev` - cambiar en producción)
- Awareness para presencia de usuarios
- Cursores colaborativos
- Auto-guardado
- Límite de colaboradores simultáneos

### LexyAssistantSidebar.tsx

Sidebar con chat de IA para asistencia legal.

**Características**:
- Chat con Lexy (IA legal)
- Historial de conversación en tiempo real (Supabase Realtime)
- Sugerencias de edición aplicables directamente al editor
- Integración con `onApplyEdit` para aplicar cambios al editor Yjs

**Integración con Yjs**:
```tsx
const handleLexyApplyEdit = (editSuggestion: string) => {
  if (editor) {
    // Reemplazar contenido - Yjs sincroniza automáticamente
    editor.commands.setContent(editSuggestion);
    handleManualSave();
  }
};
```

### EditorPresenceBar.tsx

Barra de presencia que muestra usuarios activos.

**Características**:
- Avatares de usuarios conectados
- Colores asignados determinísticamente
- Indicador de capacidad (3/3 usuarios)

### EditorToolbar.tsx

Toolbar de formato para el editor.

**Características**:
- Negrita, cursiva, código
- Listas ordenadas y desordenadas
- Citas
- Headings (H1, H2, H3)
- Deshacer/rehacer

## Arquitectura Técnica

### Sincronización con Yjs

Yjs utiliza CRDTs (Conflict-free Replicated Data Types) para permitir edición colaborativa sin conflictos:

```typescript
// 1. Crear documento Yjs
const ydoc = new Y.Doc();

// 2. Conectar con WebSocket provider
const provider = new WebsocketProvider(
  'wss://demos.yjs.dev',
  `lexy-contract-${contractId}`,
  ydoc
);

// 3. Configurar editor Tiptap con Yjs
const editor = useEditor({
  extensions: [
    StarterKit.configure({ history: false }), // Importante: desactivar history
    Collaboration.configure({ document: ydoc }),
    CollaborationCursor.configure({ provider }),
  ],
});
```

### Presencia de Usuarios

La presencia se maneja en dos capas:

1. **Awareness API (Yjs)**: Para cursores y edición en tiempo real
2. **Supabase Database**: Para persistencia y heartbeat

```typescript
// Awareness (Yjs)
awareness.setLocalState({
  user: { id, name, color, avatar_url },
  cursor: null,
});

// Heartbeat (Supabase)
setInterval(() => {
  fetch(`/api/contracts/${contractId}/collaborators/heartbeat`, {
    method: 'POST',
    body: JSON.stringify({ user_id }),
  });
}, 30000);
```

### Auto-guardado

Ambos modos implementan auto-guardado con debounce:

```typescript
useEffect(() => {
  if (!editor) return;

  let saveTimeout: NodeJS.Timeout;

  const handleUpdate = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      const content = editor.getHTML();
      await handleSave(content);
    }, 2000); // 2 segundos de inactividad
  };

  editor.on('update', handleUpdate);

  return () => {
    editor.off('update', handleUpdate);
    clearTimeout(saveTimeout);
  };
}, [editor, handleSave]);
```

## Botones en ContractDetailView

En la vista de detalle del contrato, se muestran DOS botones diferenciados:

```tsx
{/* Botón 1: AI Asistida */}
<Button
  onClick={() => router.push(`/contratos/${contract.id}/editar`)}
  className="bg-gradient-to-r from-indigo-600 to-purple-600"
>
  <Sparkles className="w-4 h-4" />
  Editar con Lexy (IA + Tiempo Real)
</Button>

{/* Botón 2: Google Docs Style */}
<Button
  onClick={() => router.push(`/contratos/${contract.id}/editar-colaborativo`)}
  className="border-blue-300 text-blue-700"
>
  <Users className="w-4 h-4" />
  Edición Colaborativa (Solo Editor)
</Button>
```

## Diferencias Clave

| Feature | Con Lexy | Google Docs Puro |
|---------|----------|------------------|
| Sidebar Lexy | ✅ Sí (450px) | ❌ No |
| Editor | ✅ Sí (flex-1) | ✅ Sí (pantalla completa) |
| Presencia | ✅ Sí | ✅ Sí |
| Toolbar | ✅ Sí | ✅ Sí |
| Cursores | ✅ Sí | ✅ Sí |
| Chat IA | ✅ Sí | ❌ No |
| Auto-edición IA | ✅ Sí | ❌ No |
| Canal Yjs | Mismo | Mismo |
| Sincronización | Tiempo real | Tiempo real |

## Testing

### Probar Modo con Lexy

1. Abrir contrato → Click "Editar con Lexy"
2. Verificar que aparece sidebar a la izquierda
3. Verificar que aparece editor a la derecha
4. Preguntar algo a Lexy en el chat
5. Pedir edición a Lexy → Verificar que se aplica al editor
6. Abrir mismo contrato en otra pestaña/navegador
7. Verificar sincronización en tiempo real

### Probar Modo Google Docs

1. Abrir contrato → Click "Edición Colaborativa"
2. Verificar que aparece solo editor (sin Lexy)
3. Editar texto
4. Abrir mismo contrato en otra pestaña/navegador
5. Verificar sincronización en tiempo real
6. Verificar presencia de usuarios

### Probar Sincronización Cruzada

1. Abrir modo "Con Lexy" en navegador A
2. Abrir modo "Google Docs" en navegador B
3. Editar en A → Verificar que se refleja en B
4. Editar en B → Verificar que se refleja en A
5. Pedir edición a Lexy en A → Verificar que se refleja en B

## TODO: Producción

⚠️ **CRÍTICO**: Antes de producción:

1. **Reemplazar WebSocket server**:
   ```typescript
   // ❌ NO usar en producción
   const wsProvider = new WebsocketProvider('wss://demos.yjs.dev', ...);

   // ✅ Usar servidor propio
   const wsProvider = new WebsocketProvider('wss://ws.tudominio.com', ...);
   ```

2. **Configurar límites**:
   - Max colaboradores por contrato (actual: 3)
   - Timeout de inactividad
   - Políticas de permisos

3. **Monitoreo**:
   - Métricas de uso de WebSocket
   - Latencia de sincronización
   - Errores de conexión

## API Endpoints

### POST `/api/contracts/[id]/collaborators/heartbeat`

Actualiza `last_seen_at` para presencia en base de datos.

**Body**:
```json
{
  "user_id": "uuid"
}
```

### PATCH `/api/contracts/[id]`

Guarda el contenido del contrato.

**Body**:
```json
{
  "contenido_markdown": "<p>Contenido HTML del editor</p>"
}
```

## Dependencias

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-collaboration": "^2.x",
  "@tiptap/extension-collaboration-cursor": "^2.x",
  "yjs": "^13.x",
  "y-websocket": "^1.x",
  "@supabase/supabase-js": "^2.x"
}
```

## Soporte

Para problemas o preguntas sobre el sistema de edición colaborativa, contacta al equipo de desarrollo.
