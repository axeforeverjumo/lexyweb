'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';
import type { Notification } from '@/types/subscription.types';

interface NotificationBellProps {
  userId: string;
  className?: string;
}

export default function NotificationBell({ userId, className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/notifications?unread_only=true&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.total || 0);
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Refetch cuando se abre
      fetchUnreadCount();
    }
  };

  const handleNotificationRead = async (notificationId: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // API call
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert on error
      fetchUnreadCount();
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    // Optimistic update
    const notification = notifications.find((n) => n.id === notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    if (notification && !notification.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // API call
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Revert on error
      fetchUnreadCount();
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleTogglePanel}
        className={`relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200 ${className}`}
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full border-2 border-white shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Notifications Panel */}
          <div className="absolute right-0 top-full mt-2 z-50">
            <NotificationsPanel
              notifications={notifications}
              onNotificationRead={handleNotificationRead}
              onNotificationDelete={handleDeleteNotification}
              onClose={() => setIsOpen(false)}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}
