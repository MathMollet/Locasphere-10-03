import { User, UserProfile } from '../types/user';
import { storage } from '../utils/storage';

export interface StoredUser extends User {
  password: string;
  profile?: UserProfile;
}

const USERS_STORAGE_KEY = 'izimo_users';

export const userService = {
  async getUsers(): Promise<StoredUser[]> {
    const users = await storage.get(USERS_STORAGE_KEY);
    return Array.isArray(users) ? users : [];
  },

  async saveUser(userData: StoredUser): Promise<void> {
    const users = await this.getUsers();
    const existingUserIndex = users.findIndex(u => u.email === userData.email);
    
    if (existingUserIndex >= 0) {
      // Fusionner les données existantes avec les nouvelles données
      users[existingUserIndex] = {
        ...users[existingUserIndex],
        ...userData,
        // Préserver le mot de passe existant
        password: users[existingUserIndex].password
      };
    } else {
      users.push(userData);
    }
    
    await storage.set(USERS_STORAGE_KEY, users);

    // Mettre à jour l'utilisateur courant si nécessaire
    const currentUser = await storage.get('izimo_current_user');
    if (currentUser && currentUser.email === userData.email) {
      const { password, ...userWithoutPassword } = userData;
      await storage.set('izimo_current_user', userWithoutPassword);
    }
  },

  async findUserByEmail(email: string): Promise<StoredUser | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async validateCredentials(email: string, password: string): Promise<StoredUser | null> {
    const user = await this.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const users = await this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1 || users[userIndex].password !== currentPassword) {
      return false;
    }
    
    users[userIndex].password = newPassword;
    await storage.set(USERS_STORAGE_KEY, users);
    return true;
  },

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
    const users = await this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return false;
    }
    
    users[userIndex].profile = {
      ...users[userIndex].profile,
      ...profile,
    };
    
    await storage.set(USERS_STORAGE_KEY, users);
    return true;
  }
};