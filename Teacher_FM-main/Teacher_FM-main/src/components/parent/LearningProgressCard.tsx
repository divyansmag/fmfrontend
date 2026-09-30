import React from 'react';
import type { SubjectProgress } from '../../data/parentChildProgressData';

interface Props {
  subjects: SubjectProgress[];
}

export const LearningProgressCard: React.FC<Props> = ({ subjects }) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Learning Progress
        </h3>

        <div className="space-y-5">
          {subjects.map((sub) => (
            <div key={sub.name} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-800 dark:text-gray-200">{sub.name}</span>
                <span className="text-[#0d52ce] dark:text-[#3b82f6] font-bold">{sub.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-[#0d52ce] rounded-full transition-all duration-500"
                  style={{ width: `${sub.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
