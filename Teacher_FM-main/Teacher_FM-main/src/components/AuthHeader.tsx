import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AuthHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full px-6 lg:px-12 py-5 flex items-center justify-between">
      <div 
        className="flex items-center gap-2.5 cursor-pointer" 
        onClick={() => window.location.href = "http://localhost:5173/?view=role-select"}
      >
        <img src="http://localhost:5173/dist/assets/logo.png" alt="FutureMinds Logo" className="w-12 h-12 object-contain dark:hidden" />
        <img src="http://localhost:5173/dist/assets/logodark.png" alt="FutureMinds Logo Dark" className="w-12 h-12 object-contain hidden dark:block" />
        <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400 font-display tracking-tight">FutureMinds</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Moon className="w-4 h-4 dark:hidden" />
          <Sun className="w-4 h-4 hidden dark:block" />
        </button>
      </div>
    </header>
  );
};
