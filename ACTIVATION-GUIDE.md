# Guía de Activación - Sistema de Suscripciones y Colaboración

**Fecha:** 2026-01-23
**Tiempo estimado:** 15 minutos
**Status:** ✅ Listo para activar

---

## 🚀 Pasos para Activar el Sistema

### PASO 1: Verificar Base de Datos (1 min)

```bash
# Conectar a Supabase y verificar que las 12 migraciones se ejecutaron
# Las migraciones ya fueron ejecutadas, pero verifica:

1. Abrir Supabase Dashboard
2. Ir a "Database" > "Migrations"
3. Verificar que aparecen las 12 migraciones (2026-01-22-*)
4. Verificar que todas tienen status "✅ Applied"
```

**Tablas que deben existir:**
- subscriptions
- organizations
- organization_invitations
- chat_shares
- conversacion_participants
- typing_indicators
- notifications

**Columnas nuevas en profiles:**
- nick
- subscription_tier
- subscription_status
- organization_id
- trial_ends_at

**Columnas nuevas en conversaciones:**
- is_shared
- is_organization_chat
- organization_id

---

### PASO 2: Reemplazar Sidebar (2 min)

Encuentra donde usas `ConversationsSidebar` y reemplázalo con `ConversationsSidebarV2`:

```typescript
// ANTES
import ConversationsSidebar from '@/components/abogado/ConversationsSidebar';

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      <ConversationsSidebar />
      <ChatInterface />
    </div>
  );
}

// DESPUÉS
import ConversationsSidebarV2 from '@/components/abogado/ConversationsSidebarV2';

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      <ConversationsSidebarV2 />
      <ChatInterface />
    </div>
  );
}
```

**Archivos donde probablemente necesites hacer el cambio:**
- `src/app/chat/page.tsx` (o similar)
- `src/app/(dashboard)/chat/page.tsx` (si usas route groups)

---

### PASO 3: Configurar Variables de Entorno (3 min)

Añade estas variables a tu `.env.local`:

```bash
# Stripe (obtener de Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (crear en Stripe Dashboard)
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_TEAM=price_...
STRIPE_PRICE_ID_BUSINESS=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Supabase (ya las tienes, pero verifica)
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Cómo crear Price IDs en Stripe:**
1. Ir a Stripe Dashboard → Products
2. Crear 4 productos: PRO, TEAM, BUSINESS, ENTERPRISE
3. Para cada uno:
   - Price: €65, €150, €299, €500
   - Recurring: Monthly
   - Copiar el Price ID (price_...)

---

### PASO 4: Crear Usuario de Prueba con Nick (2 min)

```sql
-- Conectar a Supabase SQL Editor y ejecutar:

-- Actualizar tu usuario actual con un nick
UPDATE profiles
SET
  nick = 'test_admin',
  subscription_status = 'trialing',
  subscription_tier = 'pro',
  trial_ends_at = NOW() + INTERVAL '7 days'
WHERE email = 'tu-email@ejemplo.com';

-- Crear un segundo usuario para probar compartir
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'test2@ejemplo.com',
  crypt('password123', gen_salt('bf')),
  NOW()
);

INSERT INTO profiles (id, email, nick, subscription_status, subscription_tier, trial_ends_at)
SELECT
  id,
  'test2@ejemplo.com',
  'test_user_2',
  'trialing',
  'pro',
  NOW() + INTERVAL '7 days'
FROM auth.users
WHERE email = 'test2@ejemplo.com';
```

---

### PASO 5: Reiniciar Servidor de Desarrollo (1 min)

```bash
# Detener el servidor (Ctrl+C)
# Limpiar cache de Next.js
rm -rf .next

# Reiniciar
npm run dev

# O si usas otro comando
yarn dev
# pnpm dev
```

---

### PASO 6: Pruebas de Verificación (5 min)

#### Test 1: Sidebar con Dos Segmentos
```
1. Abrir http://localhost:3000/chat
2. Verificar que el sidebar muestra:
   ✓ Sección "Mis Chats"
   ✓ NotificationBell (campana) en el header
   ✓ Botón "Gestionar Equipo" (si eres owner, lo verás después de crear org)
