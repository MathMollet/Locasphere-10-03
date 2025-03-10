import React from 'react';
import { Message } from '../../types/message';
import { formatMessageTime } from '../../utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
  isOwner: boolean;
}

export default function MessageBubble({ message, isOwner }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwner
            ? 'bg-indigo-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwner ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formatMessageTime(new Date(message.timestamp))}
        </p>
      </div>
    </div>
  );
}