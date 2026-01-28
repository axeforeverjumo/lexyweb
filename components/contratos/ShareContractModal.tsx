'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Check, Clock, Trash2, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Collaborator {
  id: string;
  user_id: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected';
  invited_at: string;
  accepted_at?: string;
  profiles: {
    id: string;
    email: string;
    nombre?: string;
    apellidos?: string;
  };
}

interface ConversationParticipant {
  id: string;
  usuario_id: string;
  profiles: {
    id: string;
    email: string;
    nombre?: string;
    apellidos?: string;
  };
}

interface Friend {
  id: string;
  friend: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  status: 'accepted';
  is_sender: boolean;
}

interface ShareContractModalProps {
  contractId: string;
  conversacionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareContractModal({
  contractId,
  conversacionId,
  isOpen,
  onClose,
}: ShareContractModalProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'email' | 'chat'>('friends');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [conversationParticipants, setConversationParticipants] = useState<ConversationParticipant[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, contractId, conversacionId]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      // Cargar colaboradores actuales
      const collabResponse = await fetch(`/api/contracts/${contractId}/collaborators`);
      if (collabResponse.ok) {
        const data = await collabResponse.json();
        setCollaborators(data.collaborators || []);
      }

      // Cargar amigos
      const friendsResponse = await fetch('/api/friends?status=accepted');
      if (friendsResponse.ok) {
        const data = await friendsResponse.json();
        setFriends(data.friendships || []);
      }

      // Cargar participantes de la conversación si existe
      if (conversacionId) {
        const participantsResponse = await fetch(`/api/conversaciones/${conversacionId}/participants`);
        if (participantsResponse.ok) {
          const data = await participantsResponse.json();
          setConversationParticipants(data.participants || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedUserId && !emailInput.trim()) {
      setError('Selecciona un usuario o introduce un email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let userIdToInvite = selectedUserId;

      // Si se introdujo un email, buscar el usuario
      if (!selectedUserId && emailInput.trim()) {
        const searchResponse = await fetch(`/api/users/search?email=${encodeURIComponent(emailInput.trim())}`);
        if (!searchResponse.ok) {
          setError('Usuario no encontrado con ese email');
          setIsLoading(false);
          return;
        }
        const userData = await searchResponse.json();
        userIdToInvite = userData.user.id;
      }

      // Invitar usuario
      const response = await fetch(`/api/contracts/${contractId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userIdToInvite,
          role: 'editor',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al enviar invitación');
        setIsLoading(false);
        return;
      }

      // Recargar colaboradores
      await loadData();
      setSelectedUserId('');
      setEmailInput('');
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      setError(error.message || 'Error al enviar invitación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('¿Eliminar este colaborador?')) return;

    try {
      const response = await fetch(`/api/contracts/${contractId}/collaborators/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar colaborador');
      }

      await loadData();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      alert('Error al eliminar colaborador');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <Check className="w-3 h-3" />
            Aceptado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  const availableParticipants = conversationParticipants.filter(
    (p) => !collaborators.some((c) => c.user_id === p.usuario_id)
  );

  const acceptedCollaborators = collaborators.filter((c) => c.status === 'accepted');
  const maxReached = acceptedCollaborators.length >= 3;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Compartir Contrato
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Máximo 3 colaboradores ({acceptedCollaborators.length}/3)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Amigos ({friends.filter(f => !collaborators.some(c => c.user_id === f.friend.id)).length})
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'email'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Por email
          </button>
          {conversacionId && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Desde chat ({availableParticipants.length})
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : (
            <>
              {maxReached && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Has alcanzado el límite de 3 colaboradores. Elimina uno para invitar a otro.
                  </p>
                </div>
              )}

              {/* Tab: Amigos */}
              {activeTab === 'friends' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Invitar Amigos
                  </h3>

                  {friends.filter(f => !collaborators.some(c => c.user_id === f.friend.id)).length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-600">
                        Todos tus amigos ya son colaboradores o no tienes amigos añadidos.
                      </p>
                    </div>
                  ) : (
                    friends
                      .filter(f => !collaborators.some(c => c.user_id === f.friend.id))
                      .map((friendship) => (
                        <div
                          key={friendship.id}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {friendship.friend.full_name?.[0] || friendship.friend.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {friendship.friend.full_name || 'Usuario'}
                              </p>
                              <p className="text-xs text-slate-600">{friendship.friend.email}</p>
                            </div>
                          </div>
                          <Button
                            onClick={async () => {
                              setIsLoading(true);
                              try {
                                const response = await fetch(`/api/contracts/${contractId}/collaborators`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    userId: friendship.friend.id,
                                    role: 'editor',
                                  }),
                                });

                                if (!response.ok) {
                                  const data = await response.json();
                                  throw new Error(data.error);
                                }

                                await loadData();
                              } catch (error: any) {
                                alert(error.message || 'Error al invitar');
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                            disabled={isLoading || maxReached}
                            size="sm"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Invitar
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* Tab: Por Email */}
              {activeTab === 'email' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Invitar por Email
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email del colaborador
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setError('');
                      }}
                      placeholder="ejemplo@email.com"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleInvite}
                    disabled={isLoading || !emailInput.trim() || maxReached}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando invitación...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Enviar invitación
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Tab: Desde Chat */}
              {activeTab === 'chat' && conversacionId && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Participantes del Chat
                  </h3>

                  {availableParticipants.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-600">
                        Todos los participantes del chat ya son colaboradores.
                      </p>
                    </div>
                  ) : (
                    availableParticipants.map((participant) => (
                      <div
                        key={participant.usuario_id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {participant.profiles.nombre?.[0] || participant.profiles.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {participant.profiles.nombre || 'Usuario'}
                              {participant.profiles.apellidos && ` ${participant.profiles.apellidos}`}
                            </p>
                            <p className="text-xs text-slate-600">{participant.profiles.email}</p>
                          </div>
                        </div>
                        <Button
                          onClick={async () => {
                            setIsLoading(true);
                            try {
                              const response = await fetch(`/api/contracts/${contractId}/collaborators`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  userId: participant.usuario_id,
                                  role: 'editor',
                                }),
                              });

                              if (!response.ok) {
                                const data = await response.json();
                                throw new Error(data.error);
                              }

                              await loadData();
                            } catch (error: any) {
                              alert(error.message || 'Error al invitar');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={isLoading || maxReached}
                          size="sm"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Invitar
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Lista de colaboradores actuales (común a todos los tabs) */}
              {collaborators.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Colaboradores Actuales
                  </h3>
                  <div className="space-y-2">
                    {collaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {collab.profiles.nombre?.charAt(0) || collab.profiles.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {collab.profiles.nombre || collab.profiles.email}
                              {collab.profiles.apellidos && ` ${collab.profiles.apellidos}`}
                            </p>
                            <p className="text-xs text-slate-600">{collab.profiles.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(collab.status)}
                          <button
                            onClick={() => handleRemoveCollaborator(collab.user_id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Eliminar colaborador"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
