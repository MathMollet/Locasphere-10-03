import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  };
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <action.icon className="h-5 w-5" />
          {action.label}
        </button>
      )}
    </div>
  );
}