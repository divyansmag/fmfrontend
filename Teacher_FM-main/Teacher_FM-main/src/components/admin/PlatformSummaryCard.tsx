import React from 'react';
import { Building2 } from 'lucide-react';
import type { AdminInfo } from '../../data/adminData';

interface Props {
  info: AdminInfo;
}

export const PlatformSummaryCard: React.FC<Props> = ({ info }) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-5 sm:p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
      {/* Left Details */}
      <div className="flex items-center space-x-4">
        {/* Building Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-500">
          <Building2 className="w-7 h-7 stroke-[2]" />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Platform Overview
            </h2>

            {/* Status Badge */}
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{info.status}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {info.platformName}
          </p>
        </div>
      </div>
    </div>
  );
};
