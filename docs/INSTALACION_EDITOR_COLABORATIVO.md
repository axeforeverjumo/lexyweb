# Instalación de Dependencias para Editor Colaborativo

## Dependencias NPM Requeridas

Ejecuta estos comandos en la raíz del proyecto:

```bash
# Editor colaborativo con Yjs
npm install yjs y-websocket y-protocols

# Editor de texto rico (opcional: elegir uno)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
# O alternativa más simple:
npm install react-codemirror @codemirror/lang-markdown

# Cliente de Supabase Realtime (ya debería estar instalado)
npm install @supabase/supabase-js

# Utilidades adicionales
npm install nanoid
```

## Arquitectura del Editor Colaborativo

### Opción 1: Tiptap (Editor WYSIWYG con Markdown)
**Pros:**
- UI moderna y elegante
- Colaboración nativa con Yjs
- Soporte Markdown completo
- Cursores de usuarios con colores

**Contras:**
- Más complejo de configurar
- Mayor tamaño de bundle

### Opción 2: CodeMirror (Editor de código con Markdown)
**Pros:**
- Más ligero
- Excelente para Markdown
- Configuración más simple

**Contras:**
- Menos visual (más técnico)
- Requiere configuración custom para colaboración

### Opción 3: Slate.js + Supabase Realtime (Custom)
**Pros:**
- Control total
- Integración directa con Supabase

**Contras:**
- Requiere implementación completa de CRDT
- Más tiempo de desarrollo

## Recomendación

Para este proyecto, recomiendo **Tiptap + Yjs + Supabase Realtime**:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor yjs y-websocket nanoid
```

## Estructura de Archivos

```
components/
  collaborative-editor/
    CollaborativeEditor.tsx      # Editor principal
    EditorPresenceBar.tsx         # Barra de presencia
    EditorCursor.tsx              # Cursor de colaborador
    EditorToolbar.tsx             # Toolbar de formato
    useYjsProvider.ts             # Hook para Yjs
    useRealtimePresence.ts        # Hook para Supabase presence
    types.ts                      # TypeScript types
lib/
  collaborative/
    yjsProvider.ts                # Proveedor Yjs custom
    supabaseYjsProvider.ts        # Bridge Yjs <-> Supabase
```

## Siguiente Paso

Después de instalar las dependencias, ejecuta:
```bash
npm run dev
```

Y procede a implementar los componentes listados arriba.
