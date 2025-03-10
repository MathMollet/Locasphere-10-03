import { useState, useCallback } from 'react';
import { Message, ChatContact } from '../types/message';
import { createNewMessage, createNewContact, generateContactId } from '../utils/chatUtils';

const initialContacts: ChatContact[] = [
  {
    id: 'tenant_1',
    name: 'Marie Lambert',
    role: 'tenant',
    propertyName: 'Appartement Centre Ville',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=128&h=128&q=80',
    lastMessage: {
      content: 'D\'accord, je vous envoie ça ce soir.',
      timestamp: '2024-03-15T14:30:00Z',
      unread: true,
    },
  },
  {
    id: 'tenant_2',
    name: 'Thomas Martin',
    role: 'tenant',
    propertyName: 'Maison Bordeaux',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=128&h=128&q=80',
    lastMessage: {
      content: 'Merci pour l\'intervention rapide !',
      timestamp: '2024-03-14T09:15:00Z',
      unread: false,
    },
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    senderId: 'tenant_1',
    receiverId: 'owner',
    content: 'Bonjour, j\'ai une question concernant les charges.',
    timestamp: '2024-03-15T14:25:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: 'owner',
    receiverId: 'tenant_1',
    content: 'Bien sûr, je vous écoute.',
    timestamp: '2024-03-15T14:28:00Z',
    read: true,
  },
];

export function useChat() {
  const [contacts, setContacts] = useState<ChatContact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const createOrGetContactForApplicant = useCallback((applicantId: string, name: string, propertyName: string) => {
    const contactId = generateContactId('applicant', applicantId);
    const existingContact = contacts.find(c => c.id === contactId);
    
    if (existingContact) {
      return existingContact;
    }

    const newContact = createNewContact(applicantId, name, 'applicant', propertyName);
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, [contacts]);

  const createConversation = useCallback((contactId: string, name: string, propertyName: string, role: 'tenant' | 'applicant') => {
    const uniqueContactId = generateContactId(role, contactId);
    const existingContact = contacts.find(c => c.id === uniqueContactId);
    
    if (!existingContact) {
      const newContact = createNewContact(contactId, name, role, propertyName);
      setContacts(prev => [...prev, newContact]);
      setSelectedContact(newContact);
    } else {
      setSelectedContact(existingContact);
    }
    
    setIsCreateModalOpen(false);
  }, [contacts]);

  const deleteConversation = useCallback((contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
    if (selectedContact?.id === contactId) {
      setSelectedContact(null);
    }
    setMessages(prev => prev.filter(
      message => message.senderId !== contactId && message.receiverId !== contactId
    ));
  }, [selectedContact]);

  const sendMessage = useCallback((content: string) => {
    if (!selectedContact || !content.trim()) return;

    const newMsg = createNewMessage('owner', selectedContact.id, content);
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    setContacts(prev =>
      prev.map(contact =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              lastMessage: {
                content: content.trim(),
                timestamp: new Date().toISOString(),
                unread: false,
              },
            }
          : contact
      )
    );
  }, [selectedContact]);

  return {
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    createOrGetContactForApplicant,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createConversation,
    deleteConversation,
  };
}