import React, { useState } from 'react';
import { Bell, Moon, Sun, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useLocation, useNavigate, Link } from '../nav.jsx';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import teacherProfileAvatar from '../assets/avatars/teacher_login.png';

export const DashboardHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left empty spacer */}
      <div className="hidden sm:block w-32" />

      {/* Center Navigation Links */}
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center space-x-6 text-xs sm:text-sm font-semibold">
        <Link
          to="/teacher/dashboard"
          className={`transition-colors ${
          location.pathname === '/teacher/dashboard' ?
          'relative text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-emerald-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 pb-1 transition-colors'}`
          }>
          
          Dashboard
        </Link>

        <Link
          to="/teacher/assignments"
          className={`transition-colors ${
          location.pathname === '/teacher/assignments' ?
          'relative text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-emerald-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 pb-1 transition-colors'}`
          }>
          
          Assignments
        </Link>

        <Link
          to="/teacher/announcements"
          className={`transition-colors ${
          location.pathname === '/teacher/announcements' ?
          'relative text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-emerald-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 pb-1 transition-colors'}`
          }>
          
          Announcements
        </Link>

        <Link
          to="/teacher/lab-guide"
          className={`transition-colors ${
          location.pathname === '/teacher/lab-guide' ?
          'relative text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-emerald-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 pb-1 transition-colors'}`
          }>
          Lab Guide
        </Link>

        <Link
          to="/teacher/student-progress"
          className={`transition-colors ${
          location.pathname === '/teacher/student-progress' ?
          'relative text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-emerald-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 pb-1 transition-colors'}`
          }>
          
          Student Progress
        </Link>


      </nav>

      {/* Right Controls */}
      <div className="flex items-center justify-end space-x-3 w-32">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:dark:hover:bg-slate-800 cursor-pointer">
          
          {theme === 'dark' ?
          <Sun className="w-4.5 h-4.5 text-amber-400 stroke-[1.8]" /> :

          <Moon className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 stroke-[1.8]" />
          }
        </button>

        {/* Notification Bell */}
        <button
          className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Notifications">
          
          <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="relative" id="profile-dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all"
          >
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-sm overflow-hidden">
              <img src={teacherProfileAvatar} alt="Anaya Sharma" className="w-full h-full object-cover" />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen &&
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Anaya Sharma</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Teacher</p>
                </div>
              </div>
              
              <div className="pt-2 space-y-1">
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/teacher/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </header>);

};