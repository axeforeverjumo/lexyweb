#!/usr/bin/env node

/**
 * SCRIPT DE DIAGNÓSTICO DE AUTENTICACIÓN SUPABASE
 *
 * Este script verifica CADA parte del sistema de autenticación:
 * 1. Conectividad con Supabase
 * 2. Validez de las credenciales (URL y Anon Key)
 * 3. Existencia del usuario de prueba
 * 4. Capacidad de hacer login con ese usuario
 */

import { createClient } from '@supabase/supabase-js';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.local
config({ path: join(__dirname, '../.env.local') });

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bold');
  console.log('='.repeat(60));
}

function subsection(title) {
  log(`\n${title}`, 'cyan');
  console.log('-'.repeat(40));
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

// Variables de entorno
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Usuario de prueba
const TEST_USER = {
  email: 'juan.manuel@jumo.tech',
  password: 'Admin123.', // Debe coincidir con el usuario creado en Supabase
};

// Test 1: Verificar variables de entorno
async function test1_checkEnvVars() {
  section('TEST 1: VERIFICACIÓN DE VARIABLES DE ENTORNO');

  let allPresent = true;

  subsection('Variables de entorno detectadas:');

  if (SUPABASE_URL) {
    success(`NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL}`);
  } else {
    error('NEXT_PUBLIC_SUPABASE_URL: FALTA');
    allPresent = false;
  }

  if (SUPABASE_ANON_KEY) {
    success(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  } else {
    error('NEXT_PUBLIC_SUPABASE_ANON_KEY: FALTA');
    allPresent = false;
  }

  if (SUPABASE_SERVICE_KEY) {
    success(`SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);
  } else {
    warning('SUPABASE_SERVICE_ROLE_KEY: FALTA (necesaria para listar usuarios)');
  }

  return allPresent;
}

// Test 2: Verificar conectividad HTTP
async function test2_checkConnectivity() {
  section('TEST 2: VERIFICACIÓN DE CONECTIVIDAD HTTP');

  return new Promise((resolve) => {
    const url = new URL(SUPABASE_URL);

    subsection(`Conectando a: ${url.hostname}`);

    https.get(`${SUPABASE_URL}/rest/v1/`, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        success(`El servidor responde (HTTP ${res.statusCode})`);
        info('Headers recibidos:');
        Object.entries(res.headers).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
        resolve(true);
      } else {
        error(`El servidor responde con código inesperado: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      error(`No se pudo conectar: ${err.message}`);
      resolve(false);
    });
  });
}

// Test 3: Verificar Anon Key
async function test3_checkAnonKey() {
  section('TEST 3: VERIFICACIÓN DE ANON KEY');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    subsection('Intentando hacer una petición anónima...');

    // Intentar obtener la sesión actual (debe ser null pero no dar error)
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      error(`Error al usar Anon Key: ${sessionError.message}`);
      info('Detalles del error:');
      console.log(JSON.stringify(sessionError, null, 2));
      return false;
    }

    success('Anon Key es válida (puede hacer peticiones a Supabase)');
    info(`Sesión actual: ${data.session ? 'Activa' : 'No hay sesión'}`);
    return true;

  } catch (err) {
    error(`Excepción al verificar Anon Key: ${err.message}`);
    return false;
  }
}

// Test 4: Listar usuarios con Service Role Key
async function test4_listUsers() {
  section('TEST 4: LISTAR USUARIOS (SERVICE ROLE KEY)');

  if (!SUPABASE_SERVICE_KEY) {
    warning('Service Role Key no está configurada. Saltando test.');
    return null;
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    subsection('Obteniendo lista de usuarios...');

    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      error(`Error al listar usuarios: ${listError.message}`);
      info('Detalles del error:');
      console.log(JSON.stringify(listError, null, 2));
      return false;
    }

    success(`Se encontraron ${users.length} usuario(s) en la base de datos`);

    info('\nUsuarios registrados:');
    users.forEach((user, index) => {
      console.log(`\n  ${index + 1}. Email: ${user.email}`);
      console.log(`     ID: ${user.id}`);
      console.log(`     Confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}`);
      console.log(`     Creado: ${user.created_at}`);
      console.log(`     Último login: ${user.last_sign_in_at || 'Nunca'}`);
    });

    // Verificar si existe el usuario de prueba
    const testUserExists = users.some(u => u.email === TEST_USER.email);

    if (testUserExists) {
      success(`\n✓ El usuario de prueba (${TEST_USER.email}) existe en la BD`);
      const testUserData = users.find(u => u.email === TEST_USER.email);
      if (!testUserData.email_confirmed_at) {
        warning('⚠ El usuario NO ha confirmado su email');
      }
    } else {
      error(`\n✗ El usuario de prueba (${TEST_USER.email}) NO existe en la BD`);
      warning('Debes crear este usuario primero para poder hacer el test de login');
    }

    return testUserExists;

  } catch (err) {
    error(`Excepción al listar usuarios: ${err.message}`);
    return false;
  }
}

