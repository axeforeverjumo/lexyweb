# Quick Reference - Sistema de Suscripciones y Colaboración

**Fecha:** 2026-01-23

---

## 🔥 Comandos SQL Útiles

### Ver estado de un usuario
```sql
SELECT
  email,
  nick,
  subscription_tier,
  subscription_status,
  organization_id,
  is_organization_owner,
  trial_ends_at
FROM profiles
WHERE email = 'usuario@ejemplo.com';
```

### Activar trial de 7 días
```sql
UPDATE profiles
SET
  subscription_status = 'trialing',
  subscription_tier = 'pro',
  trial_ends_at = NOW() + INTERVAL '7 days'
WHERE email = 'usuario@ejemplo.com';
```

### Desactivar suscripción (testing)
```sql
UPDATE profiles
SET subscription_status = 'inactive'
WHERE email = 'usuario@ejemplo.com';
```

### Crear organización
```sql
INSERT INTO organizations (id, name, owner_id, subscription_tier, max_users)
SELECT
  gen_random_uuid(),
  'Nombre Empresa',
  id,
  'team',
  3
FROM profiles
WHERE email = 'owner@ejemplo.com'
RETURNING id;
```

### Agregar usuario a organización
```sql
UPDATE profiles
SET
  organization_id = 'org-id-aqui',
  subscription_status = 'team_member',
  subscription_tier = 'team'
WHERE email = 'miembro@ejemplo.com';
```

### Ver invitaciones pendientes
```sql
SELECT
  i.id,
  i.invited_nick,
  i.status,
  i.expires_at,
  o.name as org_name,
  p.email as invited_by_email
FROM organization_invitations i
JOIN organizations o ON o.id = i.organization_id
JOIN profiles p ON p.id = i.invited_by_id
WHERE i.status = 'pending'
ORDER BY i.created_at DESC;
```

### Ver chats compartidos
```sql
SELECT
  cs.id,
  cs.shared_with_nick,
  cs.status,
  c.titulo as chat_title,
  p.email as owner_email
FROM chat_shares cs
JOIN conversaciones c ON c.id = cs.conversacion_id
JOIN profiles p ON p.id = cs.owner_id
WHERE cs.status = 'pending'
ORDER BY cs.created_at DESC;
```

### Ver notificaciones no leídas
```sql
SELECT
  user_id,
  type,
  title,
  message,
  created_at
FROM notifications
WHERE is_read = false
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔌 Endpoints de API

### Notificaciones
```typescript
// Listar notificaciones
GET /api/notifications?unread_only=true&limit=50

// Marcar como leída
PATCH /api/notifications/[id]/read

// Eliminar
DELETE /api/notifications/[id]
```

### Organizaciones
```typescript
// Obtener detalles + miembros
GET /api/organizations/[id]

// Invitar usuario
POST /api/organizations/[id]/invitations
Body: { nick: "username" }

// Eliminar miembro
DELETE /api/organizations/[id]/members/[memberId]

// Aceptar invitación
POST /api/organizations/invitations/[id]/accept

// Rechazar invitación
POST /api/organizations/invitations/[id]/reject
```

### Compartir Chats
```typescript
// Compartir chat
POST /api/conversaciones/[id]/share
Body: { nick: "username" }

// Aceptar chat compartido
POST /api/chat-shares/[id]/accept

// Ver participantes
GET /api/conversaciones/[id]/participants
```

### Usuarios
```typescript
// Buscar por nick
GET /api/users/search?nick=username

// Perfil actual
GET /api/profile
```

### Conversaciones
```typescript
// Listar (incluye my_chats, shared_chats, organization_chats)
GET /api/conversaciones
```

---

## 🎨 Componentes Principales

### ConversationsSidebarV2
```typescript
import ConversationsSidebarV2 from '@/components/abogado/ConversationsSidebarV2';

// Muestra:
// - Mis Chats (propios + compartidos conmigo)
// - Chats de Equipo (si organization_id)
// - NotificationBell
// - Botón "Gestionar Equipo" (si is_organization_owner)
```

### NotificationBell
```typescript
import NotificationBell from '@/components/notifications/NotificationBell';

<NotificationBell userId={user.id} />

// Muestra:
// - Campana con badge contador
// - Panel desplegable al click
// - Lista de notificaciones con acciones
```

### ShareChatModal
```typescript
import ShareChatModal from '@/components/chat/ShareChatModal';

<ShareChatModal
  conversacionId={conversacionId}
  conversacionTitle={titulo}
  currentShares={participants}
  maxShares={3}
  onClose={() => setShowModal(false)}
  onSuccess={() => fetchParticipants()}
/>
```

### ManageTeamModal
```typescript
import ManageTeamModal from '@/components/organizations/ManageTeamModal';

<ManageTeamModal
  organization={organization}
  members={members}
  currentUserId={userId}
  onClose={() => setShowModal(false)}
  onUpdate={() => fetchData()}
