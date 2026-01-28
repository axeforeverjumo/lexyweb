'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Users, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type {
  Profile,
  OrganizationInvitation,
  SubscriptionStatus,
} from '@/types/subscription.types';
import { getTrialDaysRemaining } from '@/types/subscription.types';

interface SubscriptionBlockedScreenProps {
  user: Profile;
  pendingInvitations?: OrganizationInvitation[];
}

export default function SubscriptionBlockedScreen({
  user,
  pendingInvitations = [],
}: SubscriptionBlockedScreenProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null);

  const trialDaysRemaining = getTrialDaysRemaining(user);
  const isTrialExpired = user.subscription_status === 'inactive' && trialDaysRemaining === 0;

  const getStatusMessage = (): { title: string; description: string } => {
    if (user.subscription_status === 'trialing' && trialDaysRemaining !== null) {
      return {
        title: '¡Trial activo!',
        description: `Te quedan ${trialDaysRemaining} días de prueba gratuita`,
      };
    }

    if (isTrialExpired) {
      return {
        title: 'Tu trial ha finalizado',
        description: 'Activa una suscripción para continuar usando Lexy',
      };
    }

    if (user.subscription_status === 'canceled' || user.subscription_status === 'past_due') {
      return {
        title: 'Suscripción inactiva',
        description: 'Tu suscripción ha sido cancelada o tiene pagos pendientes',
      };
    }

    return {
      title: 'Cuenta inactiva',
      description: 'Necesitas una suscripción activa para acceder a Lexy',
    };
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      // Refrescar la página para re-ejecutar el middleware
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing status:', error);
      setIsRefreshing(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      const response = await fetch(
        `/api/organizations/invitations/${invitationId}/accept`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        // Recargar para re-ejecutar middleware y verificar nuevo estado
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Error al aceptar la invitación');
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      const response = await fetch(
        `/api/organizations/invitations/${invitationId}/reject`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        // Recargar para actualizar lista de invitaciones
        window.location.reload();
      }
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    } finally {
      setProcessingInvitation(null);
    }
  };

  const { title, description } = getStatusMessage();

  return (
    <div className="min-h-screen grid-pattern-white bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="glassmorphic border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-full">
                <Lock className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text-emerald mb-3">{title}</h1>
            <p className="text-gray-600 text-lg">{description}</p>
          </div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4" />
                <span>Invitaciones pendientes</span>
              </div>

              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {invitation.organization?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {invitation.invited_by?.full_name} te ha invitado a su equipo
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        disabled={processingInvitation === invitation.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {processingInvitation === invitation.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Aceptar
                      </button>

                      <button
                        onClick={() => handleRejectInvitation(invitation.id)}
                        disabled={processingInvitation === invitation.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-all duration-200"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {/* Primary Action - Ver Planes */}
            <button
              onClick={() => router.push('/subscription/plans')}
              className="group w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Ver planes y precios</span>
            </button>

            {/* Secondary Action - Refrescar */}
            <button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>{isRefreshing ? 'Verificando...' : 'Ya pagué - actualizar estado'}</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda?{' '}
              <a
                href="mailto:soporte@lexy.plus"
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
              >
                Contacta con soporte
              </a>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Powered by{' '}
            <span className="gradient-text-emerald font-semibold">Lexy</span> •
            Tu asistente legal con IA
          </p>
        </div>
      </div>
    </div>
  );
}
