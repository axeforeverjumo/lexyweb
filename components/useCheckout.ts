'use client';

import { useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import type { PlanTier } from '@/types/pricing';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null);

  const startCheckout = async (tier: PlanTier = 'pro') => {
    try {
      setLoading(true);
      setLoadingTier(tier);

      // Enterprise requiere contacto con ventas
      if (tier === 'enterprise') {
        window.location.href = 'mailto:ventas@lexy.plus?subject=Consulta Plan Enterprise';
        return;
      }

      // Create checkout session with tier
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.contactSales) {
        alert('Por favor contacta con ventas para el plan Enterprise');
        return;
      }

      const { sessionId, url } = data;

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          // @ts-ignore - redirectToCheckout exists in Stripe.js but TypeScript types may not reflect it
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al iniciar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setLoadingTier(null);
    }
  };

  return { startCheckout, loading, loadingTier };
}
