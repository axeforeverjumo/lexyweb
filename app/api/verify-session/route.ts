import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract tier from subscription metadata
    const subscription = session.subscription as any;
    const tier = subscription?.metadata?.tier || 'pro';
    const planName = subscription?.metadata?.plan_name || 'PRO';
    const maxUsers = subscription?.metadata?.max_users || '1';

    return NextResponse.json({
      success: true,
      tier,
      planName,
      maxUsers: parseInt(maxUsers),
      customerEmail: session.customer_details?.email,
      trialEnd: subscription?.trial_end,
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
