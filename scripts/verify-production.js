#!/usr/bin/env node

/**
 * Script de Verificación de Variables en Producción
 *
 * Este script verifica si las variables de Supabase están realmente
 * embebidas en el bundle de producción de Vercel.
 */

const https = require('https');

const PRODUCTION_URL = 'https://www.lexy.plus';
const EXPECTED_VALUES = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.odoo.barcelona',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjcxMzY4MCwiZXhwIjo0OTIyMzg3MjgwLCJyb2xlIjoiYW5vbiJ9.xMSCK41FQ6t1N5x-r3TXm30tRIURDAqN16tj8pW3tZA'
};

console.log('\n🔍 VERIFICACIÓN DE VARIABLES EN PRODUCCIÓN\n');
console.log('=' .repeat(60));

// Función para obtener el HTML de la página de login
function fetchLoginPage() {
  return new Promise((resolve, reject) => {
    https.get(`${PRODUCTION_URL}/login`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Función para obtener los archivos JS del bundle
function fetchBundleFiles(html) {
  const scriptRegex = /<script\s+src="([^"]+\.js)"/g;
  const scripts = [];
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }

  return scripts;
}

// Función para buscar variables en un archivo JS
function checkScriptForVars(scriptPath) {
  return new Promise((resolve, reject) => {
    const url = scriptPath.startsWith('http') ? scriptPath : `${PRODUCTION_URL}${scriptPath}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const results = {
          hasSupabaseUrl: data.includes(EXPECTED_VALUES.NEXT_PUBLIC_SUPABASE_URL),
          hasSupabaseKey: data.includes(EXPECTED_VALUES.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          hasMissingError: data.includes('Missing Supabase environment variables'),
          scriptPath,
          size: Buffer.byteLength(data, 'utf8')
        };
        resolve(results);
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('📥 1. Descargando página de login...\n');
    const html = await fetchLoginPage();
    console.log(`   ✅ HTML descargado (${Buffer.byteLength(html, 'utf8')} bytes)\n`);

    console.log('🔎 2. Extrayendo scripts del bundle...\n');
    const scripts = fetchBundleFiles(html);
    console.log(`   ✅ Encontrados ${scripts.length} scripts\n`);

    scripts.forEach((script, i) => {
      console.log(`   ${i + 1}. ${script}`);
    });

    console.log('\n🔬 3. Analizando scripts en busca de variables...\n');

    let foundSupabaseUrl = false;
    let foundSupabaseKey = false;
    let foundMissingError = false;

    for (const script of scripts) {
      console.log(`   Analizando: ${script.split('/').pop()}...`);
      const results = await checkScriptForVars(script);

      if (results.hasSupabaseUrl) {
        foundSupabaseUrl = true;
        console.log(`   ✅ SUPABASE_URL encontrada en ${script}`);
      }

      if (results.hasSupabaseKey) {
        foundSupabaseKey = true;
        console.log(`   ✅ SUPABASE_ANON_KEY encontrada en ${script}`);
      }

      if (results.hasMissingError) {
        foundMissingError = true;
        console.log(`   ⚠️  Error "Missing Supabase" encontrado en ${script}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADOS FINALES:\n');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${foundSupabaseUrl ? '✅ ENCONTRADA' : '❌ NO ENCONTRADA'}`);
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${foundSupabaseKey ? '✅ ENCONTRADA' : '❌ NO ENCONTRADA'}`);
    console.log(`   Error "Missing Supabase": ${foundMissingError ? '⚠️  PRESENTE (MAL)' : '✅ AUSENTE (BIEN)'}`);

    console.log('\n' + '='.repeat(60));

    if (!foundSupabaseUrl || !foundSupabaseKey) {
      console.log('\n❌ PROBLEMA DETECTADO:\n');
      console.log('   Las variables NO están embebidas en el bundle de producción.');
      console.log('   Esto confirma que Vercel no las está inyectando correctamente.\n');
      console.log('👉 SIGUIENTE PASO: Ejecuta el script de redeploy forzado:');
      console.log('   npm run redeploy\n');
      process.exit(1);
    } else {
      console.log('\n✅ TODO CORRECTO:\n');
      console.log('   Las variables ESTÁN embebidas en el bundle.');
      console.log('   El problema debe ser otro (CORS, red, etc.).\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

main();
