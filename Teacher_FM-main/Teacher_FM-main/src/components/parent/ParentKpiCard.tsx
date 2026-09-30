import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ParentKpiCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  subValue?: React.ReactNode;
  label: string;
}

export const ParentKpiCard: React.FC<ParentKpiCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  subValue,
  label,
}) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
      {/* Top Icon */}
      <div className={`w-11 h-11 rounded-2xl ${iconBgColor} flex items-center justify-center flex-shrink-0 mb-4`}>
        <Icon className={`w-5 h-5 ${iconColor} stroke-[2.2]`} />
      </div>

      {/* Main Content */}
      <div>
        <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {value}
        </div>

        {subValue && (
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            {subValue}
          </div>
        )}

        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
};
