'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MessageSquare,
  Bell,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types/subscription.types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationsPanelProps {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationDelete: (id: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function NotificationsPanel({
  notifications,
  onNotificationRead,
  onNotificationDelete,
  onClose,
  isLoading = false,
}: NotificationsPanelProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getIconByType = (type: NotificationType) => {
    switch (type) {
      case 'organization_invite':
        return <Users className="w-5 h-5 text-emerald-600" />;
      case 'chat_share_invite':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'chat_message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleAcceptInvitation = async (notification: Notification) => {
    setProcessingId(notification.id);
    try {
      let endpoint = '';

      if (notification.type === 'organization_invite') {
        endpoint = `/api/organizations/invitations/${notification.related_id}/accept`;
      } else if (notification.type === 'chat_share_invite') {
        endpoint = `/api/chat-shares/${notification.related_id}/accept`;
      }

      const response = await fetch(endpoint, { method: 'POST' });

      if (response.ok) {
        onNotificationRead(notification.id);
        onClose();
        // Reload to update sidebar and access
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo aceptar la invitación'}`);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Error al aceptar la invitación');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectInvitation = async (notification: Notification) => {
    setProcessingId(notification.id);
    try {
      let endpoint = '';

      if (notification.type === 'organization_invite') {
        endpoint = `/api/organizations/invitations/${notification.related_id}/reject`;
      } else if (notification.type === 'chat_share_invite') {
        endpoint = `/api/chat-shares/${notification.related_id}/reject`;
      }

      const response = await fetch(endpoint, { method: 'POST' });

      if (response.ok) {
        onNotificationDelete(notification.id);
      }
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como leída
    if (!notification.is_read) {
      onNotificationRead(notification.id);
    }

    // Navegar si hay action_url
    if (notification.action_url) {
      router.push(notification.action_url);
      onClose();
    }
  };

  return (
    <div className="w-96 max-h-[600px] glassmorphic border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificaciones
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[520px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No hay notificaciones</p>
            <p className="text-sm text-gray-400">Te avisaremos cuando tengas algo nuevo</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? 'bg-emerald-50/50' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIconByType(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1.5" />
                      )}
                    </div>

                    {notification.message && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Action Buttons for Invitations */}
                        {(notification.type === 'organization_invite' ||
                          notification.type === 'chat_share_invite') && (
                          <>
                            <button
                              onClick={() => handleAcceptInvitation(notification)}
                              disabled={processingId === notification.id}
                              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              {processingId === notification.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Aceptar
                            </button>

                            <button
                              onClick={() => handleRejectInvitation(notification)}
                              disabled={processingId === notification.id}
                              className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Rechazar
                            </button>
                          </>
                        )}

                        {/* View Button for other types */}
                        {notification.type === 'chat_message' && notification.action_url && (
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Ver
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => onNotificationDelete(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
