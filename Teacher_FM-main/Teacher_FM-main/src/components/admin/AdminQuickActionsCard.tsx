import React from 'react';
import { UserPlus, PlusCircle, BookPlus, FileSpreadsheet } from 'lucide-react';

export const AdminQuickActionsCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
          Quick Actions
        </h3>

        <div className="space-y-3">
          {/* Action 1: Add Student */}
          <button
            onClick={() => alert('Opening Add Student modal...')}
            className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm bg-[#ff8a00] hover:bg-[#e07900] transition-colors shadow-sm shadow-amber-500/20 cursor-pointer flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4 stroke-[2.2]" />
            <span>+ Add Student</span>
          </button>

          {/* Action 2: Add Teacher */}
          <button
            onClick={() => alert('Opening Add Teacher modal...')}
            className="w-full py-2.5 px-4 rounded-xl text-[#ff8a00] dark:text-[#f97316] font-semibold text-xs sm:text-sm bg-white dark:bg-[#101014] border border-[#ff8a00] dark:border-[#f97316] hover:bg-amber-50 dark:hover:bg-[#1f1a14] transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Add Teacher</span>
          </button>

          {/* Action 3: Create Course */}
          <button
            onClick={() => alert('Opening Create Course modal...')}
            className="w-full py-2.5 px-4 rounded-xl text-[#ff8a00] dark:text-[#f97316] font-semibold text-xs sm:text-sm bg-white dark:bg-[#101014] border border-[#ff8a00] dark:border-[#f97316] hover:bg-amber-50 dark:hover:bg-[#1f1a14] transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <BookPlus className="w-4 h-4 stroke-[2.2]" />
            <span>Create Course</span>
          </button>

          {/* Action 4: Generate Report */}
          <button
            onClick={() => alert('Generating platform analytics report...')}
            className="w-full py-2.5 px-4 rounded-xl text-[#ff8a00] dark:text-[#f97316] font-semibold text-xs sm:text-sm bg-white dark:bg-[#101014] border border-[#ff8a00] dark:border-[#f97316] hover:bg-amber-50 dark:hover:bg-[#1f1a14] transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
