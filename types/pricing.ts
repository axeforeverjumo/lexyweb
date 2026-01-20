export type PlanTier = 'pro' | 'team' | 'business' | 'enterprise';

export interface PricingPlan {
  id: PlanTier;
  name: string;
  price: number;
  priceId?: string;
  tagline: string;
  description: string;
  cta: string;
  badge?: string;
  maxUsers: number;
  features: string[];
  highlighted?: boolean;
  contactSales?: boolean;
  recommended?: boolean;
}

export interface ComparisonFeature {
  name: string;
  pro: boolean | string;
  team: boolean | string;
  business: boolean | string;
  enterprise: boolean | string;
}
