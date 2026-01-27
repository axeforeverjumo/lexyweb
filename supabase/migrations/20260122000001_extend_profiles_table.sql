-- =============================================
-- MIGRACIÓN 1: EXTENDER TABLA PROFILES
-- Fecha: 2026-01-22
-- Descripción: Agregar campos de suscripción + nick único
-- =============================================

-- AGREGAR COLUMNAS DE SUSCRIPCIÓN (de lexyweb)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;

-- AGREGAR COLUMNAS DE COLABORACIÓN (de diseño nuevo)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS nick VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS organization_id UUID,
ADD COLUMN IF NOT EXISTS is_organization_owner BOOLEAN DEFAULT false;

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_nick ON profiles(nick);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- COMENTARIOS
COMMENT ON COLUMN profiles.subscription_tier IS
  'Tier de suscripción: none, pro, team, business, enterprise';
COMMENT ON COLUMN profiles.subscription_status IS
  'Estado: inactive, trialing, active, past_due, canceled, unpaid';
COMMENT ON COLUMN profiles.nick IS
  'Identificador único tipo username para invitaciones (ej: axeforever24)';
COMMENT ON COLUMN profiles.organization_id IS
  'Referencia a la organización/equipo al que pertenece';

-- TRIGGER: Asignar trial automáticamente al registrarse
CREATE OR REPLACE FUNCTION assign_trial_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo si no tiene ya valores asignados
  IF NEW.subscription_status IS NULL OR NEW.subscription_status = 'inactive' THEN
    NEW.subscription_status := 'trialing';
    NEW.trial_ends_at := NOW() + INTERVAL '14 days';
    NEW.subscription_tier := 'pro'; -- Trial con features PRO
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created_assign_trial
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION assign_trial_on_signup();

-- IMPORTANTE: Los usuarios existentes NO se modifican
-- Solo los nuevos registros tendrán trial automático
