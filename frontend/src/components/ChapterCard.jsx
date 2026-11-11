import { Check, Lock, Play } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function ChapterCard({ chapter }) {
  const { openChapterModal } = useApp();
  const isCompleted = chapter.status === 'completed';
  const isActive = chapter.status === 'active';
  const isLocked = chapter.status === 'locked';

  const handleClick = () => {
    openChapterModal(chapter.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`min-w-[280px] sm:min-w-[310px] flex-shrink-0 bg-white dark:bg-slate-800 rounded-3xl p-6 cursor-pointer transition-all hover:-translate-y-1 group ${
        isActive
          ? 'shadow-md border-2 border-purple-600 dark:border-purple-500 relative'
          : 'shadow-sm hover:shadow-md border border-slate-200/80 dark:border-slate-700/80'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
{isCompleted && (
  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner dark:shadow-[inset_0_0_10px_rgba(16,185,129,0.25)] border border-emerald-200/50 dark:border-emerald-500/30">
    <Check className="w-5 h-5 stroke-[2.5]" />
  </div>
)}
        {isActive && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openChapterModal(chapter.id);
            }}
            className="w-10 h-10 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition-transform hover:scale-110"
            title="Inspect Chapter Structure"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        )}
        {isLocked && (
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        )}

        {isActive ? (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{chapter.lessonsCount} Lessons</span>
            <div className="w-12 bg-purple-100 dark:bg-purple-900/50 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-purple-600 h-full w-1/3 rounded-full" />
            </div>
          </div>
        ) : (
          <span className="text-xs font-bold text-slate-400">{chapter.lessonsCount} Lessons</span>
        )}
      </div>

      <div className={`text-[11px] font-bold uppercase tracking-wider ${isLocked ? 'text-slate-400' : 'text-purple-600 dark:text-purple-400'}`}>
        CHAPTER {chapter.number}
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-purple-600 transition-colors">{chapter.title}</h4>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {chapter.tags.map((tag, index) => {
          let label = tag;
          let tagClass = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
          if (isCompleted) label = `✓ ${tag}`;
          if (isActive) {
            tagClass = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300';
            if (index < 2) label = `● ${tag}`;
          }
          return (
            <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${tagClass}`}>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
