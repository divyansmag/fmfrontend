import React from 'react';
import { User, GraduationCap, CheckCircle2, BookOpen } from 'lucide-react';
import type { RecentActivityItem } from '../../data/adminData';

interface Props {
  activities: RecentActivityItem[];
}

export const AdminRecentActivityCard: React.FC<Props> = ({ activities }) => {
  const getIcon = (type: RecentActivityItem['iconType']) => {
    switch (type) {
      case 'teacher':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 stroke-[2]" />
          </div>
        );
      case 'student':
        return (
          <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/60 text-[#ff8a00] dark:text-[#f97316] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2]" />
          </div>
        );
      case 'parent':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
        );
      case 'course':
        return (
          <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-500 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Recent Activity
          </h3>
          <button
            onClick={() => alert('Viewing all recent platform activities...')}
            className="text-xs font-semibold text-[#ff8a00] dark:text-[#f97316] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All</span>
            <span>→</span>
          </button>
        </div>

        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start space-x-3.5 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors border border-transparent hover:border-gray-100 dark:hover:border-[#27272f]"
            >
              {getIcon(act.iconType)}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {act.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {act.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
