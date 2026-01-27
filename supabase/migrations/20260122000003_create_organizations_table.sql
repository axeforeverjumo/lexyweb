-- =============================================
-- MIGRACIÓN 3: CREAR TABLA ORGANIZATIONS
-- Fecha: 2026-01-22
-- Descripción: Equipos/Empresas para planes TEAM+
-- =============================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- INFORMACIÓN BÁSICA
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- PLAN
  subscription_tier VARCHAR(20) NOT NULL CHECK (
    subscription_tier IN ('team', 'business', 'enterprise')
  ),
  max_users INTEGER NOT NULL, -- 3, 4, 7 según plan

  -- STRIPE (referencia a la subscription)
  stripe_subscription_id VARCHAR(255),

  -- METADATA
  settings JSONB DEFAULT '{}',

  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_organizations_stripe_subscription ON organizations(stripe_subscription_id);

-- TRIGGER: Auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_organization_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_organization_updated
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_organization_updated_at();

-- TRIGGER: Actualizar profiles.organization_id del owner
CREATE OR REPLACE FUNCTION set_owner_organization()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET organization_id = NEW.id,
      is_organization_owner = true
  WHERE id = NEW.owner_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_organization_created_set_owner
AFTER INSERT ON organizations
FOR EACH ROW EXECUTE FUNCTION set_owner_organization();

-- ROW LEVEL SECURITY
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Ver solo mi organización
CREATE POLICY "view_own_organization"
ON organizations FOR SELECT
USING (
  owner_id = auth.uid()
  OR id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  )
);

-- Solo el owner puede actualizar
CREATE POLICY "owner_update_organization"
ON organizations FOR UPDATE
USING (owner_id = auth.uid());

-- Solo el owner puede eliminar
CREATE POLICY "owner_delete_organization"
ON organizations FOR DELETE
USING (owner_id = auth.uid());

-- AGREGAR FK a tabla subscriptions (ejecutar después)
ALTER TABLE subscriptions
ADD CONSTRAINT fk_subscriptions_organization
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

COMMENT ON TABLE organizations IS
  'Equipos/Empresas para planes TEAM, BUSINESS y ENTERPRISE';
