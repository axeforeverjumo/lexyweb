-- =============================================
-- MIGRACIÓN 12: VISTAS DE ESTADÍSTICAS
-- Fecha: 2026-01-22
-- Descripción: Vistas para reporting y dashboards
-- =============================================

-- ========================================
-- VISTA: Estadísticas de suscripciones
-- ========================================

CREATE OR REPLACE VIEW subscription_stats AS
SELECT
  tier,
  status,
  COUNT(*) as count,
  SUM(CASE
    WHEN tier = 'pro' THEN 65
    WHEN tier = 'team' THEN 150
    WHEN tier = 'business' THEN 299
    WHEN tier = 'enterprise' THEN 500
    ELSE 0
  END) as mrr_eur
FROM subscriptions
WHERE status IN ('trialing', 'active')
GROUP BY tier, status;

-- Permisos solo para admins
GRANT SELECT ON subscription_stats TO authenticated;

-- ========================================
-- VISTA: Información completa de usuario
-- ========================================

CREATE OR REPLACE VIEW user_full_info AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.phone,
  p.avatar_url,
  p.nick,
  p.role,
  p.subscription_tier,
  p.subscription_status,
  p.trial_ends_at,
  p.organization_id,
  p.is_organization_owner,
  o.name as organization_name,
  o.max_users as org_max_users,
  (SELECT COUNT(*) FROM profiles WHERE organization_id = p.organization_id) as org_current_members,
  s.stripe_subscription_id,
  s.stripe_customer_id,
  s.current_period_end as subscription_ends_at,
  s.cancel_at_period_end as will_cancel
FROM profiles p
LEFT JOIN organizations o ON o.id = p.organization_id
LEFT JOIN subscriptions s ON s.user_id = p.id
  AND s.status IN ('trialing', 'active')
  AND s.current_period_end > NOW();

-- Permisos: cada usuario ve solo su info
GRANT SELECT ON user_full_info TO authenticated;

-- ========================================
-- VISTA: Chats accesibles por usuario
-- ========================================

CREATE OR REPLACE VIEW user_accessible_chats AS
SELECT
  c.id as conversacion_id,
  c.user_id as owner_id,
  c.titulo,
  c.tipo,
  c.estado,
  c.is_shared,
  c.is_organization_chat,
  c.organization_id,
  c.created_at,
  c.updated_at,
  c.last_message_at,
  cp.user_id as participant_id,
  cp.role as participant_role,
  cp.can_write as can_participant_write
FROM conversaciones c
LEFT JOIN conversacion_participants cp ON cp.conversacion_id = c.id;

-- Permisos: filtrado por RLS en conversaciones
GRANT SELECT ON user_accessible_chats TO authenticated;

-- ========================================
-- VISTA: Notificaciones pendientes por usuario
-- ========================================

CREATE OR REPLACE VIEW pending_notifications_count AS
SELECT
  user_id,
  COUNT(*) as unread_count,
  COUNT(*) FILTER (WHERE type = 'organization_invite') as pending_org_invites,
  COUNT(*) FILTER (WHERE type = 'chat_share_invite') as pending_chat_shares
FROM notifications
WHERE is_read = false
GROUP BY user_id;

GRANT SELECT ON pending_notifications_count TO authenticated;

COMMENT ON VIEW subscription_stats IS
  'Estadísticas de suscripciones para dashboard admin';
COMMENT ON VIEW user_full_info IS
  'Información completa del usuario incluyendo suscripción y organización';
COMMENT ON VIEW user_accessible_chats IS
  'Todos los chats accesibles por el usuario (propios, compartidos, de equipo)';
