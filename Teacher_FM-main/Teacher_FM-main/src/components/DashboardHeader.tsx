import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import teacherProfileAvatar from '../assets/avatars/teacher_login.png';

export const DashboardHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#fcfcfd] dark:bg-[#101014] border-b border-gray-200/60 dark:border-[#27272f] py-3.5 px-6 md:px-8 flex items-center justify-between transition-colors">
      {/* Left empty spacer to balance right controls for true horizontal centering */}
      <div className="hidden sm:block w-32" />

      {/* Center Navigation Links */}
      <nav className="flex items-center justify-center space-x-6 text-xs sm:text-sm font-semibold flex-1">
        <Link
          to="/teacher/dashboard"
          className={`transition-colors ${
            location.pathname === '/teacher/dashboard'
              ? 'text-[#15ab5d]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/teacher/student-progress"
          className={`transition-colors ${
            location.pathname === '/teacher/student-progress'
              ? 'text-[#15ab5d]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Student Progress
        </Link>

        <Link
          to="/teacher/settings"
          className={`transition-colors ${
            location.pathname === '/teacher/settings'
              ? 'text-[#15ab5d]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Settings
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center justify-end space-x-3 w-32">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a21] cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-amber-400 stroke-[1.8]" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 stroke-[1.8]" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a21] cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#101014]" />
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => navigate('/teacher/settings')}
          className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 cursor-pointer"
        >
          <img
            src={teacherProfileAvatar}
            alt="Anaya Sharma"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
