import React, { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
              focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              sm:text-sm resize-none"
            rows={3}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
            disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}