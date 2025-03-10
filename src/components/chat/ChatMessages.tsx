import React, { useEffect, useRef } from 'react';
import { Message, ChatContact } from '../../types/message';
import MessageBubble from './MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  selectedContact: ChatContact;
}

export default function ChatMessages({ messages, selectedContact }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter messages for the selected contact
  const filteredMessages = messages.filter(
    message => 
      (message.senderId === selectedContact.id && message.receiverId === 'owner') ||
      (message.senderId === 'owner' && message.receiverId === selectedContact.id)
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      {filteredMessages.map((message) => (
        <MessageBubble
          key={`${message.id}_${message.senderId}`}
          message={message}
          isOwner={message.senderId === 'owner'}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}