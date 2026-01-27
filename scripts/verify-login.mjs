#!/usr/bin/env node

/**
 * VERIFICAR LOGIN CON EL USUARIO RECIÉN CREADO
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TEST_USER = {
  email: 'juan.manuel@jumo.tech',
  password: 'Admin123.',
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
  log('║         VERIFICACIÓN DE LOGIN CON USUARIO CREADO       ║', 'bold');
  log('╚══════════════════════════════════════════════════════════╝', 'bold');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('\n' + '='.repeat(60));
  log('INTENTANDO LOGIN...', 'bold');
  console.log('='.repeat(60));
  console.log(`Email: ${TEST_USER.email}`);
  console.log(`Contraseña: ${TEST_USER.password}`);

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    if (signInError) {
      log(`\n✗ LOGIN FALLÓ: ${signInError.message}`, 'red');
      console.log('\nDetalles del error:');
      console.log(JSON.stringify(signInError, null, 2));
      process.exit(1);
    }

    console.log('\n' + '═'.repeat(60));
    log('✓✓✓ ¡LOGIN EXITOSO! ✓✓✓', 'green');
    console.log('═'.repeat(60));

    console.log('\nDatos de la sesión:');
    console.log(`  User ID: ${data.user.id}`);
    console.log(`  Email: ${data.user.email}`);
    console.log(`  Email verificado: ${data.user.email_confirmed_at ? 'Sí' : 'No'}`);
    console.log(`  Access Token: ${data.session.access_token.substring(0, 40)}...`);
    console.log(`  Expira: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);

    console.log('\n' + '═'.repeat(60));
    log('CONCLUSIÓN', 'green');
    console.log('═'.repeat(60));
    console.log('✓ Las credenciales de Supabase son CORRECTAS');
    console.log('✓ El usuario existe y está confirmado');
    console.log('✓ El login funciona perfectamente');
    console.log('');
    console.log('El error 401 que veías antes era porque el usuario NO EXISTÍA.');
    console.log('Ahora que el usuario está creado, el login debería funcionar tanto');
    console.log('en local como en Vercel (producción).');

    console.log('\n' + '═'.repeat(60));
    log('PRUEBA EN EL NAVEGADOR', 'blue');
    console.log('═'.repeat(60));
    console.log('1. Abre: http://localhost:3000/login');
    console.log('2. Ingresa:');
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Contraseña: ${TEST_USER.password}`);
    console.log('3. Click en "Iniciar sesión"');
    console.log('4. Deberías ser redirigido a /dashboard');
    console.log('');
    console.log('Y en Vercel (producción):');
    console.log('1. Abre: https://tu-dominio.vercel.app/login');
    console.log('2. Mismas credenciales');
    console.log('3. ¡Debería funcionar sin error 401!');

    console.log('\n');

  } catch (err) {
    log(`\n✗ Excepción: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
  }
}

main();
