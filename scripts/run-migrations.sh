#!/bin/bash

# Script para ejecutar migraciones SQL en Supabase
# Uso: ./scripts/run-migrations.sh

set -e

echo "🔧 Ejecutando migraciones de Supabase..."

# Verificar que supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI no está instalado"
    echo "Instala con: brew install supabase/tap/supabase"
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -d "supabase/migrations" ]; then
    echo "❌ Error: Directorio supabase/migrations no encontrado"
    echo "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Listar migraciones pendientes
echo ""
echo "📋 Migraciones disponibles:"
ls -1 supabase/migrations/*.sql | while read file; do
    echo "   - $(basename "$file")"
done

echo ""
read -p "¿Deseas ejecutar estas migraciones? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 0
fi

# Ejecutar migraciones con Supabase CLI
echo ""
echo "🚀 Ejecutando migraciones..."

# Opción 1: Si estás usando un proyecto Supabase vinculado
# supabase db push

# Opción 2: Si tienes acceso directo a la base de datos
# Necesitarás las credenciales de conexión
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Variable DATABASE_URL no está configurada"
    echo ""
    echo "Opciones para ejecutar las migraciones:"
    echo ""
    echo "1. Usar Supabase CLI (requiere proyecto vinculado):"
    echo "   supabase link --project-ref <tu-project-ref>"
    echo "   supabase db push"
    echo ""
    echo "2. Ejecutar manualmente en el dashboard de Supabase:"
    echo "   Dashboard > SQL Editor > pegar contenido de cada migración"
    echo ""
    echo "3. Usar psql con DATABASE_URL:"
    echo "   export DATABASE_URL='postgresql://...'"
    echo "   ./scripts/run-migrations.sh"
    exit 1
fi

# Si DATABASE_URL está disponible, ejecutar con psql
echo "📊 Ejecutando migraciones con psql..."

for migration in supabase/migrations/*.sql; do
    echo "   Ejecutando: $(basename "$migration")"
    psql "$DATABASE_URL" -f "$migration"
done

echo ""
echo "✅ Migraciones ejecutadas exitosamente"
echo ""
echo "🔍 Verificando tablas creadas..."
psql "$DATABASE_URL" -c "\dt contract_*"
psql "$DATABASE_URL" -c "\dt user_friends"

echo ""
echo "✨ Proceso completado"
