-- =============================================
-- MIGRACIÓN 8: CREAR TABLA TYPING_INDICATORS
-- Fecha: 2026-01-22
-- Descripción: Lock optimista - solo uno escribe a la vez
-- =============================================

CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 seconds'),

  UNIQUE(conversacion_id, user_id)
);

-- ÍNDICES
CREATE INDEX idx_typing_conversacion_id ON typing_indicators(conversacion_id);
CREATE INDEX idx_typing_expires_at ON typing_indicators(expires_at);

-- FUNCIÓN: Limpiar indicadores expirados
CREATE OR REPLACE FUNCTION cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM typing_indicators WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NOTA: Se debe configurar un cron job para ejecutar esta función cada minuto
-- Opción 1: pg_cron extension (si está disponible)
-- SELECT cron.schedule('cleanup-typing', '*/1 * * * *', 'SELECT cleanup_expired_typing_indicators()');
--
-- Opción 2: Llamar desde backend cada vez que se consulta typing
-- (implementado en API /api/conversaciones/:id/typing)

-- ROW LEVEL SECURITY
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

-- Ver indicadores de chats accesibles
CREATE POLICY "view_typing_in_accessible_chats"
ON typing_indicators FOR SELECT
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

-- Usuarios pueden crear sus propios indicadores
CREATE POLICY "users_create_own_typing"
ON typing_indicators FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Usuarios pueden eliminar sus propios indicadores
CREATE POLICY "users_delete_own_typing"
ON typing_indicators FOR DELETE
USING (user_id = auth.uid());

COMMENT ON TABLE typing_indicators IS
  'Indicadores de escritura en tiempo real - expiran en 10 segundos';
