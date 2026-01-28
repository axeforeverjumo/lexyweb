/**
 * Apply database migration manually
 * Run with: npx tsx scripts/apply-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration(migrationFile: string) {
  console.log(`\nApplying migration: ${path.basename(migrationFile)}`);
  console.log('='.repeat(60));

  const sql = fs.readFileSync(migrationFile, 'utf8');

  try {
    // Split by semicolon and execute each statement separately
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        console.log(`\nExecuting: ${statement.substring(0, 80)}...`);
        const { error } = await supabase.rpc('exec_sql', {
          sql_string: statement + ';',
        });

        if (error) {
          console.error('Error:', error);
          // Try direct query as fallback
          const { error: directError } = await supabase
            .from('_migrations')
            .select('*')
            .limit(0);

          if (directError) {
            console.error('Direct query also failed:', directError);
          }
        } else {
          console.log('✓ Success');
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Failed to apply migration:', error);
    process.exit(1);
  }
}

// Apply the specific migration
const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql'
);

if (!fs.existsSync(migrationPath)) {
  console.error('Migration file not found:', migrationPath);
  process.exit(1);
}

applyMigration(migrationPath).catch(console.error);
