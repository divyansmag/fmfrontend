import React from 'react';
import { Eye, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AdminAppearanceCard = () => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs transition-colors h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-6">
          <Eye className="w-5 h-5 text-[#ff8a00] dark:text-[#f97316] stroke-[2.2]" />
          <h3 className="text-lg font-extrabold font-display text-gray-900 dark:text-white tracking-tight">
            Appearance & Accessibility
          </h3>
        </div>

        {/* Mode Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Light Mode */}
          <button
            onClick={() => setThemeMode('light')}
            className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            themeMode === 'light' ?
            'border-2 border-[#ff8a00] bg-amber-50/40 dark:bg-amber-950/20 shadow-xs' :
            'border-gray-200 dark:border-slate-700/80 hover:bg-gray-50 dark:hover:bg-[#202028]'}`
            }>
            
            {/* Preview Box */}
            <div className="w-full h-20 rounded-xl bg-[#faf8f5] border border-gray-200 p-2.5 flex space-x-2 mb-3">
              <div className="w-1/3 h-full rounded-lg bg-white p-2 flex flex-col justify-between border border-gray-100">
                <div className="w-full h-2 bg-gray-200 rounded-sm" />
                <div className="w-3/4 h-3 bg-[#ff8a00] rounded-sm" />
              </div>
              <div className="w-2/3 h-full rounded-lg bg-white border border-gray-100" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                Light Mode
              </span>
              {themeMode === 'light' ?
              <CheckCircle2 className="w-5 h-5 text-[#ff8a00] fill-[#ff8a00] text-white stroke-[2]" /> :

              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 stroke-[1.5]" />
              }
            </div>
          </button>

          {/* 2. Dark Mode */}
          <button
            onClick={() => setThemeMode('dark')}
            className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            themeMode === 'dark' ?
            'border-2 border-[#ff8a00] bg-amber-50/40 dark:bg-amber-950/20 shadow-xs' :
            'border-gray-200 dark:border-slate-700/80 hover:bg-gray-50 dark:hover:bg-[#202028]'}`
            }>
            
            {/* Preview Box */}
            <div className="w-full h-20 rounded-xl bg-[#0f172a] border border-gray-800 p-2.5 flex space-x-2 mb-3">
              <div className="w-1/3 h-full rounded-lg bg-[#1e293b] p-2 flex flex-col justify-between border border-gray-700">
                <div className="w-full h-2 bg-gray-600 rounded-sm" />
                <div className="w-3/4 h-3 bg-[#ff8a00] rounded-sm" />
              </div>
              <div className="w-2/3 h-full rounded-lg bg-[#1e293b] border border-gray-700" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                Dark Mode
              </span>
              {themeMode === 'dark' ?
              <CheckCircle2 className="w-5 h-5 text-[#ff8a00] fill-[#ff8a00] text-white stroke-[2]" /> :

              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 stroke-[1.5]" />
              }
            </div>
          </button>

          {/* 3. System Default */}
          <button
            onClick={() => setThemeMode('system')}
            className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            themeMode === 'system' ?
            'border-2 border-[#ff8a00] bg-amber-50/40 dark:bg-amber-950/20 shadow-xs' :
            'border-gray-200 dark:border-slate-700/80 hover:bg-gray-50 dark:hover:bg-[#202028]'}`
            }>
            
            {/* Preview Box */}
            <div className="w-full h-20 rounded-xl bg-gradient-to-r from-[#faf8f5] to-[#0f172a] border border-gray-300 p-2.5 flex space-x-2 mb-3">
              <div className="w-1/2 h-full rounded-lg bg-white p-2 border border-gray-100 flex flex-col justify-between">
                <div className="w-full h-2 bg-gray-200 rounded-sm" />
              </div>
              <div className="w-1/2 h-full rounded-lg bg-[#1e293b] p-2 border border-gray-700 flex flex-col justify-between" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                System Default
              </span>
              {themeMode === 'system' ?
              <CheckCircle2 className="w-5 h-5 text-[#ff8a00] fill-[#ff8a00] text-white stroke-[2]" /> :

              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 stroke-[1.5]" />
              }
            </div>
          </button>
        </div>
      </div>
    </div>);

};