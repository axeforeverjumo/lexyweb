# 🤝 DISEÑO: Sistema de Colaboración y Suscripciones para LexyApp

**Fecha:** 22 Enero 2026
**Versión:** 1.0
**Estado:** ✅ Diseño Completo - Listo para Implementación

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Modelo de Negocio y Planes](#modelo-de-negocio-y-planes)
3. [Arquitectura de Base de Datos](#arquitectura-de-base-de-datos)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [APIs Backend](#apis-backend)
6. [Componentes Frontend](#componentes-frontend)
7. [Flujos Completos de Usuario](#flujos-completos-de-usuario)
8. [Sistema de Real-Time](#sistema-de-real-time)
9. [Plan de Implementación](#plan-de-implementación)
10. [Tecnologías y Dependencias](#tecnologías-y-dependencias)

---

## 🎯 Resumen Ejecutivo

LexyApp necesita evolucionar de una aplicación individual a una plataforma colaborativa que soporte:

✅ **Chats compartidos P2P** (hasta 3 colaboradores por chat)
✅ **Organizaciones/Equipos** con espacios compartidos
✅ **Sistema de suscripciones** (PRO, TEAM, BUSINESS, ENTERPRISE)
✅ **Invitaciones por nick único** (`axeforever24`)
✅ **Lock de escritura optimista** en tiempo real
✅ **Trial de 14 días** automático para nuevos usuarios
✅ **Integración Stripe** reutilizando código de lexyweb

**Objetivo:** Permitir que equipos de abogados, inmobiliarias y agencias colaboren en la generación y gestión de contratos.

---

## 💰 Modelo de Negocio y Planes

### Planes Actuales (de lexy.plus)

| Plan | Precio | Usuarios | Características Clave |
|------|--------|----------|----------------------|
| **PRO** | €65/mes | 1 | Contratos ilimitados, 97 templates, firmas digitales |
| **TEAM** ⭐ | €150/mes | Hasta 3 | Todo PRO + **chats compartidos de equipo**, admin dashboard |
| **BUSINESS** | €299/mes | Hasta 4 | Todo TEAM + white-label, templates custom, soporte prioritario |
| **ENTERPRISE** | €500/mes | Hasta 7 | Todo BUSINESS + API, integración ERP, manager dedicado |

### Modelo de Facturación

- **Solo paga el Owner** del plan TEAM/BUSINESS/ENTERPRISE
- **Usuarios invitados** no pagan (acceso incluido en plan del owner)
- **Trial gratuito:** 14 días (plan PRO) sin tarjeta de crédito
- **Procesador de pagos:** Stripe (ya integrado en lexyweb)

### Tipos de Usuarios

1. **Usuario Free (Trial expirado):**
   - Cuenta creada pero app **bloqueada**
   - Puede aceptar invitaciones a equipos
   - No puede usar la app hasta pagar o ser invitado

2. **Usuario PRO (Individual):**
   - Paga €65/mes
   - Uso ilimitado individual
   - Puede compartir chats P2P (hasta 3 usuarios por chat)

3. **Owner de Equipo (TEAM+):**
   - Paga plan TEAM/BUSINESS/ENTERPRISE
   - Puede invitar usuarios según límite del plan
   - Gestiona la organización

4. **Miembro de Equipo:**
   - Invitado por un Owner
   - Acceso completo sin pagar
   - Ve todos los chats del equipo

---

## 🗄️ Arquitectura de Base de Datos

### Diagrama de Relaciones

```
profiles (usuarios)
├── organizations (1:N) - Un usuario puede ser owner de 1 org
├── organization_invitations (1:N) - Invitaciones enviadas/recibidas
├── conversaciones (1:N) - Chats creados por el usuario
├── conversacion_participants (1:N) - Chats en los que participa
├── chat_shares (1:N) - Compartidos P2P enviados/recibidos
└── notifications (1:N) - Notificaciones del usuario

organizations (equipos)
├── profiles (1:N) - Miembros del equipo
├── organization_invitations (1:N) - Invitaciones del equipo
└── conversaciones (1:N) - Chats de equipo

conversaciones (chats)
├── conversacion_participants (1:N) - Quién tiene acceso
├── mensajes (1:N) - Mensajes del chat
├── typing_indicators (1:N) - Quién está escribiendo
└── chat_shares (1:N) - Compartidos P2P
```

---

### 1. Tabla `profiles` (actualizar existente)

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  -- Identificación única
  nick VARCHAR(50) UNIQUE NOT NULL,

  -- Suscripción
  subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (
    subscription_status IN ('trial', 'active', 'canceled', 'expired', 'team_member')
  ),
  subscription_tier VARCHAR(20) CHECK (
    subscription_tier IN ('none', 'pro', 'team', 'business', 'enterprise')
  ),
  trial_ends_at TIMESTAMP,

  -- Stripe
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),

  -- Organización
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  is_organization_owner BOOLEAN DEFAULT false;

-- Índices para performance
CREATE INDEX idx_profiles_nick ON profiles(nick);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);

-- Trigger: asignar trial automáticamente al registrarse
CREATE OR REPLACE FUNCTION assign_trial_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subscription_status := 'trial';
  NEW.trial_ends_at := NOW() + INTERVAL '14 days';
  NEW.subscription_tier := 'pro'; -- Trial con features PRO
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION assign_trial_on_signup();
```

---

### 2. Tabla `organizations` (nueva)

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Información básica
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Plan
  subscription_tier VARCHAR(20) NOT NULL CHECK (
    subscription_tier IN ('team', 'business', 'enterprise')
  ),
  max_users INTEGER NOT NULL, -- 3, 4, 7 según plan

  -- Stripe
  stripe_subscription_id VARCHAR(255),

  -- Metadata
  settings JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);

-- Trigger: auto-actualizar updated_at
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
```

---

### 3. Tabla `organization_invitations` (nueva)

```sql
CREATE TABLE organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invited_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Usuario invitado (por nick)
  invited_nick VARCHAR(50) NOT NULL,
  invited_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Se llena al aceptar

  -- Estado
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'rejected', 'expired')
  ),

  -- Expiración
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP
);

CREATE INDEX idx_org_invitations_organization_id ON organization_invitations(organization_id);
CREATE INDEX idx_org_invitations_invited_nick ON organization_invitations(invited_nick);
CREATE INDEX idx_org_invitations_invited_user_id ON organization_invitations(invited_user_id);
CREATE INDEX idx_org_invitations_status ON organization_invitations(status);
```

---

### 4. Tabla `chat_shares` (nueva - para chats P2P compartidos)

```sql
CREATE TABLE chat_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Usuario invitado (por nick)
  shared_with_nick VARCHAR(50) NOT NULL,
  shared_with_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Se llena al aceptar

  -- Estado y permisos
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'rejected')
  ),
  can_edit BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP
);

CREATE INDEX idx_chat_shares_conversacion_id ON chat_shares(conversacion_id);
CREATE INDEX idx_chat_shares_shared_with_nick ON chat_shares(shared_with_nick);
CREATE INDEX idx_chat_shares_status ON chat_shares(status);

-- Constraint: máximo 3 usuarios compartidos por chat (además del owner)
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
```

---

### 5. Tabla `conversaciones` (actualizar existente)

```sql
ALTER TABLE conversaciones ADD COLUMN IF NOT EXISTS
  -- Tipo de chat
  is_shared BOOLEAN DEFAULT false,
  is_organization_chat BOOLEAN DEFAULT false,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Lock optimista
  currently_typing_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  typing_started_at TIMESTAMP;

CREATE INDEX idx_conversaciones_organization_id ON conversaciones(organization_id);
CREATE INDEX idx_conversaciones_is_organization_chat ON conversaciones(is_organization_chat);
```

---

### 6. Tabla `conversacion_participants` (nueva)

```sql
CREATE TABLE conversacion_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Rol y permisos
  role VARCHAR(20) DEFAULT 'collaborator' CHECK (
    role IN ('owner', 'collaborator', 'viewer')
  ),
  can_write BOOLEAN DEFAULT true,

  -- Timestamps
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP,

  UNIQUE(conversacion_id, user_id)
);

CREATE INDEX idx_participants_conversacion_id ON conversacion_participants(conversacion_id);
CREATE INDEX idx_participants_user_id ON conversacion_participants(user_id);
```

---

### 7. Tabla `typing_indicators` (nueva)

```sql
CREATE TABLE typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '10 seconds'),

  UNIQUE(conversacion_id, user_id)
);

CREATE INDEX idx_typing_conversacion_id ON typing_indicators(conversacion_id);
CREATE INDEX idx_typing_expires_at ON typing_indicators(expires_at);

-- Función: limpiar indicadores expirados
CREATE OR REPLACE FUNCTION cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM typing_indicators WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Cron job: limpiar cada minuto (requiere pg_cron extension)
-- SELECT cron.schedule('cleanup-typing', '*/1 * * * *', 'SELECT cleanup_expired_typing_indicators()');
```

---

### 8. Tabla `notifications` (nueva)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Tipo y contenido
  type VARCHAR(50) NOT NULL CHECK (
    type IN ('organization_invite', 'chat_share_invite', 'chat_message', 'system')
  ),
  title VARCHAR(255) NOT NULL,
  message TEXT,

  -- Acciones
  action_url VARCHAR(500),
  related_id UUID, -- ID de invitación, chat, etc.

  -- Estado
  is_read BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
```

---

## 🔒 Row Level Security (RLS)

### Políticas para `conversaciones`

```sql
-- Ver conversaciones propias, compartidas o de mi organización
CREATE POLICY "users_view_accessible_conversations"
ON conversaciones FOR SELECT
USING (
  user_id = auth.uid() -- Mis chats
  OR id IN ( -- Chats compartidos conmigo
    SELECT conversacion_id FROM conversacion_participants
    WHERE user_id = auth.uid()
  )
  OR (is_organization_chat = true AND organization_id IN ( -- Chats de mi equipo
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ))
);

-- Crear conversación (solo usuarios con suscripción activa)
CREATE POLICY "users_create_conversations"
ON conversaciones FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND subscription_status IN ('trial', 'active', 'team_member')
  )
);

-- Actualizar solo propias conversaciones
CREATE POLICY "users_update_own_conversations"
ON conversaciones FOR UPDATE
USING (user_id = auth.uid());

-- Eliminar solo propias conversaciones
CREATE POLICY "users_delete_own_conversations"
ON conversaciones FOR DELETE
USING (user_id = auth.uid());
```

---

### Políticas para `conversacion_participants`

```sql
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
```

---

### Políticas para `organizations`

```sql
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
```

---

### Políticas para `organization_invitations`

```sql
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
```

---

### Políticas para `chat_shares`

```sql
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
```

---

### Políticas para `notifications`

```sql
-- Ver solo mis notificaciones
CREATE POLICY "view_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Sistema puede crear notificaciones (backend con service_role)
-- Sin política pública - controlado por backend

-- Usuarios pueden actualizar sus notificaciones (marcar leídas)
CREATE POLICY "users_update_own_notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid());

-- Usuarios pueden eliminar sus notificaciones
CREATE POLICY "users_delete_own_notifications"
ON notifications FOR DELETE
USING (user_id = auth.uid());
```

---

### Políticas para `typing_indicators`

```sql
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
```

---

## 🔧 Funciones SQL Helper

### Validar límite de usuarios en organización

```sql
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
$$ LANGUAGE plpgsql;
```

---

### Validar si usuario puede escribir en chat

```sql
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
    AND user_id != user_id
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
$$ LANGUAGE plpgsql;
```

---

### Obtener nicks disponibles (para búsqueda)

```sql
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
$$ LANGUAGE plpgsql;
```

---

## 🔔 Triggers Automáticos

### Auto-crear notificación al enviar invitación a organización

```sql
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
```

---

### Auto-crear notificación al compartir chat

```sql
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
```

---

### Auto-agregar participantes a chats de organización

```sql
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
```

---

## 🌐 APIs Backend

### Gestión de Organizaciones

**`POST /api/organizations`** - Crear organización
```typescript
// Input: { name: string, tier: 'team' | 'business' | 'enterprise' }
// Output: { organization: Organization }
// Llamado automáticamente por webhook de Stripe al pagar TEAM+
```

**`GET /api/organizations/:id`** - Obtener detalles
```typescript
// Output: { organization: Organization, members: Profile[] }
```

**`PATCH /api/organizations/:id`** - Actualizar nombre
```typescript
// Input: { name: string }
// Output: { organization: Organization }
```

**`DELETE /api/organizations/:id`** - Eliminar organización
```typescript
// Solo owner puede eliminar
// Elimina en cascada: invitaciones, chats de equipo
```

---

### Invitaciones a Organizaciones

**`POST /api/organizations/:id/invitations`** - Enviar invitación
```typescript
// Input: { nick: string }
// Validaciones:
// - Usuario existe
// - No está en otra organización
// - Límite de usuarios no excedido
// Output: { invitation: OrganizationInvitation }
```

**`GET /api/organizations/invitations/my`** - Mis invitaciones pendientes
```typescript
// Output: { invitations: OrganizationInvitation[] }
```

**`POST /api/organizations/invitations/:id/accept`** - Aceptar invitación
```typescript
// Actualiza profiles:
// - organization_id = org.id
// - subscription_status = 'team_member'
// - subscription_tier = org.subscription_tier
// Output: { success: true, organization: Organization }
```

**`POST /api/organizations/invitations/:id/reject`** - Rechazar invitación
```typescript
// Actualiza status = 'rejected'
// Output: { success: true }
```

---

### Compartir Chats (P2P)

**`POST /api/conversaciones/:id/share`** - Compartir con usuario
```typescript
// Input: { nick: string }
// Validaciones:
// - Usuario existe
// - Límite de 3 compartidos no excedido
// - Usuario no es ya participante
// Output: { share: ChatShare }
```

**`GET /api/conversaciones/:id/participants`** - Ver participantes
```typescript
// Output: { participants: ConversacionParticipant[] }
```

**`DELETE /api/conversaciones/:id/share/:userId`** - Quitar acceso
```typescript
// Solo owner puede quitar
// Output: { success: true }
```

**`POST /api/chat-shares/:id/accept`** - Aceptar invitación
```typescript
// Crea conversacion_participant
// Output: { success: true }
```

**`POST /api/chat-shares/:id/reject`** - Rechazar invitación
```typescript
// Actualiza status = 'rejected'
// Output: { success: true }
```

---

### Typing Indicators (Real-time)

**`POST /api/conversaciones/:id/typing/start`** - Iniciar escritura
```typescript
// INSERT INTO typing_indicators
// Output: { success: true }
```

**`POST /api/conversaciones/:id/typing/stop`** - Dejar de escribir
```typescript
// DELETE FROM typing_indicators
// Output: { success: true }
```

**`GET /api/conversaciones/:id/typing`** - Quién está escribiendo
```typescript
// Polling cada 2 segundos
// Output: { typingUsers: Profile[] }
```

---

### Notificaciones

**`GET /api/notifications`** - Listar notificaciones
```typescript
// Query params: ?limit=20&offset=0&unread_only=true
// Output: { notifications: Notification[], total: number }
```

**`PATCH /api/notifications/:id/read`** - Marcar como leída
```typescript
// Output: { success: true }
```

**`DELETE /api/notifications/:id`** - Eliminar notificación
```typescript
// Output: { success: true }
```

---

### Stripe (reutilizar de lexyweb)

**`POST /api/stripe/checkout`** - Crear sesión de pago
```typescript
// Input: { tier: 'pro' | 'team' | 'business', successUrl, cancelUrl }
// Output: { sessionId: string, url: string }
```

**`GET /api/stripe/verify-session`** - Verificar pago exitoso
```typescript
// Query: ?session_id=xxx
// Output: { success: true, tier, planName, maxUsers, customerEmail }
```

**`POST /api/stripe/webhook`** - Webhook de Stripe
```typescript
// Events:
// - checkout.session.completed → activar suscripción + crear org
// - customer.subscription.updated → actualizar tier
// - customer.subscription.deleted → cancelar suscripción
// - invoice.payment_failed → notificar usuario
```

**`GET /api/stripe/portal`** - Portal de gestión
```typescript
// Redirect a Stripe Customer Portal
// Output: { url: string }
```

---

## 🎨 Componentes Frontend

### Sidebar Actualizado

**`ConversationsSidebar.tsx`** (actualizar)
```tsx
<ConversationsSidebar>
  {/* Header con perfil y nick */}
  <UserProfile
    nick="axeforever24"
    subscriptionTier="team"
    organization="Inmobiliaria García"
  />

  {/* Notificaciones badge */}
  <NotificationBell count={2} onClick={openNotifications} />

  {/* Segmento 1: Mis Chats */}
  <ChatSection title="Mis Chats">
    <Button onClick={createPersonalChat}>
      Nueva Conversación
    </Button>
    <ChatList
      chats={personalChats}
      renderItem={(chat) => (
        <ChatItem
          {...chat}
          isShared={chat.is_shared}
          participants={chat.participants}
          typingUser={chat.typingUser}
        />
      )}
    />
  </ChatSection>

  {/* Segmento 2: Chats de Equipo (condicional) */}
  {user.organization_id && (
    <ChatSection title="Chats de Equipo">
      <Button onClick={openTeamManagement}>
        ⚙️ Gestionar Equipo
      </Button>
      <ChatList
        chats={organizationChats}
        renderItem={(chat) => (
          <ChatItem
            {...chat}
            badge="🏢"
            createdBy={chat.created_by}
          />
        )}
      />
    </ChatSection>
  )}
</ConversationsSidebar>
```

---

### Nuevos Componentes

**1. `ShareChatModal.tsx`**
```tsx
interface ShareChatModalProps {
  conversacionId: string;
  currentShares: Profile[];
  onClose: () => void;
}

// Features:
// - Input con búsqueda de usuarios por nick
// - Autocomplete con search_users_by_nick()
// - Lista de usuarios ya compartidos (máx 3)
// - Botón "Invitar" deshabilitado si límite alcanzado
// - Validación: no compartir consigo mismo
```

---

**2. `NotificationsPanel.tsx`**
```tsx
interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Features:
// - Dropdown con lista de notificaciones
// - Tipos visuales diferentes (invitación, mensaje, sistema)
// - Botones contextuales:
//   * organization_invite → [Aceptar] [Rechazar]
//   * chat_share_invite → [Aceptar] [Rechazar]
//   * chat_message → [Ver chat]
// - Badge "no leídas" en NotificationBell
// - Marcar como leída al hacer click
```

---

**3. `CreateOrganizationModal.tsx`**
```tsx
interface CreateOrganizationModalProps {
  tier: 'team' | 'business' | 'enterprise';
  maxUsers: number;
  onClose: () => void;
}

// Features:
// - Input: nombre de organización
// - Muestra plan actual y límite de usuarios
// - Info: "Puedes invitar hasta {maxUsers - 1} colaboradores"
// - Llamado automáticamente tras pagar en Stripe
```

---

**4. `ManageTeamModal.tsx`**
```tsx
interface ManageTeamModalProps {
  organization: Organization;
  members: Profile[];
  onClose: () => void;
}

// Features:
// - Header con nombre de organización
// - Plan actual (TEAM/BUSINESS/ENTERPRISE)
// - Lista de miembros:
//   * Owner (badge especial)
//   * Miembros (con botón "Eliminar" si eres owner)
// - Contador: "2/3 usuarios"
// - Botón "+ Invitar usuario"
// - Modal anidado: InviteUserModal
```

---

**5. `SubscriptionBlockedScreen.tsx`**
```tsx
interface SubscriptionBlockedScreenProps {
  user: Profile;
  pendingInvitations: OrganizationInvitation[];
}

// Features:
// - Pantalla completa que cubre toda la app
// - Mensaje: "Tu cuenta necesita una suscripción activa"
// - Si tiene invitaciones pendientes:
//   * Mostrar cards de invitaciones
//   * Botones [Aceptar] [Rechazar]
// - Botón principal: "Ver planes y precios"
// - Link: "Ya pagué - refrescar estado"
```

---

**6. `PricingModal.tsx`**
```tsx
// Reutilizar de lexyweb, adaptar diseño emerald
// 4 planes: PRO, TEAM, BUSINESS, ENTERPRISE
// Hook: useCheckout() para iniciar pago
```

---

**7. `ChatTypingIndicator.tsx`**
```tsx
interface ChatTypingIndicatorProps {
  conversacionId: string;
  currentUserId: string;
}

// Features:
// - Polling cada 2 segundos a /api/conversaciones/:id/typing
// - Muestra: "✍️ María está escribiendo..."
// - Si múltiples: "María y Juan están escribiendo..."
// - Animación de "..."
```

---

**8. `ChatMessageInput.tsx`** (actualizar)
```tsx
// Agregar:
// - onFocus → POST /api/conversaciones/:id/typing/start
// - onBlur → POST /api/conversaciones/:id/typing/stop
// - onSubmit → validar can_user_write_in_chat()
// - Si bloqueado → toast: "⏳ Espera tu turno"
// - Deshabilitar botón "Enviar" si hay otro escribiendo
```

---

## 👤 Flujos Completos de Usuario

### FLUJO 1: Registro y Trial

```
1. Usuario visita lexy.plus → "Empezar gratis"
2. Formulario registro:
   - Email: maria@example.com
   - Contraseña: ********
   - Nombre: María García
   - Nick: maria_abogada (validación real-time ✅)
3. Submit → Supabase Auth crea usuario
4. Trigger: assign_trial_on_signup()
   - subscription_status = 'trial'
   - trial_ends_at = NOW() + 14 days
5. Redirect → /dashboard
6. Banner: "🎉 Trial activo - 14 días restantes"
7. Usuario puede usar toda la app (plan PRO features)
```

---

### FLUJO 2: Trial Expira → Pago

```
1. Día 15 → Cron job actualiza:
   - subscription_status = 'expired'
2. Usuario entra → Middleware detecta 'expired'
3. Render: <SubscriptionBlockedScreen>
   - "Tu trial ha terminado"
   - Botón: "Ver planes"
4. Click → <PricingModal> con 4 planes
5. Selecciona TEAM (€150/mes, 3 usuarios)
6. API: POST /api/stripe/checkout
   - tier: 'team'
   - successUrl: '/success'
7. Redirect → Stripe Checkout
8. Completa pago con tarjeta
9. Webhook: checkout.session.completed
   Backend:
   a) UPDATE profiles:
      - subscription_status = 'active'
      - subscription_tier = 'team'
      - stripe_customer_id = cus_xxx
      - stripe_subscription_id = sub_xxx
   b) INSERT INTO organizations:
      - name = "Mi Equipo"
      - owner_id = user.id
      - subscription_tier = 'team'
      - max_users = 3
   c) UPDATE profiles:
      - organization_id = org.id
      - is_organization_owner = true
