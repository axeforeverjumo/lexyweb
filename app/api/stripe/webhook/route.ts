import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import type { SubscriptionTier } from '@/types/subscription.types';

// Crear cliente de Supabase con service role para el webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Mapeo de Price ID a tier y límites
const PRICE_TO_TIER_MAP: Record<string, { tier: SubscriptionTier; max_users: number }> = {
  [process.env.STRIPE_PRICE_ID_PRO || '']: { tier: 'pro', max_users: 1 },
  [process.env.STRIPE_PRICE_ID_TEAM || '']: { tier: 'team', max_users: 3 },
  [process.env.STRIPE_PRICE_ID_BUSINESS || '']: { tier: 'business', max_users: 4 },
  [process.env.STRIPE_PRICE_ID_ENTERPRISE || '']: { tier: 'enterprise', max_users: 7 },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log('[Stripe Webhook] Event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log('[Stripe Webhook] Checkout session completed:', session.id);

  const userId = session.metadata?.supabase_user_id;
  const priceId = session.metadata?.price_id;

  if (!userId || !priceId) {
    console.error('[Stripe Webhook] Missing metadata in checkout session');
    return;
  }

  const tierConfig = PRICE_TO_TIER_MAP[priceId];
  if (!tierConfig) {
    console.error('[Stripe Webhook] Unknown price ID:', priceId);
    return;
  }

  // Actualizar estado de suscripción temporal
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tierConfig.tier,
      subscription_status: 'trialing',
      stripe_customer_id: session.customer,
    })
    .eq('id', userId);

  console.log('[Stripe Webhook] User profile updated:', userId, tierConfig.tier);
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('[Stripe Webhook] Subscription created:', subscription.id);

  const userId = subscription.metadata?.supabase_user_id;
  const priceId = subscription.items.data[0]?.price?.id;

  if (!userId || !priceId) {
    console.error('[Stripe Webhook] Missing metadata in subscription');
    return;
  }

  const tierConfig = PRICE_TO_TIER_MAP[priceId];
  if (!tierConfig) {
    console.error('[Stripe Webhook] Unknown price ID:', priceId);
    return;
  }

  // 1. Crear o actualizar registro de suscripción
  const { data: existingSub } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existingSub) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        tier: tierConfig.tier,
        status: subscription.status === 'trialing' ? 'trialing' : 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        max_users: tierConfig.max_users,
      })
      .eq('id', existingSub.id);
  } else {
    await supabaseAdmin.from('subscriptions').insert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      stripe_price_id: priceId,
      tier: tierConfig.tier,
      status: subscription.status === 'trialing' ? 'trialing' : 'active',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      max_users: tierConfig.max_users,
    });
  }

  // 2. Actualizar perfil
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tierConfig.tier,
      subscription_status: subscription.status === 'trialing' ? 'trialing' : 'active',
    })
    .eq('id', userId);

  // 3. CRÍTICO: Crear organización si es plan TEAM+
  if (['team', 'business', 'enterprise'].includes(tierConfig.tier)) {
    await createOrganization(userId, tierConfig.tier, tierConfig.max_users, subscription.id);
  }

  console.log('[Stripe Webhook] Subscription processed:', {
    userId,
    tier: tierConfig.tier,
    status: subscription.status,
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('[Stripe Webhook] Subscription updated:', subscription.id);

  // Obtener suscripción existente
  const { data: existingSub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, tier, organization_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSub) {
    console.error('[Stripe Webhook] Subscription not found:', subscription.id);
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  const tierConfig = PRICE_TO_TIER_MAP[priceId];

  if (!tierConfig) {
    console.error('[Stripe Webhook] Unknown price ID:', priceId);
    return;
  }

  // Actualizar suscripción
  await supabaseAdmin
    .from('subscriptions')
    .update({
      stripe_price_id: priceId,
      tier: tierConfig.tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      max_users: tierConfig.max_users,
    })
    .eq('stripe_subscription_id', subscription.id);

  // Actualizar perfil
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tierConfig.tier,
      subscription_status: subscription.status,
    })
    .eq('id', existingSub.user_id);

  // Si cambió a TEAM+ y no tiene organización, crearla
  if (
    ['team', 'business', 'enterprise'].includes(tierConfig.tier) &&
    !existingSub.organization_id
  ) {
    await createOrganization(
      existingSub.user_id,
      tierConfig.tier,
      tierConfig.max_users,
      subscription.id
    );
  }

  // Si cambió a PRO desde TEAM+, eliminar organización
  if (tierConfig.tier === 'pro' && existingSub.organization_id) {
    await supabaseAdmin
      .from('organizations')
      .delete()
      .eq('id', existingSub.organization_id);

    await supabaseAdmin
      .from('profiles')
      .update({ organization_id: null, is_organization_owner: false })
      .eq('organization_id', existingSub.organization_id);
  }

  console.log('[Stripe Webhook] Subscription updated:', {
    userId: existingSub.user_id,
    tier: tierConfig.tier,
    status: subscription.status,
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('[Stripe Webhook] Subscription deleted:', subscription.id);

  const { data: existingSub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, organization_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSub) {
    console.error('[Stripe Webhook] Subscription not found:', subscription.id);
    return;
  }

  // Actualizar suscripción a cancelada
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id);

  // Actualizar perfil a sin suscripción
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: 'none',
      subscription_status: 'inactive',
    })
    .eq('id', existingSub.user_id);

  // Eliminar organización si existía
  if (existingSub.organization_id) {
    await supabaseAdmin
      .from('organizations')
      .delete()
      .eq('id', existingSub.organization_id);

    await supabaseAdmin
      .from('profiles')
      .update({ organization_id: null, is_organization_owner: false })
      .eq('organization_id', existingSub.organization_id);
  }

  console.log('[Stripe Webhook] Subscription deleted:', existingSub.user_id);
}

async function createOrganization(
  userId: string,
  tier: SubscriptionTier,
  maxUsers: number,
  stripeSubscriptionId: string
) {
  console.log('[Stripe Webhook] Creating organization for user:', userId);

  // Obtener nombre del usuario
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('nick')
    .eq('id', userId)
    .single();

  const orgName = profile?.nick ? `${profile.nick}'s Team` : 'My Team';

  // Crear organización
  const { data: org, error: orgError } = await supabaseAdmin
    .from('organizations')
    .insert({
      name: orgName,
      owner_id: userId,
      subscription_tier: tier as any,
      max_users: maxUsers,
      stripe_subscription_id: stripeSubscriptionId,
      settings: {},
    })
    .select()
    .single();

  if (orgError) {
    console.error('[Stripe Webhook] Error creating organization:', orgError);
    return;
  }

  // Actualizar perfil del owner
  await supabaseAdmin
    .from('profiles')
    .update({
      organization_id: org.id,
      is_organization_owner: true,
    })
    .eq('id', userId);

  // Actualizar suscripción con organization_id
  await supabaseAdmin
    .from('subscriptions')
    .update({ organization_id: org.id })
    .eq('user_id', userId);

  console.log('[Stripe Webhook] Organization created:', org.id);
}
