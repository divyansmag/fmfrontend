import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ClassSelector: React.FC = () => {
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="bg-white dark:bg-[#1a1a21] border border-gray-200 dark:border-[#27272f] hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-[#f5f5f5] shadow-2xs flex items-center space-x-2 transition-colors cursor-pointer"
      >
        <span>Class: Grade 6 – Section A</span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 stroke-[2]" />
      </button>
    </div>
  );
};
