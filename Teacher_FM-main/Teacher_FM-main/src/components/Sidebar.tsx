import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import fmLogo from '../assets/fm_logo.png';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('futureminds_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('futureminds_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/teacher/dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'student-progress',
      label: 'Student Progress',
      path: '/teacher/student-progress',
      icon: TrendingUp,
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/teacher/settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`bg-[#f7f1ff] dark:bg-[#121218] border-r border-purple-100/60 dark:border-[#27272f] min-h-screen flex flex-col justify-between flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-20 p-3 items-center' : 'w-64 p-6'
      }`}
    >
      {/* Top Section */}
      <div className="w-full">
        {/* Brand Header + Collapse Toggle Button */}
        <div
          className={`flex items-center justify-between mb-8 ${
            isCollapsed ? 'flex-col space-y-4' : 'flex-row'
          }`}
        >
          {isCollapsed ? (
            <div
              onClick={() => navigate('/teacher/dashboard')}
              className="w-10 h-10 flex items-center justify-center cursor-pointer mx-auto"
              title="FutureMinds AI Teacher Portal"
            >
              <img
                src={fmLogo}
                alt="FutureMinds AI Labs"
                className="w-9 h-9 object-contain"
              />
            </div>
          ) : (
            <div
              onClick={() => navigate('/teacher/dashboard')}
              className="cursor-pointer flex flex-col items-start"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={fmLogo}
                  alt="FutureMinds AI Labs"
                  className="h-7.5 w-auto object-contain"
                />
                <h1 className="text-lg font-bold text-[#15ab5d] tracking-tight">
                  FutureMinds AI
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                Teacher Portal
              </p>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-purple-100/60 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-3 rounded-xl'
                    : 'space-x-3 px-4 py-2.5 rounded-xl'
                } font-semibold text-sm ${
                  isActive
                    ? 'bg-[#15ab5d] text-white shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100/50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 stroke-[2.2] flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="w-full pt-6">
        <div className="border-t border-gray-200/70 dark:border-[#27272f] mb-4 w-full" />

        <div className="space-y-1 w-full">
          <button
            onClick={() => alert('Help Center: Contact support or view teacher user guide.')}
            title={isCollapsed ? 'Help Center' : undefined}
            className={`w-full flex items-center transition-all cursor-pointer ${
              isCollapsed
                ? 'justify-center p-2.5 rounded-lg'
                : 'space-x-3 px-3 py-2 rounded-lg'
            } font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-purple-100/40 dark:hover:bg-gray-800/40`}
          >
            <HelpCircle className="w-4.5 h-4.5 stroke-[2] flex-shrink-0" />
            {!isCollapsed && <span>Help Center</span>}
          </button>

          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center transition-all cursor-pointer ${
              isCollapsed
                ? 'justify-center p-2.5 rounded-lg'
                : 'space-x-3 px-3 py-2 rounded-lg'
            } font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-purple-100/40 dark:hover:bg-gray-800/40`}
          >
            <LogOut className="w-4.5 h-4.5 stroke-[2] flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
