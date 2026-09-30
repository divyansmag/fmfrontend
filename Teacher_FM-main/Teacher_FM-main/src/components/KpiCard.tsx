import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  label?: string;
  subLabel?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  label,
  subLabel,
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1a21] rounded-2xl p-6 border border-gray-100/80 dark:border-[#27272f] shadow-md dark:shadow-none shadow-purple-900/5 flex flex-col justify-between transition-colors duration-200 hover:shadow-lg hover:shadow-purple-900/10 min-h-[140px]">
      {/* Icon Circle */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBgColor}`}
      >
        <Icon className={`w-4.5 h-4.5 stroke-[2] ${iconColor}`} />
      </div>

      {/* Main Value & Labels */}
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
          {value}
        </div>
        {label && (
          <div className="text-xs text-gray-500 dark:text-[#a1a1aa] font-medium mt-1">
            {label}
          </div>
        )}
        {subLabel && (
          <div className="text-xs text-gray-500 dark:text-[#a1a1aa] font-medium mt-1">
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};
