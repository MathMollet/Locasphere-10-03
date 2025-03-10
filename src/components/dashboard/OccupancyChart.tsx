import React from 'react';

interface OccupancyChartProps {
  data: {
    labels: string[];
    current: number[];
    projected: number[];
  };
}

export default function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <div className="relative h-[300px]">
      <div className="absolute inset-0">
        <div className="flex h-full">
          {data.labels.map((label, index) => (
            <div key={label} className="flex-1 flex flex-col justify-end">
              <div className="relative h-full flex items-end space-x-1">
                <div
                  className="w-4 bg-indigo-600 dark:bg-indigo-400 rounded-t"
                  style={{
                    height: `${data.current[index]}%`,
                  }}
                />
                {data.projected[index] && (
                  <div
                    className="w-4 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-t bg-transparent"
                    style={{
                      height: `${data.projected[index]}%`,
                    }}
                  />
                )}
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
            <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Actuel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-dashed border-indigo-300 dark:border-indigo-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Prévisionnel</span>
          </div>
        </div>
      </div>
    </div>
  );
}