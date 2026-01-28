'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Share2, Search, Loader2, CheckCircle, UserPlus, Users, AlertTriangle } from 'lucide-react';
import type { Profile, ConversacionParticipant } from '@/types/subscription.types';

interface ShareChatModalProps {
  conversacionId: string;
  conversacionTitle: string;
  currentShares: ConversacionParticipant[];
  maxShares?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ShareChatModal({
  conversacionId,
  conversacionTitle,
  currentShares,
  maxShares = 3,
  onClose,
  onSuccess,
}: ShareChatModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const currentShareCount = currentShares.length;
  const availableSlots = maxShares - currentShareCount;
  const isMaxReached = availableSlots <= 0;

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
          // Filtrar usuarios que ya tienen acceso
          const sharedUserIds = currentShares.map((share) => share.user_id);
          const filteredResults = (data.users || []).filter(
            (user: Profile) => !sharedUserIds.includes(user.id)
          );
          setSearchResults(filteredResults);
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
  }, [searchTerm, currentShares]);

  const handleShareWithUser = async (nick: string) => {
    if (isMaxReached) {
      setError('Has alcanzado el límite máximo de 3 usuarios compartidos');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      const response = await fetch(`/api/conversaciones/${conversacionId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick }),
      });

      if (response.ok) {
        setShareSuccess(true);
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al compartir el chat');
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
      setError('Error al compartir el chat');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glassmorphic border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Compartir Chat
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-emerald-100 text-sm truncate">{conversacionTitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {shareSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Chat compartido!
              </h3>
              <p className="text-sm text-gray-600">
                El usuario recibirá una notificación con tu invitación
              </p>
            </div>
          ) : (
            <>
              {/* Current Shares Info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Colaboradores: {currentShareCount}/{maxShares}
                    </p>
                    <p className="text-sm text-gray-600">
                      {availableSlots > 0
                        ? `Puedes invitar hasta ${availableSlots} ${availableSlots === 1 ? 'colaborador' : 'colaboradores'} más`
                        : 'Has alcanzado el límite de colaboradores'}
                    </p>
                  </div>
                </div>

                {/* Current Shares List */}
                {currentShares.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200 space-y-2">
                    {currentShares.map((share) => (
                      <div key={share.user_id} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          {share.user?.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-gray-700">
                          {share.user?.full_name || share.user?.email}
                          {share.user?.nick && (
                            <span className="text-gray-500"> (@{share.user.nick})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Max Reached Warning */}
              {isMaxReached && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">
                      Límite alcanzado
                    </p>
                    <p className="text-sm text-amber-700">
                      No puedes invitar a más colaboradores. Elimina uno existente para agregar otro.
                    </p>
                  </div>
                </div>
              )}

              {/* Search Input */}
              {!isMaxReached && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar usuario por nick
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ej: maria_abogada"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      autoFocus
                      disabled={isMaxReached}
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 animate-spin" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Escribe al menos 2 caracteres para buscar
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Search Results */}
              {!isMaxReached && searchResults.length > 0 && (
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

                      {/* Share Button */}
                      <button
                        onClick={() => user.nick && handleShareWithUser(user.nick)}
                        disabled={isSharing || !user.nick || isMaxReached}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        {isSharing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Compartir
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isMaxReached && searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
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
        {!shareSuccess && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
