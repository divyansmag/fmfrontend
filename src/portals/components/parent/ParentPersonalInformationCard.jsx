import React from 'react';
import { User } from 'lucide-react';






export const ParentPersonalInformationCard = ({ info }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <User className="w-5 h-5 text-[#0d52ce] stroke-[2.2]" />
            <h3 className="text-xl font-extrabold font-display tracking-tight">Personal Information</h3>
          </div>
          <button
            onClick={() => alert('Privacy settings: Parent data is encrypted and private.')}
            className="text-xs font-semibold text-[#0d52ce] dark:text-[#3b82f6] hover:underline cursor-pointer">
            
            Manage Privacy
          </button>
        </div>

        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              FULL NAME
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200/80 dark:border-slate-700/80 bg-[#f8fafc] dark:bg-slate-900/50 text-xs font-semibold text-gray-800 dark:text-gray-200">
              {info.name}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              EMAIL ADDRESS
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200/80 dark:border-slate-700/80 bg-[#f8fafc] dark:bg-slate-900/50 text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
              {info.email}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              PHONE
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200/80 dark:border-slate-700/80 bg-[#f8fafc] dark:bg-slate-900/50 text-xs font-semibold text-gray-800 dark:text-gray-200">
              {info.phone}
            </div>
          </div>

          {/* School */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              SCHOOL
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200/80 dark:border-slate-700/80 bg-[#f8fafc] dark:bg-slate-900/50 text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
              {info.school}
            </div>
          </div>
        </div>
      </div>
    </div>);

};