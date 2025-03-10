import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigateToAccount = () => {
    navigate('/dashboard/account');
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
          </div>
        )}
        <span className="hidden md:block">{user.firstName} {user.lastName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 divide-y divide-gray-100 dark:divide-gray-700 z-[100]">
          <div className="px-4 py-3">
            <p className="text-sm dark:text-gray-200">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <button
              onClick={handleNavigateToAccount}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              <Settings className="h-4 w-4" />
              Mon compte
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}