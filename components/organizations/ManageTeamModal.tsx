'use client';

import { useState } from 'react';
import { X, Users, Crown, UserPlus, Trash2, AlertCircle } from 'lucide-react';
import type { Organization, Profile } from '@/types/subscription.types';
import { getPlanByTier } from '@/types/subscription.types';
import InviteUserModal from './InviteUserModal';

interface ManageTeamModalProps {
  organization: Organization;
  members: Profile[];
  currentUserId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ManageTeamModal({
  organization,
  members,
  currentUserId,
  onClose,
  onUpdate,
}: ManageTeamModalProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const plan = getPlanByTier(organization.subscription_tier);
  const isOwner = organization.owner_id === currentUserId;
  const currentMembers = members.length;
  const availableSlots = organization.max_users - currentMembers;

  const handleRemoveMember = async (memberId: string) => {
    if (!isOwner || memberId === organization.owner_id) return;

    if (
      !confirm(
        '¿Estás seguro de eliminar este miembro del equipo? Perderá acceso inmediatamente.'
      )
    ) {
      return;
    }

    setRemovingMemberId(memberId);
    try {
      const response = await fetch(`/api/organizations/${organization.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Error al eliminar el miembro');
    } finally {
      setRemovingMemberId(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl glassmorphic border border-gray-200 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{organization.name}</h2>
                <p className="text-emerald-100 text-sm">
                  Plan {plan?.name} • {currentMembers}/{organization.max_users} usuarios
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Invite Section */}
            {isOwner && availableSlots > 0 && (
              <div className="mb-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Invita a tu equipo
                    </p>
                    <p className="text-sm text-gray-600">
                      Tienes {availableSlots} {availableSlots === 1 ? 'espacio disponible' : 'espacios disponibles'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invitar
                  </button>
                </div>
              </div>
            )}

            {/* No Slots Warning */}
            {isOwner && availableSlots === 0 && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">
                    Límite de usuarios alcanzado
                  </p>
                  <p className="text-sm text-amber-700">
                    Actualiza tu plan para invitar a más miembros
                  </p>
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Miembros del Equipo
              </h3>

              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:border-emerald-200 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.full_name || 'Avatar'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {(member.full_name || member.email)?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">
                        {member.full_name || member.email}
                      </p>
                      {member.id === organization.owner_id && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full">
                          <Crown className="w-3 h-3" />
                          Owner
                        </span>
                      )}
                      {member.id === currentUserId && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          Tú
                        </span>
                      )}
                    </div>
                    {member.nick && (
                      <p className="text-sm text-gray-500">@{member.nick}</p>
                    )}
                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                  </div>

                  {/* Actions */}
                  {isOwner && member.id !== organization.owner_id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removingMemberId === member.id}
                      className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar miembro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Nested Invite Modal */}
      {showInviteModal && (
        <InviteUserModal
          organizationId={organization.id}
          organizationName={organization.name}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            onUpdate?.();
          }}
        />
      )}
    </>
  );
}
