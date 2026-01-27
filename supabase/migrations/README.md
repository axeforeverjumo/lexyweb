# 🗄️ MIGRACIONES SQL - SISTEMA HÍBRIDO LEXYAPP + LEXYWEB

**Fecha:** 22 Enero 2026
**Versión:** 1.0 Híbrida
**Base de Datos:** Compartida entre lexyweb y lexyapp

---

## ⚠️ IMPORTANTE - LEER ANTES DE EJECUTAR

### 🔥 ESTAS MIGRACIONES SON DESTRUCTIVAS

- **Modifican la estructura de la base de datos compartida**
- **Afectan tanto a lexyweb como a lexyapp**
- **NO son reversibles automáticamente**
- **Ejecutar SOLO UNA VEZ en Supabase**

### ✅ Requisitos Previos

1. **Backup completo de la base de datos**
2. **Verificar que profiles, conversaciones, contratos existen**
3. **Tener acceso al Dashboard de Supabase**
4. **Ejecutar en ambiente de desarrollo PRIMERO**

---

## 📋 RESUMEN DE MIGRACIONES

Este conjunto de migraciones implementa:

✅ **Sistema de Suscripciones Stripe** (de lexyweb)
✅ **Sistema de Organizaciones/Equipos** (nuevo)
✅ **Invitaciones por Nick Único** (nuevo)
✅ **Chats Compartidos P2P** (máx 3 usuarios)
✅ **Chats de Equipo** (organizaciones)
✅ **Lock de Escritura Optimista** (real-time)
✅ **Notificaciones In-App** (sistema completo)

---

## 📦 ORDEN DE EJECUCIÓN

**CRÍTICO:** Ejecutar en este orden exacto.

| # | Archivo | Descripción | Impacto |
|---|---------|-------------|---------|
| 1 | `20260122000001_extend_profiles_table.sql` | Agregar campos: nick, subscription_*, organization_id | **ALTO** - Modifica profiles |
| 2 | `20260122000002_create_subscriptions_table.sql` | Crear tabla subscriptions (tracking Stripe) | Medio |
| 3 | `20260122000003_create_organizations_table.sql` | Crear tabla organizations + FK | Medio |
| 4 | `20260122000004_create_organization_invitations_table.sql` | Invitaciones por nick | Bajo |
| 5 | `20260122000005_create_chat_shares_table.sql` | Compartir chats P2P (máx 3) | Bajo |
| 6 | `20260122000006_update_conversaciones_table.sql` | Agregar campos: is_shared, is_organization_chat | **ALTO** - Modifica conversaciones |
| 7 | `20260122000007_create_conversacion_participants_table.sql` | Control de acceso a chats | Bajo |
| 8 | `20260122000008_create_typing_indicators_table.sql` | Lock optimista (typing) | Bajo |
| 9 | `20260122000009_create_notifications_table.sql` | Sistema de notificaciones | Bajo |
| 10 | `20260122000010_create_helper_functions.sql` | Funciones SQL reutilizables | Bajo |
| 11 | `20260122000011_create_automatic_triggers.sql` | Triggers para notificaciones automáticas | Medio |
| 12 | `20260122000012_create_stats_views.sql` | Vistas para reporting | Bajo |

---

## 🚀 MÉTODO 1: Supabase Dashboard (Recomendado)

### Paso 1: Acceder al SQL Editor

1. Ir a: https://supabase.odoo.barcelona/project/_/sql
2. Click "New Query"

### Paso 2: Ejecutar una por una

```sql
-- COPIAR Y PEGAR EL CONTENIDO DE CADA ARCHIVO EN ORDEN
-- Ejemplo:

-- 1️⃣ MIGRACIÓN 1
-- Copiar TODO el contenido de 20260122000001_extend_profiles_table.sql
-- Click "Run" (Ctrl/Cmd + Enter)
-- ✅ Verificar que no hay errores

-- 2️⃣ MIGRACIÓN 2
-- Copiar TODO el contenido de 20260122000002_create_subscriptions_table.sql
-- Click "Run"
-- ✅ Verificar

-- ... continuar con todas
```

### Paso 3: Verificar cada migración

Después de cada migración, ejecutar:

```sql
-- Verificar que la tabla/columna existe
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles' -- O la tabla que se modificó
ORDER BY ordinal_position;
```

---

## 🚀 MÉTODO 2: Supabase CLI (Avanzado)

### Requisitos

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref YOUR_PROJECT_ID
```

### Ejecutar todas las migraciones

```bash
cd lexyapp  # O lexyweb (da igual, misma BD)

# Ejecutar todas
supabase db push