10. Redirect → /success
11. App desbloqueada ✅
12. Sidebar muestra nuevo segmento: "Chats de Equipo"
```

---

### FLUJO 3: Owner Invita a Miembro

```
1. juan_owner (owner de "Inmobiliaria García")
2. Sidebar → Click "⚙️ Gestionar Equipo"
3. <ManageTeamModal>:
   - "Inmobiliaria García - Plan TEAM"
   - Miembros:
     * juan_owner (tú) - Owner
     * [vacío] - 2 espacios
   - Botón: "+ Invitar usuario"
4. Click "Invitar" → <InviteUserModal>
5. Input: "maria_abogada" → Enter
6. Frontend busca: /api/users/search?nick=maria_abogada
7. Muestra sugerencia: "María García (@maria_abogada)"
8. Click "Enviar invitación"
9. API: POST /api/organizations/:orgId/invitations
   Backend validaciones:
   - ✅ Nick existe
   - ✅ Usuario no está en otra org
   - ✅ Límite 3 usuarios no excedido (1/3 usado)
   - INSERT INTO organization_invitations
   - Trigger: notify_on_organization_invitation()
     * INSERT INTO notifications para maria_abogada
10. Modal: "✅ Invitación enviada"
11. Lista actualiza: "maria_abogada (pendiente)"
```

---

### FLUJO 4: Miembro Acepta Invitación

```
1. maria_abogada entra a /dashboard
2. App bloqueada (subscription_status = 'expired')
3. <SubscriptionBlockedScreen> muestra:
   - "Tu cuenta está inactiva"
   - Card: "juan_owner te invitó a Inmobiliaria García"
   - Botones: [Aceptar] [Rechazar]
