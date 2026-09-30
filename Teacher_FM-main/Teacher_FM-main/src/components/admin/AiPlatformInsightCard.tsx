import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  insightText: string;
  recommendedFocus: string;
}

export const AiPlatformInsightCard: React.FC<Props> = ({
  insightText,
  recommendedFocus,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fffdf2] dark:bg-[#1f1a14] rounded-2xl p-6 border border-amber-200/80 dark:border-amber-900/40 shadow-xs flex flex-col justify-between transition-colors h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#ff8a00] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-amber-100 tracking-tight leading-tight">
            AI Platform<br />Insight
          </h3>
        </div>

        {/* Text Content */}
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-amber-200/90 leading-relaxed font-medium">
          <p>{insightText}</p>

          <div className="bg-white/80 dark:bg-[#18181b]/80 p-4 rounded-xl border border-amber-200/70 dark:border-amber-900/50 space-y-1">
            <p className="font-bold text-gray-900 dark:text-amber-100">
              Recommended focus:
            </p>
            <p className="text-xs text-gray-600 dark:text-amber-200/80">
              {recommendedFocus}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={() => navigate('/admin/platform-progress')}
          className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm bg-[#ff8a00] hover:bg-[#e07900] transition-colors shadow-sm shadow-amber-500/20 cursor-pointer"
        >
          View Platform Progress
        </button>
      </div>
    </div>
  );
};
