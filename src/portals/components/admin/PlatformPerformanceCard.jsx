import React from 'react';






export const PlatformPerformanceCard = ({ metrics }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight">
          Platform Performance
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 mb-6">
          Monitor engagement and completion across the platform.
        </p>

        <div className="space-y-5">
          {metrics.map((item) =>
          <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                <span className="text-gray-800 dark:text-gray-200">{item.label}</span>
                <span className="text-gray-900 dark:text-white font-bold">{item.percentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                className="h-full bg-[#ff8a00] rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }} />
              
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};