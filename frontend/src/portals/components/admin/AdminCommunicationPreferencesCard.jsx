import React from 'react';
import { Bell } from 'lucide-react';







export const AdminCommunicationPreferencesCard = ({
  preferences,
  onToggle
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-6">
        <Bell className="w-5 h-5 text-[#ff8a00] dark:text-[#f97316] stroke-[2.2]" />
        <h3 className="text-lg font-extrabold font-display text-gray-900 dark:text-white tracking-tight">
          Notification Settings
        </h3>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preferences.map((pref) =>
        <div
          key={pref.id}
          className="p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {pref.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                {pref.description}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
            type="button"
            role="switch"
            aria-checked={pref.enabled}
            onClick={() => onToggle(pref.id)}
            className={`relative w-[50px] h-[28px] rounded-full p-[2px] inline-flex items-center transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0 ml-4 focus:outline-none ${
            pref.enabled ?
            'bg-[#ff8a00]' :
            'bg-gray-300 dark:bg-gray-700'}`
            }>
            
              <span
              className={`block w-[24px] h-[24px] rounded-full bg-white transition-transform duration-200 ease-in-out shadow-xs ${
              pref.enabled ? 'translate-x-[22px]' : 'translate-x-0'}`
              } />
            
            </button>
          </div>
        )}
      </div>
    </div>);

};