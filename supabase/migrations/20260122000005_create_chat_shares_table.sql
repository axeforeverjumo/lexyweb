-- =============================================
-- MIGRACIÓN 5: CREAR TABLA CHAT_SHARES
-- Fecha: 2026-01-22
-- Descripción: Compartir chats P2P (máximo 3 usuarios)
-- =============================================

CREATE TABLE IF NOT EXISTS chat_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- USUARIO INVITADO (por nick)
  shared_with_nick VARCHAR(50) NOT NULL,
  shared_with_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Se llena al aceptar

  -- ESTADO Y PERMISOS
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'rejected')
  ),
  can_edit BOOLEAN DEFAULT true,

  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- ÍNDICES
CREATE INDEX idx_chat_shares_conversacion_id ON chat_shares(conversacion_id);
CREATE INDEX idx_chat_shares_shared_with_nick ON chat_shares(shared_with_nick);
CREATE INDEX idx_chat_shares_shared_with_id ON chat_shares(shared_with_id);
CREATE INDEX idx_chat_shares_status ON chat_shares(status);

-- CONSTRAINT: Solo una invitación pendiente por usuario por chat
CREATE UNIQUE INDEX idx_unique_pending_chat_share
ON chat_shares(conversacion_id, shared_with_nick)
WHERE status = 'pending';

-- CONSTRAINT: Máximo 3 usuarios compartidos por chat (además del owner)
CREATE OR REPLACE FUNCTION check_chat_share_limit()
RETURNS TRIGGER AS $$
DECLARE
  share_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO share_count
  FROM chat_shares
  WHERE conversacion_id = NEW.conversacion_id
    AND status = 'accepted';

  IF share_count >= 3 THEN
    RAISE EXCEPTION 'Cannot share with more than 3 users';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_chat_share_limit
BEFORE INSERT ON chat_shares
FOR EACH ROW EXECUTE FUNCTION check_chat_share_limit();

-- ROW LEVEL SECURITY
ALTER TABLE chat_shares ENABLE ROW LEVEL SECURITY;

-- Ver compartidos relevantes
CREATE POLICY "view_relevant_chat_shares"
ON chat_shares FOR SELECT
USING (
  owner_id = auth.uid()
  OR shared_with_id = auth.uid()
  OR shared_with_nick IN (
    SELECT nick FROM profiles WHERE id = auth.uid()
  )
);

-- Solo owner del chat puede compartir
CREATE POLICY "chat_owner_can_share"
ON chat_shares FOR INSERT
WITH CHECK (
  conversacion_id IN (
    SELECT id FROM conversaciones WHERE user_id = auth.uid()
  )
);

-- Usuarios pueden actualizar sus compartidos (aceptar/rechazar)
CREATE POLICY "users_update_own_shares"
ON chat_shares FOR UPDATE
USING (
  shared_with_id = auth.uid()
  OR shared_with_nick IN (SELECT nick FROM profiles WHERE id = auth.uid())
);

-- Owner puede eliminar compartidos
CREATE POLICY "owner_delete_shares"
ON chat_shares FOR DELETE
USING (owner_id = auth.uid());

COMMENT ON TABLE chat_shares IS
  'Compartir chats personales P2P - máximo 3 colaboradores por chat';
