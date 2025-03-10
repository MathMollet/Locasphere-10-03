import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Calculator } from 'lucide-react';

interface FinancialMetricsProps {
  metrics: {
    totalRevenue: number;
    expenses: number;
    netIncome: number;
    roi: number;
  };
}

export default function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="h-5 w-5 text-green-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Revenus totaux
          </h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {metrics.totalRevenue} €
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Charges
          </h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {metrics.expenses} €
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-5 w-5 text-blue-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Revenu net
          </h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {metrics.netIncome} €
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Rendement
          </h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {metrics.roi}%
        </p>
      </div>
    </div>
  );
}