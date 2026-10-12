import React from 'react';
import { Eye, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ParentAppearanceCard = () => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        {/* Header */}
        <div className="flex items-center space-x-2 text-gray-900 dark:text-white mb-3">
          <Eye className="w-5 h-5 text-[#0d52ce] stroke-[2.2]" />
          <h3 className="text-xl font-extrabold font-display tracking-tight">
            Appearance & Accessibility
          </h3>
        </div>

        <div className="border-b border-gray-100 dark:border-slate-700/80 mb-5" />

        {/* 3 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Option 1: Light Mode */}
          <div
            onClick={() => setThemeMode('light')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            themeMode === 'light' ?
            'border-[#0d52ce] bg-blue-50/20 dark:bg-blue-950/20' :
            'border-gray-200/80 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-gray-700'}`
            }>
            
            {/* Preview Box */}
            <div className="w-full h-16 rounded-xl bg-[#f4f7fe] dark:bg-gray-100 p-2.5 flex flex-col justify-between mb-3 border border-gray-200/60">
              <div className="w-2/3 h-2 rounded bg-white" />
              <div className="w-1/3 h-3.5 rounded bg-[#0d52ce]" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                Light Mode
              </span>
              {themeMode === 'light' ?
              <CheckCircle2 className="w-5 h-5 text-[#0d52ce] fill-[#0d52ce] stroke-white" /> :

              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              }
            </div>
          </div>

          {/* Option 2: Dark Mode */}
          <div
            onClick={() => setThemeMode('dark')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            themeMode === 'dark' ?
            'border-[#0d52ce] bg-blue-50/20 dark:bg-blue-950/20' :
            'border-gray-200/80 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-gray-700'}`
            }>
            
            {/* Preview Box */}
            <div className="w-full h-16 rounded-xl bg-[#272730] p-2.5 flex flex-col justify-between mb-3 border border-gray-700/60">
              <div className="w-2/3 h-2 rounded bg-gray-600" />
              <div className="w-1/3 h-3.5 rounded bg-[#0d52ce]" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                Dark Mode
              </span>
              {themeMode === 'dark' ?
              <CheckCircle2 className="w-5 h-5 text-[#0d52ce] fill-[#0d52ce] stroke-white" /> :

              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              }
            </div>
          </div>

          {/* Option 3: System Default */}
          <div
            onClick={() => setThemeMode('system')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            themeMode === 'system' ?
            'border-[#0d52ce] bg-blue-50/20 dark:bg-blue-950/20' :
            'border-gray-200/80 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-gray-700'}`
            }>
            
            {/* Preview Box: Split */}
            <div className="w-full h-16 rounded-xl overflow-hidden flex mb-3 border border-gray-200/60 dark:border-gray-700">
              <div className="w-1/2 h-full bg-[#f4f7fe] p-2" />
              <div className="w-1/2 h-full bg-[#272730] p-2" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                System Default
              </span>
              {themeMode === 'system' ?
              <CheckCircle2 className="w-5 h-5 text-[#0d52ce] fill-[#0d52ce] stroke-white" /> :

              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

};