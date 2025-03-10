import { execute } from '../../lib/db';
import { User, NotificationPreferences } from '../../types/user';
import { v4 as uuidv4 } from 'uuid';

export const userService = {
  async createUser(user: Omit<User, 'id'> & { password: string }): Promise<User> {
    const id = uuidv4();
    
    await execute(
      `INSERT INTO users (id, email, password, firstName, lastName, role, notificationPreferences)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.role,
        user.notificationPreferences ? JSON.stringify(user.notificationPreferences) : null
      ]
    );

    return { id, ...user };
  },

  async findUserByEmail(email: string) {
    const result = await execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return result.rows[0];
  },

  async findUserById(id: string) {
    const result = await execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return result.rows[0];
  },

  async updateNotificationPreferences(userId: string, preferences: NotificationPreferences) {
    await execute(
      `UPDATE users 
       SET notificationPreferences = ?
       WHERE id = ?`,
      [JSON.stringify(preferences), userId]
    );
  },

  async updatePassword(userId: string, newPassword: string) {
    await execute(
      `UPDATE users 
       SET password = ?
       WHERE id = ?`,
      [newPassword, userId]
    );
  }
};