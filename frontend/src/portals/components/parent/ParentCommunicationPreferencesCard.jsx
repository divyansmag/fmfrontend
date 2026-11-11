import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { defaultCommunicationPrefs } from '../../data/parentSettingsData';

export const ParentCommunicationPreferencesCard = () => {
  const [prefs, setPrefs] = useState(defaultCommunicationPrefs);

  const togglePref = (id) => {
    setPrefs((prev) =>
    prev.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item)
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center space-x-2 text-gray-900 dark:text-white mb-3">
          <Bell className="w-5 h-5 text-[#0d52ce] stroke-[2.2]" />
          <h3 className="text-xl font-extrabold font-display tracking-tight">
            Communication Preferences
          </h3>
        </div>

        <div className="border-b border-gray-100 dark:border-slate-700/80 mb-5" />

        {/* 2x2 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prefs.map((item) =>
          <div
            key={item.id}
            className="bg-[#f8fafc] dark:bg-slate-900/50 rounded-xl p-4 border border-gray-200/70 dark:border-slate-700/80 flex items-center justify-between transition-colors">
            
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Toggle Switch */}
              <button
              onClick={() => togglePref(item.id)}
              className={`relative w-[50px] h-[28px] rounded-full p-[2px] inline-flex items-center transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0 ml-4 focus:outline-none ${
              item.enabled ? 'bg-[#0d52ce]' : 'bg-gray-300 dark:bg-gray-700'}`
              }
              aria-label={`Toggle ${item.title}`}>
              
                <span
                className={`block w-[24px] h-[24px] rounded-full bg-white transition-transform duration-200 ease-in-out shadow-xs ${
                item.enabled ? 'translate-x-[22px]' : 'translate-x-0'}`
                } />
              
              </button>
            </div>
          )}
        </div>
      </div>
    </div>);

};