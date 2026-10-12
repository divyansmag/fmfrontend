import React from 'react';
import studentAvatar from '../../assets/avatars/anaya_sharma.png';





export const AiLearningInsightBanner = ({ insightText }) => {
  return (
    <div className="bg-[#e0e7ff]/60 dark:bg-[#1e1b4b]/50 rounded-2xl p-6 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-colors">
      <div className="flex items-start md:items-center space-x-4">
        {/* AI Student Mascot / Avatar Badge */}
        <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border-2 border-[#0d52ce] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
          <img
            src={studentAvatar}
            alt="AI Mascot"
            className="w-full h-full object-cover" />
          
        </div>

        <div>
          <h3 className="text-lg font-extrabold font-display text-gray-900 dark:text-indigo-100 tracking-tight mb-1">
            AI Learning Insight
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-indigo-200/90 font-medium leading-relaxed max-w-3xl">
            "{insightText}"
          </p>
        </div>
      </div>
    </div>);

};