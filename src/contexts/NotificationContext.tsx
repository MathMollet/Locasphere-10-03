import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications au montage et à chaque changement d'utilisateur
  useEffect(() => {
    if (user) {
      const loadNotifications = () => {
        try {
          const userNotifications = notificationService.getNotificationsByUser(user.email);
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => !n.read).length);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      };

      loadNotifications();
      const interval = setInterval(loadNotifications, 5000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const newNotification = notificationService.createNotification(notification);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = (id: string) => {
    try {
      notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    if (!user) return;
    try {
      notificationService.markAllAsRead(user.email);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = (id: string) => {
    try {
      notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setUnreadCount(prev => 
        notifications.find(n => n.id === id)?.read ? prev : Math.max(0, prev - 1)
      );
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}