# O ejecutar una por una
supabase db execute -f supabase/migrations/20260122000001_extend_profiles_table.sql
supabase db execute -f supabase/migrations/20260122000002_create_subscriptions_table.sql
# ... etc
```

---

## ✅ VERIFICACIÓN POST-MIGRACIÓN

### 1. Verificar tablas creadas

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'subscriptions',
    'organizations',
    'organization_invitations',
    'chat_shares',
    'conversacion_participants',
    'typing_indicators',
    'notifications'
  );

-- Debe devolver 7 filas
```

### 2. Verificar columnas en profiles

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN (
    'nick',
    'subscription_tier',
    'subscription_status',
    'stripe_customer_id',
    'trial_ends_at',
    'subscription_ends_at',
    'organization_id',
    'is_organization_owner'
  );

-- Debe devolver 8 filas
```

### 3. Verificar columnas en conversaciones

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'conversaciones'
  AND column_name IN (
    'is_shared',
    'is_organization_chat',
    'organization_id',
    'currently_typing_user_id',
    'typing_started_at'
  );

-- Debe devolver 5 filas
```

### 4. Verificar funciones SQL

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'has_active_subscription',
    'get_user_tier',
    'check_organization_user_limit',
    'can_user_write_in_chat',
    'search_users_by_nick'
  );

-- Debe devolver 5 filas
```

### 5. Verificar triggers

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Verificar que existen:
-- - on_profile_created_assign_trial (profiles)
-- - on_organization_invitation_created (organization_invitations)
-- - on_chat_share_created (chat_shares)
-- - on_org_chat_created (conversaciones)
-- - on_invitation_accepted (organization_invitations)
-- - on_chat_share_accepted (chat_shares)
```

### 6. Verificar vistas

```sql
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN (
    'subscription_stats',
    'user_full_info',
    'user_accessible_chats',
    'pending_notifications_count'
  );

-- Debe devolver 4 filas
```

---

## 🔍 TESTING

### Crear usuario de prueba con nick

```sql
-- Crear usuario manualmente (simular registro)
INSERT INTO profiles (id, email, full_name, nick, role)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Usuario Prueba',
  'testuser123',
  'user'
);

-- Verificar que tiene trial automático
SELECT nick, subscription_status, subscription_tier, trial_ends_at
FROM profiles
WHERE nick = 'testuser123';

-- Resultado esperado:
-- subscription_status = 'trialing'
-- subscription_tier = 'pro'
-- trial_ends_at = (NOW + 14 days)
```

### Crear organización de prueba

```sql
-- Crear organización
INSERT INTO organizations (name, owner_id, subscription_tier, max_users)
VALUES (
  'Empresa de Prueba',
  (SELECT id FROM profiles WHERE nick = 'testuser123'),
  'team',
  3
);

-- Verificar que el owner tiene organization_id
SELECT nick, organization_id, is_organization_owner
FROM profiles
WHERE nick = 'testuser123';

-- Resultado esperado:
-- organization_id = <UUID de la org creada>
-- is_organization_owner = true
```

### Invitar usuario por nick

```sql
-- Invitar a otro usuario
INSERT INTO organization_invitations (
  organization_id,
  invited_by_id,
  invited_nick
)
VALUES (
  (SELECT organization_id FROM profiles WHERE nick = 'testuser123'),
  (SELECT id FROM profiles WHERE nick = 'testuser123'),
  'axeforever24' -- Nick del usuario a invitar
);

-- Verificar que se creó notificación
SELECT * FROM notifications
WHERE user_id = (SELECT id FROM profiles WHERE nick = 'axeforever24')
  AND type = 'organization_invite';

-- Resultado esperado: 1 fila con notificación
```

---

## 🔴 TROUBLESHOOTING

### Error: "column already exists"

```
ERROR: column "nick" of relation "profiles" already exists
```

