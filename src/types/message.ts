import { Application } from './application';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  role: 'tenant' | 'applicant';
  propertyName: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    unread: boolean;
  };
}