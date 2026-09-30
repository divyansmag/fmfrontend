import React from 'react';
import { User } from 'lucide-react';

export const PersonalInformation: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1a1a21] rounded-2xl p-6 border border-gray-200/80 dark:border-[#27272f] shadow-md dark:shadow-none shadow-purple-900/5 transition-colors">
      {/* Card Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200/70 dark:border-[#27272f] mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-4.5 h-4.5 text-[#15ab5d]" />
          <h3 className="text-base font-bold text-gray-900 dark:text-[#f5f5f5]">
            Personal Information
          </h3>
        </div>
        <button
          onClick={() => alert('Privacy preferences manager opening...')}
          className="text-xs font-semibold text-[#15ab5d] hover:underline cursor-pointer"
        >
          Manage Privacy
        </button>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-wider mb-1.5">
            FULL NAME
          </label>
          <input
            type="text"
            readOnly
            value="Anaya Sharma"
            className="w-full bg-purple-50/40 dark:bg-[#0d0d12] border border-gray-200 dark:border-[#27272f] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-[#f5f5f5] font-medium focus:outline-none"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-wider mb-1.5">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            readOnly
            value="anaya@futureminds.demo"
            className="w-full bg-purple-50/40 dark:bg-[#0d0d12] border border-gray-200 dark:border-[#27272f] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-[#f5f5f5] font-medium focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-wider mb-1.5">
            PHONE
          </label>
          <input
            type="text"
            readOnly
            value="+91 98765 43210"
            className="w-full bg-purple-50/40 dark:bg-[#0d0d12] border border-gray-200 dark:border-[#27272f] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-[#f5f5f5] font-medium focus:outline-none"
          />
        </div>

        {/* School */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-wider mb-1.5">
            SCHOOL
          </label>
          <input
            type="text"
            readOnly
            value="Delhi Public School, Noida"
            className="w-full bg-purple-50/40 dark:bg-[#0d0d12] border border-gray-200 dark:border-[#27272f] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-[#f5f5f5] font-medium focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
