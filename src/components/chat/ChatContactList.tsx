import React from 'react';
import { ChatContact } from '../../types/message';
import ContactAvatar from './ContactAvatar';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { sortContactsByLastMessage } from '../../utils/chatUtils';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ChatContactListProps {
  contacts: ChatContact[];
  selectedContact: ChatContact | null;
  onSelectContact: (contact: ChatContact) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (contactId: string) => void;
}

export default function ChatContactList({
  contacts,
  selectedContact,
  onSelectContact,
  onCreateConversation,
  onDeleteConversation,
}: ChatContactListProps) {
  const sortedContacts = sortContactsByLastMessage(contacts);

  return (
    <div className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
          <button
            onClick={onCreateConversation}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
            title="Nouvelle conversation"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedContacts.map((contact) => (
          <li
            key={contact.id}
            className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group ${
              selectedContact?.id === contact.id ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center p-4">
              <div className="flex-1" onClick={() => onSelectContact(contact)}>
                <div className="flex items-center">
                  <ContactAvatar contact={contact} size="small" />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                      {contact.lastMessage && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(contact.lastMessage.timestamp))}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          contact.role === 'tenant'
                            ? 'bg-blue-400'
                            : 'bg-purple-400'
                        }`} />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.role === 'tenant' ? 'Locataire' : 'Candidat'}
                        </p>
                      </div>
                      {contact.lastMessage?.unread && (
                        <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-indigo-600">
                          <span className="sr-only">Nouveau message</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contact.propertyName}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteConversation(contact.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Supprimer la conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}