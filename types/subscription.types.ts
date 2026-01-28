// =============================================
// TIPOS: Sistema de Suscripciones y Colaboración
// Fecha: 2026-01-23
// Basado en: migraciones SQL ejecutadas
// =============================================

// ========================================
// SUSCRIPCIONES Y ORGANIZACIONES
// ========================================

export type SubscriptionTier = 'none' | 'pro' | 'team' | 'business' | 'enterprise';

export type SubscriptionStatus =
  | 'inactive'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'
  | 'team_member'; // Miembro de equipo (no paga)

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  max_users: number;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  subscription_tier: Exclude<SubscriptionTier, 'none' | 'pro'>; // Solo team, business, enterprise
  max_users: number; // 3, 4, 7
  stripe_subscription_id: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ========================================
// INVITACIONES
// ========================================

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  invited_by_id: string;
  invited_nick: string;
  invited_user_id: string | null; // Se llena al aceptar
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
  // Relaciones populadas
  organization?: Organization;
  invited_by?: Profile;
  invited_user?: Profile;
}

export interface ChatShare {
  id: string;
  conversacion_id: string;
  owner_id: string;
  shared_with_nick: string;
  shared_with_id: string | null; // Se llena al aceptar
  status: InvitationStatus;
  can_edit: boolean;
  created_at: string;
  accepted_at: string | null;
  // Relaciones populadas
  conversacion?: Conversacion;
  owner?: Profile;
  shared_with?: Profile;
}

// ========================================
// PARTICIPANTES Y TYPING
// ========================================

export type ParticipantRole = 'owner' | 'collaborator' | 'viewer';

export interface ConversacionParticipant {
  id: string;
  conversacion_id: string;
  user_id: string;
  role: ParticipantRole;
  can_write: boolean;
  joined_at: string;
  last_read_at: string | null;
  // Relaciones populadas
  user?: Profile;
}

export interface TypingIndicator {
  id: string;
  conversacion_id: string;
  user_id: string;
  started_at: string;
  expires_at: string;
  // Relaciones populadas
  user?: Profile;
}

// ========================================
// NOTIFICACIONES
// ========================================

export type NotificationType =
  | 'organization_invite'
  | 'chat_share_invite'
  | 'chat_message'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  action_url: string | null;
  related_id: string | null; // ID de invitación, chat, etc.
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

// ========================================
// PROFILE EXTENDIDO
// ========================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';

  // Nuevos campos de suscripción
  nick: string | null; // Username único para invitaciones
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;

  // Organización
  organization_id: string | null;
  is_organization_owner: boolean;

  created_at: string;
  updated_at: string;

  // Relaciones populadas
  organization?: Organization;
}

// ========================================
// CONVERSACION EXTENDIDA
// ========================================

export interface Conversacion {
  id: string;
  user_id: string;
  tipo: 'consulta' | 'contrato' | 'general';
  titulo: string;
  estado: 'activa' | 'archivada';

  // Nuevos campos de colaboración
  is_shared: boolean;
  is_organization_chat: boolean;
  organization_id: string | null;
  currently_typing_user_id: string | null;
  typing_started_at: string | null;

  created_at: string;
  updated_at: string;
  last_message_at: string | null;

  // Relaciones populadas
  participants?: ConversacionParticipant[];
  typing_users?: Profile[];
  organization?: Organization;
}

// ========================================
// RESPUESTAS DE API
// ========================================

export interface OrganizationWithMembers extends Organization {
  members: Profile[];
  pending_invitations: OrganizationInvitation[];
}

export interface ConversacionWithDetails extends Conversacion {
  participant_count: number;
  unread_count: number;
  shared_with?: Profile[];
}

export interface NotificationWithDetails extends Notification {
  invitation?: OrganizationInvitation;
  chat_share?: ChatShare;
}

// ========================================
// DATOS DE FORMULARIOS
// ========================================

export interface CreateOrganizationData {
  name: string;
  tier: Exclude<SubscriptionTier, 'none' | 'pro'>;
  max_users: number;
}

export interface InviteToOrganizationData {
  nick: string;
}

export interface ShareChatData {
  conversacion_id: string;
  shared_with_nick: string;
}

export interface AcceptInvitationResponse {
  success: boolean;
  organization?: Organization;
  conversacion?: Conversacion;
}

// ========================================
// HELPERS Y UTILIDADES
// ========================================

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number; // EUR/mes
  maxUsers: number;
  features: string[];
  stripePriceId: string;
}

export const SUBSCRIPTION_PLANS: Record<Exclude<SubscriptionTier, 'none'>, SubscriptionPlan> = {
  pro: {
    tier: 'pro',
    name: 'PRO',
    price: 65,
    maxUsers: 1,
    features: [
      'Contratos ilimitados',
      '97 templates legales',
      'Firmas digitales',
      'Generación con IA',
      'Chats compartidos P2P (hasta 3 usuarios)',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || '',
  },
  team: {
    tier: 'team',
    name: 'TEAM',
    price: 150,
    maxUsers: 3,
    features: [
      'Todo PRO',
      'Hasta 3 usuarios',
      'Chats de equipo compartidos',
      'Dashboard de administración',
      'Gestión de miembros',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_TEAM || '',
  },
  business: {
    tier: 'business',
    name: 'BUSINESS',
    price: 299,
    maxUsers: 4,
    features: [
      'Todo TEAM',
      'Hasta 4 usuarios',
      'White-label personalizado',
      'Templates custom',
      'Soporte prioritario',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_BUSINESS || '',
  },
  enterprise: {
    tier: 'enterprise',
    name: 'ENTERPRISE',
    price: 500,
    maxUsers: 7,
    features: [
      'Todo BUSINESS',
      'Hasta 7 usuarios',
      'API personalizada',
      'Integración ERP',
      'Manager dedicado',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
  },
};

// Helper: Verificar si usuario tiene suscripción activa
export function hasActiveSubscription(profile: Profile): boolean {
  return ['trialing', 'active', 'team_member'].includes(profile.subscription_status);
}

// Helper: Obtener plan por tier
export function getPlanByTier(tier: SubscriptionTier): SubscriptionPlan | null {
  if (tier === 'none') return null;
  return SUBSCRIPTION_PLANS[tier] || null;
}

// Helper: Verificar si usuario puede invitar más miembros
export function canInviteMoreMembers(organization: Organization, currentMembers: number): boolean {
  return currentMembers < organization.max_users;
}

// Helper: Calcular días restantes de trial
export function getTrialDaysRemaining(profile: Profile): number | null {
  if (!profile.trial_ends_at || profile.subscription_status !== 'trialing') return null;
  const trialEnd = new Date(profile.trial_ends_at);
  const now = new Date();
  const diff = trialEnd.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}
