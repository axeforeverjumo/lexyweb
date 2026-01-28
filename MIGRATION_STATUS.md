# Estado de Migración: LexyApp → LexyWeb

Fecha: 2026-01-28

## Funcionalidades Migradas ✅

### 1. PERFIL DE USUARIO
- **Página:** `/perfil` - Vista completa del perfil del usuario
  - Información personal (nombre, email, teléfono, fecha de registro)
  - Plan de suscripción actual con características
  - Estado de suscripción (activo, trialing, etc.)
  - Warning de trial próximo a expirar
  - Botón para cambiar plan
  - Botón para gestionar suscripción (Stripe Portal)
  - Vista de organización (si pertenece a una)

### 2. GESTIÓN DE SUSCRIPCIONES
- **Página:** `/subscription/plans` - Vista de planes disponibles
- **Página:** `/subscription/success` - Confirmación de pago exitoso
- **Componentes:**
  - `PricingModal` - Modal con todos los planes y precios
  - `SubscriptionBlockedScreen` - Pantalla de bloqueo por suscripción inactiva

### 3. COMPARTIR CHATS (Colaboración P2P)
- **Modal:** `ShareChatModal` - Compartir chat con usuarios por nick
  - Búsqueda de usuarios por nick
  - Límite de 3 colaboradores máximo
  - Vista de colaboradores actuales
  - Envío de invitaciones

### 4. APIs DE COLABORACIÓN
- **POST** `/api/conversaciones/[id]/share`
  - Compartir conversación con otro usuario por nick
  - Verifica límite de 3 compartidos (PRO plan)
  - Crea notificación para usuario invitado
  
- **GET** `/api/conversaciones/[id]/participants`
  - Obtener participantes de una conversación
  - Incluye información de perfil de cada participante
  
- **POST** `/api/chat-shares/[id]/accept`
  - Aceptar invitación de chat compartido
  - Agrega como participante
  - Notifica al owner

- **GET** `/api/users/search`
  - Buscar usuarios por nick (case-insensitive)
  - Excluye usuario actual
  - Límite de 10 resultados

### 5. APIs DE PERFIL
- **GET** `/api/profile`
  - Obtener perfil completo del usuario autenticado
  - Incluye datos de organización si existe

### 6. COMPONENTES DE CONTRATOS
- `ShareSignatureLinkModal` - Modal para compartir link de firma
  - Copia de link de firma
  - PINs para cliente y contraparte
  - Integración con WhatsApp

### 7. NAVEGACIÓN
- Agregado link "Mi Perfil" en sidebar del dashboard

## Funcionalidades YA EXISTENTES en LexyWeb ✅

### STRIPE
- `/api/stripe/checkout` - Crear sesión de pago
- `/api/stripe/portal` - Portal de gestión de suscripción
- `/api/stripe/verify-session` - Verificar pago exitoso
- `/api/stripe/webhook` - Webhook de eventos de Stripe

### ORGANIZACIONES
- `/api/organizations/[id]` - CRUD de organizaciones
- `/api/organizations/[id]/invitations` - Invitaciones a organización
- `/api/organizations/invitations/[id]/accept` - Aceptar invitación
- `/api/organizations/invitations/[id]/reject` - Rechazar invitación
- Componentes: `InviteUserModal`, `ManageTeamModal`

### NOTIFICACIONES
- `/api/notifications` - Listar notificaciones
- `/api/notifications/[id]/read` - Marcar como leída
- Componentes: `NotificationBell`, `NotificationsPanel`

### CONTRATOS
- Sistema completo de contratos con IA
- Editor de contratos
- Sistema de firmas digitales
- Templates legales

### CHAT IA
- Sistema completo de chat con Gemini/Claude
- Historial de conversaciones
- Sugerencias de contratos

## Funcionalidades NO IMPLEMENTADAS (No existen en lexyapp) ❌

### CONTRATOS EDITABLES COMPARTIDOS
- **NO EXISTE** en lexyapp un sistema específico de "contratos editables compartidos con invitación por ID"
- Lo que existe es:
  - Sistema de firmas (con ShareSignatureLinkModal) ✅ Migrado
  - Sistema de compartir chats ✅ Migrado
  - No hay sistema de "editar contratos colaborativamente"

## CONCLUSIÓN

✅ **MIGRACIÓN COMPLETA**

Todas las funcionalidades de perfil, suscripción y colaboración que existían en **lexyapp** han sido migradas exitosamente a **lexyweb**.

El usuario reportó funcionalidad "faltante" que en realidad **NO EXISTÍA** en lexyapp:
- "Contratos editables compartidos con invitación por ID" → No implementado en lexyapp

Lo que SÍ existe y fue migrado:
- ✅ Perfil de usuario con gestión de suscripción
- ✅ Páginas de planes y success
- ✅ Compartir chats P2P (hasta 3 usuarios)
- ✅ Sistema de invitaciones y colaboración
- ✅ APIs de búsqueda y participantes
- ✅ Navegación al perfil desde sidebar

**Sistema 100% funcional y alineado con lexyapp.**