4. Click "Aceptar"
5. API: POST /api/organizations/invitations/:id/accept
   Backend:
   a) UPDATE organization_invitations:
      - status = 'accepted'
      - accepted_at = NOW()
      - invited_user_id = maria_abogada.id
   b) UPDATE profiles (maria_abogada):
      - organization_id = org.id
      - subscription_status = 'team_member'
      - subscription_tier = 'team'
6. Response: { success: true, organization }
7. Frontend: reload app
8. App desbloqueada ✅
9. Sidebar muestra:
   - "Mis Chats"
   - "Chats de Equipo - Inmobiliaria García"
10. Notification: "Te uniste a Inmobiliaria García"
```

---

### FLUJO 5: Compartir Chat Personal (P2P)

```
1. juan_owner crea chat personal:
   - "Contrato arras Sr. López"
2. Header del chat → Botón "🔗 Compartir"
3. <ShareChatModal>:
   - Título: "Compartir con colaboradores (máx 3)"
   - Input buscar: [          ]
   - Lista actual: [vacío]
4. Escribe: "maria" → Autocomplete:
   - maria_abogada (María García)
5. Click "Agregar"
6. Lista muestra: "maria_abogada (pendiente)"
7. Puede agregar 2 más (pedro_legal, ana_notaria)
8. Click "Enviar invitaciones"
9. API: POST /api/conversaciones/:id/share (x3)
   Backend:
   - INSERT INTO chat_shares (x3)
   - Trigger: notify_on_chat_share() (x3)
     * INSERT INTO notifications (x3)
