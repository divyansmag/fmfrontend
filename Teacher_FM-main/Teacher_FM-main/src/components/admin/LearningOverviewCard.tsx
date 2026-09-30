import React from 'react';
import { BookOpen, RefreshCw, ClipboardCheck, TrendingUp } from 'lucide-react';
import type { LearningOverviewStat } from '../../data/adminData';

interface Props {
  stats: LearningOverviewStat[];
}

export const LearningOverviewCard: React.FC<Props> = ({ stats }) => {
  const getIcon = (type: LearningOverviewStat['iconType'], colorClass: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className={`w-5 h-5 ${colorClass}`} />;
      case 'lesson':
        return <RefreshCw className={`w-5 h-5 ${colorClass}`} />;
      case 'assessment':
        return <ClipboardCheck className={`w-5 h-5 ${colorClass}`} />;
      case 'completion':
        return <TrendingUp className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <BookOpen className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Learning Overview
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 mb-6">
          Overall learning activity across the platform.
        </p>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-gray-100 dark:border-[#27272f] bg-gray-50/50 dark:bg-[#121218] flex items-center space-x-3.5"
            >
              <div className={`w-11 h-11 rounded-xl ${stat.colorBg} flex items-center justify-center flex-shrink-0`}>
                {getIcon(stat.iconType, stat.iconColor)}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
