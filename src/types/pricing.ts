export type PlanTier = 'pro' | 'team' | 'business' | 'enterprise';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  name: string;
  tier: PlanTier;
  price: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  popular?: boolean;
}

export const PLAN_CONFIG = {
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
    maxUsers: 10,
    priceEnv: 'STRIPE_PRICE_ID_BUSINESS',
  },
  enterprise: {
    name: 'ENTERPRISE',
    maxUsers: -1, // unlimited
    priceEnv: 'STRIPE_PRICE_ID_ENTERPRISE',
  },
} as const;

export type PlanConfig = typeof PLAN_CONFIG;
