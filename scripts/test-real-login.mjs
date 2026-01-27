#!/usr/bin/env node

/**
 * TEST DE LOGIN REAL CON USUARIOS EXISTENTES
 *
 * Intenta hacer login con contraseñas comunes para los usuarios detectados
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

// Usuarios detectados en la base de datos
const USERS = [
  'test@lexy.plus',
  'j.ojedagarcia@icloud.com',
];

// Contraseñas comunes a probar
const COMMON_PASSWORDS = [
  'Admin123.',
  'admin123',
  'password',
  'Password123',
  '123456',
  'test123',
  'Test123.',
];

async function testLogin(email, password) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      return { success: false, error: signInError.message };
    }

    return {
      success: true,
      userId: data.user.id,
      email: data.user.email,
      token: data.session.access_token.substring(0, 30) + '...',
    };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
  log('║      TEST DE LOGIN CON CONTRASEÑAS COMUNES             ║', 'bold');
  log('╚══════════════════════════════════════════════════════════╝', 'bold');

  console.log('\nUsuarios detectados en la base de datos:');
  USERS.forEach((email, i) => {
    console.log(`  ${i + 1}. ${email}`);
  });

  console.log('\nProbando contraseñas comunes...\n');

  for (const email of USERS) {
    console.log('─'.repeat(60));
    log(`Usuario: ${email}`, 'bold');
    console.log('─'.repeat(60));

    let foundPassword = false;

    for (const password of COMMON_PASSWORDS) {
      process.stdout.write(`Probando: ${password.padEnd(20)} ... `);

      const result = await testLogin(email, password);

      if (result.success) {
        success('¡FUNCIONA!');
        console.log(`\n${'═'.repeat(60)}`);
        log('¡¡¡ CREDENCIALES VÁLIDAS ENCONTRADAS !!!', 'green');
        console.log(`${'═'.repeat(60)}`);
        console.log(`Email: ${result.email}`);
        console.log(`Contraseña: ${password}`);
        console.log(`User ID: ${result.userId}`);
        console.log(`Token: ${result.token}`);
        console.log(`${'═'.repeat(60)}\n`);
        foundPassword = true;
        break;
      } else {
        error('Falló');
      }
    }

    if (!foundPassword) {
      console.log('');
      info('Ninguna contraseña común funcionó para este usuario');
      console.log('Debes conocer la contraseña exacta o resetearla en Supabase Dashboard\n');
    }
  }

  console.log('\n' + '='.repeat(60));
  log('FIN DEL TEST', 'bold');
  console.log('='.repeat(60));

  console.log('\nSi no se encontró ninguna contraseña:');
  console.log('1. Ve a Supabase Dashboard → Authentication → Users');
  console.log('2. Selecciona el usuario');
  console.log('3. Click en "Reset Password"');
  console.log('4. O crea un nuevo usuario de prueba con contraseña conocida\n');
}

main().catch(err => {
  error(`Error fatal: ${err.message}`);
  process.exit(1);
});
