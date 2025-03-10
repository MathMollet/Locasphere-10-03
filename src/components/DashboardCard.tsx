import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function DashboardCard({ title, value, icon: Icon, trend }: DashboardCardProps) {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <span className={`text-sm ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}