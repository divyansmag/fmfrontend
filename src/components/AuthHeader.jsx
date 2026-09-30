import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AuthHeader() {
  const { navigateTo, toggleTheme } = useApp();

  return (
    <header className="w-full px-6 lg:px-12 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('role-select')}>
        <img src="dist\assets\logo.png" alt="FutureMinds Logo" className="w-12 h-12 object-contain dark:hidden" />
        <img src="dist\assets\logodark.png" alt="FutureMinds Logo Dark" className="w-12 h-12 object-contain hidden dark:block" />
        <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400 font-display tracking-tight">FutureMinds</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
        >
          <Moon className="w-4 h-4 dark:hidden" />
          <Sun className="w-4 h-4 hidden dark:block" />
        </button>
      </div>
    </header>
  );
}