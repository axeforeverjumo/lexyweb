'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  CreditCard,
  Crown,
  Users,
  Calendar,
  ExternalLink,
  Loader2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import type { Profile, Organization } from '@/types/subscription.types';
import { SUBSCRIPTION_PLANS, getTrialDaysRemaining } from '@/types/subscription.types';

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const { profile } = await response.json();
        setProfile(profile);
        setOrganization(profile.organization || null);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true);
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' });
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Error al abrir el portal de gestión');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      alert('Error al abrir el portal de gestión');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleUpgradePlan = () => {
    router.push('/subscription/plans');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No se pudo cargar el perfil</p>
        </div>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[profile.subscription_tier !== 'none' ? profile.subscription_tier : 'pro'];
  const trialDaysRemaining = getTrialDaysRemaining(profile);
  const isTrialing = profile.subscription_status === 'trialing';
  const hasActiveSubscription = ['active', 'trialing', 'team_member'].includes(
    profile.subscription_status
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || 'Usuario'}</h1>
                <p className="text-gray-600">@{profile.nick || 'sin-nick'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {profile.role === 'admin' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  ADMIN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trial Warning */}
        {isTrialing && trialDaysRemaining !== null && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-1">Trial Activo</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Te quedan {trialDaysRemaining} {trialDaysRemaining === 1 ? 'día' : 'días'} de prueba gratuita
                </p>
                <button
                  onClick={handleUpgradePlan}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Activar Suscripción
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Suscripción</h2>
          </div>

          <div className="space-y-4">
            {/* Plan Info */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="font-bold text-gray-900">{currentPlan?.name || 'Sin Plan'}</p>
                  <p className="text-sm text-gray-600">
                    {currentPlan?.price}€/mes
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    hasActiveSubscription
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {profile.subscription_status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Plan Features */}
            {currentPlan && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Características incluidas:</p>
                <ul className="space-y-1.5">
                  {currentPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleUpgradePlan}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
              >
                Cambiar Plan
              </button>
              {hasActiveSubscription && profile.stripe_customer_id && (
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoadingPortal}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
                >
                  {isLoadingPortal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Gestionar
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Organization Card */}
        {organization && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Organización</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{organization.name}</p>
                  <p className="text-sm text-gray-600">
                    {organization.subscription_tier.toUpperCase()} Plan
                  </p>
                </div>
                {profile.is_organization_owner && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    PROPIETARIO
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Máx. {organization.max_users} usuarios</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Información Personal</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-gray-900">{profile.email}</p>
              </div>
            </div>

            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Miembro desde</p>
                <p className="text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
