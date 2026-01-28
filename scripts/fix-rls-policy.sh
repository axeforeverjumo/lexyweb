#!/bin/bash

# Fix RLS infinite recursion in contract_collaborators table
# This script applies the migration manually to your Supabase instance

set -e

echo "Fixing contract_collaborators RLS policies..."
echo "=============================================="

# Read migration file
MIGRATION_FILE="supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "Error: Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo ""
echo "Migration file: $MIGRATION_FILE"
echo ""
echo "Please apply this SQL to your Supabase database:"
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the following SQL:"
echo ""
echo "=============================================="
cat "$MIGRATION_FILE"
echo ""
echo "=============================================="
echo ""
echo "Or run this command to copy to clipboard (macOS):"
echo "  cat $MIGRATION_FILE | pbcopy"
echo ""
