import React from 'react';
import { ChatContact } from '../../types/message';
import ContactAvatar from './ContactAvatar';
import { Building2, User } from 'lucide-react';

interface ChatHeaderProps {
  contact: ChatContact;
}

export default function ChatHeader({ contact }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <ContactAvatar contact={contact} size="medium" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {contact.name}
            </h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              contact.role === 'tenant'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400'
            }`}>
              {contact.role === 'tenant' ? 'Locataire' : 'Candidat'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Building2 className="h-4 w-4" />
            <p className="text-sm">{contact.propertyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}