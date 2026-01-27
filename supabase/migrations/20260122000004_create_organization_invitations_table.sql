-- =============================================
-- MIGRACIÓN 4: CREAR TABLA ORGANIZATION_INVITATIONS
-- Fecha: 2026-01-22
-- Descripción: Sistema de invitaciones por nick único
-- =============================================

CREATE TABLE IF NOT EXISTS organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invited_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- USUARIO INVITADO (por nick)
  invited_nick VARCHAR(50) NOT NULL,
  invited_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Se llena al aceptar

  -- ESTADO
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'rejected', 'expired')
  ),

  -- EXPIRACIÓN (7 días)
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),

  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- ÍNDICES
CREATE INDEX idx_org_invitations_organization_id ON organization_invitations(organization_id);
CREATE INDEX idx_org_invitations_invited_nick ON organization_invitations(invited_nick);
CREATE INDEX idx_org_invitations_invited_user_id ON organization_invitations(invited_user_id);
CREATE INDEX idx_org_invitations_status ON organization_invitations(status);

-- CONSTRAINT: Solo una invitación pendiente por usuario
CREATE UNIQUE INDEX idx_unique_pending_invitation
ON organization_invitations(organization_id, invited_nick)
WHERE status = 'pending';

-- ROW LEVEL SECURITY
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- Ver invitaciones relevantes
CREATE POLICY "view_relevant_org_invitations"
ON organization_invitations FOR SELECT
USING (
  invited_by_id = auth.uid()
  OR invited_user_id = auth.uid()
  OR invited_nick IN (
    SELECT nick FROM profiles WHERE id = auth.uid()
  )
);

-- Solo owners de organización pueden invitar
CREATE POLICY "org_owner_can_invite"
ON organization_invitations FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  )
);

-- Usuarios pueden actualizar sus propias invitaciones (aceptar/rechazar)
CREATE POLICY "users_update_own_invitations"
ON organization_invitations FOR UPDATE
USING (
  invited_user_id = auth.uid()
  OR invited_nick IN (SELECT nick FROM profiles WHERE id = auth.uid())
);

COMMENT ON TABLE organization_invitations IS
  'Invitaciones a organizaciones por nick único - expiran en 7 días';
