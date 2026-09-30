import { useState } from 'react';
import { BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Cpu, FileText, Gamepad2, HelpCircle, Lock, Pause, Play, Settings, Sparkles, Volume2, Zap, PanelRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import ContentViewer from './content/ContentViewer.jsx';
import { getSortedUnits, getSortedSubtopics, getSortedAssets } from '../data/courseData';

// ── Asset type helpers ─────────────────────────────────────────────────────
const ASSET_META = {
  video:      { label: 'Video',      color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  summary:    { label: 'Summary',    color: 'text-sky-600 dark:text-sky-400',       bg: 'bg-sky-100 dark:bg-sky-900/40' },
  game:       { label: 'Game',       color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-900/40' },
  quiz:       { label: 'Quiz',       color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-100 dark:bg-rose-900/40' },
  mindmap:    { label: 'Mindmap',    color: 'text-teal-600 dark:text-teal-400',     bg: 'bg-teal-100 dark:bg-teal-900/40' },
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

// ── Sidebar: SubtopicRow ───────────────────────────────────────────────────
function SubtopicRow({ subtopic, chapterId, unitId, isChapterLocked, defaultOpen }) {
  const { currentAssetId, navigateToAsset, getAssetCompleted, getSubtopicProgress } = useApp();
  const [open, setOpen] = useState(defaultOpen);
  const assets = getSortedAssets(subtopic);
  const progress = getSubtopicProgress(subtopic);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition-all group"
      >
        {open
          ? <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
          : <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />}
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex-1 truncate">{subtopic.title}</span>
        {progress.total > 0 && (
          <span className="text-[9px] font-bold text-slate-400">{progress.completed}/{progress.total}</span>
        )}
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-100 dark:border-slate-800 pl-2">
          {assets.map((asset) => {
            const isActive = asset.id === currentAssetId;
            const completed = getAssetCompleted(asset.id);
            const meta = ASSET_META[asset.type] || ASSET_META.summary;

            return (
              <button
                key={asset.id}
                type="button"
                disabled={isChapterLocked}
                onClick={() => !isChapterLocked && navigateToAsset(chapterId, unitId, subtopic.id, asset.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 border border-transparent'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {completed
                    ? <Check className="w-3 h-3 stroke-[3]" />
                    : assetIcon(asset.type, 'w-3 h-3')}
                </div>
                <span className={`text-[11px] truncate flex-1 ${isActive ? 'font-bold text-purple-700 dark:text-purple-300' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                  {asset.title}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sidebar: UnitSection ───────────────────────────────────────────────────
function UnitSection({ unit, chapterId, isChapterLocked, isCurrentUnit, unitIndex }) {
  const [open, setOpen] = useState(isCurrentUnit);
  const subtopics = getSortedSubtopics(unit);
  const { getUnitProgress } = useApp();
  const progress = getUnitProgress(unit);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700/60"
      >
        <div className="w-6 h-6 rounded-lg bg-purple-600 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
          U{unit.order}
        </div>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex-1 text-left truncate">{unit.title}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {progress.total > 0 && (
            <span className="text-[9px] font-black text-purple-600 dark:text-purple-400">
              {progress.pct}%
            </span>
          )}
          {open
            ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="ml-2 space-y-1">
          {subtopics.map((subtopic, si) => (
            <SubtopicRow
              key={subtopic.id}
              subtopic={subtopic}
              chapterId={chapterId}
              unitId={unit.id}
              isChapterLocked={isChapterLocked}
              defaultOpen={si === 0 && isCurrentUnit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main VideoLesson ───────────────────────────────────────────────────────
export default function VideoLesson() {
  const {
    currentChapter,
    currentUnit,
    currentSubtopic,
    currentAsset,
    currentAssetId,
    currentChapterId,
    currentUnitId,
    video,
    navigateTo,
    showToast,
    toggleVideoPlay,
    switchVideoTab,
    saveVideoNote,
    discussionInput,
    setDiscussionInput,
    postDiscussionReply,
    markAssetComplete,
    toggleAssetComplete,
    getAssetCompleted,
    getUnitProgress,
    navigateAdjacentAsset,
  } = useApp();

  const [notes, setNotes] = useState(video.notes);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tabClass = (tab) =>
    video.activeTab === tab
      ? 'pb-3 font-bold text-sm text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
      : 'pb-3 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 border-b-2 border-transparent';

  const isChapterLocked = currentChapter?.status === 'locked';
  const unitProgress = currentUnit ? getUnitProgress(currentUnit) : { pct: 0, completed: 0, total: 0 };
  const isCompleted = currentAssetId ? getAssetCompleted(currentAssetId) : false;

  // Build the manifest shape that ContentViewer/renderers expect from the asset
  const assetManifest = currentAsset
    ? {
        id: currentAsset.id,
        type: currentAsset.type,
        title: currentAsset.title,
        description: currentAsset.description || '',
        data: currentAsset.data || {},
      }
    : null;

  const isVideoAsset = currentAsset?.type === 'video';
  const units = currentChapter ? getSortedUnits(currentChapter) : [];

  return (
    <main id="view-video" className="view-container p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6">

      {/* Breadcrumb */}
      {currentChapter && currentUnit && currentSubtopic && (
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex-wrap">
          <button type="button" onClick={() => navigateTo('roadmap-2')} className="hover:text-purple-600 transition-colors">
            Roadmap
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentChapter.title}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-400">{currentUnit.title}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-purple-600 dark:text-purple-400 font-bold">{currentSubtopic.title}</span>
          
          {!isSidebarOpen && (
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelRight className="w-4 h-4" /> 
                <span className="hidden sm:inline">Show Menu</span>
              </button>
            </div>
          )}
        </nav>
      )}

      <div className={`grid grid-cols-1 ${isSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8 items-start`}>
        
        {/* ── Main Content Area ── */}
        <div className={`${isSidebarOpen ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-6`}>

          {/* Video Player — only shown for video assets
          {isVideoAsset && (
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl aspect-video border border-slate-800 flex flex-col justify-between group">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&auto=format&fit=crop&q=80')", backgroundPosition: 'top center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

              <div className="relative z-10 p-5 flex items-start justify-between">
                <div className="text-xs text-white/80 font-medium">{currentSubtopic?.title} · {currentAsset?.title}</div>
              </div>

              <div className="relative z-10 my-auto mx-auto">
                <button
                  id="video-center-play-btn"
                  type="button"
                  onClick={toggleVideoPlay}
                  className="w-20 h-20 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white backdrop-blur-md shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all cursor-pointer"
                >
                  {video.isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                </button>
              </div>

              <div className="relative z-10 p-5 pt-0 space-y-2.5">
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden cursor-pointer relative" onClick={() => showToast('Scrubbed', 'Jumped timeline position', 'info')}>
                  <div className="bg-purple-500 h-full w-[45%] rounded-full relative">
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-white text-xs pt-1">
                  <div className="flex items-center gap-4">
                    <button id="video-bottom-play-btn" type="button" onClick={toggleVideoPlay} className="hover:text-purple-400 transition-colors">
                      {video.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button type="button" onClick={() => showToast('Volume', 'Volume set to 100%', 'info')} className="hover:text-purple-400 transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="text-[11px] text-white/70 font-mono">01:12 / {currentAsset?.data?.durationMinutes ?? '?'}:00</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => showToast('Speed', 'Playback Speed: 1.0x', 'info')} className="hover:text-purple-400 text-xs font-bold font-mono">1.0x</button>
                    <button type="button" onClick={() => showToast('Settings', 'Video quality: 1080p 60fps', 'info')} className="hover:text-purple-400">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Lesson Content Header with Title and Universal "Mark as Completed" */}
          {currentAsset && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${ASSET_META[currentAsset.type]?.bg || 'bg-purple-100'} ${ASSET_META[currentAsset.type]?.color || 'text-purple-600'}`}>
                    {ASSET_META[currentAsset.type]?.label || currentAsset.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium truncate">
                    {currentChapter?.title} · {currentUnit?.title} · {currentSubtopic?.title}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display truncate">
                  {currentAsset.title}
                </h1>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                {/* Navigation arrows */}
                <button
                  type="button"
                  onClick={() => navigateAdjacentAsset('prev')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  title="Previous Asset"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => navigateAdjacentAsset('next')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  title="Next Asset"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>

                {/* Mark as Completed — Available for EVERY asset type */}
                <button
                  type="button"
                  id="mark-completed-btn"
                  onClick={() => toggleAssetComplete(currentAsset.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-600'
                      : 'bg-purple-600 text-white shadow-purple-600/25 hover:bg-purple-700'
                  }`}
                  title={isCompleted ? 'Completed! Click to toggle' : 'Mark as Completed'}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Content Renderer — renders the actual asset content */}
          {assetManifest && (
            <ContentViewer manifest={assetManifest} />
          )}

          {!currentAsset && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <div className="text-base font-bold text-slate-900 dark:text-white mb-1">Ready to learn?</div>
              <p className="text-sm text-slate-400">Select a lesson from the navigation panel, or use the roadmap to find your next topic.</p>
              <button
                type="button"
                onClick={() => navigateTo('roadmap-2')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
              >
                Go to Roadmap
              </button>
            </div>
          )}

          {/* Notes & Overview box — ONLY FOR VIDEO ASSETS (Discussion removed) */}
          {currentAsset && isVideoAsset && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-7 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-700 flex items-center gap-8">
                <button
                  id="video-tab-btn-overview"
                  type="button"
                  onClick={() => switchVideoTab('overview')}
                  className={tabClass('overview')}
                >
                  Overview
                </button>
                <button
                  id="video-tab-btn-notes"
                  type="button"
                  onClick={() => switchVideoTab('notes')}
                  className={tabClass('notes')}
                >
                  Notes
                </button>
              </div>

              {video.activeTab === 'overview' && (
                <div id="video-tab-pane-overview" className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentAsset.description || `This video lesson is part of "${currentSubtopic?.title}" in ${currentChapter?.title}.`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentChapter?.tags?.map((tag) => (
                      <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {video.activeTab === 'notes' && (
                <div id="video-tab-pane-notes" className="space-y-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Your Study Notepad</label>
                  <textarea
                    id="video-notes-input"
                    rows="5"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono leading-relaxed"
                    placeholder="Type your personal takeaways here..."
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => saveVideoNote(notes)}
                      className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition-all cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Navigation Sidebar ── */}
        {isSidebarOpen && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4 sticky top-6">
            {/* Chapter header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  Chapter {currentChapter?.number ?? '—'}
                </span>
                <div className="flex items-center gap-2">
                  {isChapterLocked && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Hide Menu"
                  >
                    <PanelRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display leading-snug">
                {currentChapter?.title ?? 'Select a chapter'}
              </h3>
  
              {/* Unit progress bar */}
              {currentUnit && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>{currentUnit.title}</span>
                    <span>{unitProgress.pct}%</span>
                  </div>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${unitProgress.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
  
            {/* Unit → Subtopic → Asset tree */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {units.map((unit, ui) => (
                <UnitSection
                  key={unit.id}
                  unit={unit}
                  chapterId={currentChapterId}
                  isChapterLocked={isChapterLocked}
                  isCurrentUnit={unit.id === currentUnitId}
                  unitIndex={ui}
                />
              ))}
              {units.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  No lessons yet. Add content in the CMS.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
