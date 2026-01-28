'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import type { Profile } from '@/types/subscription.types';

interface InviteUserModalProps {
  organizationId: string;
  organizationName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InviteUserModal({
  organizationId,
  organizationName,
  onClose,
  onSuccess,
}: InviteUserModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/users/search?nick=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleInviteUser = async (nick: string) => {
    setIsInviting(true);
    setError(null);

    try {
      const response = await fetch(`/api/organizations/${organizationId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick }),
      });

      if (response.ok) {
        setInviteSuccess(true);
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al enviar la invitación');
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      setError('Error al enviar la invitación');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-md glassmorphic border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invitar Usuario
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-emerald-100 text-sm">{organizationName}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {inviteSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Invitación enviada!
              </h3>
              <p className="text-sm text-gray-600">
                El usuario recibirá una notificación con tu invitación
              </p>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por nick de usuario
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej: juan_abogado"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 animate-spin" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Escribe al menos 2 caracteres para buscar
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Resultados
                  </p>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || 'Avatar'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                            {(user.full_name || user.email)?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500">@{user.nick}</p>
                      </div>

                      {/* Invite Button */}
                      <button
                        onClick={() => user.nick && handleInviteUser(user.nick)}
                        disabled={isInviting || !user.nick}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invitar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    No se encontraron usuarios con ese nick
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!inviteSuccess && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
