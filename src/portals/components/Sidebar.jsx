import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '../nav.jsx';
import {
  LayoutGrid,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FlaskConical } from
'lucide-react';

import { useAuth } from '../context/AuthContext';


export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
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
    icon: LayoutGrid
  },
  {
    id: 'assignments',
    label: 'Assignments',
    path: '/teacher/assignments',
    icon: ClipboardList
  },
  {
    id: 'announcements',
    label: 'Announcements',
    path: '/teacher/announcements',
    icon: Megaphone
  },
  {
    id: 'lab-guide',
    label: 'Lab Guide',
    path: '/teacher/lab-guide',
    icon: FlaskConical
  },
  {
    id: 'student-progress',
    label: 'Student Progress',
    path: '/teacher/student-progress',
    icon: TrendingUp
  }];


  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-screen sticky top-0 flex flex-col justify-between flex-shrink-0 transition-all duration-300 ${
      isCollapsed ? 'w-20 p-3 items-center' : 'w-64 p-6'}`
      }>
      
      {/* Top Section */}
      <div className="w-full">
        {/* Brand Header + Collapse Toggle Button */}
        <div
          className={`flex items-center justify-between mb-8 ${
          isCollapsed ? 'flex-col space-y-4' : 'flex-row'}`
          }>
          
          {isCollapsed ?
          <div
            onClick={() => navigate('/teacher/dashboard')}
            className="w-10 h-10 flex items-center justify-center cursor-pointer mx-auto"
            title="FutureMinds AI Teacher Portal">
            
              <img src="/dist/assets/fm_logo.png"
              alt="FutureMinds AI Labs"
              className="w-9 h-9 object-contain dark:brightness-125 dark:contrast-125 dark:saturate-150 dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
            
            </div> :

          <div
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden">
              <img src="/dist/assets/fm_logo.png" alt="FutureMinds Logo" className="w-10 h-10 object-contain flex-shrink-0 dark:brightness-125 dark:contrast-125 dark:saturate-150 dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
              <div className="sidebar-brand-text">
                <div className="text-lg font-extrabold text-[#15ab5d] font-display leading-tight">FutureMinds</div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">MYAIGURU</div>
              </div>
            </div>
          }

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-purple-100/60 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
            
            {isCollapsed ?
            <ChevronRight className="w-5 h-5 stroke-[2.2]" /> :

            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            }
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
                isCollapsed ?
                'justify-center p-3 rounded-xl' :
                'space-x-3 px-4 py-2.5 rounded-xl'} font-semibold text-sm ${

                isActive ?
                'bg-[#15ab5d] text-white shadow-xs' :
                'text-gray-700 dark:text-gray-300 hover:bg-purple-100/50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'}`
                }>
                
                <Icon className="w-4.5 h-4.5 stroke-[2.2] flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>);

          })}
        </nav>
      </div>

    </aside>);

};