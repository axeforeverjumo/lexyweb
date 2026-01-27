# Sistema de Autenticación LEXY

Sistema completo de autenticación con diseño emerald moderno, glassmorphism y integración total con Supabase Auth.

## Arquitectura

```
src/
├── app/
│   ├── (auth)/                    # Auth route group (sin header/footer)
│   │   ├── layout.tsx            # Layout para páginas de auth
│   │   ├── login/
│   │   │   └── page.tsx          # Página de inicio de sesión
│   │   ├── register/
│   │   │   └── page.tsx          # Página de registro
│   │   └── forgot-password/
│   │       └── page.tsx          # Recuperación de contraseña
│   └── auth/
│       └── callback/
│           └── route.ts          # Callback de autenticación OAuth
├── components/
│   └── auth/
│       ├── AuthForm.tsx          # Wrapper del formulario
│       ├── AuthInput.tsx         # Input field estilizado
│       ├── AuthButton.tsx        # Botón de acción
│       ├── AuthError.tsx         # Mensaje de error
│       └── README.md             # Documentación de componentes
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Cliente de Supabase (client-side)
│   │   └── server.ts            # Cliente de Supabase (server-side)
│   └── auth/
│       └── utils.ts             # Utilidades de autenticación
└── middleware.ts                 # Protección de rutas
```

## Características Principales

### Diseño Visual

