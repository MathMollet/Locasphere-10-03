import { ChatContact, Message } from '../types/message';

export const generateContactId = (role: 'tenant' | 'applicant', id: string): string => {
  return `${role}_${id.replace(/^(tenant_|applicant_)/, '')}`;
};

export const sortContactsByLastMessage = (contacts: ChatContact[]): ChatContact[] => {
  return [...contacts].sort((a, b) => {
    const dateA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp) : new Date(0);
    const dateB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};

export const createNewMessage = (
  senderId: string,
  receiverId: string,
  content: string
): Message => {
  return {
    id: `msg_${Date.now()}`,
    senderId,
    receiverId,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    read: false,
  };
};

export const createNewContact = (
  id: string,
  name: string,
  role: 'tenant' | 'applicant',
  propertyName: string
): ChatContact => {
  return {
    id: generateContactId(role, id),
    name,
    role,
    propertyName,
    lastMessage: {
      content: '',
      timestamp: new Date().toISOString(),
      unread: false,
    },
  };
};