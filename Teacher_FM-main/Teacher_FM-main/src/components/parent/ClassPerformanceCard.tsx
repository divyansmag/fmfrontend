import React from 'react';
import type { TopPerformer } from '../../data/parentChildProgressData';

interface Props {
  childRank: number;
  classAverage: number;
  rankAboveAvgPercent: number;
  topPerformers: TopPerformer[];
}

export const ClassPerformanceCard: React.FC<Props> = ({
  childRank,
  classAverage,
  rankAboveAvgPercent,
  topPerformers,
}) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Class Performance
        </h3>

        {/* Position Highlight Box */}
        <div className="bg-[#eef2ff] dark:bg-[#1e1b4b]/40 border border-indigo-200/70 dark:border-indigo-900/50 rounded-xl p-4 flex items-center space-x-3.5 mb-5">
          <div className="w-11 h-11 rounded-full bg-[#0d52ce] text-white font-extrabold text-base flex items-center justify-center flex-shrink-0 shadow-xs">
            #{childRank}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-indigo-100 uppercase tracking-wide">
              Your Child's Position
            </h4>
            <p className="text-xs text-gray-700 dark:text-indigo-200/90 font-medium mt-0.5">
              Ananya is performing <strong className="text-[#0d52ce] dark:text-indigo-300">+{rankAboveAvgPercent}% above</strong> the class average of {classAverage}%.
            </p>
          </div>
        </div>

        {/* Top Performers Section */}
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase block mb-3">
            TOP PERFORMERS
          </span>

          <div className="space-y-3">
            {topPerformers.map((performer) => (
              <div
                key={performer.name}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-[#27272f] last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{performer.badge}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {performer.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {performer.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
