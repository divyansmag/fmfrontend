import React, { useState } from 'react';
import { Bell, Moon, Sun, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import adminAvatar from '../../assets/avatars/admin.png';

export const AdminHeader: React.FC = () => {
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
    <header className="w-full bg-[#fdfaf5] dark:bg-[#101014] border-b border-amber-100/60 dark:border-[#27272f] py-3.5 px-6 md:px-8 flex items-center justify-between transition-colors relative z-20">
      {/* Left empty spacer to balance right controls for true horizontal centering */}
      <div className="hidden sm:block w-52" />

      {/* Center Navigation Links */}
      <nav className="flex items-center justify-center space-x-6 text-xs sm:text-sm font-semibold flex-1">
        <Link
          to="/admin/dashboard"
          className={`transition-colors ${
            location.pathname === '/admin/dashboard'
              ? 'text-[#ff8a00] dark:text-[#f97316]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/platform-progress"
          className={`transition-colors ${
            location.pathname === '/admin/platform-progress'
              ? 'text-[#ff8a00] dark:text-[#f97316]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Platform Progress
        </Link>

        <Link
          to="/admin/settings"
          className={`transition-colors ${
            location.pathname === '/admin/settings'
              ? 'text-[#ff8a00] dark:text-[#f97316]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Settings
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center justify-end space-x-4 w-52">
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
          onClick={() => alert('No new platform alerts for System Admin.')}
        >
          <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-800" />

        {/* Admin Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2.5 cursor-pointer focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
              <img
                src={adminAvatar}
                alt="System Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#ff8a00] dark:group-hover:text-[#f97316] transition-colors">
              Admin / System Admin
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 stroke-[2] transition-transform duration-150" />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#18181b] rounded-xl shadow-lg border border-gray-100 dark:border-[#27272f] py-2 z-30">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-[#27272f]">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Admin / System Admin</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">admin@futureminds.edu</p>
              </div>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