3. Crear una nueva conversación
4. Verificar que aparece en "Mis Chats"
```

#### Test 2: Compartir Chat
```
1. Abrir cualquier chat
2. Click en botón "Compartir" en el header
3. Verificar que ShareChatModal se abre
4. Buscar por nick: "test_user_2"
5. Click "Compartir"
6. Verificar mensaje de éxito
```

#### Test 3: Notificaciones
```
1. Con test2@ejemplo.com, hacer login
2. Verificar que aparece notificación de chat compartido
3. Click en NotificationBell (campana)
4. Verificar que se muestra el panel con la notificación
5. Click en la notificación
6. Verificar que redirige al chat
```

#### Test 4: Trial Expirado
```
1. SQL Editor de Supabase:
   UPDATE profiles
   SET subscription_status = 'inactive'
   WHERE email = 'tu-email@ejemplo.com';

2. Recargar app
3. Verificar que redirige a /subscription/blocked
4. Verificar que muestra SubscriptionBlockedScreen
5. Verificar botón "Ver planes"

6. Restaurar:
   UPDATE profiles
   SET subscription_status = 'trialing'
   WHERE email = 'tu-email@ejemplo.com';
```

---

### PASO 7: Crear Organización de Prueba (Opcional, 3 min)

```sql
-- SQL Editor de Supabase

-- 1. Crear organización
INSERT INTO organizations (id, name, owner_id, subscription_tier, max_users)
SELECT
  gen_random_uuid(),
  'Mi Empresa Legal',
  id,
  'team',
  3
FROM profiles
WHERE email = 'tu-email@ejemplo.com'
RETURNING id;

-- 2. Copiar el ID que te devuelve

-- 3. Actualizar tu profile con organization_id
UPDATE profiles
SET
  organization_id = '[ID-copiado-arriba]',
  is_organization_owner = true,
  subscription_tier = 'team',
  subscription_status = 'active'
WHERE email = 'tu-email@ejemplo.com';

-- 4. Recargar app
-- Ahora deberías ver:
--  ✓ Botón "Gestionar Equipo" en sidebar
--  ✓ Sección "Chats de Equipo" en sidebar
```

---

## ✅ Checklist de Activación

### Antes de Producción

- [ ] Base de datos verificada (12 migraciones aplicadas)
- [ ] Sidebar reemplazado (ConversationsSidebarV2)
- [ ] Variables de entorno configuradas
- [ ] Stripe configurado con Price IDs
- [ ] Usuario de prueba creado con nick
- [ ] Servidor reiniciado
- [ ] Test 1: Sidebar completado ✓
- [ ] Test 2: Compartir chat completado ✓
- [ ] Test 3: Notificaciones completado ✓
- [ ] Test 4: Trial expirado completado ✓
- [ ] (Opcional) Organización de prueba creada

### Configuración Adicional (Recomendado)

- [ ] Configurar webhook de Stripe en producción
- [ ] Crear página `/subscription/plans` con pricing
- [ ] Configurar Stripe Customer Portal
- [ ] Configurar emails de notificación (SendGrid, Resend, etc.)
- [ ] Configurar analytics (Posthog, Mixpanel, etc.)

---

## 🐛 Troubleshooting

### Error: "No autenticado" en APIs

**Problema:** Las APIs devuelven 401 Unauthorized

**Solución:**
```typescript
// Verificar que createClient está usando server cookies
// src/lib/supabase/server.ts debe tener:

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
```

---

### Error: "Nick already exists"

**Problema:** Al crear usuario, el nick ya está en uso

**Solución:**
```sql
-- Verificar nicks existentes
SELECT nick, email FROM profiles WHERE nick IS NOT NULL;

