import { LucideIcon } from 'lucide-react';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'template';
  category: 'legal' | 'fiscal' | 'insurance' | 'templates';
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}