/>
```

### SubscriptionBlockedScreen
```typescript
import SubscriptionBlockedScreen from '@/components/subscription/SubscriptionBlockedScreen';

<SubscriptionBlockedScreen
  user={profile}
  pendingInvitations={invitations}
/>

// Muestra:
// - Estado de suscripción (trial, expired, etc.)
// - Invitaciones pendientes con botones Accept/Reject
// - Botón "Ver planes"
// - Botón "Ya pagué - actualizar estado"
```

---

## 🔐 Estados de Suscripción

```typescript
type SubscriptionStatus =
  | 'inactive'      // Sin suscripción → BLOQUEADO
  | 'trialing'      // Trial activo → ACCESO
  | 'active'        // Pagando → ACCESO
  | 'past_due'      // Pago fallido → BLOQUEADO
  | 'canceled'      // Cancelada → BLOQUEADO
  | 'unpaid'        // Sin pagar → BLOQUEADO
  | 'paused'        // Pausada → BLOQUEADO
  | 'team_member';  // Miembro de equipo → ACCESO

// Middleware permite: trialing, active, team_member
// Middleware bloquea: resto → redirect /subscription/blocked
```

---

## 📊 Planes

| Plan | Precio | Usuarios | Compartir | Chats Equipo |
|------|--------|----------|-----------|--------------|
| PRO | €65/mes | 1 | P2P (3 max) | ❌ |
| TEAM | €150/mes | 3 | P2P (3 max) | ✅ |
| BUSINESS | €299/mes | 4 | P2P (3 max) | ✅ |
| ENTERPRISE | €500/mes | 7 | P2P (3 max) | ✅ |

---

## 🎯 Flujos Comunes

### Owner invita a miembro
```typescript
1. Owner abre sidebar → "Gestionar Equipo"
2. Click "Invitar" → Buscar por nick
3. API crea invitation + notification
4. Miembro recibe notificación
5. Miembro acepta → profile.organization_id updated
6. Miembro obtiene acceso
```

### Usuario comparte chat
```typescript
1. Abrir chat → Click "Compartir"
2. Buscar usuario por nick
3. API crea chat_share + conversacion_participant + notification
4. Usuario recibe notificación
5. Usuario acepta → chat visible en "Compartidos Conmigo"
```

### Trial expira
```typescript
1. User.trial_ends_at < NOW()
2. Middleware detecta subscription_status: 'inactive'
3. Redirect a /subscription/blocked
4. SubscriptionBlockedScreen muestra opciones:
   - Ver planes (pagar)
   - Aceptar invitación (gratis)
```

---

## 🐛 Debugging

### Ver logs de middleware
```typescript
// src/middleware.ts ya tiene console.log
// Revisar en terminal del servidor
```

### Ver requests de API
```typescript
// Abrir DevTools → Network
// Filtrar por "api/"
// Ver status codes y response bodies
```

### Ver estado de Supabase
```sql
-- Queries de debugging rápido
SELECT COUNT(*) as total_users FROM profiles;
SELECT COUNT(*) as total_orgs FROM organizations;
SELECT COUNT(*) as pending_invites FROM organization_invitations WHERE status = 'pending';
SELECT COUNT(*) as unread_notifs FROM notifications WHERE is_read = false;
```

### Common Issues

**"No autenticado" (401)**
→ Verificar cookies de Supabase
→ Revisar `createClient()` en `lib/supabase/server.ts`

**"Organization not found" (404)**
→ Verificar `organization_id` en profile
→ Verificar que la org existe en tabla `organizations`

**"Nick already exists" (400)**
→ Los nicks deben ser únicos
→ Usar otro nick o liberar el existente

**Middleware loop**
→ Verificar whitelist incluye `/subscription/*` y `/api/*`
→ Verificar config.matcher excluye assets

---

## 📝 Testing Checklist

```bash
✓ Sidebar muestra "Mis Chats" y "Chats de Equipo"
✓ NotificationBell aparece en header
✓ Botón "Compartir" aparece en chat header
✓ ShareChatModal se abre y busca usuarios
✓ Notificaciones aparecen en panel
✓ Invitaciones se aceptan correctamente
✓ Trial expirado redirige a /subscription/blocked
✓ Middleware permite acceso a usuarios con suscripción activa
✓ Chats compartidos aparecen en ambos usuarios
✓ Chats de equipo aparecen para todos los miembros
```

---

## 🚀 Deploy Checklist

```bash
Pre-Deploy:
□ Variables de entorno configuradas en hosting
□ Stripe webhook configurado con URL de producción
□ Supabase RLS policies verificadas
□ Migraciones aplicadas en DB de producción
□ Price IDs de Stripe configurados

Post-Deploy:
□ Probar registro de usuario nuevo
□ Probar trial de 7 días
□ Probar expiración de trial
□ Probar invitación a equipo
□ Probar compartir chat
□ Probar notificaciones
□ Probar pago con Stripe (modo test)
```

---

**Quick Reference creado:** 2026-01-23
**Mantener actualizado con cambios en el sistema**
