import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { Notification } from '../types/notification';

const NOTIFICATIONS_STORAGE_KEY = 'izimo_notifications';
const MAX_NOTIFICATIONS = 50; // Limite le nombre de notifications stockées

export const notificationService = {
  getNotifications(): Notification[] {
    try {
      const notifications = storage.get(NOTIFICATIONS_STORAGE_KEY);
      return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  saveNotifications(notifications: Notification[]): void {
    try {
      // Garder seulement les MAX_NOTIFICATIONS plus récentes
      const sortedNotifications = notifications
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, MAX_NOTIFICATIONS);
      
      storage.set(NOTIFICATIONS_STORAGE_KEY, sortedNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  },

  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    try {
      const notifications = this.getNotifications();
      
      // Vérifier si une notification similaire existe déjà
      const existingSimilar = notifications.find(n => 
        n.userId === notification.userId &&
        n.type === notification.type &&
        n.title === notification.title &&
        !n.read &&
        (new Date().getTime() - new Date(n.createdAt).getTime()) < 300000 // 5 minutes
      );

      if (existingSimilar) {
        return existingSimilar;
      }

      const newNotification: Notification = {
        id: uuidv4(),
        ...notification,
        createdAt: new Date().toISOString(),
        read: false,
      };

      notifications.unshift(newNotification);
      this.saveNotifications(notifications);
      
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  getNotificationsByUser(userId: string): Notification[] {
    try {
      const notifications = this.getNotifications();
      return notifications.filter(notif => 
        notif.userId === userId || 
        notif.userId === (typeof userId === 'string' ? userId.toLowerCase() : userId)
      );
    } catch (error) {
      console.error('Error getting notifications by user:', error);
      return [];
    }
  },

  getUnreadCount(userId: string): number {
    try {
      return this.getNotificationsByUser(userId).filter(n => !n.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  markAsRead(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const notificationIndex = notifications.findIndex(notif => notif.id === notificationId);
      
      if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        this.saveNotifications(notifications);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead(userId: string): void {
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(notif => 
        (notif.userId === userId || notif.userId === userId.toLowerCase())
          ? { ...notif, read: true }
          : notif
      );
      this.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  deleteNotification(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const filteredNotifications = notifications.filter(notif => notif.id !== notificationId);
      this.saveNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  cleanupOldNotifications(maxAge: number = 30): void {
    try {
      const notifications = this.getNotifications();
      const now = new Date();
      const filteredNotifications = notifications.filter(notif => {
        const notifDate = new Date(notif.createdAt);
        const ageInDays = (now.getTime() - notifDate.getTime()) / (1000 * 60 * 60 * 24);
        return ageInDays <= maxAge || !notif.read;
      });
      this.saveNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
};