#### Paleta Emerald
- Primary: `emerald-600` (#059669) / `emerald-500` (#10b981)
- Gradients: `from-emerald-600 to-emerald-500`
- Focus rings: `emerald-500/50`
- Shadows: `emerald-600/20`

#### Efectos Visuales
1. **Background**
   - Gradient: `from-gray-950 via-black to-gray-900`
   - Grid pattern: Líneas sutiles cada 24px
   - Gradient orbs: Emerald blur 3xl animados

2. **Glassmorphism**
   - Background: `bg-white/5`
   - Backdrop blur: `backdrop-blur-xl`
   - Border: `border-white/10`
   - Shadow: `shadow-2xl`

3. **Animaciones (Framer Motion)**
   - Fade in: opacity 0 → 1
   - Slide up: translateY(20px) → 0
   - Staggered delays: 0.1s - 0.3s
   - Smooth transitions: 300ms

### Componentes

#### 1. AuthForm
Wrapper principal que proporciona:
- Layout completo con background effects
- Logo LEXY con badge "Legal garantizado"
- Link de regreso al home
- Card glassmorphism
- Trust badges en footer
- Sección de footer personalizable

```tsx
<AuthForm
  title="Bienvenido de nuevo"
  subtitle="Inicia sesión para acceder a tu cuenta"
  footer={<LinkToRegister />}
>
  <FormContent />
</AuthForm>
```

#### 2. AuthInput
Input field con:
- Label estilizado
- Border emerald en focus
- Estados de error animados
- Disabled states
- Full TypeScript support

```tsx
<AuthInput
  type="email"
  label="Email"
  placeholder="tu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
  required
/>
```

#### 3. AuthButton
Botón con:
- Loading state con spinner
- Variantes: primary (gradient) / secondary (ghost)
- Hover effects con scale
- Full width responsive
- Disabled automático durante loading

```tsx
<AuthButton
  type="submit"
  loading={isLoading}
  variant="primary"
>
  Iniciar sesión
</AuthButton>
```

#### 4. AuthError
Mensaje de error con:
- Animación de entrada
- Icon de alerta
- Botón de cierre opcional
- Diseño coherente

```tsx
<AuthError
  message={error}
  onDismiss={() => setError('')}
/>
```

### Páginas de Autenticación

#### Login (`/login`)
**Funcionalidad:**
- Email y password fields
- Remember me checkbox
- Link a forgot password
- Link a register
- Validación client-side
- Integración con Supabase Auth
- Mensajes de error en español
- Redirección a `/dashboard`

**Traducciones de errores:**
```typescript
const errorMessages = {
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión',
  'User not found': 'No existe una cuenta con este email',
  'Invalid email': 'El formato del email no es válido',
};
```

#### Register (`/register`)
**Funcionalidad:**
- Nombre completo, email, password, confirm password
- Validación de contraseñas:
  - Mínimo 8 caracteres
  - Deben coincidir
- Checkbox de términos y condiciones
- Integración con Supabase Auth
- Metadata del usuario (full_name)
- Mensajes de error en español
- Redirección a `/dashboard` o confirmación de email

**Validaciones:**
```typescript
// Password mínimo 8 caracteres
if (password.length < 8) {
  setPasswordError('La contraseña debe tener al menos 8 caracteres');
}

// Passwords coincidentes
if (password !== confirmPassword) {
  setConfirmPasswordError('Las contraseñas no coinciden');
}

// Términos aceptados
if (!acceptTerms) {
  setError('Debes aceptar los términos y condiciones');
}
```

#### Forgot Password (`/forgot-password`)
**Funcionalidad:**
- Campo de email
- Envío de email de recuperación
- Success state después de envío
- Link de regreso a login
- Integración con Supabase Auth

**Flujo:**
1. Usuario ingresa email
2. `supabase.auth.resetPasswordForEmail()`
3. Redirect URL: `/auth/reset-password`
4. Success message mostrado
5. Usuario recibe email con link

### Supabase Integration

#### Client-Side (`client.ts`)
Para componentes de cliente:
```tsx
'use client';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

#### Server-Side (`server.ts`)
Para Server Components:
```tsx
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

#### Auth Utils
Utilidades server-side:
```tsx
import { getCurrentUser, isAuthenticated, getSession } from '@/lib/auth/utils';

// En Server Component o API Route
const user = await getCurrentUser();
const authenticated = await isAuthenticated();
const session = await getSession();
```

### Middleware de Protección

El middleware protege automáticamente las rutas:

```typescript
// Rutas protegidas (requieren autenticación)
const protectedRoutes = [
  '/dashboard',
  '/contratos',
  '/configuracion',
  '/perfil'
];

// Rutas de auth (redirigen a dashboard si ya autenticado)
const authRoutes = ['/login', '/register'];
```

**Comportamiento:**
- Sin sesión + ruta protegida → Redirect a `/login?redirect=/ruta`
- Con sesión + ruta de auth → Redirect a `/dashboard`

### Estados y UX

#### Loading States
Todos los formularios tienen:
- Botones con loading spinner
- Inputs deshabilitados durante loading
- Mensaje de loading descriptivo ("Iniciando sesión...", "Creando cuenta...")

#### Error States
- Mensajes de error en español
- Animación de entrada
- Botón de cierre (dismiss)
- Error específico por campo (password, confirmPassword)
- Icon visual de alerta

#### Success States
- Página de forgot password muestra success state
- Icon de check verde
- Mensaje descriptivo
- CTA para siguiente acción

### Flujos de Usuario

#### 1. Nuevo Usuario
```
Home → Register → Email confirmation (opcional) → Dashboard
```

#### 2. Usuario Existente
```
Home → Login → Dashboard
```

#### 3. Recuperación de Contraseña
```
Login → Forgot Password → Email enviado → Reset Password → Login
```

### Configuración de Supabase

#### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Configuración de Auth
En Supabase Dashboard:

1. **Email Settings**
   - Enable email confirmation (opcional)
   - Configure email templates
   - Set redirect URLs

2. **Auth Providers**
   - Email/Password: Enabled
   - OAuth providers: Configurar según necesidad

3. **URL Configuration**
   - Site URL: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/reset-password`

### Seguridad

#### Protección de Rutas
- Middleware automático
- Verificación server-side
- Session validation

#### Validaciones
- Client-side: UX inmediata
- Server-side: Supabase Auth
- Password strength: Mínimo 8 caracteres
- Email format validation

#### HTTPS
- Producción: Forzar HTTPS
- Cookies: Secure flag en producción
- Session tokens: HTTPOnly cookies

### Accesibilidad

#### WCAG 2.1 AA Compliance
- Semantic HTML
- ARIA labels en inputs
- Keyboard navigation completa
- Focus states visibles
- Color contrast ratios
- Error messages asociados con campos

#### Keyboard Navigation
- Tab order lógico
- Enter para submit
- Escape para cerrar modales (futuro)
- Focus trap en formularios

### Testing

#### Manual Testing Checklist

**Login:**
- [ ] Login exitoso con credenciales válidas
- [ ] Error con email inválido
- [ ] Error con password incorrecta
- [ ] Error con usuario no existente
- [ ] Remember me funciona
- [ ] Redirect a dashboard después de login
- [ ] Redirect parameter funciona

**Register:**
- [ ] Registro exitoso con datos válidos
- [ ] Error con email duplicado
- [ ] Error con password < 8 caracteres
- [ ] Error con passwords no coincidentes
- [ ] Error sin aceptar términos
- [ ] Metadata guardada (full_name)
- [ ] Redirect a dashboard después de registro

**Forgot Password:**
- [ ] Email enviado correctamente
- [ ] Success state mostrado
- [ ] Error con email inválido
- [ ] Link del email funciona

**Middleware:**
- [ ] Rutas protegidas sin sesión → redirect a login
- [ ] Rutas de auth con sesión → redirect a dashboard
- [ ] Redirect parameter preservado

**Responsive:**
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

**Accesibilidad:**
- [ ] Tab navigation funciona
- [ ] Screen reader compatible
- [ ] Focus states visibles
- [ ] Color contrast adecuado

### Próximas Mejoras

#### Funcionalidad
- [ ] OAuth providers (Google, GitHub, LinkedIn)
- [ ] Two-factor authentication
- [ ] Magic link login
- [ ] Session management UI
- [ ] Account settings page
- [ ] Email change flow
- [ ] Phone verification

#### UX
- [ ] Password strength indicator
- [ ] Show/hide password toggle
- [ ] Auto-fill detection
- [ ] Better error recovery flows

#### Seguridad
- [ ] Rate limiting
- [ ] CAPTCHA en registro
- [ ] IP-based blocking
- [ ] Session timeout configuration
- [ ] Device management

#### Internacionalización
- [ ] Multi-language support
- [ ] RTL layout support

## Uso en Desarrollo

### Iniciar el proyecto
```bash
cd lexyweb
npm run dev
```

### Rutas disponibles
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/forgot-password` - Recuperación de contraseña

### Testing local
1. Registrar nuevo usuario
2. Verificar redirección a dashboard
3. Logout (implementar)
4. Login con credenciales
5. Test forgot password flow

## Mantenimiento

### Actualizar traducciones
Editar `errorMessages` en cada página:
```typescript
const errorMessages: Record<string, string> = {
  'Error key': 'Traducción al español',
};
```

### Cambiar estilos
Los estilos están centralizados en los componentes:
- `AuthForm.tsx` - Layout y background
- `AuthInput.tsx` - Input styles
- `AuthButton.tsx` - Button variants
- Tailwind config para colores globales

### Agregar nueva página de auth
1. Crear en `src/app/(auth)/nueva-pagina/page.tsx`
2. Usar componentes de `@/components/auth`
3. Agregar ruta al middleware si es necesario
4. Actualizar documentación

## Soporte

Para issues o mejoras, documentar en:
- GitHub Issues (si aplica)
- Internal documentation
- Code comments para casos edge
