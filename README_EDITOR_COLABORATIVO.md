# Sistema de Edición Colaborativa de Contratos - LexyWeb

## Descripción

Sistema completo de edición colaborativa en tiempo real estilo Google Docs para contratos legales, integrado con asistencia de IA (Lexy).

**Features principales:**
- Edición simultánea de 1-3 usuarios en tiempo real
- Cursores de usuarios con colores únicos
- Presencia en tiempo real (quién está editando)
- Chat con Lexy AI para asistencia legal
- Sistema de amigos para compartir rápidamente
- Auto-guardado cada 2 segundos
- Sincronización automática de cambios
- Resolución de conflictos automática (CRDT)

## Stack Tecnológico

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Editor:** Tiptap + Yjs (CRDT)
- **IA:** Claude Sonnet 4.5 (Anthropic)
- **Base de datos:** Supabase (PostgreSQL + Realtime)
- **WebSocket:** Yjs WebSocket Server (Railway)
- **Despliegue:** Vercel

## Arquitectura

```
┌──────────────────────────────────────────────┐
│  Canvas Editor Layout                        │
├──────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────────┐   │
│ │ Lexy Sidebar   │ │ Real-time Editor   │   │
│ │ (450px)        │ │ (flex-1)           │   │
│ │                │ │                    │   │
│ │ Chat con IA    │ │ • Editor Yjs       │   │
│ │ Sugerencias    │ │ • Cursores users   │   │
│ │ Auto-edición   │ │ • Presencia bar    │   │
│ │                │ │ • Toolbar format   │   │
│ └────────────────┘ └────────────────────┘   │
└──────────────────────────────────────────────┘
```

## Estructura de Archivos

```
lexyweb/
├── app/
│   └── api/
│       ├── claude/
│       │   └── contract-assist/route.ts    # Chat con Lexy
│       ├── contracts/
│       │   └── [id]/
│       │       └── collaborators/
│       │           ├── route.ts            # CRUD colaboradores
│       │           └── [userId]/route.ts
│       └── friends/
│           ├── route.ts                    # Lista/crear amigos
│           └── [id]/route.ts               # Actualizar/eliminar
├── components/
│   ├── collaborative-editor/
│   │   ├── CollaborativeEditor.tsx         # Editor principal (Yjs + Tiptap)
│   │   ├── EditorPresenceBar.tsx           # Usuarios conectados
│   │   ├── EditorToolbar.tsx               # Formato (Bold, Headers, etc.)
│   │   ├── LexyAssistantSidebar.tsx        # Chat con IA
│   │   ├── ContractEditorCanvas.example.tsx # Ejemplo de integración
│   │   └── types.ts                        # TypeScript types
│   ├── contratos/
│   │   └── ShareContractModal.tsx          # Modal compartir (3 tabs)
│   └── friends/
│       └── FriendsModal.tsx                # Gestión de amigos
├── supabase/
│   └── migrations/
│       ├── 20260128000001_create_contract_chat_history.sql
│       ├── 20260128000002_create_contract_collaborators.sql
│       ├── 20260128000003_add_realtime_collaboration_fields.sql
│       └── 20260128000004_create_user_friends.sql
├── scripts/
│   └── run-migrations.sh                   # Script para migraciones
└── docs/
    ├── MODELOS_IA.md                       # Configuración Gemini/Claude
    ├── INSTALACION_EDITOR_COLABORATIVO.md  # Dependencias NPM
    ├── YJS_WEBSOCKET_SERVER.md             # Servidor WebSocket
    ├── RESUMEN_IMPLEMENTACION_COLABORATIVO.md
    └── GUIA_DESPLIEGUE_COMPLETO.md         # Guía paso a paso
```

## Instalación Rápida

### 1. Instalar Dependencias

```bash
npm install yjs y-websocket y-protocols @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor nanoid
```

### 2. Ejecutar Migraciones SQL

Opción A - Dashboard de Supabase:
1. Dashboard > SQL Editor
2. Ejecutar cada archivo `.sql` en orden

Opción B - Supabase CLI:
```bash
supabase db push
```

