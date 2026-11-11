import { useState } from 'react';
import { BookOpen, Check, ChevronDown, ChevronRight, Cpu, FileText, Flashlight, Gamepad2, HelpCircle, Lock, Play, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getSortedUnits, getSortedSubtopics, getSortedAssets } from '../data/courseData';

const ASSET_TYPE_META = {
  video:      { label: 'Video',      color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  summary:    { label: 'Summary',    color: 'text-sky-600 dark:text-sky-400',    bg: 'bg-sky-100 dark:bg-sky-900/40' },
  game:       { label: 'Game',       color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  quiz:       { label: 'Quiz',       color: 'text-rose-600 dark:text-rose-400',   bg: 'bg-rose-100 dark:bg-rose-900/40' },
  mindmap:    { label: 'Mindmap',    color: 'text-teal-600 dark:text-teal-400',   bg: 'bg-teal-100 dark:bg-teal-900/40' },
  flashcards: { label: 'Cards',      color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  lab:        { label: 'Lab',        color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
};

function assetIcon(type, className = 'w-3.5 h-3.5') {
  switch (type) {
    case 'video':      return <Play className={className} />;
    case 'summary':    return <FileText className={className} />;
    case 'game':       return <Gamepad2 className={className} />;
    case 'quiz':       return <HelpCircle className={className} />;
    case 'mindmap':    return <Cpu className={className} />;
    case 'flashcards': return <BookOpen className={className} />;
    case 'lab':        return <Zap className={className} />;
    default:           return <FileText className={className} />;
  }
}

function AssetRow({ asset, chapterId, unitId, subtopicId, isLocked }) {
  const { navigateToAsset, getAssetCompleted, currentAssetId } = useApp();
  const meta = ASSET_TYPE_META[asset.type] || ASSET_TYPE_META.summary;
  const completed = getAssetCompleted(asset.id);
  const isActive = currentAssetId === asset.id;

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={() => !isLocked && navigateToAsset(chapterId, unitId, subtopicId, asset.id)}
      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
        isActive
          ? 'bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800'
          : isLocked
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer'
      }`}
    >
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
        {completed ? <Check className="w-3 h-3 stroke-[3]" /> : assetIcon(asset.type)}
      </div>
      <span className={`text-xs font-medium truncate flex-1 ${
        isActive ? 'text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-700 dark:text-slate-300'
      }`}>
        {asset.title}
      </span>
      <span className={`text-[10px] font-bold flex-shrink-0 ${meta.color}`}>{meta.label}</span>
    </button>
  );
}

function SubtopicSection({ subtopic, chapterId, unitId, isLocked, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const assets = getSortedAssets(subtopic);
  const { getSubtopicProgress } = useApp();
  const progress = getSubtopicProgress(subtopic);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-all group"
      >
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          : <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1 text-left truncate">
          {subtopic.title}
        </span>
        {progress.total > 0 && (
          <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">
            {progress.completed}/{progress.total}
          </span>
        )}
      </button>

      {open && (
        <div className="pl-5 space-y-1 border-l border-slate-100 dark:border-slate-800 ml-4">
          {assets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              chapterId={chapterId}
              unitId={unitId}
              subtopicId={subtopic.id}
              isLocked={isLocked}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UnitSection({ unit, chapterId, isLocked, unitIndex }) {
  const [open, setOpen] = useState(unitIndex === 0);
  const subtopics = getSortedSubtopics(unit);
  const { getUnitProgress } = useApp();
  const progress = getUnitProgress(unit);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition-all group"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 shadow-sm">
          U{unit.order}
        </div>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex-1 text-left truncate">{unit.title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {progress.total > 0 && (
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
              {progress.pct}%
            </span>
          )}
          {open
            ? <ChevronDown className="w-4 h-4 text-slate-400" />
            : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="pl-2 space-y-2 ml-2">
          {subtopics.map((subtopic, si) => (
            <SubtopicSection
              key={subtopic.id}
              subtopic={subtopic}
              chapterId={chapterId}
              unitId={unit.id}
              isLocked={isLocked}
              defaultOpen={si === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChapterModal() {
  const {
    chapterModalOpen,
    closeChapterModal,
    chapters,
    selectedChapter,
    selectedChapterId,
    selectModalChapter,
    getChapterProgress,
  } = useApp();

  if (!chapterModalOpen || !selectedChapter) return null;

  const isLocked = selectedChapter.status === 'locked';
  const progress = getChapterProgress(selectedChapter);
  const units = getSortedUnits(selectedChapter);

  return (
    <div id="chapter-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 modal-backdrop">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 id="modal-chapter-title" className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
              Chapter {selectedChapter.number}: {selectedChapter.title}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              {isLocked ? (
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Locked Chapter
                </span>
              ) : (
                <>
                  <span id="modal-chapter-count" className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {progress.completed} of {progress.total} assets complete
                  </span>
                  <div className="w-28 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{progress.pct}%</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={closeChapterModal}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden min-h-0">
          
          {/* Chapter sidebar */}
          <div id="modal-chapters-sidebar" className="p-4 border-r border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto">
            {chapters.map((chapter) => {
              const isSelected = chapter.id === selectedChapterId;
              const isCompleted = chapter.status === 'completed';
              const chapterLocked = chapter.status === 'locked';
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => selectModalChapter(chapter.id)}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-center gap-3.5 border transition-all ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 stroke-2" />
                    </div>
                  ) : chapterLocked ? (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">CHAPTER {chapter.number}</div>
                    <div className={`text-sm font-semibold truncate ${chapterLocked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {chapter.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapter content tree: Units → Subtopics → Assets */}
          <div id="modal-lessons-list" className="md:col-span-2 p-5 space-y-4 overflow-y-auto">
            {units.length === 0 ? (
              <div className="flex items-center justify-center h-full py-10 text-sm text-slate-400">
                No units in this chapter yet.
              </div>
            ) : (
              <div className={`space-y-4 ${isLocked ? 'grayscale opacity-60' : ''}`}>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {units.length} unit{units.length !== 1 ? 's' : ''} {!isLocked && '· Click any asset to open it'}
                </div>
                {units.map((unit, ui) => (
                  <UnitSection
                    key={unit.id}
                    unit={unit}
                    chapterId={selectedChapter.id}
                    isLocked={isLocked}
                    unitIndex={ui}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}