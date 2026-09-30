import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import fmLogo from '../assets/fm_logo.png';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-[#fdf8ff] dark:bg-[#101014] border-b border-[#ecebf3] dark:border-[#27272f] py-3.5 px-6 sm:px-12 flex justify-between items-center transition-colors">
      <Link to="/" className="flex items-center space-x-2.5">
        <span className="text-[#7032e3] dark:text-[#a855f7] text-2xl font-bold tracking-tight">
          FutureMinds AI
        </span>
        <img
          src={fmLogo}
          alt="FutureMinds AI Labs"
          className="h-8 w-auto object-contain"
        />
      </Link>

      <div className="flex items-center space-x-3">
        <button 
          className="bg-[#7c46f6] hover:bg-[#6c36e6] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-150 shadow-xs cursor-pointer"
        >
          Sign In
        </button>
        <button 
          onClick={toggleTheme}
          aria-label="Toggle theme" 
          className="w-9 h-9 rounded-full border border-gray-200 dark:border-[#27272f] flex items-center justify-center text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1a1a21] hover:bg-gray-50 dark:hover:bg-[#252530] transition-colors shadow-2xs cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[1.8]" />
          ) : (
            <Moon className="w-4 h-4 text-gray-700 stroke-[1.8]" />
          )}
        </button>
      </div>
    </header>
  );
};
