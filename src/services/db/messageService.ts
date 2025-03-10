import db from '../../lib/db';
import { Message } from '../../types/message';

export const messageService = {
  createMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const stmt = db.prepare(`
      INSERT INTO messages (
        id, content, senderId, receiverId, read
      )
      VALUES (?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    stmt.run(
      id,
      message.content,
      message.senderId,
      message.receiverId,
      message.read ? 1 : 0
    );

    return { id, ...message, timestamp };
  },

  findMessagesBetweenUsers(userId1: string, userId2: string) {
    const stmt = db.prepare(`
      SELECT * FROM messages 
      WHERE (senderId = ? AND receiverId = ?) 
         OR (senderId = ? AND receiverId = ?)
      ORDER BY createdAt ASC
    `);
    
    return stmt.all(userId1, userId2, userId2, userId1);
  },

  markAsRead(messageId: string) {
    const stmt = db.prepare('UPDATE messages SET read = 1 WHERE id = ?');
    stmt.run(messageId);
  },

  getUnreadCount(userId: string) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM messages WHERE receiverId = ? AND read = 0');
    const result = stmt.get(userId);
    return result.count;
  }
};