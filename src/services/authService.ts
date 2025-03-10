import { User, UserRole } from '../types/user';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const CURRENT_USER_KEY = 'izimo_current_user';
const USERS_STORAGE_KEY = 'izimo_users';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      return storage.get(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  setCurrentUser(user: User): void {
    try {
      storage.set(CURRENT_USER_KEY, user);
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  getUsers(): (User & { password: string })[] {
    try {
      const users = storage.get(USERS_STORAGE_KEY);
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  saveUsers(users: (User & { password: string })[]): void {
    try {
      storage.set(USERS_STORAGE_KEY, users);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  },

  login(email: string, password: string): User {
    // S'assurer que l'admin existe
    this.initializeDefaultAdmin();

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  },

  register(userData: RegisterData): User {
    const users = this.getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existingUser) {
      throw new Error('Un compte existe déjà avec cet email');
    }

    const newUser = {
      id: uuidv4(),
      ...userData,
      notificationPreferences: {
        email: true,
        push: true
      }
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    this.setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  },

  logout(): void {
    try {
      storage.remove(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  changePassword(userId: string, currentPassword: string, newPassword: string): boolean {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1 || users[userIndex].password !== currentPassword) {
        return false;
      }
      
      users[userIndex].password = newPassword;
      this.saveUsers(users);
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  initializeDefaultAdmin(): void {
    try {
      const users = this.getUsers();
      const adminEmail = 'admin@izimo.com';
      let adminUser = users.find(u => u.email === adminEmail);
      
      if (!adminUser) {
        adminUser = {
          id: uuidv4(),
          email: adminEmail,
          password: 'admin123',
          firstName: 'Stéphane',
          lastName: 'FARIGOULE',
          role: 'admin' as UserRole,
          notificationPreferences: {
            email: true,
            push: true
          }
        };
        users.push(adminUser);
        this.saveUsers(users);
      } else if (adminUser.role !== 'admin') {
        // S'assurer que l'utilisateur admin a bien le rôle admin
        adminUser.role = 'admin';
        this.saveUsers(users);
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
    }
  },

  resetAdminRole(): void {
    try {
      // Récupérer tous les utilisateurs
      const users = this.getUsers();
      
      // Trouver l'utilisateur admin
      const adminIndex = users.findIndex(u => u.email === 'admin@izimo.com');
      
      if (adminIndex !== -1) {
        // Mettre à jour le rôle
        users[adminIndex].role = 'admin';
        
        // Sauvegarder les modifications
        this.saveUsers(users);
        
        // Mettre à jour l'utilisateur courant si c'est l'admin
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === 'admin@izimo.com') {
          const { password: _, ...adminWithoutPassword } = users[adminIndex];
          this.setCurrentUser(adminWithoutPassword);
        }
      }
    } catch (error) {
      console.error('Error resetting admin role:', error);
    }
  }
};

// Réinitialiser le rôle admin au chargement du service
authService.resetAdminRole();