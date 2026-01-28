'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Friend {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_sender: boolean;
  friend: {
    id: string;
    full_name: string;
    nick: string | null;
    avatar_url: string | null;
    email: string;
  };
  created_at: string;
}

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FriendsModal({ isOpen, onClose }: FriendsModalProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'search'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadFriends();
    }
  }, [isOpen]);

  const loadFriends = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar amigos aceptados
      const friendsRes = await fetch('/api/friends?status=accepted');
      if (!friendsRes.ok) throw new Error('Error al cargar amigos');
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friendships || []);

      // Cargar solicitudes pendientes
      const pendingRes = await fetch('/api/friends?status=pending');
      if (!pendingRes.ok) throw new Error('Error al cargar solicitudes');
      const pendingData = await pendingRes.json();
      setPendingRequests(pendingData.friendships || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (email: string) => {
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendEmail: email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar solicitud');
      }

      await loadFriends();
      setSearchQuery('');
      setSearchResults([]);
      alert('Solicitud de amistad enviada');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (!res.ok) throw new Error('Error al aceptar solicitud');

      await loadFriends();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (!res.ok) throw new Error('Error al rechazar solicitud');

      await loadFriends();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm('¿Seguro que deseas eliminar este amigo?')) return;

    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar amigo');

      await loadFriends();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // TODO: Implementar API de búsqueda de usuarios
      // Por ahora, solo permite agregar por email exacto
      setSearchResults([{ email: searchQuery }]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Amigos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Amigos ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Solicitudes ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Añadir amigo
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Tab: Amigos */}
              {activeTab === 'friends' && (
                <div className="space-y-3">
                  {friends.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No tienes amigos todavía. Envía solicitudes para empezar.
                    </p>
                  ) : (
                    friends.map((friendship) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                            {friendship.friend.full_name?.[0] || friendship.friend.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {friendship.friend.full_name || 'Usuario'}
                            </p>
                            <p className="text-sm text-gray-500">{friendship.friend.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFriend(friendship.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Solicitudes Pendientes */}
              {activeTab === 'pending' && (
                <div className="space-y-3">
                  {pendingRequests.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No tienes solicitudes pendientes.
                    </p>
                  ) : (
                    pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                            {request.friend.full_name?.[0] || request.friend.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {request.friend.full_name || 'Usuario'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.is_sender ? 'Solicitud enviada' : 'Solicitud recibida'}
                            </p>
                          </div>
                        </div>

                        {!request.is_sender && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              title="Aceptar"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              title="Rechazar"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Buscar/Añadir */}
              {activeTab === 'search' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Buscar por email..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Buscar
                    </button>
                  </div>

                  {searchQuery && (
                    <button
                      onClick={() => handleSendRequest(searchQuery)}
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <UserPlusIcon className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-600 font-medium">
                        Enviar solicitud a {searchQuery}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
