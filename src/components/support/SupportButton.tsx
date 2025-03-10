import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SupportButtonProps {
  onClick: () => void;
}

export default function SupportButton({ onClick }: SupportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title="Support"
    >
      <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    </button>
  );
}