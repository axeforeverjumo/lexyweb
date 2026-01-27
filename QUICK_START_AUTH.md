# Quick Start - Sistema de Autenticación LEXY

Guía rápida para usar el sistema de autenticación en 5 minutos.

## Rutas Disponibles

```
/login              → Iniciar sesión
/register           → Crear cuenta
/forgot-password    → Recuperar contraseña
```

## Uso en Componentes

### Client Component (Formularios, UI interactiva)

```tsx
'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function MyComponent() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      router.push('/dashboard');
      router.refresh();
    }
  };
}
```

### Server Component (Páginas protegidas)

```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Usuario: {user.email}</div>;
}
```

### Usando Auth Utils

```tsx
import { getCurrentUser, isAuthenticated } from '@/lib/auth/utils';

export default async function Page() {
  // Opción 1: Obtener usuario
  const user = await getCurrentUser();

  // Opción 2: Solo verificar si está autenticado
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect('/login');
  }

  return <div>Bienvenido {user?.email}</div>;
}
```

## Crear Nueva Página Protegida

### Paso 1: Crear la página

```tsx
// src/app/mi-pagina/page.tsx
import { getCurrentUser } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function MiPagina() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Mi Página Protegida</h1>
      <p>Usuario: {user.email}</p>
    </div>
  );
}
```

### Paso 2: Agregar al middleware (opcional)

```tsx
// src/middleware.ts
const protectedRoutes = [
  '/dashboard',
  '/contratos',
  '/configuracion',
  '/perfil',
  '/mi-pagina', // ← Agregar aquí
];
```

## Componentes de UI

### Usar AuthForm para nuevas páginas de auth

```tsx
'use client';
import AuthForm from '@/components/auth/AuthForm';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import AuthError from '@/components/auth/AuthError';

export default function MiAuthPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthForm
      title="Mi Título"
      subtitle="Mi subtítulo"
      footer={<Link href="/login">Volver</Link>}
    >
      <form onSubmit={handleSubmit}>
        {error && <AuthError message={error} onDismiss={() => setError('')} />}

        <AuthInput
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthButton type="submit" loading={loading}>
          Enviar
        </AuthButton>
      </form>
    </AuthForm>
  );
}
```

## Operaciones Comunes

### Login

```tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

if (data.session) {
  router.push('/dashboard');
}
```

### Register

```tsx
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Juan Pérez',
    },
  },
});
```

### Logout

```tsx
await supabase.auth.signOut();
router.push('/login');
router.refresh();
```

### Obtener usuario actual

```tsx
// Client-side
const { data: { user } } = await supabase.auth.getUser();

// Server-side
const user = await getCurrentUser();
```

### Verificar sesión

```tsx
// Client-side
const { data: { session } } = await supabase.auth.getSession();

// Server-side
const session = await getSession();
```

### Password reset

```tsx
// Enviar email
await supabase.auth.resetPasswordForEmail('user@example.com', {
  redirectTo: `${window.location.origin}/auth/reset-password`,
});

// Actualizar password (en página de reset)
await supabase.auth.updateUser({
  password: 'new_password',
});
```

## Manejo de Errores

### Traducir errores de Supabase

```tsx
const errorMessages: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Debes confirmar tu email',
  'User already registered': 'Este email ya está registrado',
};

const translateError = (error: string) => {
  return errorMessages[error] || 'Ha ocurrido un error';
};
```

### Mostrar errores

```tsx
const [error, setError] = useState('');

try {
  // ... operación auth
} catch (err) {
  setError(translateError(err.message));
}

// En el JSX
{error && <AuthError message={error} onDismiss={() => setError('')} />}
```

## Middleware

El middleware ya está configurado y protege automáticamente:

**Rutas protegidas** (requieren login):
- `/dashboard/*`
- `/contratos/*`
- `/configuracion/*`
- `/perfil/*`

**Rutas de auth** (redirigen a dashboard si ya logueado):
- `/login`
- `/register`

No necesitas hacer nada adicional.

## Variables de Entorno

Asegúrate de tener en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.odoo.barcelona
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

## Testing Rápido

### Test manual en 1 minuto

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir navegador
open http://localhost:3000/register

# 3. Registrar usuario
# Email: test@example.com
# Password: password123

# 4. Verificar redirección a /dashboard
# 5. Volver a /login (debe redirigir a /dashboard)

# 6. Logout (implementar en dashboard)
# 7. Login con credenciales
```

## Tips de Desarrollo

### 1. Usar React DevTools
Instala React DevTools para debug de estado

### 2. Ver sesión actual
```tsx
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('Current session:', session);
  });
}, []);
```

### 3. Escuchar cambios de auth
```tsx
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event, session);
  });

  return () => subscription.unsubscribe();
}, []);
```

### 4. Debug middleware
Agrega logs en `middleware.ts`:
```tsx
console.log('Path:', req.nextUrl.pathname);
console.log('Session:', session);
```

## Troubleshooting

### "Invalid login credentials"
- Verifica que el email y password sean correctos
- Verifica que el usuario existe en Supabase Dashboard
- Verifica que el email esté confirmado (si está habilitado)

### Usuario no redirige después de login
- Verifica que `router.refresh()` se llame después de `router.push()`
- Verifica que el middleware esté funcionando
- Check cookies en DevTools

### Middleware no funciona
- Verifica que `matcher` incluya la ruta
- Verifica que las cookies estén siendo enviadas
- Check Network tab en DevTools

### TypeScript errors
- Instala types: `npm install -D @types/node`
- Verifica que `tsconfig.json` incluya las paths correctas

## Próximos Pasos

1. Implementar logout en dashboard
2. Agregar página de perfil
3. Implementar reset password page
4. Agregar OAuth providers
5. Setup email templates en Supabase

## Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- Documentación completa: `AUTH_SYSTEM.md`
- Componentes: `src/components/auth/README.md`
