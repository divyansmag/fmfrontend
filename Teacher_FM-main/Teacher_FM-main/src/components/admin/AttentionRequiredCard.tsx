import React from 'react';
import { UserCheck, FileText, Users } from 'lucide-react';
import type { PendingReviewItem } from '../../data/adminData';

interface Props {
  items: PendingReviewItem[];
}

export const AttentionRequiredCard: React.FC<Props> = ({ items }) => {
  const getIcon = (type: PendingReviewItem['iconType']) => {
    switch (type) {
      case 'user':
        return <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-500" />;
      case 'file':
        return <FileText className="w-5 h-5 text-amber-600 dark:text-amber-500" />;
      case 'group':
        return <Users className="w-5 h-5 text-amber-600 dark:text-amber-500" />;
      default:
        return <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Attention Required
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 mb-5">
          Administrative actions that may need your attention.
        </p>

        {/* 3 Compact Cards */}
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-gray-100 dark:border-[#27272f] bg-gray-50/50 dark:bg-[#121218] flex flex-col items-center text-center justify-between min-h-[130px]"
            >
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center mb-1">
                {getIcon(item.iconType)}
              </div>

              <div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {item.count}
                </div>
                <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                  {item.label}
                </div>
              </div>

              <button
                onClick={() => alert(`Reviewing ${item.label}...`)}
                className="text-xs font-bold text-[#ff8a00] dark:text-[#f97316] hover:underline cursor-pointer mt-2"
              >
                {item.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
