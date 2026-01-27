/**
 * Script para crear productos y precios en Stripe
 *
 * Uso:
 * 1. Asegúrate de tener STRIPE_SECRET_KEY en .env.local
 * 2. Ejecuta: node scripts/setup-stripe-products.js
 * 3. Copia los price IDs generados a tu .env.local
 */

const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = [
  {
    tier: 'pro',
    name: 'LEXY PRO',
    description: 'Plan individual para agentes inmobiliarios',
    price: 6500, // 65€ en centavos
    metadata: {
      tier: 'pro',
      max_users: '1',
      features: 'Contratos ilimitados, Consultas IA 24/7, 97 plantillas, Canvas, Firmas digitales'
    }
  },
  {
    tier: 'team',
    name: 'LEXY TEAM',
    description: 'Para agencias pequeñas (2-3 agentes)',
    price: 15000, // 150€ en centavos
    metadata: {
      tier: 'team',
      max_users: '3',
      features: 'Todo PRO + Hasta 3 usuarios, Chats compartidos, Gestión de permisos, Dashboard admin'
    }
  },
  {
    tier: 'business',
    name: 'LEXY BUSINESS',
    description: 'Para agencias medianas',
    price: 29900, // 299€ en centavos
    metadata: {
      tier: 'business',
      max_users: '4',
      features: 'Todo TEAM + Whitelabel, Sube contratos propios, Formación personalizada, Videollamadas'
    }
  },
  {
    tier: 'enterprise',
    name: 'LEXY ENTERPRISE',
    description: 'Para grandes grupos inmobiliarios',
    price: 50000, // 500€ en centavos
    metadata: {
      tier: 'enterprise',
      max_users: '7',
      features: 'Todo BUSINESS + Success Manager, Integración ERP, API access, Soporte VIP 2h, SLA 99.9%'
    }
  }
];

async function createProduct(productData) {
  try {
    console.log(`\n📦 Creando producto: ${productData.name}...`);

    // Crear producto
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: productData.metadata,
    });

    console.log(`✅ Producto creado: ${product.id}`);

    // Crear precio recurrente mensual
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price,
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: productData.metadata,
    });

    console.log(`💰 Precio creado: ${price.id}`);

    return {
      tier: productData.tier,
      productId: product.id,
      priceId: price.id,
      amount: productData.price / 100,
    };
  } catch (error) {
    console.error(`❌ Error creando ${productData.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando configuración de productos Stripe para LEXY...\n');

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    console.error('❌ Error: STRIPE_SECRET_KEY no está configurada en .env.local');
    console.log('\n📝 Pasos para obtener tu STRIPE_SECRET_KEY:');
    console.log('1. Ve a https://dashboard.stripe.com/test/apikeys');
    console.log('2. Copia la "Secret key" (empieza con sk_test_...)');
    console.log('3. Añádela a tu archivo .env.local');
    console.log('\nEjemplo:');
    console.log('STRIPE_SECRET_KEY=sk_test_51Abc123...\n');
    process.exit(1);
  }

  console.log('✅ STRIPE_SECRET_KEY encontrada\n');
  console.log('Creando 4 productos y precios...\n');

  const results = [];

  for (const product of PRODUCTS) {
    const result = await createProduct(product);
    if (result) {
      results.push(result);
    }
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ CONFIGURACIÓN COMPLETADA');
  console.log('='.repeat(70));

  console.log('\n📋 Añade estos Price IDs a tu archivo .env.local:\n');
  console.log('# Stripe Price IDs');
  results.forEach(result => {
    console.log(`STRIPE_PRICE_ID_${result.tier.toUpperCase()}=${result.priceId}`);
  });

  console.log('\n📊 Resumen de productos creados:\n');
  results.forEach(result => {
    console.log(`  ${result.tier.toUpperCase().padEnd(12)} - ${result.amount}€/mes - ${result.priceId}`);
  });

  console.log('\n🎯 Próximos pasos:');
  console.log('1. Copia los Price IDs de arriba a tu .env.local');
  console.log('2. Reinicia el servidor: npm run dev');
  console.log('3. Prueba el checkout en http://localhost:3000/#precios');
  console.log('4. Cuando esté listo, añade las variables a Vercel');
  console.log('\n✨ ¡Listo para aceptar pagos!\n');
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