### 3. Configurar Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://demos.yjs.dev  # Desarrollo
```

### 4. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

### 5. Probar

1. Ir a un contrato
2. Click "Editar con Lexy"
3. Probar edición en 2 navegadores simultáneamente

## Guía de Uso

### Para Usuarios

1. **Abrir Editor:**
   - Dashboard > Contratos > [Seleccionar contrato] > "Editar con Lexy"

2. **Editar Contrato:**
   - Escribe directamente en el editor
   - Usa toolbar para formato (Bold, Headers, Lists)
   - Cambios se guardan automáticamente cada 2s

3. **Preguntar a Lexy:**
   - Sidebar izquierdo > Chat
   - Escribe tu pregunta
   - Lexy responderá y puede sugerir ediciones
   - Click "Aplicar cambios" para aceptar sugerencias

4. **Compartir con Colaboradores:**
   - Click "Compartir" (arriba derecha)
   - Tab "Amigos" - Invitar amigos existentes
   - Tab "Por email" - Buscar por email
   - Tab "Desde chat" - Invitar participantes de conversación
   - Máximo 3 colaboradores simultáneos

5. **Ver Quién Está Editando:**
   - Barra superior muestra avatares de usuarios conectados
   - Cursores de colores muestran dónde están escribiendo otros

### Para Desarrolladores

#### Integrar en Nueva Página

```tsx
import ContractEditorCanvas from '@/components/collaborative-editor/ContractEditorCanvas.example';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <ContractEditorCanvas
      contractId={params.id}
      initialContent="# Mi Contrato"
      onSave={async (content) => {
        // Guardar en BD
      }}
    />
  );
}
```

#### Personalizar Editor

```tsx
<CollaborativeEditor
  contractId={contractId}
  initialContent={content}
  onContentChange={(newContent) => console.log(newContent)}
  onSave={handleSave}
  maxCollaborators={3}
  readOnly={false}
/>
```

#### Añadir Botón de Compartir

```tsx
import ShareContractModal from '@/components/contratos/ShareContractModal';

const [showShare, setShowShare] = useState(false);

<Button onClick={() => setShowShare(true)}>Compartir</Button>

<ShareContractModal
  contractId={contractId}
  conversacionId={conversacionId}
  isOpen={showShare}
  onClose={() => setShowShare(false)}
/>
```

## API Reference

### Colaboradores

```typescript
// GET /api/contracts/[id]/collaborators
// Lista colaboradores de un contrato
Response: {
  collaborators: Array<{
    id: string;
    user_id: string;
    role: 'editor' | 'viewer';
    status: 'pending' | 'accepted' | 'rejected';
    profiles: { email, nombre, apellidos };
  }>
}

// POST /api/contracts/[id]/collaborators
// Invitar colaborador
Body: { userId: string, role: 'editor' }
Response: { message: string }

// DELETE /api/contracts/[id]/collaborators/[userId]
// Eliminar colaborador
Response: { message: string }
```

### Amigos

```typescript
// GET /api/friends?status=accepted
// Lista amigos
Response: {
  friendships: Array<{
    id: string;
    friend: { id, full_name, email, avatar_url };
    status: 'pending' | 'accepted';
  }>
}

// POST /api/friends
// Enviar solicitud de amistad
Body: { friendEmail: string }
Response: { friendship: {...}, message: string }

// PATCH /api/friends/[id]
// Aceptar/rechazar solicitud
Body: { action: 'accept' | 'reject' | 'block' }
Response: { friendship: {...}, message: string }

