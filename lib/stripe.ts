import Stripe from 'stripe';

// Allow build to succeed without Stripe keys
// Will only throw error at runtime if someone tries to create a checkout
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});
