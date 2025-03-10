import React from 'react';

interface RentChartProps {
  data: {
    labels: string[];
    expected: number[];
    received: number[];
  };
}

export default function RentChart({ data }: RentChartProps) {
  const maxValue = Math.max(...data.expected, ...data.received);
  const chartHeight = 200;

  return (
    <div className="relative h-[300px]">
      <div className="absolute inset-0">
        <div className="flex h-full">
          {data.labels.map((label, index) => (
            <div key={label} className="flex-1 flex flex-col justify-end">
              <div className="relative h-full flex items-end space-x-1">
                <div
                  className="w-4 bg-indigo-200 dark:bg-indigo-900/50 rounded-t"
                  style={{
                    height: `${(data.expected[index] / maxValue) * chartHeight}px`,
                  }}
                />
                <div
                  className="w-4 bg-indigo-600 dark:bg-indigo-400 rounded-t"
                  style={{
                    height: `${(data.received[index] / maxValue) * chartHeight}px`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="absolute top-0 right-0 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-200 dark:bg-indigo-900/50" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Attendu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Perçu</span>
          </div>
        </div>
      </div>
    </div>
  );
}