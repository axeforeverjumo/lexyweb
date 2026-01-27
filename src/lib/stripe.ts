import Stripe from 'stripe';

// Allow build to succeed without Stripe keys
// Will only throw error at runtime if someone tries to create a checkout
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  STRIPE_SECRET_KEY not set in production environment');
}

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Stripe Price IDs from environment variables
export const STRIPE_PRICE_IDS = {
  PRO: process.env.STRIPE_PRICE_ID_PRO || '',
  TEAM: process.env.STRIPE_PRICE_ID_TEAM || '',
  BUSINESS: process.env.STRIPE_PRICE_ID_BUSINESS || '',
  ENTERPRISE: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
} as const;

// Helper to validate price ID
export function isValidPriceId(priceId: string): boolean {
  return Object.values(STRIPE_PRICE_IDS).includes(priceId);
}
