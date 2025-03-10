import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface PropertyRentSummaryProps {
  name: string;
  expectedRent: number;
  receivedRent: number;
  difference: number;
}

export default function PropertyRentSummary({
  name,
  expectedRent,
  receivedRent,
  difference,
}: PropertyRentSummaryProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{name}</h3>
        <div className="mt-1 flex items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Attendu: {expectedRent} €
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Perçu: {receivedRent} €
          </p>
        </div>
      </div>
      <div className={`flex items-center gap-1 ${
        difference > 0
          ? 'text-green-600 dark:text-green-400'
          : difference < 0
          ? 'text-red-600 dark:text-red-400'
          : 'text-gray-600 dark:text-gray-400'
      }`}>
        {difference > 0 ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : difference < 0 ? (
          <ArrowDownRight className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {Math.abs(difference)} €
        </span>
      </div>
    </div>
  );
}