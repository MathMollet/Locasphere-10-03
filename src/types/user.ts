import { LucideIcon } from 'lucide-react';

export type UserRole = 'admin' | 'owner' | 'tenant';

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  notificationPreferences?: NotificationPreferences;
  avatarUrl?: string;
}

export interface UserProfile {
  owner?: {
    companyName?: string;
    siret?: string;
  };
  tenant?: {
    currentAddress: string;
    currentEmployer?: string;
    monthlyIncome?: number;
    employmentContract?: 'cdi' | 'cdd' | 'interim' | 'other';
  };
  admin?: {
    accessLevel: 'full' | 'restricted';
    permissions: string[];
  };
}