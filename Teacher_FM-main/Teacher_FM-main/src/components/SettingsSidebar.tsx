import React from 'react';
import { User, GraduationCap, Palette, Bell, Lock } from 'lucide-react';
import teacherAvatar from '../assets/avatars/teacher_login.png';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsSidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full lg:w-64 bg-white dark:bg-[#1a1a21] rounded-2xl p-6 border border-gray-200/80 dark:border-[#27272f] shadow-md dark:shadow-none shadow-purple-900/5 flex flex-col items-center text-center flex-shrink-0 transition-colors">
      {/* Profile Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-100 dark:border-gray-700 mb-3 shadow-xs">
        <img
          src={teacherAvatar}
          alt="Anaya Sharma"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Details */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-[#f5f5f5]">
        Anaya Sharma
      </h2>
      <p className="text-xs text-gray-500 dark:text-[#a1a1aa] font-medium mb-4">
        Teacher • Section A
      </p>

      {/* View Teacher ID Button */}
      <button
        onClick={() => alert('Teacher ID: TCH-2024-88492')}
        className="w-full bg-purple-100/70 dark:bg-purple-950/40 text-[#7032e3] dark:text-purple-300 hover:bg-purple-200/80 dark:hover:bg-purple-900/50 font-semibold text-xs py-2 px-4 rounded-xl transition-colors mb-6 cursor-pointer"
      >
        View Teacher ID
      </button>

      {/* Sub-Navigation Items */}
      <nav className="w-full space-y-1.5 text-left">
        {[
          { id: 'Profile', label: 'Profile', icon: User },
          { id: 'Academic Info', label: 'Academic Info', icon: GraduationCap },
          { id: 'Appearance', label: 'Appearance', icon: Palette },
          { id: 'Notifications', label: 'Notifications', icon: Bell },
          { id: 'Security', label: 'Security', icon: Lock },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#15ab5d] text-white shadow-xs'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
