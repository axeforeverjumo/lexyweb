-- =============================================
-- MIGRACIÓN 9: CREAR TABLA NOTIFICATIONS
-- Fecha: 2026-01-22
-- Descripción: Sistema de notificaciones in-app
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- TIPO Y CONTENIDO
  type VARCHAR(50) NOT NULL CHECK (
    type IN ('organization_invite', 'chat_share_invite', 'chat_message', 'system')
  ),
  title VARCHAR(255) NOT NULL,
  message TEXT,

  -- ACCIONES
  action_url VARCHAR(500),
  related_id UUID, -- ID de invitación, chat, etc.

  -- ESTADO
  is_read BOOLEAN DEFAULT false,

  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- ÍNDICES
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ROW LEVEL SECURITY
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Ver solo mis notificaciones
CREATE POLICY "view_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Usuarios pueden actualizar sus notificaciones (marcar leídas)
CREATE POLICY "users_update_own_notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid());

-- Usuarios pueden eliminar sus notificaciones
CREATE POLICY "users_delete_own_notifications"
ON notifications FOR DELETE
USING (user_id = auth.uid());

-- Sistema puede crear notificaciones (backend con service_role)
-- Sin política pública - controlado por backend

COMMENT ON TABLE notifications IS
  'Notificaciones in-app para invitaciones, mensajes y sistema';