**Solución:** La migración ya se ejecutó. Verificar si todas las columnas existen.

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'nick';
```

Si existe, saltar esa migración.

---

### Error: "relation does not exist"

```
ERROR: relation "organizations" does not exist
```

**Causa:** Migraciones ejecutadas fuera de orden.

**Solución:** Ejecutar las migraciones en el orden correcto (ver tabla arriba).

---

### Error: "foreign key constraint violation"

```
ERROR: insert or update on table violates foreign key constraint
```

**Causa:** Intentando referenciar una tabla que no existe o un registro que no existe.

**Solución:**
1. Verificar que la migración de la tabla referenciada se ejecutó
2. Verificar que el ID referenciado existe

```sql
-- Ejemplo: verificar que el user_id existe en profiles
SELECT id FROM profiles WHERE id = '<UUID>';
```

---

### Error: "permission denied for table"

```
ERROR: permission denied for table profiles
```

**Causa:** Usuario sin permisos o RLS bloqueando.

**Solución:** Usar el SQL Editor del Dashboard (tiene permisos de service_role).

---

## 📊 IMPACTO EN APLICACIONES

### LEXYWEB (Landing)

**Necesita actualizar:**
- ✅ Webhook de Stripe para crear `subscriptions` + `organizations`
- ✅ Página de éxito tras pago
- ✅ Portal de gestión de suscripción

**Archivos a modificar:**
- `app/api/webhooks/stripe/route.ts` - Crear subscription + org
- `app/success/page.tsx` - Mostrar info de suscripción

---

### LEXYAPP (Aplicación)

**Necesita actualizar:**
- ✅ Registro de usuarios (generar nick único)
- ✅ Middleware (verificar subscription_status)
- ✅ Sidebar (mostrar "Mis Chats" + "Chats de Equipo")
- ✅ Sistema de invitaciones (por nick)
- ✅ Notificaciones in-app

**Nuevos componentes necesarios:**
- `ShareChatModal.tsx`
- `NotificationsPanel.tsx`
- `ManageTeamModal.tsx`
- `SubscriptionBlockedScreen.tsx`
- Y más (ver docs/plans/2026-01-22-colaboracion-y-suscripciones-design.md)

---

## 📚 DOCUMENTACIÓN RELACIONADA

- **Diseño completo:** `docs/plans/2026-01-22-colaboracion-y-suscripciones-design.md`
- **Diagrama ER:** (pendiente de crear)
- **Tipos TypeScript:** (pendiente de crear en `src/types/subscription.types.ts`)

---

## 🆘 SOPORTE

Si encuentras problemas:
1. Verificar logs de Supabase Dashboard
2. Revisar este README completo
3. Consultar el diseño completo en `docs/plans/`
4. Hacer rollback si es necesario (contactar admin de Supabase)

---

## ⚠️ ROLLBACK (Solo si es necesario)

**NO HAY ROLLBACK AUTOMÁTICO**

Si necesitas deshacer las migraciones:

```sql
-- CUIDADO: Esto ELIMINA datos

-- Eliminar tablas nuevas
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS typing_indicators CASCADE;
DROP TABLE IF EXISTS conversacion_participants CASCADE;
DROP TABLE IF EXISTS chat_shares CASCADE;
DROP TABLE IF EXISTS organization_invitations CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Eliminar columnas de profiles
ALTER TABLE profiles
  DROP COLUMN IF EXISTS nick,
  DROP COLUMN IF EXISTS subscription_tier,
  DROP COLUMN IF EXISTS subscription_status,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS trial_ends_at,
  DROP COLUMN IF EXISTS subscription_ends_at,
  DROP COLUMN IF EXISTS organization_id,
  DROP COLUMN IF EXISTS is_organization_owner;

-- Eliminar columnas de conversaciones
ALTER TABLE conversaciones
  DROP COLUMN IF EXISTS is_shared,
  DROP COLUMN IF EXISTS is_organization_chat,
  DROP COLUMN IF EXISTS organization_id,
  DROP COLUMN IF EXISTS currently_typing_user_id,
  DROP COLUMN IF EXISTS typing_started_at;

-- Eliminar funciones, triggers y vistas (ejecutar uno por uno)
```

**⚠️ ESTO ELIMINARÁ TODOS LOS DATOS DE SUSCRIPCIONES, ORGANIZACIONES, INVITACIONES Y COMPARTIDOS**

---

## ✅ CHECKLIST POST-EJECUCIÓN

- [ ] Las 12 migraciones ejecutadas sin errores
- [ ] Todas las tablas verificadas (7 nuevas)
- [ ] Todas las columnas verificadas (13 nuevas)
- [ ] Todas las funciones verificadas (5)
- [ ] Todos los triggers verificados (6)
- [ ] Todas las vistas verificadas (4)
- [ ] Test con usuario de prueba exitoso
- [ ] Test con organización de prueba exitoso
- [ ] Test con invitación de prueba exitoso
- [ ] Backup de BD creado antes de ejecutar
- [ ] Documentación leída completamente
- [ ] Lexyweb actualizado para usar nuevo schema
- [ ] Lexyapp actualizado para usar nuevo schema

---

**Creado por:** Claude Code
**Fecha:** 22 Enero 2026
**Versión:** 1.0 Híbrida (lexyweb + lexyapp)
**Base de Datos:** Supabase compartida (https://supabase.odoo.barcelona)
