#!/usr/bin/env node

/**
 * Script de Verificación de Variables de Entorno
 *
 * Ejecutar: node scripts/verify-env.js
 *
 * Verifica que todas las variables de entorno requeridas estén configuradas
 * y que tengan el formato correcto.
 */

const requiredEnvVars = {
  // Supabase (CRÍTICO)
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: true,
    description: 'URL de Supabase',
    validate: (value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    errorMessage: 'Debe ser una URL HTTPS válida (ej: https://xxxxx.supabase.co)'
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: true,
    description: 'Supabase Anon Key',
    validate: (value) => value && value.length > 100,
    errorMessage: 'Debe ser un JWT válido (más de 100 caracteres)'
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    required: true,
    description: 'Supabase Service Role Key',
    validate: (value) => value && value.length > 100,
    errorMessage: 'Debe ser un JWT válido (más de 100 caracteres)'
  },

  // AI (REQUERIDO para funcionalidad)
  'GEMINI_API_KEY': {
    required: true,
    description: 'Google Gemini API Key',
    validate: (value) => value && value.startsWith('AIza'),
    errorMessage: 'Debe comenzar con "AIza"'
  },
  'ANTHROPIC_API_KEY': {
    required: true,
    description: 'Anthropic Claude API Key',
    validate: (value) => value && value.startsWith('sk-ant-'),
    errorMessage: 'Debe comenzar con "sk-ant-"'
  },

  // Stripe (REQUERIDO para pagos)
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
    required: true,
    description: 'Stripe Publishable Key',
    validate: (value) => value && value.startsWith('pk_'),
    errorMessage: 'Debe comenzar con "pk_"'
  },
  'STRIPE_SECRET_KEY': {
    required: true,
    description: 'Stripe Secret Key',
    validate: (value) => value && value.startsWith('sk_'),
    errorMessage: 'Debe comenzar con "sk_"'
  },
  'STRIPE_WEBHOOK_SECRET': {
    required: false,
    description: 'Stripe Webhook Secret',
    validate: (value) => value && value.startsWith('whsec_'),
    errorMessage: 'Debe comenzar con "whsec_" (usa Stripe CLI en desarrollo)'
  },
  'STRIPE_PRICE_ID_PRO': {
    required: true,
    description: 'Stripe Price ID - Pro Plan',
    validate: (value) => value && value.startsWith('price_'),
    errorMessage: 'Debe comenzar con "price_"'
  },
  'STRIPE_PRICE_ID_TEAM': {
    required: true,
    description: 'Stripe Price ID - Team Plan',
    validate: (value) => value && value.startsWith('price_'),
    errorMessage: 'Debe comenzar con "price_"'
  },
  'STRIPE_PRICE_ID_BUSINESS': {
    required: true,
    description: 'Stripe Price ID - Business Plan',
    validate: (value) => value && value.startsWith('price_'),
    errorMessage: 'Debe comenzar con "price_"'
  },
  'STRIPE_PRICE_ID_ENTERPRISE': {
    required: true,
    description: 'Stripe Price ID - Enterprise Plan',
    validate: (value) => value && value.startsWith('price_'),
    errorMessage: 'Debe comenzar con "price_"'
  },

  // App Config
  'NEXT_PUBLIC_APP_URL': {
    required: true,
    description: 'URL de la aplicación',
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    errorMessage: 'Debe ser una URL válida'
  },

  // Sanity CMS
  'NEXT_PUBLIC_SANITY_PROJECT_ID': {
    required: true,
    description: 'Sanity Project ID',
    validate: (value) => value && value.length > 5,
    errorMessage: 'Debe ser un ID de proyecto válido'
  },
  'NEXT_PUBLIC_SANITY_DATASET': {
    required: true,
    description: 'Sanity Dataset',
    validate: (value) => value === 'production' || value === 'development',
    errorMessage: 'Debe ser "production" o "development"'
  },
};

console.log('🔍 Verificando variables de entorno...\n');

let errors = 0;
let warnings = 0;

Object.entries(requiredEnvVars).forEach(([key, config]) => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';

  if (!value) {
    if (config.required) {
      console.log(`${status} ${key}: FALTA (REQUERIDA)`);
      console.log(`   → ${config.description}`);
      console.log(`   → ${config.errorMessage}\n`);
      errors++;
    } else {
      console.log(`⚠️  ${key}: FALTA (OPCIONAL)`);
      console.log(`   → ${config.description}\n`);
      warnings++;
    }
    return;
  }

  // Validar formato
  if (config.validate && !config.validate(value)) {
    console.log(`❌ ${key}: FORMATO INVÁLIDO`);
    console.log(`   → ${config.description}`);
    console.log(`   → ${config.errorMessage}`);
    console.log(`   → Valor actual: ${value.substring(0, 20)}...\n`);
    errors++;
    return;
  }

  console.log(`✅ ${key}: OK`);
  console.log(`   → ${config.description}`);
  console.log(`   → ${value.substring(0, 20)}...\n`);
});

console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN');
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('\n✅ Todas las variables están configuradas correctamente!');
  console.log('\nPuedes ejecutar la aplicación con: npm run dev\n');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`\n❌ ${errors} error(es) encontrado(s)`);
    console.log('\n🚨 La aplicación NO funcionará correctamente.');
    console.log('\n📝 Revisa el archivo .env.example para ver qué variables faltan.');
    console.log('📝 En producción, configura estas variables en Vercel.');
  }

  if (warnings > 0) {
    console.log(`\n⚠️  ${warnings} advertencia(s) encontrada(s)`);
    console.log('\nLa aplicación puede funcionar, pero con funcionalidad limitada.');
  }

  console.log('\n📚 Para más información:');
  console.log('   - Ver: .env.example');
  console.log('   - Ver: VERCEL_SETUP_CHECKLIST.md');
  console.log('   - Ver: DIAGNOSTICO_SUPABASE.md\n');

  process.exit(errors > 0 ? 1 : 0);
}
