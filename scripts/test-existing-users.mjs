#!/usr/bin/env node

/**
 * TEST DE LOGIN CON USUARIOS EXISTENTES
 *
 * Prueba el login con los usuarios que YA EXISTEN en la base de datos
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

// Colores
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

// Usuarios existentes detectados
const USERS_TO_TEST = [
  {
    email: 'test@lexy.plus',
    password: 'CONTRASEÑA_DESCONOCIDA', // No sabemos la contraseña
  },
  {
    email: 'j.ojedagarcia@icloud.com',
    password: 'CONTRASEÑA_DESCONOCIDA', // No sabemos la contraseña
  },
];

async function testLogin(email, password) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('\n' + '='.repeat(60));
  log(`Probando login: ${email}`, 'bold');
  console.log('='.repeat(60));

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      error(`Error: ${signInError.message}`);
      info('Código de error: ' + signInError.code);
      return false;
    }

    success('¡LOGIN EXITOSO!');
    info(`User ID: ${data.user.id}`);
    info(`Email: ${data.user.email}`);
    info(`Token: ${data.session.access_token.substring(0, 30)}...`);
    return true;

  } catch (err) {
    error(`Excepción: ${err.message}`);
    return false;
  }
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
  log('║         TEST DE LOGIN CON USUARIOS EXISTENTES          ║', 'bold');
  log('╚══════════════════════════════════════════════════════════╝', 'bold');

  console.log('\nINSTRUCCIONES:');
  console.log('Este script intenta hacer login con los usuarios existentes.');
  console.log('Necesitas proporcionar la contraseña correcta para cada uno.\n');

  // Usuario 1: test@lexy.plus
  info('Usuario detectado: test@lexy.plus');
  console.log('Por favor, proporciona la contraseña para este usuario:');
  console.log('(Si no la conoces, presiona Enter para saltar)');

  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  const password1 = await question('\nContraseña para test@lexy.plus: ');
  if (password1.trim()) {
    await testLogin('test@lexy.plus', password1);
  } else {
    info('Saltado: test@lexy.plus\n');
  }

  const password2 = await question('\nContraseña para j.ojedagarcia@icloud.com: ');
  if (password2.trim()) {
    await testLogin('j.ojedagarcia@icloud.com', password2);
  } else {
    info('Saltado: j.ojedagarcia@icloud.com\n');
  }

  rl.close();

  console.log('\n' + '='.repeat(60));
  log('FIN DEL TEST', 'bold');
  console.log('='.repeat(60) + '\n');
}

main().catch(err => {
  error(`Error fatal: ${err.message}`);
  process.exit(1);
});
