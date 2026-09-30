import React from 'react';
import { Camera, LogOut } from 'lucide-react';
import adminAvatar from '../../assets/avatars/admin.png';
import type { AdminSettingsInfo } from '../../data/adminSettingsData';

interface Props {
  info: AdminSettingsInfo;
  onSignOut: () => void;
}

export const AdminProfileSummaryCard: React.FC<Props> = ({
  info,
  onSignOut,
}) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transition-colors">
      {/* Left Avatar & Details */}
      <div className="flex items-center space-x-5">
        {/* Avatar Container with Camera Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-sm flex-shrink-0">
            <img
              src={adminAvatar}
              alt="System Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => alert('Change avatar feature clicked.')}
            title="Change Avatar"
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#ff8a00] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#e07900] transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Details */}
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {info.name}
            </h2>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 text-[11px] font-semibold text-[#ff8a00] dark:text-[#f97316]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a00] flex-shrink-0" />
              <span>{info.status}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            {info.organizationTitle}
          </p>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center space-x-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-[#27272f]">
        <button
          onClick={onSignOut}
          className="flex-1 sm:flex-none py-2 px-4 rounded-xl text-[#ff8a00] dark:text-[#f97316] font-semibold text-xs bg-amber-50/50 dark:bg-amber-950/40 border border-amber-500/60 dark:border-amber-900/60 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
