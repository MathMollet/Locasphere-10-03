import React from 'react';
import { AlertTriangle, FileWarning, Calendar } from 'lucide-react';

interface Alert {
  id: string;
  type: 'payment' | 'document' | 'contract';
  message: string;
}

interface AlertsListProps {
  alerts: Alert[];
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'payment':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'document':
        return <FileWarning className="h-5 w-5 text-yellow-500" />;
      case 'contract':
        return <Calendar className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
          {getAlertIcon(alert.type)}
          <p className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
        </div>
      ))}
    </div>
  );
}