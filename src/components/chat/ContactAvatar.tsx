import React from 'react';
import { ChatContact } from '../../types/message';

interface ContactAvatarProps {
  contact: ChatContact;
  size?: 'small' | 'medium';
}

export default function ContactAvatar({ contact, size = 'small' }: ContactAvatarProps) {
  const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-12 w-12',
  };

  const sizeClass = sizeClasses[size];

  if (contact.avatar) {
    return (
      <img
        src={contact.avatar}
        alt={contact.name}
        className={`${sizeClass} rounded-full`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center`}>
      <span className="text-gray-500 font-medium">
        {contact.name.charAt(0)}
      </span>
    </div>
  );
}