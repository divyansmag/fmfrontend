import React from 'react';
import { CheckCircle2, FileText, PlayCircle } from 'lucide-react';
import type { ActivityItem } from '../../data/parentChildProgressData';

interface Props {
  activities: ActivityItem[];
}

export const RecentLearningActivityCard: React.FC<Props> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'quiz':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0d52ce] dark:text-[#3b82f6] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
        );
      case 'essay':
        return (
          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        );
      case 'video':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <PlayCircle className="w-5 h-5 stroke-[2]" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
          Recent Learning Activity
        </h3>

        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors border border-transparent hover:border-gray-100 dark:hover:border-[#27272f]"
            >
              <div className="flex items-start space-x-3.5">
                {getIcon(act.type)}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {act.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {act.details}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap ml-3">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
