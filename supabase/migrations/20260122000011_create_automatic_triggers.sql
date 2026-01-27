-- =============================================
-- MIGRACIÓN 11: TRIGGERS AUTOMÁTICOS
-- Fecha: 2026-01-22
-- Descripción: Automatizaciones para notificaciones y más
-- =============================================

-- ========================================
-- TRIGGER: Notificar al invitar a organización
-- ========================================

CREATE OR REPLACE FUNCTION notify_on_organization_invitation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_id, action_url)
  SELECT
    p.id,
    'organization_invite',
    'Invitación a equipo',
    invited_by.full_name || ' te ha invitado a ' || o.name,
    NEW.id,
    '/notifications'
  FROM profiles p
  JOIN organizations o ON o.id = NEW.organization_id
  JOIN profiles invited_by ON invited_by.id = NEW.invited_by_id
  WHERE p.nick = NEW.invited_nick;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_organization_invitation_created
AFTER INSERT ON organization_invitations
FOR EACH ROW EXECUTE FUNCTION notify_on_organization_invitation();

-- ========================================
-- TRIGGER: Notificar al compartir chat
-- ========================================

CREATE OR REPLACE FUNCTION notify_on_chat_share()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_id, action_url)
  SELECT
    p.id,
    'chat_share_invite',
    'Chat compartido',
    owner.full_name || ' compartió un chat contigo: ' || c.titulo,
    NEW.id,
    '/notifications'
  FROM profiles p
  JOIN profiles owner ON owner.id = NEW.owner_id
  JOIN conversaciones c ON c.id = NEW.conversacion_id
  WHERE p.nick = NEW.shared_with_nick;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_chat_share_created
AFTER INSERT ON chat_shares
FOR EACH ROW EXECUTE FUNCTION notify_on_chat_share();

-- ========================================
-- TRIGGER: Auto-agregar participantes a chats de organización
-- ========================================

CREATE OR REPLACE FUNCTION auto_add_org_members_to_chat()
RETURNS TRIGGER AS $$
BEGIN
  -- Si es chat de organización, agregar todos los miembros
  IF NEW.is_organization_chat = true THEN
    INSERT INTO conversacion_participants (conversacion_id, user_id, role, can_write)
    SELECT NEW.id, p.id, 'collaborator', true
    FROM profiles p
    WHERE p.organization_id = NEW.organization_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_org_chat_created
AFTER INSERT ON conversaciones
FOR EACH ROW EXECUTE FUNCTION auto_add_org_members_to_chat();

-- ========================================
-- TRIGGER: Actualizar profiles al aceptar invitación
-- ========================================

CREATE OR REPLACE FUNCTION update_profile_on_invitation_accepted()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo si el status cambió a 'accepted'
  IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
    UPDATE profiles
    SET
      organization_id = NEW.organization_id,
      subscription_status = 'team_member',
      subscription_tier = (
        SELECT subscription_tier FROM organizations WHERE id = NEW.organization_id
      )
    WHERE id = NEW.invited_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_invitation_accepted
AFTER UPDATE ON organization_invitations
FOR EACH ROW EXECUTE FUNCTION update_profile_on_invitation_accepted();

-- ========================================
-- TRIGGER: Crear participant al aceptar chat share
-- ========================================

CREATE OR REPLACE FUNCTION create_participant_on_share_accepted()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo si el status cambió a 'accepted'
  IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
    INSERT INTO conversacion_participants (conversacion_id, user_id, role, can_write)
    VALUES (NEW.conversacion_id, NEW.shared_with_id, 'collaborator', NEW.can_edit)
    ON CONFLICT (conversacion_id, user_id) DO NOTHING;

    -- Actualizar flag is_shared en conversación
    UPDATE conversaciones
    SET is_shared = true
    WHERE id = NEW.conversacion_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_chat_share_accepted
AFTER UPDATE ON chat_shares
FOR EACH ROW EXECUTE FUNCTION create_participant_on_share_accepted();

COMMENT ON FUNCTION notify_on_organization_invitation IS
  'Crea notificación automáticamente cuando se invita a un usuario';
COMMENT ON FUNCTION auto_add_org_members_to_chat IS
  'Agrega automáticamente todos los miembros del equipo al crear chat de organización';
