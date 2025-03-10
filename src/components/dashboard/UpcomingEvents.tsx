import React from 'react';
import { Calendar, Wrench, ClipboardList } from 'lucide-react';

interface Event {
  id: string;
  type: 'visit' | 'maintenance' | 'inventory';
  title: string;
  date: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'visit':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case 'inventory':
        return <ClipboardList className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
          {getEventIcon(event.type)}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}