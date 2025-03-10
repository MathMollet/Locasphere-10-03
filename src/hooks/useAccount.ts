import { useState } from 'react';
import { User } from '../types/user';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export function useAccount() {
  const { user: authUser, updateCurrentUser } = useAuth();
  const [user, setUser] = useState<User>(authUser || {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'owner',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const updateUser = (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Mettre à jour l'utilisateur dans le service
    userService.saveUser({
      ...updatedUser,
      password: (userService.findUserByEmail(updatedUser.email) as any)?.password || ''
    });

    // Mettre à jour l'utilisateur dans le contexte d'authentification
    updateCurrentUser(updatedUser);
  };

  const toggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const saveChanges = () => {
    setIsEditing(false);
  };

  return {
    user,
    isEditing,
    updateUser,
    toggleEdit,
    saveChanges
  };
}