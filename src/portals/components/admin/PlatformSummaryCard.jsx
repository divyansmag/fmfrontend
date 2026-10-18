import React from 'react';
import { Building2, UserPlus } from 'lucide-react';
import { useNavigate } from '../../nav.jsx';

export const PlatformSummaryCard = ({ info }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
      {/* Left Details */}
      <div className="flex items-center space-x-4">
        {/* Building Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-500">
          <Building2 className="w-7 h-7 stroke-[2]" />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight">
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

      {/* Right Quick Action: Provision users */}
      <button
        onClick={() => navigate('/admin/users')}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff8a00] hover:bg-[#e67a00] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer transform active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        <span>Add Students & Teachers</span>
      </button>
    </div>
  );
};