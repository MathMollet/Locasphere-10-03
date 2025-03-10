import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType } from '../../types/notification';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface NotificationPanelProps {
  onClose: () => void;
}

const notificationIcons: Record<NotificationType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const notificationColors: Record<NotificationType, string> = {
  info: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50',
  success: 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/50',
  warning: 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/50',
  error: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/50',
};

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notification: {
    id: string;
    read: boolean;
    link?: string;
  }) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
            >
              <Check className="h-4 w-4" />
              Tout marquer comme lu
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Aucune notification
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 ${
                    notification.link ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
                  } ${notification.read ? 'opacity-75' : ''}`}
                >
                  <div className="flex gap-4">
                    <div className={`p-2 rounded-full ${notificationColors[notification.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}