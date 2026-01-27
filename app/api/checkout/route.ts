import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type { PlanTier } from '@/types/pricing';

// Tier configuration
const TIER_CONFIG = {
  pro: {
    name: 'PRO',
    maxUsers: 1,
    priceEnv: 'STRIPE_PRICE_ID_PRO',
  },
  team: {
    name: 'TEAM',
    maxUsers: 3,
    priceEnv: 'STRIPE_PRICE_ID_TEAM',
  },
  business: {
    name: 'BUSINESS',
    maxUsers: 4,
    priceEnv: 'STRIPE_PRICE_ID_BUSINESS',
  },
  enterprise: {
    name: 'ENTERPRISE',
    maxUsers: 7,
    priceEnv: 'STRIPE_PRICE_ID_ENTERPRISE',
  },
} as const;

export async function POST(req: NextRequest) {
  try {
    // Validate Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const { tier = 'pro', successUrl, cancelUrl } = await req.json();

    // Validate tier
    if (!tier || !(tier in TIER_CONFIG)) {
      return NextResponse.json(
        { error: 'Invalid tier specified' },
        { status: 400 }
      );
    }

    const tierConfig = TIER_CONFIG[tier as PlanTier];
    const priceId = process.env[tierConfig.priceEnv];

    // Check if price ID is configured for this tier
    if (!priceId || priceId === 'price_placeholder') {
      return NextResponse.json(
        {
          error: `Pricing not configured for ${tierConfig.name} tier. Please contact support.`,
          contactSales: tier === 'enterprise'
        },
        { status: 503 }
      );
    }

    // Enterprise tier requires contact with sales
    if (tier === 'enterprise') {
      return NextResponse.json({
        contactSales: true,
        message: 'Enterprise tier requires personalized onboarding. Please contact sales.',
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/#precios`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: undefined, // Will be collected in checkout
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          tier,
          plan_name: tierConfig.name,
          max_users: tierConfig.maxUsers.toString(),
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
