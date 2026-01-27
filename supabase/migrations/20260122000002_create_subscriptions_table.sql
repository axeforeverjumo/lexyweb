-- =============================================
-- MIGRACIÓN 2: CREAR TABLA SUBSCRIPTIONS
-- Fecha: 2026-01-22
-- Descripción: Tracking completo de suscripciones Stripe
-- Origen: Diseño de lexyweb
-- =============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- STRIPE IDs
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,

  -- PLAN INFO
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('pro', 'team', 'business', 'enterprise')),
  status VARCHAR(20) NOT NULL CHECK (status IN (
    'incomplete', 'incomplete_expired', 'trialing', 'active',
    'past_due', 'canceled', 'unpaid', 'paused'
  )),

  -- FECHAS
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,

  -- FLAGS
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- METADATA
  max_users INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- RELACIÓN CON ORGANIZATION (nuevo)
  organization_id UUID, -- Se llena cuando sea TEAM+

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_organization ON subscriptions(organization_id);

-- TRIGGER: Actualizar updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuarios solo ven sus propias suscripciones
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins pueden ver todas
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role puede insertar/actualizar (webhook)
-- No se necesita política porque el webhook usa service_role key

COMMENT ON TABLE subscriptions IS
  'Tracking completo de suscripciones Stripe - sincronizado vía webhook';
