import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessBannerProps {
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function SuccessBanner({ message, onClose, autoHideDuration = 3000 }: SuccessBannerProps) {
  useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-green-50 dark:bg-green-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-300" />
            <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-200">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 flex p-0.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span className="sr-only">Fermer</span>
            <X className="h-5 w-5 text-green-500 dark:text-green-400" />
          </button>
        </div>
      </div>
    </div>
  );
}