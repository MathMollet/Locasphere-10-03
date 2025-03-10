import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationPreferences as NotificationPrefsType } from '../../types/user';

interface NotificationPreferencesProps {
  preferences: NotificationPrefsType;
  onUpdate: (preferences: NotificationPrefsType) => void;
  disabled?: boolean;
}

export default function NotificationPreferences({
  preferences,
  onUpdate,
  disabled = false,
}: NotificationPreferencesProps) {
  const handleToggle = (key: keyof NotificationPrefsType) => {
    onUpdate({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-50 rounded-full">
            <Bell className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Préférences de notification
            </h2>
            <p className="text-sm text-gray-500">
              Gérez vos préférences de notification
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Notifications par email
              </p>
              <p className="text-sm text-gray-500">
                Recevez les notifications importantes par email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={() => handleToggle('email')}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Notifications push
              </p>
              <p className="text-sm text-gray-500">
                Recevez des notifications en temps réel dans votre navigateur
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.push}
                onChange={() => handleToggle('push')}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}