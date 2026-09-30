import React from 'react';
import { TrendingUp, CheckCircle, GraduationCap, Flame } from 'lucide-react';
import type { ChildProgressData } from '../../data/parentChildProgressData';

interface Props {
  data: ChildProgressData;
}

export const ChildProgressKpiCards: React.FC<Props> = ({ data }) => {
  const completionPercent = Math.round((data.modulesCompleted / data.totalModules) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Card 1: Overall Progress */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0d52ce] dark:text-[#3b82f6] flex-shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            OVERALL PROGRESS
          </span>
        </div>

        <div>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {data.overallProgress}%
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            ↑ {data.overallChange}% this month
          </div>
        </div>
      </div>

      {/* Card 2: Module Completion */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0d52ce] dark:text-[#3b82f6] flex-shrink-0">
            <CheckCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            MODULE COMPLETION
          </span>
        </div>

        <div>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {data.modulesCompleted}<span className="text-2xl font-bold text-gray-400">/{data.totalModules}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mt-3 mb-1">
            <div
              className="h-full bg-[#0d52ce] rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {completionPercent}% completed
          </div>
        </div>
      </div>

      {/* Card 3: Avg Quiz Score */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            AVG QUIZ SCORE
          </span>
        </div>

        <div>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {data.avgQuizScore}%
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            +{data.quizScoreChange}% this month
          </div>
        </div>
      </div>

      {/* Card 4: Learning Streak */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0">
            <Flame className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            LEARNING STREAK
          </span>
        </div>

        <div>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {data.learningStreak} <span className="text-xl font-bold text-gray-700 dark:text-gray-300">Days</span>
          </div>
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-500 mt-1">
            Keep it going! 🔥
          </div>
        </div>
      </div>
    </div>
  );
};
