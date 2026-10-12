import React from 'react';
import studentAvatar from '../../assets/avatars/anaya_sharma.png';










export const ChildProfileSummaryCard = ({
  childName = 'Ananya Patel',
  gradeSchool = 'Grade 8 • Delhi Public School',
  status = 'On Track',
  lastActive = 'Today, 10:30 AM',
  showLastActive = false,
  showStatus = false
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
      {/* Left Details */}
      <div className="flex items-center space-x-4">
        {/* Child Avatar Box */}
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200/60 dark:border-gray-700">
          <img
            src={studentAvatar}
            alt={childName}
            className="w-full h-full object-cover" />
          
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight">
              {childName}
            </h2>

            {/* Status Badge (Optional) */}
            {showStatus &&
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>{status}</span>
              </span>
            }
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {gradeSchool}
          </p>
        </div>
      </div>

      {/* Right Last Active Info (Optional) */}
      {showLastActive &&
      <div className="text-left sm:text-right border-t sm:border-t-0 border-gray-100 dark:border-slate-700/80 pt-3 sm:pt-0 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase block">
            LAST ACTIVE
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5 block">
            {lastActive}
          </span>
        </div>
      }
    </div>);

};