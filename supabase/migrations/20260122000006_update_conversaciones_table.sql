-- =============================================
-- MIGRACIÓN 6: ACTUALIZAR TABLA CONVERSACIONES
-- Fecha: 2026-01-22
-- Descripción: Agregar campos para chats compartidos y de equipo
-- =============================================

-- AGREGAR COLUMNAS
ALTER TABLE conversaciones
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_organization_chat BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS currently_typing_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS typing_started_at TIMESTAMP WITH TIME ZONE;

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_conversaciones_organization_id ON conversaciones(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_is_organization_chat ON conversaciones(is_organization_chat);
CREATE INDEX IF NOT EXISTS idx_conversaciones_currently_typing ON conversaciones(currently_typing_user_id);

-- COMENTARIOS
COMMENT ON COLUMN conversaciones.is_shared IS
  'TRUE si el chat está compartido con otros usuarios (P2P)';
COMMENT ON COLUMN conversaciones.is_organization_chat IS
  'TRUE si es un chat de equipo (todos los miembros lo ven)';
COMMENT ON COLUMN conversaciones.organization_id IS
  'Referencia a la organización si es chat de equipo';
COMMENT ON COLUMN conversaciones.currently_typing_user_id IS
  'Usuario que está escribiendo actualmente (lock optimista)';
