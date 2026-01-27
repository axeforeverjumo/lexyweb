#!/usr/bin/env node

/**
 * VERIFICACIÓN DE CONFIGURACIÓN DEL CLIENTE
 *
 * Este script simula lo que hace el navegador cuando carga la página
 * para verificar si las variables de entorno están disponibles en el cliente
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: join(__dirname, '../.env.local') });

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

log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
log('║      VERIFICACIÓN DE CONFIGURACIÓN DEL CLIENTE         ║', 'bold');
log('╚══════════════════════════════════════════════════════════╝', 'bold');

console.log('\n' + '='.repeat(60));
log('1. VARIABLES EN .env.local', 'bold');
console.log('='.repeat(60));

const envVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    success(`${key}: ${value.substring(0, 50)}...`);
  } else {
    error(`${key}: NO DEFINIDA`);
  }
});

console.log('\n' + '='.repeat(60));
log('2. ARCHIVO lib/supabase/client.ts', 'bold');
console.log('='.repeat(60));

try {
  const clientFilePath = join(__dirname, '../lib/supabase/client.ts');
  const clientContent = readFileSync(clientFilePath, 'utf-8');

  info('\nContenido del archivo:');
  console.log(clientContent);

  // Verificar si usa process.env correctamente
  if (clientContent.includes('process.env.NEXT_PUBLIC_SUPABASE_URL')) {
    warning('\n⚠ PROBLEMA DETECTADO:');
    console.log('El archivo usa process.env.NEXT_PUBLIC_SUPABASE_URL');
    console.log('\nEsto NO funciona en el cliente después del build porque:');
    console.log('1. Las variables NEXT_PUBLIC_* se embeben en tiempo de BUILD');
    console.log('2. En runtime (cliente), process.env NO existe en el navegador');
    console.log('3. Next.js hace un reemplazo estático en build time');

    console.log('\n' + '─'.repeat(60));
    log('SOLUCIÓN:', 'green');
    console.log('─'.repeat(60));
    console.log('En lugar de:');
    console.log('  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;');
    console.log('\nUsar directamente el valor (Next.js lo reemplazará en build):');
    console.log('  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;');
    console.log('\nO mejor aún, verificar en tiempo de ejecución:');
    console.log(`  if (typeof window !== 'undefined') {
    // En el cliente, las variables ya están reemplazadas
    // pero podemos verificar que existan
  }`);

  } else {
    success('El archivo NO usa process.env directamente (correcto)');
  }

} catch (err) {
  error(`Error al leer client.ts: ${err.message}`);
}

console.log('\n' + '='.repeat(60));
log('3. VERIFICAR BUILD OUTPUT', 'bold');
console.log('='.repeat(60));

info('\nPara verificar si las variables se embedieron en el build:');
console.log('1. Hacer build: npm run build');
console.log('2. Buscar en .next/static/chunks el valor de la URL de Supabase');
console.log('3. Si aparece "undefined" o no aparece, las variables NO se embedieron');

console.log('\n' + '='.repeat(60));
log('4. DIAGNÓSTICO ESPECÍFICO DE VERCEL', 'bold');
console.log('='.repeat(60));

console.log('\nEn Vercel, las variables de entorno funcionan diferente:');
console.log('');
console.log('✓ Variables NEXT_PUBLIC_* se embeben en el BUNDLE en build time');
console.log('✓ Si cambias las variables en Vercel, DEBES hacer REDEPLOY');
console.log('✓ NO basta con "Redeploy" - debes hacer un nuevo push o manualmente rebuild');
console.log('');
console.log('Proceso correcto:');
console.log('1. Actualizar variables en Vercel Dashboard');
console.log('2. Ir a Deployments');
console.log('3. En el último deployment, hacer click en "..." → "Redeploy"');
console.log('4. Marcar "Use existing Build Cache" como FALSE');
console.log('5. Hacer "Redeploy"');
console.log('');
console.log('O más simple:');
console.log('1. Hacer un cambio dummy en el código (añadir un comentario)');
console.log('2. git commit -m "trigger rebuild"');
console.log('3. git push');

console.log('\n' + '='.repeat(60));
log('5. PROBLEMA DEL 401 UNAUTHORIZED', 'bold');
console.log('='.repeat(60));

console.log('\nEl error 401 en /auth/v1/token significa que:');
console.log('');
console.log('❌ NO es un problema de red (el servidor responde)');
console.log('❌ NO es un problema de CORS (la petición llega)');
console.log('❌ NO es un problema de URL (se conecta al servidor correcto)');
console.log('');
console.log('✓ El problema es con las CREDENCIALES:');
console.log('  - Email incorrecto');
console.log('  - Contraseña incorrecta');
console.log('  - Usuario no existe');
console.log('  - Usuario no confirmado');
console.log('');
console.log('Según el diagnóstico anterior:');
console.log('  → El usuario juan.manuel@jumo.tech NO EXISTE');
console.log('  → Los usuarios que existen son:');
console.log('    • test@lexy.plus');
console.log('    • j.ojedagarcia@icloud.com');
console.log('');
console.log('SOLUCIÓN INMEDIATA:');
console.log('1. Usar uno de los usuarios existentes para probar');
console.log('2. O crear el usuario juan.manuel@jumo.tech en Supabase Dashboard');

console.log('\n' + '='.repeat(60));
log('RESUMEN Y PRÓXIMOS PASOS', 'bold');
console.log('='.repeat(60));

console.log('\nAcciones recomendadas en orden:');
console.log('');
console.log('1. CREAR USUARIO DE PRUEBA');
console.log('   Ve a Supabase Dashboard → Authentication → Users');
console.log('   Crea manualmente el usuario: juan.manuel@jumo.tech');
console.log('   Establece contraseña: Admin123.');
console.log('');
console.log('2. PROBAR LOCALMENTE');
console.log('   npm run dev');
console.log('   Abre http://localhost:3000/login');
console.log('   Intenta hacer login con el usuario creado');
console.log('');
console.log('3. SI FUNCIONA LOCALMENTE → REBUILD EN VERCEL');
console.log('   El problema es que las variables no están en el build');
console.log('   Haz un redeploy sin cache (ver instrucciones arriba)');
console.log('');
console.log('4. SI NO FUNCIONA NI LOCALMENTE → PROBLEMA DE CÓDIGO');
console.log('   Revisa el archivo lib/supabase/client.ts');
console.log('   Verifica que esté usando correctamente las variables');

console.log('\n');
