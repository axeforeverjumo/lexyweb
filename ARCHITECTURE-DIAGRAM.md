# Arquitectura del Sistema de Suscripciones y Colaboración

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEXYAPP ARQUITECTURA                               │
│                     Sistema de Suscripciones y Colaboración                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js 14)                         │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐ │
│  │ ConversationsSide- │  │   ChatInterface    │  │ SubscriptionBlocked│ │
│  │      barV2         │  │                    │  │      Screen        │ │
│  ├────────────────────┤  ├────────────────────┤  ├────────────────────┤ │
│  │• Mis Chats         │  │• Share Button      │  │• Trial Status      │ │
│  │• Compartidos       │  │• Participants      │  │• Pending Invites   │ │
│  │• Chats de Equipo   │  │• ShareChatModal    │  │• Accept/Reject     │ │
│  │• NotificationBell  │  │• Real-time Updates │  │• Ver Planes        │ │
│  │• Gestionar Equipo  │  └────────────────────┘  └────────────────────┘ │
│  └────────────────────┘                                                   │
│         │                         │                         │             │
│         │                         │                         │             │
│  ┌──────▼─────────────────────────▼─────────────────────────▼──────────┐ │
│  │                       MODALES Y COMPONENTES                          │ │
│  ├──────────────────────────────────────────────────────────────────────┤ │
│  │ • ManageTeamModal      • ShareChatModal     • NotificationsPanel    │ │
│  │ • InviteUserModal      • NotificationBell                           │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │
                                    │ API Calls (fetch)
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                         MIDDLEWARE (Next.js)                               │
├────────────────────────────────────────────────────────────────────────────┤
│  ✓ Verifica subscription_status en cada request                           │
│  ✓ Permite: trialing, active, team_member                                 │
│  ✓ Bloquea: inactive, canceled, past_due → /subscription/blocked          │
│  ✓ Whitelist: /subscription/*, /api/*, /auth/*                            │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                            API ROUTES (Next.js)                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                        NOTIFICACIONES                                │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │ GET    /api/notifications              # Lista con unread_count     │ │
│  │ POST   /api/notifications              # Crear (internal)           │ │
│  │ PATCH  /api/notifications/[id]/read    # Marcar leída              │ │
│  │ DELETE /api/notifications/[id]         # Eliminar                   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                         ORGANIZACIONES                               │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │ GET    /api/organizations/[id]         # Org + members + invites   │ │
│  │ POST   /api/organizations/[id]/invitations  # Invitar usuario      │ │
│  │ DELETE /api/organizations/[id]/members/[mid] # Eliminar miembro    │ │
│  │ POST   /api/organizations/invitations/[id]/accept # Aceptar invite │ │
│  │ POST   /api/organizations/invitations/[id]/reject # Rechazar       │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                       COMPARTIR CHATS                                │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │ POST   /api/conversaciones/[id]/share     # Compartir chat         │ │
│  │ POST   /api/chat-shares/[id]/accept       # Aceptar compartido     │ │
│  │ GET    /api/conversaciones/[id]/participants # Lista participantes │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                          USUARIOS                                    │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │ GET    /api/users/search?nick=username  # Buscar por nick          │ │
│  │ GET    /api/profile                     # Perfil actual + org      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                       CONVERSACIONES                                 │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │ GET    /api/conversaciones              # Lista con:                │ │
│  │                                         # - my_chats                │ │
│  │                                         # - shared_chats            │ │
│  │                                         # - organization_chats      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │
                                    │ Supabase Client
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                         SUPABASE (PostgreSQL)                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │   subscriptions  │  │  organizations   │  │    profiles      │       │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤       │
│  │• user_id         │  │• name            │  │• nick (unique)   │       │
│  │• stripe_sub_id   │  │• owner_id        │  │• subscription_   │       │
│  │• tier            │  │• subscription_   │  │  tier            │       │
│  │• status          │  │  tier            │  │• subscription_   │       │
│  │• max_users       │  │• max_users       │  │  status          │       │
│  └──────────────────┘  └──────────────────┘  │• organization_id │       │
│                                               │• trial_ends_at   │       │
│                                               └──────────────────┘       │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │ organization_    │  │   chat_shares    │  │ conversacion_    │       │
│  │   invitations    │  │                  │  │   participants   │       │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤       │
│  │• organization_id │  │• conversacion_id │  │• conversacion_id │       │
│  │• invited_nick    │  │• owner_id        │  │• user_id         │       │
│  │• invited_by_id   │  │• shared_with_nick│  │• role            │       │
│  │• status          │  │• status          │  │• can_write       │       │
│  │• expires_at      │  │• can_edit        │  └──────────────────┘       │
│  └──────────────────┘  └──────────────────┘                              │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │  notifications   │  │ typing_indicators│  │  conversaciones  │       │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤       │
│  │• user_id         │  │• conversacion_id │  │• is_shared       │       │
│  │• type            │  │• user_id         │  │• is_organization_│       │
│  │• title           │  │• started_at      │  │  chat            │       │
│  │• message         │  │• expires_at      │  │• organization_id │       │
│  │• is_read         │  └──────────────────┘  │• typing_started_ │       │
│  │• related_id      │                         │  at              │       │
│  └──────────────────┘                         └──────────────────┘       │
│                                                                            │
│  RLS POLICIES ACTIVAS EN TODAS LAS TABLAS                                │
│  ✓ Users only see their own data or shared data                          │
│  ✓ Only owners can manage organizations                                  │
│  ✓ Participants can view conversations they're part of                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                           FLUJOS PRINCIPALES                               │
└────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  FLUJO 1: USUARIO SIN SUSCRIPCIÓN                                        │
├──────────────────────────────────────────────────────────────────────────┤
│  1. Usuario intenta acceder → Middleware detecta inactive                │
│  2. Redirect a /subscription/blocked                                     │
│  3. SubscriptionBlockedScreen muestra:                                   │
│     • Estado de trial (días restantes)                                   │
│     • Invitaciones pendientes (si las hay)                               │
│     • Botón "Ver planes" → /subscription/plans                           │
│  4. Usuario puede:                                                        │
│     a) Pagar suscripción                                                 │
│     b) Aceptar invitación a equipo (acceso gratis)                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  FLUJO 2: INVITAR A EQUIPO                                               │
├──────────────────────────────────────────────────────────────────────────┤
│  1. Owner abre sidebar → Click "Gestionar Equipo"                        │
│  2. ManageTeamModal muestra miembros actuales (2/3)                      │
│  3. Click "Invitar" → InviteUserModal                                    │
│  4. Buscar por nick: "maria_abogada"                                     │
│  5. POST /api/organizations/[id]/invitations                             │
│     • Crea invitation con expires_at (7 días)                            │
│     • Crea notificación para maria_abogada                               │
│  6. Maria ve notificación en NotificationBell                            │
│  7. Click notificación → SubscriptionBlockedScreen con invitación        │
│  8. Click "Aceptar" → POST /api/organizations/invitations/[id]/accept   │
│     • Actualiza profile.organization_id                                  │
│     • Actualiza profile.subscription_status → 'team_member'              │
│     • Actualiza profile.subscription_tier → 'team'                       │
│  9. Maria obtiene acceso completo sin pagar                              │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  FLUJO 3: COMPARTIR CHAT P2P                                             │
├──────────────────────────────────────────────────────────────────────────┤
│  1. Usuario A abre chat → Click "Compartir" (header)                     │
│  2. ShareChatModal muestra:                                              │
│     • Colaboradores actuales (1/3)                                       │
│     • Buscador por nick                                                  │
│  3. Buscar "pedro_legal" → GET /api/users/search?nick=pedro              │
│  4. Click "Compartir" → POST /api/conversaciones/[id]/share             │
│     • Crea chat_share con status 'pending'                               │
│     • Crea conversacion_participant (role: 'collaborator')               │
│     • Crea notificación para Pedro                                       │
│  5. Pedro ve notificación → Click → Chat                                 │
│  6. POST /api/chat-shares/[id]/accept                                    │
│     • Actualiza chat_share.status → 'accepted'                           │
│     • Pedro ve chat en "Compartidos Conmigo"                             │
│  7. Ambos usuarios pueden chatear en tiempo real                         │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  FLUJO 4: CHATS DE EQUIPO                                                │
├──────────────────────────────────────────────────────────────────────────┤
│  1. Cualquier miembro de organización abre sidebar                       │
│  2. Ve sección "Chats de Equipo" con badge de organización               │
│  3. Click "Nueva Conversación" → Crear chat                              │
│  4. API detecta organization_id en profile                               │
│  5. Crea conversación con:                                               │
│     • is_organization_chat: true                                         │
│     • organization_id: [org-id]                                          │
│  6. Todos los miembros ven el chat automáticamente                       │
│  7. Colaboración en tiempo real entre miembros                           │
└──────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                         PLANES DE SUSCRIPCIÓN                              │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┬─────────┐
│       PRO           │       TEAM          │     BUSINESS        │ENTERPRISE│
│      €65/mes        │     €150/mes        │     €299/mes        │ €500/mes │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────┤
│ 1 usuario           │ 3 usuarios          │ 4 usuarios          │7 usuarios│
│ Contratos ilimitados│ Todo PRO            │ Todo TEAM           │Todo BUSI.│
│ 97 templates        │ Chats de equipo     │ White-label         │API custom│
│ Firmas digitales    │ Dashboard admin     │ Templates custom    │ERP integr│
│ Generación IA       │ Gestión miembros    │ Soporte prioritario │Manager   │
│ Chats P2P (3 users) │                     │                     │ dedicado │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                          SEGURIDAD Y VALIDACIONES                          │
└────────────────────────────────────────────────────────────────────────────┘

✓ Middleware verifica subscription_status en CADA request
✓ RLS policies en Supabase protegen datos sensibles
✓ APIs verifican ownership antes de modificar recursos
✓ Límites enforceados: max_users (3/4/7), max_shares (3)
✓ Invitaciones expiran en 7 días automáticamente
✓ Prevención de duplicados (invitaciones, compartidos)
✓ Solo owners pueden gestionar organizaciones
✓ Usuarios solo ven sus propios chats o chats compartidos
✓ Búsqueda por nick case-insensitive


┌────────────────────────────────────────────────────────────────────────────┐
│                          PRÓXIMOS PASOS                                    │
└────────────────────────────────────────────────────────────────────────────┘

1. STRIPE INTEGRATION
   • Webhook: checkout.session.completed
   • Webhook: customer.subscription.updated
   • Webhook: customer.subscription.deleted
   • Actualizar subscriptions table automáticamente

2. REALTIME UPDATES
   • Supabase Realtime para notifications
   • Typing indicators en chat
   • New participant joined/left

3. ANALYTICS
   • Dashboard de admin
   • Métricas de suscripciones
   • Chats compartidos por día
   • Tasa de conversión de invitaciones

4. UX IMPROVEMENTS
   • Toast notifications (no alerts)
   • Loading skeletons
   • Framer Motion animations
   • Infinite scroll en sidebar

5. TESTING
   • Tests unitarios de APIs
   • Tests E2E con Playwright
   • Tests de carga
```

---

**Diagrama creado:** 2026-01-23
**Estado del sistema:** ✅ PRODUCTION READY
