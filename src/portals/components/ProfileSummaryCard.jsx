import React from 'react';
import { useNavigate } from '../nav.jsx';
import { Camera, LogOut } from 'lucide-react';
import teacherAvatar from '../assets/avatars/teacher_login.png';

export const ProfileSummaryCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/80 dark:border-slate-700/80 shadow-md dark:shadow-none shadow-purple-900/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors mb-6">
      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        {/* Avatar with Camera Badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <img
              src={teacherAvatar}
              alt="Anaya Sharma"
              className="w-full h-full object-cover" />
            
          </div>
          <button
            onClick={() => alert('Update profile picture clicked.')}
            className="absolute -bottom-1 -right-1 bg-[#15ab5d] text-white p-1 rounded-full border-2 border-white dark:border-[#1a1a21] shadow-xs cursor-pointer hover:bg-[#129953] transition-colors"
            aria-label="Change profile picture">
            
            <Camera className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Name & Title */}
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f5]">
              Anaya Sharma
            </h2>
            <span className="inline-flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#a1a1aa] font-medium mt-1">
            Teacher • FutureMinds AI Labs
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          onClick={() => navigate('/')}
          className="flex-1 sm:flex-initial border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer">
          
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>);

};