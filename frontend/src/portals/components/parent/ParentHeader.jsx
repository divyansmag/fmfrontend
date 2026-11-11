import React, { useState } from 'react';
import { Bell, Moon, Sun, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useLocation, useNavigate, Link } from '../../nav.jsx';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import parentAvatar from '../../assets/avatars/parent.png';

export const ParentHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left empty spacer to balance right controls for true horizontal centering */}
      <div className="hidden sm:block w-48" />

      {/* Center Navigation Links */}
      <nav className="flex items-center justify-center space-x-6 text-xs sm:text-sm font-semibold flex-1">
        <Link
          to="/parent/dashboard"
          className={`transition-colors ${
          location.pathname === '/parent/dashboard' ?
          'relative text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 pb-1 transition-colors'}`
          }>
          
          Dashboard
        </Link>

        <Link
          to="/parent/child-progress"
          className={`transition-colors ${
          location.pathname === '/parent/child-progress' ?
          'relative text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 pb-1 transition-colors'}`
          }>
          
          Child Progress
        </Link>


      </nav>

      {/* Right Controls */}
      <div className="flex items-center justify-end space-x-4 w-48">
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
          aria-label="Notifications"
          onClick={() => alert('No new notifications for Priya Sharma.')}>
          
          <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="relative" id="profile-dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 p-0.5 shadow-md shadow-blue-600/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
          >
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-sm overflow-hidden">
              <img src={parentAvatar} alt="Priya Sharma" className="w-full h-full object-cover" />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen &&
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Priya Sharma</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Parent</p>
                </div>
              </div>
              
              <div className="pt-2 space-y-1">
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/parent/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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