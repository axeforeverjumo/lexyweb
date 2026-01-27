# Authentication System - LEXY

Sistema completo de autenticación con diseño emerald moderno y glassmorphism.

## Componentes

### AuthForm
Wrapper principal del formulario de autenticación con diseño moderno.

```tsx
import AuthForm from '@/components/auth/AuthForm';

<AuthForm
  title="Título"
  subtitle="Subtítulo"
  footer={<FooterContent />}
>
  {children}
</AuthForm>
```

**Props:**
- `title`: string - Título principal del formulario
- `subtitle`: string - Subtítulo descriptivo
- `footer`: ReactNode - Contenido del footer (opcional)
- `children`: ReactNode - Contenido del formulario

**Características:**
- Background gradient con grid pattern
- Glassmorphism card effect
- Animated gradient orbs
- Logo LEXY con badge
- Link de regreso al home
- Trust badges en el footer

### AuthInput
Input field estilizado para formularios de autenticación.

```tsx
import AuthInput from '@/components/auth/AuthInput';

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

**Props:**
- Extiende todas las props de `InputHTMLAttributes<HTMLInputElement>`
- `label`: string - Etiqueta del campo
- `error`: string (opcional) - Mensaje de error a mostrar

**Características:**
- Focus ring emerald
- Error states con animación
- Disabled states
- Glassmorphism background
- Validación visual

### AuthButton
Botón de acción para formularios de autenticación.

```tsx
import AuthButton from '@/components/auth/AuthButton';

<AuthButton
  type="submit"
  loading={loading}
  variant="primary"
>
  Iniciar sesión
</AuthButton>
```

**Props:**
- Extiende todas las props de `ButtonHTMLAttributes<HTMLButtonElement>`
- `loading`: boolean - Estado de carga
- `variant`: 'primary' | 'secondary' - Variante visual

**Características:**
- Loading state con spinner
- Gradient emerald en primary
- Hover effects con scale
- Disabled states
- Full width por defecto

### AuthError
Componente para mostrar mensajes de error.

```tsx
import AuthError from '@/components/auth/AuthError';

<AuthError
  message={error}
  onDismiss={() => setError('')}
/>
```

**Props:**
- `message`: string - Mensaje de error
- `onDismiss`: () => void (opcional) - Callback al cerrar

**Características:**
- Animación de entrada/salida
- Icon de alerta
- Botón de cierre opcional
- Diseño coherente con error inputs

## Páginas

### Login (`/login`)
Página de inicio de sesión.

**Características:**
- Email y password fields
- Remember me checkbox
- Link a forgot password
- Link a register
- Validación de formulario
- Mensajes de error en español
- Redirección a dashboard después de login

### Register (`/register`)
Página de registro de usuarios.

**Características:**
- Nombre completo, email, password, confirm password
- Validación de contraseñas coincidentes
- Validación de longitud mínima (8 caracteres)
- Checkbox de términos y condiciones
- Mensajes de error en español
- Redirección a dashboard después de registro

### Forgot Password (`/forgot-password`)
Página de recuperación de contraseña.

**Características:**
- Email field
- Success state después de envío
- Mensajes de error en español
- Link de regreso a login

## Utilidades

### Supabase Clients

#### Client Component
```tsx
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

#### Server Component
```tsx
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
```

### Auth Utils
```tsx
import { getCurrentUser, isAuthenticated, getSession } from '@/lib/auth/utils';

// Get current user (server-side)
const user = await getCurrentUser();

// Check authentication
const authenticated = await isAuthenticated();

// Get session
const session = await getSession();
```

## Middleware

El middleware protege rutas automáticamente:

**Rutas protegidas** (requieren autenticación):
- `/dashboard`
- `/contratos`
- `/configuracion`
- `/perfil`

**Rutas de auth** (redirigen a dashboard si ya autenticado):
- `/login`
- `/register`

## Flujo de Autenticación

### Login
1. Usuario ingresa email y password
2. Validación client-side
3. `supabase.auth.signInWithPassword()`
4. Manejo de errores en español
5. Redirección a `/dashboard`

### Register
1. Usuario ingresa datos completos
2. Validación de contraseñas coincidentes
3. Validación de términos aceptados
4. `supabase.auth.signUp()`
5. Manejo de errores en español
6. Redirección a `/dashboard` o mensaje de confirmación de email

### Password Reset
1. Usuario ingresa email
2. `supabase.auth.resetPasswordForEmail()`
3. Email enviado con instrucciones
4. Usuario sigue link del email
5. Redirección a página de reset password

## Diseño

### Paleta de Colores
- **Primary**: Emerald 500-600 (`#10b981`, `#059669`)
- **Background**: Gradient dark (`gray-950`, `black`, `gray-900`)
- **Text**: White principal, gray-400 secundario
- **Error**: Red 400-500
- **Success**: Emerald 400-500

### Efectos Visuales
- Grid pattern sutil en background
- Gradient orbs animados
- Glassmorphism en cards (`bg-white/5`, `backdrop-blur-xl`)
- Shadows emerald en hover states
- Smooth transitions (300ms)
- Focus rings emerald
- Framer Motion animations

### Tipografía
- Font: Inter Variable
- Títulos: Bold, gradient emerald
- Body: Medium weight, gray-400
- Links: Emerald-400 hover emerald-300

### Responsive
- Mobile-first approach
- Max-width: 28rem (448px)
- Padding adaptativo
- Full-width inputs y botones

## Accesibilidad

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states visibles
- Error messages con iconos
- Loading states
- Disabled states
- Color contrast WCAG AA

## Testing

### Manual Testing Checklist
- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas
- [ ] Register con datos válidos
- [ ] Register con emails duplicados
- [ ] Validación de contraseñas coincidentes
- [ ] Forgot password flow
- [ ] Redirección después de login
- [ ] Redirección después de register
- [ ] Middleware protegiendo rutas
- [ ] Loading states
- [ ] Error messages
- [ ] Mobile responsive
- [ ] Keyboard navigation

## Próximas Mejoras

- [ ] OAuth providers (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Email verification flow
- [ ] Password strength indicator
- [ ] Rate limiting
- [ ] CAPTCHA
- [ ] Session management UI
- [ ] Account settings page
