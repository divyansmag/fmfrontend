import React from 'react';
import type { PlatformProgressMetric } from '../../data/adminData';

interface Props {
  metrics: PlatformProgressMetric[];
}

export const PlatformPerformanceCard: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Platform Performance
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 mb-6">
          Monitor engagement and completion across the platform.
        </p>

        <div className="space-y-5">
          {metrics.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                <span className="text-gray-800 dark:text-gray-200">{item.label}</span>
                <span className="text-gray-900 dark:text-white font-bold">{item.percentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-[#ff8a00] rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