-- Cambiar nick si es necesario
UPDATE profiles
SET nick = 'nuevo_nick_unico'
WHERE email = 'tu-email@ejemplo.com';
```

---

### Error: Middleware loop infinito

**Problema:** La app se queda cargando indefinidamente

**Solución:**
```typescript
// Verificar que src/middleware.ts tiene:

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Y que la whitelist incluye:
const publicPaths = ['/subscription/blocked', '/subscription/plans', '/api/', '/auth/'];
```

---

### Error: "Organization not found"

**Problema:** Usuario owner no puede ver su organización

**Solución:**
```sql
-- Verificar que el usuario tiene organization_id correcto
SELECT id, email, organization_id, is_organization_owner
FROM profiles
WHERE email = 'tu-email@ejemplo.com';

-- Verificar que la organización existe
SELECT * FROM organizations WHERE id = '[organization_id]';

-- Si no existe, crear:
INSERT INTO organizations (id, name, owner_id, subscription_tier, max_users)
VALUES (
  gen_random_uuid(),
  'Mi Empresa',
  '[tu-user-id]',
  'team',
  3
);
```

---

### Error: Compartir chat falla

**Problema:** Al compartir chat, no se crea el chat_share

**Solución:**
```typescript
// Verificar que el usuario destino existe y tiene nick
// SQL Editor:
SELECT id, email, nick FROM profiles WHERE nick = 'test_user_2';

// Si no tiene nick, agregar:
UPDATE profiles
SET nick = 'test_user_2'
WHERE email = 'test2@ejemplo.com';
```

---

## 📊 Verificar en Producción

Antes de hacer deploy a producción, verificar:

### 1. Environment Variables
```bash
# Verificar en Vercel/Railway/tu hosting
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_PRICE_ID_PRO
- STRIPE_PRICE_ID_TEAM
- STRIPE_PRICE_ID_BUSINESS
- STRIPE_PRICE_ID_ENTERPRISE
```

### 2. Stripe Webhook
```bash
# Configurar en Stripe Dashboard → Webhooks
URL: https://tu-dominio.com/api/stripe/webhook
Events:
  - checkout.session.completed
  - customer.subscription.updated
  - customer.subscription.deleted
  - customer.subscription.created
```

### 3. Supabase RLS
```sql
-- Verificar que las policies están activas
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN (
  'subscriptions',
  'organizations',
  'organization_invitations',
  'chat_shares',
  'conversacion_participants',
  'notifications'
);
```

### 4. Performance
```bash
# Verificar índices en tablas grandes
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename IN (
  'conversaciones',
  'notifications',
  'conversacion_participants'
);
```

---

## 🎉 Sistema Activado

Una vez completados todos los pasos, tu sistema debería estar **100% funcional** con:

✅ **Suscripciones:**
- Trial de 7 días automático
- Bloqueo al expirar trial
- Página de planes

✅ **Organizaciones:**
- Invitar miembros por nick
- Gestionar equipo (owner)
- Miembros obtienen acceso sin pagar

✅ **Compartir Chats:**
- Compartir P2P hasta 3 usuarios (PRO)
- Chats de equipo ilimitados (TEAM+)
- Notificaciones de invitaciones

✅ **Notificaciones:**
- Campana con badge contador
- Panel desplegable
- Marcar como leídas/eliminar

✅ **UI/UX:**
- Sidebar con dos segmentos
- Diseño emerald green + glassmorphism
- Animaciones y transiciones

---

## 📞 Soporte

Si encuentras problemas durante la activación:

1. Revisar logs del servidor (`npm run dev`)
2. Revisar logs de Supabase (Dashboard → Logs)
3. Revisar logs de Stripe (Dashboard → Developers → Logs)
4. Consultar `IMPLEMENTATION-SUMMARY.md` para detalles técnicos
5. Consultar `ARCHITECTURE-DIAGRAM.md` para flujos

---

**Guía creada:** 2026-01-23
**Última actualización:** 2026-01-23
**Estado:** ✅ LISTO PARA ACTIVAR
