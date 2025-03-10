import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Sélectionnez une conversation
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choisissez un contact pour commencer à discuter
        </p>
      </div>
    </div>
  );
}