// DELETE /api/friends/[id]
// Eliminar amistad
Response: { message: string }
```

### Chat con Lexy

```typescript
// POST /api/claude/contract-assist
// Enviar mensaje a Lexy
Body: {
  contractId: string;
  message: string;
  contractContent: string;
}
Response: {
  message: string;              // Respuesta de Lexy
  editSuggestion: string | null; // Nuevo contenido si hay edición
  changedText: string | null;    // Texto modificado (para highlight)
}
```

## Base de Datos

### Tablas Principales

**contract_chat_history** - Historial de chat con Lexy
- contract_id (FK)
- user_id (FK)
- role ('user' | 'assistant')
- content (TEXT)
- edit_suggestion (TEXT, nullable)
- created_at

**contract_collaborators** - Colaboradores de contratos
- contract_id (FK)
- user_id (FK)
- invited_by (FK)
- role ('editor' | 'viewer')
- status ('pending' | 'accepted' | 'rejected')
- permissions (JSONB)
- last_seen_at (TIMESTAMPTZ, para presencia)
- cursor_position (JSONB, para cursores)

**user_friends** - Sistema de amigos
- user_id (FK)
- friend_id (FK)
- status ('pending' | 'accepted' | 'rejected' | 'blocked')
- created_at
- updated_at

## Despliegue a Producción

### Prerrequisitos

- [ ] Cuenta Vercel
- [ ] Cuenta Railway (para WebSocket)
- [ ] Proyecto Supabase configurado

### Pasos

1. **Desplegar Servidor WebSocket:**
```bash
# Crear proyecto en Railway
railway init
railway up

# Obtener URL: wss://xxx.railway.app
```

2. **Configurar Variables en Vercel:**
```bash
NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://xxx.railway.app
```

3. **Habilitar Supabase Realtime:**
   - Dashboard > Database > Replication
   - Habilitar para tablas: `contract_chat_history`, `contract_collaborators`

4. **Desplegar Next.js:**
```bash
git push origin main
# Vercel despliega automáticamente
```

Ver guía completa en `docs/GUIA_DESPLIEGUE_COMPLETO.md`

## Testing

### Tests Unitarios

```bash
npm test
```

### Tests E2E

```bash
npm run test:e2e
```

### Tests Manuales

1. **Edición Colaborativa:**
   - Abrir 2 navegadores
   - Editar simultáneamente
   - Verificar sincronización

2. **Sistema de Amigos:**
   - Enviar solicitud
   - Aceptar/rechazar
   - Invitar desde modal de compartir

3. **Chat con Lexy:**
   - Hacer pregunta
   - Solicitar edición
   - Aplicar sugerencia

## Troubleshooting

### Error: "Table does not exist"
**Solución:** Ejecutar migraciones SQL

### Error: "WebSocket connection failed"
**Solución:** Verificar `NEXT_PUBLIC_YJS_WEBSOCKET_URL`

### Error: "Maximum collaborators reached"
**Solución:** Es el comportamiento esperado (límite 3)

### Ediciones no se sincronizan
**Solución:**
1. Verificar Supabase Realtime habilitado
2. Verificar console logs
3. Verificar servidor WebSocket corriendo

Ver más en `docs/GUIA_DESPLIEGUE_COMPLETO.md`

## Roadmap

### MVP (Completado) ✅
- [x] Editor colaborativo en tiempo real
- [x] Chat con Lexy AI
- [x] Sistema de amigos
- [x] Modal de compartir con tabs
- [x] Presencia de usuarios
- [x] Auto-guardado
- [x] Límite de 3 colaboradores

### Fase 2 (Próximamente)
- [ ] Persistencia de Yjs en base de datos
- [ ] Notificaciones push
- [ ] Historial de versiones
- [ ] Comentarios en línea
- [ ] Permisos granulares (viewer, commenter, editor)
- [ ] Exportación a PDF/DOCX

### Fase 3 (Futuro)
- [ ] Edición offline con sincronización
- [ ] Videoconferencia integrada
- [ ] Firmas electrónicas
- [ ] Auditoría de cambios
- [ ] Templates de contratos

## Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Propietario: JUMO Technologies

## Soporte

- Documentación: `docs/`
- Issues: GitHub Issues
- Email: soporte@jumotechnologies.com

## Créditos

Desarrollado por JUMO Technologies con asistencia de Claude Code.

**Tecnologías principales:**
- Yjs - CRDT collaboration
- Tiptap - Rich text editor
- Anthropic Claude - IA legal
- Supabase - Backend as a Service
- Next.js - React framework

---

**Última actualización:** 28 de Enero 2026
**Versión:** 1.0.0
**Estado:** Producción Ready ✅
