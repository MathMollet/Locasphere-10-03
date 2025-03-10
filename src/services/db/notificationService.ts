import db from '../../lib/db';
import { Notification } from '../../types/notification';

export const notificationService = {
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const stmt = db.prepare(`
      INSERT INTO notifications (
        id, type, title, message, link, userId
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    stmt.run(
      id,
      notification.type,
      notification.title,
      notification.message,
      notification.link,
      notification.userId
    );

    return {
      id,
      ...notification,
      createdAt: new Date().toISOString(),
      read: false
    };
  },

  findNotificationsByUser(userId: string) {
    const stmt = db.prepare('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC');
    return stmt.all(userId);
  },

  markAsRead(notificationId: string) {
    const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE id = ?');
    stmt.run(notificationId);
  },

  markAllAsRead(userId: string) {
    const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE userId = ?');
    stmt.run(userId);
  },

  deleteNotification(notificationId: string) {
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    stmt.run(notificationId);
  }
};