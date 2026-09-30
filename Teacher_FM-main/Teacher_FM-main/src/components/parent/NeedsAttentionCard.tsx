import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { NeedsAttentionItem } from '../../data/parentChildProgressData';

interface Props {
  items: NeedsAttentionItem[];
}

export const NeedsAttentionCard: React.FC<Props> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center space-x-2 text-gray-900 dark:text-white mb-1">
          <AlertTriangle className="w-5 h-5 text-amber-500 stroke-[2.2]" />
          <h3 className="text-xl font-extrabold tracking-tight">Needs Attention</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-5">
          Ananya might need a little extra support in these specific areas.
        </p>

        <div className="space-y-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#eef2ff] dark:bg-[#1e1b4b]/40 border border-indigo-200/70 dark:border-indigo-900/50 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-indigo-100">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-indigo-300/80 font-medium mt-0.5">
                  {item.subtitle}
                </p>
              </div>
              <div className="text-lg font-extrabold text-[#0d52ce] dark:text-indigo-300 ml-4">
                {item.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
