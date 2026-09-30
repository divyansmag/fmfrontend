import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ProgressKpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor: string;
  valueColor?: string;
}

export const ProgressKpiCard: React.FC<ProgressKpiCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor,
  valueColor = 'text-gray-900 dark:text-[#f5f5f5]',
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1a21] rounded-2xl p-5 sm:p-6 border border-gray-200/80 dark:border-[#27272f] shadow-md dark:shadow-none shadow-purple-900/5 flex flex-col justify-between transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] tracking-wider uppercase">
          {label}
        </span>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>

      <div className="mt-4 flex items-baseline space-x-1.5">
        <span className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>
          {value}
        </span>
        {subValue && (
          <span className="text-xs font-bold text-[#15ab5d]">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};
