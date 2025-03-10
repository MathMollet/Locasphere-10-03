import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { authService, RegisterData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateCurrentUser: (userData: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const authenticatedUser = await authService.login(email, password);
    setUser(authenticatedUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (userData: RegisterData) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    return authService.changePassword(user.id, currentPassword, newPassword);
  };

  const updateCurrentUser = (userData: User) => {
    setUser(userData);
    authService.setCurrentUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      changePassword,
      updateCurrentUser,
      isLoading 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}