// Test 5: Intentar login con el usuario de prueba
async function test5_testLogin() {
  section('TEST 5: TEST DE LOGIN CON USUARIO DE PRUEBA');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    subsection(`Intentando login con: ${TEST_USER.email}`);
    info(`Contraseña: ${TEST_USER.password.substring(0, 4)}${'*'.repeat(TEST_USER.password.length - 4)}`);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email.trim(),
      password: TEST_USER.password,
    });

    if (signInError) {
      error(`Error al hacer login: ${signInError.message}`);
      info('Detalles del error:');
      console.log(JSON.stringify(signInError, null, 2));

      // Diagnóstico específico
      if (signInError.message === 'Invalid login credentials') {
        warning('\nPosibles causas:');
        console.log('  1. La contraseña es incorrecta');
        console.log('  2. El usuario no existe');
        console.log('  3. El usuario no ha confirmado su email');
      }

      return false;
    }

    success('¡LOGIN EXITOSO!');
    info('\nDatos de la sesión:');
    console.log(`  User ID: ${data.user.id}`);
    console.log(`  Email: ${data.user.email}`);
    console.log(`  Access Token: ${data.session.access_token.substring(0, 20)}...`);
    console.log(`  Expires at: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);

    return true;

  } catch (err) {
    error(`Excepción al hacer login: ${err.message}`);
    console.log(err);
    return false;
  }
}

// Test 6: Verificar JWT del Anon Key
async function test6_decodeJWT() {
  section('TEST 6: DECODIFICAR JWT DEL ANON KEY');

  try {
    const parts = SUPABASE_ANON_KEY.split('.');
    if (parts.length !== 3) {
      error('El Anon Key no tiene el formato de un JWT válido');
      return false;
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    success('JWT decodificado correctamente');
    info('\nContenido del JWT:');
    console.log(JSON.stringify(payload, null, 2));

    // Verificar campos importantes
    subsection('Validación de campos:');

    if (payload.iss === 'supabase') {
      success(`Issuer: ${payload.iss}`);
    } else {
      warning(`Issuer inusual: ${payload.iss} (esperado: "supabase")`);
    }

    if (payload.role === 'anon') {
      success(`Role: ${payload.role}`);
    } else {
      error(`Role incorrecto: ${payload.role} (esperado: "anon")`);
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp > now) {
      success(`Expiración: ${new Date(payload.exp * 1000).toLocaleString()} (válido)`);
    } else {
      error(`JWT EXPIRADO: ${new Date(payload.exp * 1000).toLocaleString()}`);
    }

    return true;

  } catch (err) {
    error(`Error al decodificar JWT: ${err.message}`);
    return false;
  }
}

// Función principal
async function runDiagnostics() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
  log('║     DIAGNÓSTICO COMPLETO DE AUTENTICACIÓN SUPABASE      ║', 'bold');
  log('╚══════════════════════════════════════════════════════════╝', 'bold');

  const results = {
    test1: await test1_checkEnvVars(),
    test2: await test2_checkConnectivity(),
    test3: await test3_checkAnonKey(),
    test4: await test4_listUsers(),
    test5: await test5_testLogin(),
    test6: await test6_decodeJWT(),
  };

  // Resumen final
  section('RESUMEN DE RESULTADOS');

  const tests = [
    { name: 'Variables de entorno', result: results.test1 },
    { name: 'Conectividad HTTP', result: results.test2 },
    { name: 'Validez Anon Key', result: results.test3 },
    { name: 'Listar usuarios', result: results.test4 },
    { name: 'Test de login', result: results.test5 },
    { name: 'Validación JWT', result: results.test6 },
  ];

  tests.forEach(({ name, result }) => {
    if (result === true) {
      success(`${name}: PASÓ`);
    } else if (result === false) {
      error(`${name}: FALLÓ`);
    } else {
      warning(`${name}: SALTADO`);
    }
  });

  // Diagnóstico final
  console.log('\n' + '='.repeat(60));
  log('DIAGNÓSTICO FINAL', 'bold');
  console.log('='.repeat(60) + '\n');

  const allPassed = Object.values(results).every(r => r === true || r === null);

  if (allPassed) {
    success('✓ TODOS LOS TESTS PASARON - El sistema debería funcionar correctamente');
  } else {
    error('✗ ALGUNOS TESTS FALLARON - Revisa los errores arriba');

    if (!results.test5) {
      console.log('\n' + '⚠'.repeat(30));
      warning('EL TEST DE LOGIN FALLÓ');
      console.log('⚠'.repeat(30));

      console.log('\nAcciones recomendadas:');
      console.log('1. Si el usuario no existe, créalo en Supabase Dashboard');
      console.log('2. Si el usuario existe, verifica que la contraseña sea correcta');
      console.log('3. Verifica que el usuario haya confirmado su email');
      console.log('4. Verifica que el Auth esté habilitado en Supabase');
    }
  }

  console.log('\n');
}

// Ejecutar
runDiagnostics().catch(err => {
  error(`Error fatal: ${err.message}`);
  console.error(err);
  process.exit(1);
});