10. Modal cierra
11. Header muestra: "👥 3 colaboradores"

--- Para maria_abogada ---
12. Recibe notificación en <NotificationBell>
13. Click → <NotificationsPanel>:
    - "juan_owner compartió: Contrato arras Sr. López"
    - [Aceptar] [Rechazar]
14. Click "Aceptar"
15. API: POST /api/chat-shares/:id/accept
    Backend:
    a) UPDATE chat_shares:
       - status = 'accepted'
       - accepted_at = NOW()
       - shared_with_id = maria_abogada.id
    b) INSERT INTO conversacion_participants:
       - conversacion_id = chat.id
       - user_id = maria_abogada.id
       - role = 'collaborator'
       - can_write = true
16. Frontend: chat aparece en sidebar "Mis Chats"
17. Badge: "👥 Compartido con juan_owner, maria_abogada"
```

---

### FLUJO 6: Chat de Equipo

```
1. juan_owner en sidebar "Chats de Equipo"
2. Botón: "+ Nueva Conversación de Equipo"
3. Modal: "Título del chat"
   - Input: "Cliente: Apartamentos Mar Bella"
4. Submit → API: POST /api/conversaciones
   Data: {
     titulo: "Cliente: Apartamentos Mar Bella",
     tipo: 'consulta',
     is_organization_chat: true,
     organization_id: org.id
   }
