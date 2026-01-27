-- =============================================
-- MIGRACIÓN 10: FUNCIONES HELPER
-- Fecha: 2026-01-22
-- Descripción: Funciones SQL reutilizables
-- =============================================

-- ========================================
-- FUNCIONES DE SUSCRIPCIÓN (de lexyweb)
-- ========================================

-- Función: Verificar si usuario tiene suscripción activa
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_uuid
      AND status IN ('trialing', 'active')
      AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener tier actual del usuario
CREATE OR REPLACE FUNCTION get_user_tier(user_uuid UUID)
RETURNS VARCHAR AS $$
DECLARE
  user_tier VARCHAR;
BEGIN
  SELECT tier INTO user_tier
  FROM subscriptions
  WHERE user_id = user_uuid
    AND status IN ('trialing', 'active')
    AND current_period_end > NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN COALESCE(user_tier, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- FUNCIONES DE ORGANIZACIONES
-- ========================================

-- Función: Validar límite de usuarios en organización
CREATE OR REPLACE FUNCTION check_organization_user_limit(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  max_users INTEGER;
  current_users INTEGER;
BEGIN
  SELECT o.max_users INTO max_users
  FROM organizations o WHERE o.id = org_id;

  SELECT COUNT(*) INTO current_users
  FROM profiles WHERE organization_id = org_id;

  RETURN current_users < max_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Contar miembros del equipo
CREATE OR REPLACE FUNCTION count_team_members(org_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM profiles
    WHERE organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- FUNCIONES DE CHATS
-- ========================================

-- Función: Validar si usuario puede escribir en chat (lock optimista)
CREATE OR REPLACE FUNCTION can_user_write_in_chat(
  chat_id UUID,
  user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check si hay alguien escribiendo actualmente
  IF EXISTS (
    SELECT 1 FROM typing_indicators
    WHERE conversacion_id = chat_id
    AND user_id != user_id -- Diferente usuario
    AND expires_at > NOW()
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check permisos del usuario
  RETURN EXISTS (
    SELECT 1 FROM conversacion_participants
    WHERE conversacion_id = chat_id
    AND user_id = user_id
    AND can_write = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener usuarios escribiendo en chat
CREATE OR REPLACE FUNCTION get_typing_users(chat_id UUID)
RETURNS TABLE(
  user_id UUID,
  nick VARCHAR,
  full_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.nick, p.full_name
  FROM typing_indicators ti
  JOIN profiles p ON p.id = ti.user_id
  WHERE ti.conversacion_id = chat_id
    AND ti.expires_at > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- FUNCIONES DE BÚSQUEDA
-- ========================================

-- Función: Buscar usuarios por nick (para autocomplete)
CREATE OR REPLACE FUNCTION search_users_by_nick(search_term VARCHAR)
RETURNS TABLE(
  id UUID,
  nick VARCHAR,
  full_name VARCHAR,
  avatar_url VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.nick, p.full_name, p.avatar_url
  FROM profiles p
  WHERE p.nick ILIKE '%' || search_term || '%'
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION has_active_subscription IS
  'Verifica si el usuario tiene una suscripción activa o en trial';
COMMENT ON FUNCTION check_organization_user_limit IS
  'Valida si se puede agregar otro miembro a la organización';
COMMENT ON FUNCTION can_user_write_in_chat IS
  'Valida si el usuario puede enviar mensajes (lock optimista)';
