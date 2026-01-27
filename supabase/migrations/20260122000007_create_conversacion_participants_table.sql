-- =============================================
-- MIGRACIÓN 7: CREAR TABLA CONVERSACION_PARTICIPANTS
-- Fecha: 2026-01-22
-- Descripción: Quién puede ver/editar cada chat
-- =============================================

CREATE TABLE IF NOT EXISTS conversacion_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- ROL Y PERMISOS
  role VARCHAR(20) DEFAULT 'collaborator' CHECK (
    role IN ('owner', 'collaborator', 'viewer')
  ),
  can_write BOOLEAN DEFAULT true,

  -- TIMESTAMPS
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(conversacion_id, user_id)
);

-- ÍNDICES
CREATE INDEX idx_participants_conversacion_id ON conversacion_participants(conversacion_id);
CREATE INDEX idx_participants_user_id ON conversacion_participants(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE conversacion_participants ENABLE ROW LEVEL SECURITY;

-- Ver participantes de chats accesibles
CREATE POLICY "view_participants_of_accessible_chats"
ON conversacion_participants FOR SELECT
USING (
  conversacion_id IN (
    SELECT id FROM conversaciones
    WHERE user_id = auth.uid()
    OR id IN (
      SELECT conversacion_id FROM conversacion_participants
      WHERE user_id = auth.uid()
    )
  )
);

-- Solo el owner puede agregar participantes
CREATE POLICY "owner_add_participants"
ON conversacion_participants FOR INSERT
WITH CHECK (
  conversacion_id IN (
    SELECT id FROM conversaciones WHERE user_id = auth.uid()
  )
);

-- Solo el owner puede eliminar participantes
CREATE POLICY "owner_remove_participants"
ON conversacion_participants FOR DELETE
USING (
  conversacion_id IN (
    SELECT id FROM conversaciones WHERE user_id = auth.uid()
  )
);

COMMENT ON TABLE conversacion_participants IS
  'Control de acceso granular - quién puede ver/editar cada chat';