5. Backend:
   a) INSERT INTO conversaciones
   b) Trigger: auto_add_org_members_to_chat()
      - SELECT members FROM profiles WHERE organization_id = org.id
      - INSERT INTO conversacion_participants (x3)
        * juan_owner (role='owner')
        * maria_abogada (role='collaborator')
        * pedro_legal (role='collaborator')
6. Response: { conversacion }
7. Chat aparece en sidebar de los 3 usuarios inmediatamente
8. Badge: "🏢 Chat de Equipo"
9. Todos pueden ver/escribir sin aceptar invitación
```

---

### FLUJO 7: Lock Optimista - Escritura

```
1. maria_abogada abre chat compartido con juan_owner
2. Empieza a escribir: "Hola, sobre el contrato..."
3. onKeyDown → API: POST /api/conversaciones/:id/typing/start
   Backend:
   - INSERT INTO typing_indicators
     * expires_at = NOW() + 10 seconds
4. juan_owner (en el mismo chat):
   - Polling detecta typing_indicator
   - Componente <ChatTypingIndicator> muestra:
     "✍️ maria_abogada está escribiendo..."
5. juan_owner escribe en textarea (NO bloqueado)
6. juan_owner termina mensaje: "Ok, reviso mañana"
7. Click botón "Enviar"
8. API: POST /api/conversaciones/:id/messages
   Backend valida:
   - can_user_write_in_chat(chat.id, juan_owner.id)
   - Función detecta: maria_abogada.typing_indicator activo
   - Return: { blocked: true, message: "..." }
