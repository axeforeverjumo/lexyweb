import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener session_id de query params
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID requerido' }, { status: 400 });
    }

    // Verificar sesión en Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.customer_details?.email !== user.email) {
      return NextResponse.json({ error: 'Sesión no válida para este usuario' }, { status: 403 });
    }

    // Obtener datos de suscripción actualizados
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
      },
      subscription: {
        tier: profile.subscription_tier,
        status: profile.subscription_status,
      },
    });
  } catch (error: any) {
    console.error('[Stripe Verify Session] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al verificar sesión' },
      { status: 500 }
    );
  }
}
