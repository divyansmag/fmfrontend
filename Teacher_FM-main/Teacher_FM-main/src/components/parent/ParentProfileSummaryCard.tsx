import React from 'react';
import { Camera, LogOut } from 'lucide-react';
import parentAvatar from '../../assets/avatars/parent.png';

interface Props {
  name: string;
  status: string;
  organization: string;
  onSignOut: () => void;
}

export const ParentProfileSummaryCard: React.FC<Props> = ({
  name,
  status,
  organization,
  onSignOut,
}) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Avatar Container with Camera Badge */}
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 flex-shrink-0">
          <img src={parentAvatar} alt={name} className="w-full h-full object-cover" />
          <button
            onClick={() => alert('Change profile photo feature clicked.')}
            className="absolute bottom-0 right-0 w-6 h-6 bg-[#0d52ce] text-white rounded-tl-lg flex items-center justify-center cursor-pointer hover:bg-[#0b43aa] transition-colors"
            title="Change photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Details */}
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {name}
            </h2>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40 text-xs font-semibold text-[#0d52ce] dark:text-[#3b82f6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d52ce] dark:bg-[#3b82f6]" />
              <span>{status}</span>
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            {organization}
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          onClick={onSignOut}
          className="border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 py-1.5 px-3.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