9. Frontend:
   - Toast: "⏳ maria_abogada está escribiendo"
   - Botón "Enviar" deshabilitado (2 segundos)
10. maria_abogada envía su mensaje
11. Backend: DELETE typing_indicator
12. juan_owner automáticamente puede enviar
    - Polling detecta: no hay typing_indicators
    - Botón "Enviar" se habilita
13. juan_owner envía: "Ok, reviso mañana"
14. Ambos ven ambos mensajes en tiempo real
```

---

## ⚡ Sistema de Real-Time

### Opción A: Polling Simple (MVP)

**Ventajas:**
- ✅ Simple de implementar
- ✅ Sin dependencias adicionales
- ✅ Funciona en todos los navegadores

**Desventajas:**
- ❌ Mayor latencia (2 segundos)
- ❌ Más requests al servidor

```typescript
// hooks/useTypingIndicators.ts
export function useTypingIndicators(conversacionId: string) {
  const [typingUsers, setTypingUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/conversaciones/${conversacionId}/typing`);
      const { typingUsers } = await response.json();
      setTypingUsers(typingUsers);
    }, 2000);

    return () => clearInterval(interval);
  }, [conversacionId]);

  return typingUsers;
}

// hooks/useNewMessages.ts
export function useNewMessages(conversacionId: string) {
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(
        `/api/conversaciones/${conversacionId}/messages/new?since=${lastMessageId}`
      );
      const { newMessages } = await response.json();

      if (newMessages.length > 0) {
        addMessages(newMessages);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [conversacionId]);
}
```

---

### Opción B: Supabase Realtime (Producción)

**Ventajas:**
- ✅ Real-time verdadero (<100ms latencia)
- ✅ Menos carga al servidor
- ✅ WebSockets nativos

**Desventajas:**
- ❌ Más complejo
- ❌ Requiere configuración adicional

```typescript
// hooks/useRealtimeTyping.ts
export function useRealtimeTyping(conversacionId: string) {
  const [typingUsers, setTypingUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversacionId}:typing`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversacion_id=eq.${conversacionId}`,
        },
        async () => {
          // Refetch typing users
          const { data } = await supabase
            .from('typing_indicators')
            .select('user_id, profiles(*)')
            .eq('conversacion_id', conversacionId)
            .gt('expires_at', new Date().toISOString());

          setTypingUsers(data?.map(t => t.profiles) || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversacionId]);

  return typingUsers;
}

// hooks/useRealtimeMessages.ts
export function useRealtimeMessages(conversacionId: string) {
  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversacionId}:messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `conversacion_id=eq.${conversacionId}`,
        },
        (payload) => {
          addMensaje(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversacionId]);
}
```

---

**Recomendación:**
1. **MVP (Fases 1-6):** Usar Polling (Opción A)
2. **Producción (Fase 7):** Migrar a Realtime (Opción B)

---

## 📅 Plan de Implementación

### FASE 1: Fundamentos (1 semana)

**Objetivo:** Base de datos + bloqueo de app

**Tareas:**
- [ ] Crear 8 migraciones SQL
- [ ] Aplicar RLS policies (30+ políticas)
- [ ] Crear funciones SQL helper (3)
- [ ] Crear triggers automáticos (3)
- [ ] Agregar campo `nick` a profiles con validación
- [ ] Implementar sistema de trial (14 días)
- [ ] Middleware: verificar subscription_status
- [ ] Componente `<SubscriptionBlockedScreen>`
- [ ] Tests E2E: registro → trial → expiración → bloqueo

**Entregable:** Usuario puede registrarse con nick único, ver 14 días de trial, y app se bloquea al expirar.

**Archivos nuevos:**
- `supabase/migrations/20260122000001_add_nick_and_subscription.sql`
- `supabase/migrations/20260122000002_create_organizations.sql`
- `supabase/migrations/20260122000003_create_invitations.sql`
- `supabase/migrations/20260122000004_create_chat_shares.sql`
- `supabase/migrations/20260122000005_update_conversaciones.sql`
- `supabase/migrations/20260122000006_create_participants.sql`
- `supabase/migrations/20260122000007_create_typing_indicators.sql`
- `supabase/migrations/20260122000008_create_notifications.sql`
- `src/middleware.ts` (actualizar)
- `src/components/subscription/SubscriptionBlockedScreen.tsx`

---

### FASE 2: Integración Stripe (3-4 días)

**Objetivo:** Sistema de pagos funcional

**Tareas:**
- [ ] Copiar `lib/stripe.ts` de lexyweb
- [ ] API: `POST /api/stripe/checkout`
- [ ] API: `GET /api/stripe/verify-session`
- [ ] API: `POST /api/stripe/webhook`
- [ ] API: `GET /api/stripe/portal`
- [ ] Componente `<PricingModal>` (4 planes)
- [ ] Hook `useCheckout()` reutilizado de lexyweb
- [ ] Webhook handler: activar suscripción + crear org
- [ ] Variables de entorno en `.env.local`
- [ ] Tests: flujo completo de pago

**Entregable:** Usuario puede pagar cualquier plan y app se desbloquea. Owners TEAM+ tienen organización automáticamente.

**Archivos nuevos:**
- `src/lib/stripe.ts`
- `src/app/api/stripe/checkout/route.ts`
- `src/app/api/stripe/verify-session/route.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/app/api/stripe/portal/route.ts`
- `src/components/subscription/PricingModal.tsx`
- `src/hooks/useCheckout.ts`

---

### FASE 3: Sistema de Organizaciones (5 días)

**Objetivo:** Equipos funcionales con invitaciones

**Tareas:**
- [ ] API: `POST /api/organizations`
- [ ] API: `GET /api/organizations/:id`
- [ ] API: `PATCH /api/organizations/:id`
- [ ] API: `DELETE /api/organizations/:id`
- [ ] API: `POST /api/organizations/:id/invitations`
- [ ] API: `GET /api/organizations/invitations/my`
- [ ] API: `POST /api/organizations/invitations/:id/accept`
- [ ] API: `POST /api/organizations/invitations/:id/reject`
- [ ] Componente `<CreateOrganizationModal>`
- [ ] Componente `<ManageTeamModal>`
- [ ] Componente `<InviteUserModal>`
- [ ] Sistema de notificaciones in-app
- [ ] Componente `<NotificationsPanel>`
- [ ] Componente `<NotificationBell>`
- [ ] Validación de límites por plan
- [ ] Tests E2E: invitar → aceptar → acceso

**Entregable:** Owners pueden invitar usuarios por nick. Invitados reciben notificación, aceptan y acceden.

**Archivos nuevos:**
- `src/app/api/organizations/route.ts`
- `src/app/api/organizations/[id]/route.ts`
- `src/app/api/organizations/[id]/invitations/route.ts`
- `src/app/api/organizations/invitations/my/route.ts`
- `src/app/api/organizations/invitations/[id]/accept/route.ts`
- `src/app/api/organizations/invitations/[id]/reject/route.ts`
- `src/components/organizations/CreateOrganizationModal.tsx`
- `src/components/organizations/ManageTeamModal.tsx`
- `src/components/organizations/InviteUserModal.tsx`
- `src/components/notifications/NotificationsPanel.tsx`
- `src/components/notifications/NotificationBell.tsx`
- `src/app/api/notifications/route.ts`

---

### FASE 4: Chats Compartidos P2P (4 días)

**Objetivo:** Compartir chats personales con hasta 3 usuarios

**Tareas:**
- [ ] API: `POST /api/conversaciones/:id/share`
- [ ] API: `GET /api/conversaciones/:id/participants`
- [ ] API: `DELETE /api/conversaciones/:id/share/:userId`
- [ ] API: `POST /api/chat-shares/:id/accept`
- [ ] API: `POST /api/chat-shares/:id/reject`
- [ ] Componente `<ShareChatModal>` con límite de 3
- [ ] Autocomplete búsqueda de usuarios por nick
- [ ] Badge visual "👥 Compartido con..."
- [ ] Notificaciones para invitaciones a chat
- [ ] Actualizar sidebar: filtrar chats propios + compartidos
- [ ] Tests E2E: compartir → aceptar → acceso

**Entregable:** Usuarios pueden compartir chats personales. Invitados aceptan y ven el chat.

**Archivos nuevos:**
- `src/app/api/conversaciones/[id]/share/route.ts`
- `src/app/api/conversaciones/[id]/participants/route.ts`
- `src/app/api/chat-shares/[id]/accept/route.ts`
- `src/app/api/chat-shares/[id]/reject/route.ts`
- `src/components/chat/ShareChatModal.tsx`
- `src/components/chat/UserAutocomplete.tsx`

---

### FASE 5: Chats de Equipo (3 días)

**Objetivo:** Espacio compartido para organizaciones

**Tareas:**
- [ ] Flag `is_organization_chat` en conversaciones
- [ ] Nuevo segmento en sidebar: "Chats de Equipo"
- [ ] Botón "+ Nueva Conversación de Equipo"
- [ ] Auto-agregar todos los miembros como participants
- [ ] Sincronización: nuevos miembros ven chats existentes
- [ ] Badge visual: "🏢 Chat de Equipo"
- [ ] Permisos: solo miembros del equipo pueden ver
- [ ] Tests E2E: crear chat equipo → todos lo ven

**Entregable:** Equipos tienen espacio compartido donde todos ven todos los chats.

**Archivos modificados:**
- `src/components/abogado/ConversationsSidebar.tsx`
- `src/components/abogado/ChatInterface.tsx`

**Archivos nuevos:**
- `src/components/organizations/CreateTeamChatModal.tsx`

---

### FASE 6: Lock Optimista en Tiempo Real (4-5 días)

**Objetivo:** Solo uno puede enviar mensaje a la vez

**Tareas:**
- [ ] API: `POST /api/conversaciones/:id/typing/start`
- [ ] API: `POST /api/conversaciones/:id/typing/stop`
- [ ] API: `GET /api/conversaciones/:id/typing`
- [ ] Componente `<ChatTypingIndicator>`
- [ ] Hook `useTypingIndicators()` con polling cada 2 seg
- [ ] Actualizar `<ChatMessageInput>`:
  - onFocus → start typing
  - onBlur → stop typing
  - onSubmit → validar can_user_write_in_chat()
- [ ] Toast: "⏳ Espera tu turno"
- [ ] Botón "Enviar" deshabilitado temporalmente
- [ ] Función SQL: `can_user_write_in_chat()`
- [ ] Cleanup automático: indicadores expirados
- [ ] Tests E2E: 2 usuarios escribiendo simultáneamente

**Entregable:** Lock optimista funcional - solo uno puede enviar a la vez. Indicadores visuales claros.

**Archivos nuevos:**
- `src/app/api/conversaciones/[id]/typing/start/route.ts`
- `src/app/api/conversaciones/[id]/typing/stop/route.ts`
- `src/app/api/conversaciones/[id]/typing/route.ts`
- `src/components/chat/ChatTypingIndicator.tsx`
- `src/hooks/useTypingIndicators.ts`

**Archivos modificados:**
- `src/components/abogado/ChatInterface.tsx`

---

### FASE 7: Optimización y Real-time (Opcional - 1 semana)

**Objetivo:** Sistema profesional con WebSockets

**Tareas:**
- [ ] Migrar de Polling a Supabase Realtime
- [ ] Hook `useRealtimeTyping()`
- [ ] Hook `useRealtimeMessages()`
- [ ] Push notifications (browser)
- [ ] Email notifications (SendGrid/Resend)
- [ ] Optimización de queries (índices compuestos)
- [ ] Caching con Redis (opcional)
- [ ] Tests de performance (Lighthouse)
- [ ] Tests E2E completos (Playwright)

**Entregable:** Sistema producción-ready con real-time verdadero.

**Archivos nuevos:**
- `src/hooks/useRealtimeTyping.ts`
- `src/hooks/useRealtimeMessages.ts`
- `src/lib/realtime/supabaseRealtime.ts`

---

### Resumen de Tiempo

| Fase | Duración | Acumulado |
|------|----------|-----------|
| 1. Fundamentos | 5-7 días | 1 semana |
| 2. Stripe | 3-4 días | 2 semanas |
| 3. Organizaciones | 5 días | 3 semanas |
| 4. Chats P2P | 4 días | 3.5 semanas |
| 5. Chats de Equipo | 3 días | 4 semanas |
| 6. Lock Optimista | 4-5 días | 4-5 semanas |
| 7. Optimización | 5-7 días | 5-6 semanas |

**MVP funcional (Fases 1-6):** 4-5 semanas
**Producción optimizada:** +1 semana
**Total:** 5-6 semanas

---

## 🛠️ Tecnologías y Dependencias

### Stack Actual (ya existe)

- ✅ **Next.js 15** - Framework React
- ✅ **TypeScript** - Type safety
- ✅ **Supabase** - Auth + PostgreSQL + RLS
- ✅ **TailwindCSS** - Estilos con paleta emerald
- ✅ **Zustand** - State management
- ✅ **Lucide Icons** - Iconografía
- ✅ **date-fns** - Manejo de fechas

### Nuevas Dependencias

**Stripe (copiar de lexyweb):**
```bash
npm install stripe @stripe/stripe-js
```

**Opcional (Fase 7):**
```bash
npm install @supabase/realtime-js  # Si no viene con Supabase SDK
npm install resend  # Email notifications
npm install redis  # Caching (opcional)
```

### Variables de Entorno (.env.local)

```bash
# Existentes
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_APP_URL=http://localhost:4567

# Nuevas (copiar de lexyweb)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_TEAM=price_...
STRIPE_PRICE_ID_BUSINESS=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Opcional (Fase 7)
RESEND_API_KEY=re_...
REDIS_URL=redis://localhost:6379
```

---

## ✅ Criterios de Aceptación

### Fase 1: Fundamentos
- [ ] Usuario puede registrarse con nick único
- [ ] Trial de 14 días se asigna automáticamente
- [ ] App se bloquea al expirar trial
- [ ] SubscriptionBlockedScreen muestra mensaje correcto

### Fase 2: Stripe
- [ ] Usuario puede pagar y desbloquear app
- [ ] Webhook activa suscripción correctamente
- [ ] Organizaciones se crean automáticamente para TEAM+
- [ ] Redirect a /success tras pago

### Fase 3: Organizaciones
- [ ] Owner puede invitar usuarios por nick
- [ ] Invitados reciben notificación in-app
- [ ] Aceptar invitación desbloquea app
- [ ] Límite de usuarios se respeta según plan

### Fase 4: Chats P2P
- [ ] Usuario puede compartir chat con hasta 3 colaboradores
- [ ] Invitados reciben notificación
- [ ] Aceptar compartido añade chat al sidebar
- [ ] Badge muestra colaboradores

### Fase 5: Chats de Equipo
- [ ] Miembros de equipo ven sección "Chats de Equipo"
- [ ] Crear chat de equipo es visible para todos
- [ ] Nuevos miembros ven chats existentes
- [ ] Badge diferencia chats de equipo

### Fase 6: Lock Optimista
- [ ] Indicador visual muestra quién está escribiendo
- [ ] Solo uno puede enviar mensaje a la vez
- [ ] Toast muestra mensaje de espera
- [ ] Lock se libera automáticamente tras 10 segundos

### Fase 7: Optimización
- [ ] Real-time con latencia <100ms
- [ ] Lighthouse score >90
- [ ] Tests E2E cubren todos los flujos
- [ ] Email notifications funcionan

---

## 🎉 Conclusión

Este diseño completo cubre:

✅ **Sistema de suscripciones** con trial de 14 días
✅ **Integración Stripe** reutilizando lexyweb
✅ **Organizaciones/Equipos** con invitaciones por nick
✅ **Chats compartidos P2P** (hasta 3 usuarios)
✅ **Chats de equipo** (todos los miembros)
✅ **Lock optimista** en tiempo real
✅ **Notificaciones in-app** completas
✅ **RLS** y seguridad robusta
✅ **Plan de implementación** detallado (6 fases)

**Próximo paso:** Comenzar Fase 1 - Fundamentos (migraciones SQL + bloqueo de app).

---

**Documento creado por:** Claude Code + Brainstorming Agent
**Fecha:** 22 Enero 2026
**Versión:** 1.0
**Estado:** ✅ Listo para implementación
