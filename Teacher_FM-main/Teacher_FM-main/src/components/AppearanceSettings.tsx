import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AppearanceSettings: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <div className="bg-white dark:bg-[#1a1a21] rounded-2xl p-6 border border-gray-200/80 dark:border-[#27272f] shadow-md dark:shadow-none shadow-purple-900/5 transition-colors">
      {/* Card Header */}
      <div className="flex items-center space-x-2 pb-4 border-b border-gray-200/70 dark:border-[#27272f] mb-6">
        <Eye className="w-4.5 h-4.5 text-[#15ab5d]" />
        <h3 className="text-base font-bold text-gray-900 dark:text-[#f5f5f5]">
          Appearance & Accessibility
        </h3>
      </div>

      {/* Selectable Options List (Horizontal 3-Column Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Light Mode Card */}
        <div
          onClick={() => setThemeMode('light')}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'border-[#15ab5d] bg-emerald-50/20 dark:bg-emerald-950/20'
              : 'border-gray-200 dark:border-[#27272f] hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {/* Light Mini Preview */}
          <div className="w-full h-16 bg-[#f7f1ff] border border-purple-100 rounded-lg p-2.5 mb-3 flex flex-col justify-end">
            <div className="w-12 h-3 bg-[#15ab5d] rounded-sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
              Light Mode
            </span>
            {themeMode === 'light' ? (
              <CheckCircle2 className="w-4 h-4 text-[#15ab5d] fill-[#15ab5d] text-white" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
            )}
          </div>
        </div>

        {/* 2. Dark Mode Card */}
        <div
          onClick={() => setThemeMode('dark')}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            themeMode === 'dark'
              ? 'border-[#15ab5d] bg-emerald-50/20 dark:bg-emerald-950/20'
              : 'border-gray-200 dark:border-[#27272f] hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {/* Dark Mini Preview */}
          <div className="w-full h-16 bg-[#1f1f29] border border-gray-700 rounded-lg p-2.5 mb-3 flex flex-col justify-end">
            <div className="w-12 h-3 bg-[#15ab5d] rounded-sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
              Dark Mode
            </span>
            {themeMode === 'dark' ? (
              <CheckCircle2 className="w-4 h-4 text-[#15ab5d] fill-[#15ab5d] text-white" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
            )}
          </div>
        </div>

        {/* 3. System Default Card */}
        <div
          onClick={() => setThemeMode('system')}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            themeMode === 'system'
              ? 'border-[#15ab5d] bg-emerald-50/20 dark:bg-emerald-950/20'
              : 'border-gray-200 dark:border-[#27272f] hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {/* Split System Mini Preview */}
          <div className="w-full h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-3 flex">
            <div className="w-1/2 h-full bg-[#f7f1ff] p-2 flex flex-col justify-end">
              <div className="w-6 h-2.5 bg-[#15ab5d] rounded-xs" />
            </div>
            <div className="w-1/2 h-full bg-[#1f1f29] p-2 flex flex-col justify-end">
              <div className="w-6 h-2.5 bg-[#15ab5d] rounded-xs" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
              System Default
            </span>
            {themeMode === 'system' ? (
              <CheckCircle2 className="w-4 h-4 text-[#15ab5d] fill-[#15ab5d] text-white" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
