import React from 'react';
import { User } from 'lucide-react';
import type { AdminSettingsInfo } from '../../data/adminSettingsData';

interface Props {
  info: AdminSettingsInfo;
}

export const AdminPersonalInformationCard: React.FC<Props> = ({ info }) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs transition-colors flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2.5">
            <User className="w-5 h-5 text-[#ff8a00] dark:text-[#f97316] stroke-[2.2]" />
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
              Personal Information
            </h3>
          </div>

          <button
            onClick={() => alert('Opening Privacy & Security settings...')}
            className="text-xs font-semibold text-[#ff8a00] dark:text-[#f97316] hover:underline cursor-pointer"
          >
            Manage Privacy
          </button>
        </div>

        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FULL NAME */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1">
              FULL NAME
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-[#fdfcf9] dark:bg-[#121218] text-sm font-semibold text-gray-900 dark:text-white">
              {info.name}
            </div>
          </div>

          {/* EMAIL ADDRESS */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1">
              EMAIL ADDRESS
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-[#fdfcf9] dark:bg-[#121218] text-sm font-semibold text-gray-900 dark:text-white truncate">
              {info.email}
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1">
              PHONE
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-[#fdfcf9] dark:bg-[#121218] text-sm font-semibold text-gray-900 dark:text-white">
              {info.phone}
            </div>
          </div>

          {/* ORGANIZATION */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-1">
              ORGANIZATION
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-[#fdfcf9] dark:bg-[#121218] text-sm font-semibold text-gray-900 dark:text-white truncate">
              {info.organization}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
