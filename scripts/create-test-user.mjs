#!/usr/bin/env node

/**
 * CREAR USUARIO DE PRUEBA EN SUPABASE
 *
 * Este script crea el usuario juan.manuel@jumo.tech directamente
 * usando el Service Role Key
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
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Usuario a crear
const NEW_USER = {
  email: 'juan.manuel@jumo.tech',
  password: 'Admin123.',
  email_confirm: true, // Auto-confirmar email
};

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

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
  log('║          CREAR USUARIO DE PRUEBA EN SUPABASE           ║', 'bold');
  log('╚══════════════════════════════════════════════════════════╝', 'bold');

  // Verificar Service Role Key
  if (!SUPABASE_SERVICE_KEY) {
    error('\nSUPABASE_SERVICE_ROLE_KEY no está configurada en .env.local');
    console.log('\nNo se puede crear usuarios sin Service Role Key.');
    console.log('Opciones:');
    console.log('1. Añade SUPABASE_SERVICE_ROLE_KEY a tu .env.local');
    console.log('2. O crea el usuario manualmente desde Supabase Dashboard');
    process.exit(1);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('\n' + '='.repeat(60));
  log('USUARIO A CREAR', 'bold');
  console.log('='.repeat(60));
  info(`Email: ${NEW_USER.email}`);
  info(`Contraseña: ${NEW_USER.password}`);
  info(`Auto-confirmar email: ${NEW_USER.email_confirm ? 'Sí' : 'No'}`);

  console.log('\n' + '='.repeat(60));
  log('VERIFICANDO SI EL USUARIO YA EXISTE...', 'bold');
  console.log('='.repeat(60));

  try {
    // Primero verificar si el usuario ya existe
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      error(`Error al listar usuarios: ${listError.message}`);
      process.exit(1);
    }

    const existingUser = users.find(u => u.email === NEW_USER.email);

    if (existingUser) {
      warning(`\nEl usuario ${NEW_USER.email} YA EXISTE`);
      console.log('\nDetalles del usuario existente:');
      console.log(`  ID: ${existingUser.id}`);
      console.log(`  Email confirmado: ${existingUser.email_confirmed_at ? 'Sí' : 'No'}`);
      console.log(`  Creado: ${existingUser.created_at}`);
      console.log(`  Último login: ${existingUser.last_sign_in_at || 'Nunca'}`);

      console.log('\nOpciones:');
      console.log('1. Usar este usuario para hacer login');
      console.log('2. Resetear su contraseña desde Supabase Dashboard');
      console.log('3. Eliminar este usuario y crear uno nuevo');

      process.exit(0);
    }

    success('El usuario no existe. Procediendo a crearlo...\n');

  } catch (err) {
    error(`Error al verificar usuarios: ${err.message}`);
    process.exit(1);
  }

  console.log('='.repeat(60));
  log('CREANDO USUARIO...', 'bold');
  console.log('='.repeat(60));

  try {
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: NEW_USER.email,
      password: NEW_USER.password,
      email_confirm: NEW_USER.email_confirm,
    });

    if (createError) {
      error(`\nError al crear usuario: ${createError.message}`);
      console.log('\nDetalles del error:');
      console.log(JSON.stringify(createError, null, 2));
      process.exit(1);
    }

    console.log('\n' + '═'.repeat(60));
    success('¡USUARIO CREADO EXITOSAMENTE!');
    console.log('═'.repeat(60));

    console.log('\nDetalles del usuario:');
    console.log(`  ID: ${data.user.id}`);
    console.log(`  Email: ${data.user.email}`);
    console.log(`  Email confirmado: ${data.user.email_confirmed_at ? 'Sí' : 'No'}`);
    console.log(`  Creado: ${data.user.created_at}`);

    console.log('\n' + '═'.repeat(60));
    log('CREDENCIALES DE LOGIN', 'green');
    console.log('═'.repeat(60));
    console.log(`  Email: ${NEW_USER.email}`);
    console.log(`  Contraseña: ${NEW_USER.password}`);

    console.log('\n' + '═'.repeat(60));
    log('PRÓXIMOS PASOS', 'blue');
    console.log('═'.repeat(60));
    console.log('1. Inicia el servidor de desarrollo:');
    console.log('   npm run dev');
    console.log('');
    console.log('2. Abre el navegador en:');
    console.log('   http://localhost:3000/login');
    console.log('');
    console.log('3. Haz login con las credenciales de arriba');
    console.log('');
    console.log('4. Si funciona localmente, el error 401 en Vercel también debería resolverse');
    console.log('   porque el problema era que el usuario no existía en la base de datos.');

    console.log('\n');

  } catch (err) {
    error(`\nExcepción al crear usuario: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

main();
