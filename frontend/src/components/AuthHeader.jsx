import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AuthHeader() {
  const { navigateTo, toggleTheme } = useApp();

  return (
    <header className="w-full px-6 lg:px-12 py-5 flex items-center justify-between">
      <a href="/" id="auth-logo-home" className="flex items-center gap-2.5 cursor-pointer">
        <img src="/dist/assets/fm_logo.png" alt="FutureMinds Logo" className="w-12 h-12 object-contain dark:brightness-125 dark:contrast-125 dark:saturate-150 dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
        <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400 font-display tracking-tight">FutureMinds</span>
      </a>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
        >
          <Moon className="w-4 h-4 dark:brightness-125 dark:contrast-125 dark:saturate-150 dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
          <Sun className="w-4 h-4 hidden dark:block" />
        </button>
      </div>
    </header>
  );
}