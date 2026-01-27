#!/usr/bin/env node

/**
 * Script para verificar la configuración de Supabase en producción
 * Hace una petición a la URL de producción y captura las variables
 */

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║     VERIFICACIÓN DE CONFIGURACIÓN EN PRODUCCIÓN              ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const PRODUCTION_URL = 'https://www.lexy.plus';
const LOGIN_URL = `${PRODUCTION_URL}/login`;

console.log(`🔍 Verificando: ${LOGIN_URL}\n`);

// Test 1: Verificar que la página carga
console.log('Test 1: Verificando que la página carga...');
fetch(LOGIN_URL)
  .then(response => {
    console.log(`  Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      console.log('  ✅ Página carga correctamente\n');
    } else {
      console.log('  ❌ Error al cargar la página\n');
    }
    return response.text();
  })
  .then(html => {
    // Buscar referencias a Supabase en el HTML
    const hasSupabaseRef = html.includes('supabase');
    console.log('Test 2: Buscando referencias a Supabase en el HTML...');
    console.log(`  Referencias encontradas: ${hasSupabaseRef ? 'Sí' : 'No'}`);

    if (hasSupabaseRef) {
      console.log('  ✅ El código incluye referencias a Supabase\n');
    } else {
      console.log('  ⚠️  No se encontraron referencias a Supabase en el HTML\n');
    }
  })
  .catch(error => {
    console.error('❌ Error al verificar la página:');
    console.error(`  ${error.message}\n`);
  });

// Test 2: Intentar login con Supabase directamente
console.log('Test 3: Verificando backend de Supabase...\n');

import('@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(
    'https://supabase.odoo.barcelona',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA'
  );

  return supabase.auth.signInWithPassword({
    email: 'test@lexy.plus',
    password: 'Test123456!'
  });
}).then(({ data, error }) => {
  if (error) {
    console.error('  ❌ Error de login desde backend:');
    console.error(`    ${error.message}`);
  } else {
    console.log('  ✅ Login exitoso desde backend de Supabase');
    console.log(`    Usuario: ${data.user.email}`);
  }

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                      RESUMEN                                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('Si el backend funciona pero la página no:');
  console.log('→ El problema está en las variables de entorno de Vercel\n');
  console.log('Ejecuta: npm run redeploy\n');
}).catch(err => {
  console.error('❌ Error inesperado:', err.message);
});
