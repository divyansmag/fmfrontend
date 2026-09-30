import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AdminKpiCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  growth: number;
  label: string;
}

export const AdminKpiCard: React.FC<AdminKpiCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  growth,
  label,
}) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
      {/* Top Icon Circle */}
      <div className={`w-11 h-11 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0 mb-4`}>
        <Icon className={`w-5 h-5 ${iconColor} stroke-[2.2]`} />
      </div>

      {/* Main Content */}
      <div>
        <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center space-x-1">
          <span>↑{growth}%</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">this month</span>
        </div>

        <div className="text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mt-1">
          {label}
        </div>
      </div>
    </div>
  );
};
