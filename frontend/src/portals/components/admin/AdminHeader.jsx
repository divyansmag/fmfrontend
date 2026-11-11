import React, { useState } from 'react';
import { Bell, Moon, Sun, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useLocation, useNavigate, Link } from '../../nav.jsx';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import adminAvatar from '../../assets/avatars/admin.png';

export const AdminHeader = () => {
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
      <div className="hidden sm:block w-52" />

      {/* Center Navigation Links */}
      <nav className="flex items-center justify-center space-x-6 text-xs sm:text-sm font-semibold flex-1">
        <Link
          to="/admin/dashboard"
          className={`transition-colors ${
          location.pathname === '/admin/dashboard' ?
          'relative text-xs sm:text-sm font-bold text-orange-500 dark:text-orange-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 dark:after:bg-orange-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 pb-1 transition-colors'}`
          }>
          Dashboard
        </Link>

        <Link
          to="/admin/users"
          className={`transition-colors ${
          location.pathname === '/admin/users' ?
          'relative text-xs sm:text-sm font-bold text-orange-500 dark:text-orange-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 dark:after:bg-orange-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 pb-1 transition-colors'}`
          }>
          Manage Users
        </Link>

        <Link
          to="/admin/platform-progress"
          className={`transition-colors ${
          location.pathname === '/admin/platform-progress' ?
          'relative text-xs sm:text-sm font-bold text-orange-500 dark:text-orange-400 pb-1 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 dark:after:bg-orange-400 after:rounded-full' :
          'relative text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 pb-1 transition-colors'}`
          }>
          Platform Progress
        </Link>


      </nav>

      {/* Right Controls */}
      <div className="flex items-center justify-end space-x-4 w-52">
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
          onClick={() => alert('No new platform alerts for System Admin.')}>
          
          <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>

        <div className="relative" id="profile-dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
          >
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-sm overflow-hidden">
              <img src={adminAvatar} alt="System Admin" className="w-full h-full object-cover" />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen &&
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Admin</p>
                  <p className="text-[11px] text-orange-500 dark:text-orange-400 font-semibold">System Admin</p>
                </div>
              </div>
              
              <div className="pt-2 space-y-1">
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/admin/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
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