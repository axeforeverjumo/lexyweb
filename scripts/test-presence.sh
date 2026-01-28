#!/bin/bash

# Script de prueba para verificar la implementación de presencia colaborativa

set -e

echo "🧪 Test de Presencia Colaborativa"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar dependencias NPM
echo "📦 Verificando dependencias..."
echo ""

check_dependency() {
  local package=$1
  if grep -q "\"$package\"" package.json; then
    echo -e "${GREEN}✓${NC} $package instalado"
    return 0
  else
    echo -e "${RED}✗${NC} $package NO encontrado"
    return 1
  fi
}

all_deps_ok=true

check_dependency "yjs" || all_deps_ok=false
check_dependency "y-websocket" || all_deps_ok=false
check_dependency "@tiptap/react" || all_deps_ok=false
check_dependency "@tiptap/starter-kit" || all_deps_ok=false
check_dependency "@tiptap/extension-collaboration" || all_deps_ok=false
check_dependency "@tiptap/extension-collaboration-cursor" || all_deps_ok=false

echo ""

if [ "$all_deps_ok" = false ]; then
  echo -e "${RED}❌ Faltan dependencias. Ejecuta:${NC}"
  echo "npm install yjs y-websocket @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor"
  exit 1
fi

# Verificar archivos implementados
echo "📁 Verificando archivos de implementación..."
echo ""

check_file() {
  local file=$1
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    return 0
  else
    echo -e "${RED}✗${NC} $file NO encontrado"
    return 1
  fi
}

all_files_ok=true

check_file "components/collaborative-editor/CollaborativeEditor.tsx" || all_files_ok=false
check_file "components/collaborative-editor/EditorPresenceBar.tsx" || all_files_ok=false
check_file "components/collaborative-editor/CollaborativeEditorWrapper.tsx" || all_files_ok=false
check_file "components/collaborative-editor/types.ts" || all_files_ok=false
check_file "app/api/contracts/[id]/collaborators/heartbeat/route.ts" || all_files_ok=false
check_file "app/(dashboard)/contratos/[id]/editar-colaborativo/page.tsx" || all_files_ok=false

echo ""

if [ "$all_files_ok" = false ]; then
  echo -e "${RED}❌ Faltan archivos de implementación${NC}"
  exit 1
fi

# Verificar que Awareness está siendo usado
echo "🔍 Verificando uso de Yjs Awareness..."
echo ""

if grep -q "awareness.setLocalState" components/collaborative-editor/CollaborativeEditor.tsx; then
  echo -e "${GREEN}✓${NC} awareness.setLocalState encontrado"
else
  echo -e "${RED}✗${NC} awareness.setLocalState NO encontrado"
  all_files_ok=false
fi

if grep -q "awareness.on('change'" components/collaborative-editor/CollaborativeEditor.tsx; then
  echo -e "${GREEN}✓${NC} awareness.on('change') encontrado"
else
  echo -e "${RED}✗${NC} awareness.on('change') NO encontrado"
  all_files_ok=false
fi

if grep -q "awareness.getStates()" components/collaborative-editor/CollaborativeEditor.tsx; then
  echo -e "${GREEN}✓${NC} awareness.getStates() encontrado"
else
  echo -e "${RED}✗${NC} awareness.getStates() NO encontrado"
  all_files_ok=false
fi

echo ""

# Verificar que NO se usa Supabase Realtime
echo "🚫 Verificando que NO se usa Supabase Realtime..."
echo ""

if grep -q "supabase.channel" components/collaborative-editor/CollaborativeEditor.tsx; then
  echo -e "${RED}✗${NC} supabase.channel todavía presente (ELIMINAR)"
  all_files_ok=false
else
  echo -e "${GREEN}✓${NC} supabase.channel NO encontrado (correcto)"
fi

if grep -q "presence.*sync" components/collaborative-editor/CollaborativeEditor.tsx; then
  echo -e "${RED}✗${NC} Supabase presence todavía presente (ELIMINAR)"
  all_files_ok=false
else
  echo -e "${GREEN}✓${NC} Supabase Realtime NO encontrado (correcto)"
fi

echo ""

# Verificar estructura de tipos
echo "📋 Verificando tipos TypeScript..."
echo ""

if grep -q "interface AwarenessUser" components/collaborative-editor/types.ts; then
  echo -e "${GREEN}✓${NC} AwarenessUser interface definido"
else
  echo -e "${YELLOW}⚠${NC} AwarenessUser interface NO encontrado"
fi

if grep -q "interface AwarenessState" components/collaborative-editor/types.ts; then
  echo -e "${GREEN}✓${NC} AwarenessState interface definido"
else
  echo -e "${YELLOW}⚠${NC} AwarenessState interface NO encontrado"
fi

echo ""

# Verificar migración SQL
echo "🗄️  Verificando migración SQL..."
echo ""

migration_file=$(ls -1 supabase/migrations/*_add_contract_collaborators_table.sql 2>/dev/null | head -n 1)

if [ -n "$migration_file" ]; then
  echo -e "${GREEN}✓${NC} Migración encontrada: $(basename "$migration_file")"

  if grep -q "contract_collaborators" "$migration_file"; then
    echo -e "${GREEN}✓${NC} Tabla contract_collaborators definida"
  else
    echo -e "${RED}✗${NC} Tabla contract_collaborators NO encontrada en migración"
    all_files_ok=false
  fi

  if grep -q "last_seen_at" "$migration_file"; then
    echo -e "${GREEN}✓${NC} Campo last_seen_at definido"
  else
    echo -e "${RED}✗${NC} Campo last_seen_at NO encontrado"
    all_files_ok=false
  fi
else
  echo -e "${YELLOW}⚠${NC} Migración SQL NO encontrada"
fi

echo ""

# Resultado final
echo "=================================="
if [ "$all_files_ok" = true ]; then
  echo -e "${GREEN}✅ TODAS LAS PRUEBAS PASARON${NC}"
  echo ""
  echo "Próximos pasos:"
  echo "1. npm run dev"
  echo "2. Abrir /contratos/[id] en 2-3 navegadores diferentes"
  echo "3. Click en 'Edición Colaborativa (Tiempo Real)'"
  echo "4. Verificar presencia de usuarios en barra superior"
  echo ""
  echo "📖 Documentación: docs/PRESENCIA_COLABORATIVA.md"
  exit 0
else
  echo -e "${RED}❌ ALGUNAS PRUEBAS FALLARON${NC}"
  echo ""
  echo "Revisa los errores arriba y corrige antes de continuar."
  exit 1
fi
