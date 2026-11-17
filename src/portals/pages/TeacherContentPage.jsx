import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';
import ContentViewer from '../../components/content/ContentViewer.jsx';
import { TEACHER_TRAINING_COURSE } from '../data/teacherContentData';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Gamepad2,
  HelpCircle,
  Lightbulb,
  PanelRight,
  Play,
  Zap,
  MessageSquareQuote,
  AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY_COMPLETED = 'futureminds_teacher_assets_completed_v1';
const STORAGE_KEY_NOTES = 'futureminds_teacher_assets_notes_v1';

// Asset type badges & icons matching VideoLesson.jsx + Teaching Tips
const ASSET_META = {
  video:      { label: 'Video',         color: 'text-purple-600 dark:text-purple-400',  bg: 'bg-purple-100 dark:bg-purple-900/40' },
  summary:    { label: 'Summary',       color: 'text-sky-600 dark:text-sky-400',        bg: 'bg-sky-100 dark:bg-sky-900/40' },
  tips:       { label: 'Teaching Tips', color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-100 dark:bg-amber-900/40' },
  flashcards: { label: 'Cards',         color: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  quiz:       { label: 'Quiz',          color: 'text-rose-600 dark:text-rose-400',      bg: 'bg-rose-100 dark:bg-rose-900/40' },
  mindmap:    { label: 'Mindmap',       color: 'text-teal-600 dark:text-teal-400',      bg: 'bg-teal-100 dark:bg-teal-900/40' },
  lab:        { label: 'Lab',           color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
};

function assetIcon(type, className = 'w-3.5 h-3.5') {
  switch (type) {
    case 'video':      return <Play className={className} />;
    case 'summary':    return <FileText className={className} />;
    case 'tips':       return <Lightbulb className={className} />;
    case 'game':       return <Gamepad2 className={className} />;
    case 'quiz':       return <HelpCircle className={className} />;
    case 'mindmap':    return <Cpu className={className} />;
    case 'flashcards': return <BookOpen className={className} />;
    case 'lab':        return <Zap className={className} />;
    default:           return <FileText className={className} />;
  }
}

// Renderer for the 'tips' asset type (Teaching Tips, Analogies & Misconceptions)
function TeachingTipsRenderer({ asset }) {
  const data = asset.data || {};
  const analogies = data.analogies || [];
  const tips = data.tips || [];
  const misconceptions = data.misconceptions || [];

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
      <header>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Teaching Tips & Pedagogy
        </span>
        <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
          {asset.title}
        </h3>
        {asset.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {asset.description}
          </p>
        )}
      </header>

      {/* Classroom Tips */}
      {tips.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>How to Teach This in Class</span>
          </h4>
          <ul className="space-y-2.5">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-800/50 text-sm text-slate-700 dark:text-slate-200"
              >
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analogies */}
      {analogies.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <MessageSquareQuote className="w-4 h-4 text-purple-500" />
            <span>Board-Ready Analogies for Students</span>
          </h4>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {analogies.map((a, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/25 border border-purple-200/70 dark:border-purple-800/50 space-y-1.5"
              >
                <div className="text-xs font-extrabold text-purple-700 dark:text-purple-300">
                  {a.title}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Misconceptions */}
      {misconceptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Common Student Misconceptions</span>
          </h4>
          <div className="space-y-2.5">
            {misconceptions.map((m, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1 text-xs sm:text-sm"
              >
                <div className="font-bold text-rose-600 dark:text-rose-400">
                  Myth: {m.myth}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    How to clarify:{' '}
                  </span>
                  {m.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// ── Sidebar Subtopic Row (matches VideoLesson.jsx) ──────────────────────────
function SubtopicRow({
  subtopic,
  unitId,
  currentAssetId,
  completedIds,
  onSelectAsset,
  defaultOpen,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const assets = subtopic.assets || [];
  const completedCount = assets.filter((a) => completedIds.includes(a.id)).length;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-xl transition-all cursor-pointer"
      >
        {open ? (
          <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        )}
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex-1 truncate">
          {subtopic.title}
        </span>
        {assets.length > 0 && (
          <span className="text-[9px] font-bold text-slate-400">
            {completedCount}/{assets.length}
          </span>
        )}
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-100 dark:border-slate-800 pl-2">
          {assets.map((asset) => {
            const isActive = asset.id === currentAssetId;
            const completed = completedIds.includes(asset.id);
            const meta = ASSET_META[asset.type] || ASSET_META.summary;

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelectAsset(unitId, subtopic.id, asset.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 border border-transparent'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}
                >
                  {completed ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    assetIcon(asset.type, 'w-3 h-3')
                  )}
                </div>
                <span
                  className={`text-[11px] truncate flex-1 ${
                    isActive
                      ? 'font-bold text-emerald-700 dark:text-emerald-300'
                      : 'font-medium text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {meta.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#15ab5d] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sidebar Unit Section (matches VideoLesson.jsx) ──────────────────────────
function UnitSection({
  unit,
  isCurrentUnit,
  currentAssetId,
  completedIds,
  onSelectAsset,
}) {
  const [open, setOpen] = useState(true);
  const subtopics = unit.subtopics || [];

  const unitAssets = subtopics.flatMap((s) => s.assets || []);
  const unitDone = unitAssets.filter((a) => completedIds.includes(a.id)).length;
  const unitPct =
    unitAssets.length > 0 ? Math.round((unitDone / unitAssets.length) * 100) : 0;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700/60 cursor-pointer"
      >
        <div className="w-6 h-6 rounded-lg bg-[#15ab5d] text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
          U{unit.order}
        </div>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex-1 text-left truncate">
          {unit.title}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {unitAssets.length > 0 && (
            <span className="text-[9px] font-black text-[#15ab5d]">
              {unitPct}%
            </span>
          )}
          {open ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="ml-2 space-y-1">
          {subtopics.map((subtopic, si) => (
            <SubtopicRow
              key={subtopic.id}
              subtopic={subtopic}
              unitId={unit.id}
              currentAssetId={currentAssetId}
              completedIds={completedIds}
              onSelectAsset={onSelectAsset}
              defaultOpen={si === 0 || isCurrentUnit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main TeacherContentPage (modeled after Student VideoLesson.jsx) ─────────
export const TeacherContentPage = () => {
  const units = TEACHER_TRAINING_COURSE.units || [];

  // Flatten all assets in order for Prev / Next navigation
  const flatAssets = useMemo(() => {
    const list = [];
    for (const u of units) {
      for (const s of u.subtopics || []) {
        for (const a of s.assets || []) {
          list.push({ unit: u, subtopic: s, asset: a });
        }
      }
    }
    return list;
  }, [units]);

  const [currentAssetId, setCurrentAssetId] = useState(
    () => flatAssets[0]?.asset.id || null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoTab, setVideoTab] = useState('overview'); // 'overview' | 'notes'
  const [noteSaved, setNoteSaved] = useState(false);

  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notesByAsset, setNotesByAsset] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedIds));
    } catch {
      /* ignore */
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesByAsset));
    } catch {
      /* ignore */
    }
  }, [notesByAsset]);

  const currentIdx = useMemo(
    () => flatAssets.findIndex((item) => item.asset.id === currentAssetId),
    [flatAssets, currentAssetId]
  );

  const activeEntry = flatAssets[currentIdx] || flatAssets[0];
  const currentUnit = activeEntry?.unit;
  const currentSubtopic = activeEntry?.subtopic;
  const currentAsset = activeEntry?.asset;

  const isCompleted = currentAsset ? completedIds.includes(currentAsset.id) : false;
  const isVideoAsset = currentAsset?.type === 'video';

  // Unit progress for right sidebar header
  const unitProgress = useMemo(() => {
    if (!currentUnit) return { pct: 0, completed: 0, total: 0 };
    const assets = (currentUnit.subtopics || []).flatMap((s) => s.assets || []);
    const completed = assets.filter((a) => completedIds.includes(a.id)).length;
    const total = assets.length;
    return {
      completed,
      total,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [currentUnit, completedIds]);

  const toggleAssetComplete = (assetId) => {
    setCompletedIds((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const navigateAdjacentAsset = (dir) => {
    const nextIdx = dir === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx >= 0 && nextIdx < flatAssets.length) {
      setCurrentAssetId(flatAssets[nextIdx].asset.id);
    }
  };

  const handleSelectAsset = (_unitId, _subtopicId, assetId) => {
    setCurrentAssetId(assetId);
  };

  // Build manifest for ContentViewer (video, summary, flashcards, quiz, mindmap, lab)
  const assetManifest = currentAsset
    ? {
        id: currentAsset.id,
        type: currentAsset.type,
        title: currentAsset.title,
        description: currentAsset.description || '',
        data: currentAsset.data || {},
      }
    : null;

  const tabClass = (tab) =>
    videoTab === tab
      ? 'pb-3 font-bold text-sm text-[#15ab5d] border-b-2 border-[#15ab5d] cursor-pointer'
      : 'pb-3 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-[#15ab5d] border-b-2 border-transparent cursor-pointer';

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          {currentUnit && currentSubtopic && (
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                {TEACHER_TRAINING_COURSE.title}
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 dark:text-slate-400">
                {currentUnit.title}
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#15ab5d] font-bold">
                {currentSubtopic.title}
              </span>

              {!isSidebarOpen && (
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#15ab5d] bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition-all cursor-pointer"
                    title="Expand Sidebar"
                  >
                    <PanelRight className="w-4 h-4" />
                    <span className="hidden sm:inline">Show Menu</span>
                  </button>
                </div>
              )}
            </nav>
          )}

          <div
            className={`grid grid-cols-1 ${
              isSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
            } gap-8 items-start`}
          >
            {/* ── Main Content Area (2/3 width) ── */}
            <div
              className={`${
                isSidebarOpen ? 'lg:col-span-2' : 'lg:col-span-1'
              } space-y-6`}
            >
              {/* Lesson Content Header with Title, Prev/Next, and Mark as Completed */}
              {currentAsset && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          ASSET_META[currentAsset.type]?.bg || 'bg-emerald-100'
                        } ${
                          ASSET_META[currentAsset.type]?.color || 'text-[#15ab5d]'
                        }`}
                      >
                        {ASSET_META[currentAsset.type]?.label || currentAsset.type}
                      </span>
                      <span className="text-xs text-slate-400 font-medium truncate">
                        {currentUnit?.title} · {currentSubtopic?.title}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display truncate">
                      {ASSET_META[currentAsset.type]?.label || currentAsset.type}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button
                      type="button"
                      disabled={currentIdx <= 0}
                      onClick={() => navigateAdjacentAsset('prev')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
                      title="Previous Item"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      type="button"
                      disabled={currentIdx >= flatAssets.length - 1}
                      onClick={() => navigateAdjacentAsset('next')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
                      title="Next Item"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAssetComplete(currentAsset.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-600'
                          : 'bg-[#15ab5d] text-white shadow-emerald-600/25 hover:bg-[#129650]'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Content Viewer — renders Video, Summary, Teaching Tips, Flashcards, Quiz */}
              {currentAsset &&
                (currentAsset.type === 'tips' ? (
                  <TeachingTipsRenderer asset={currentAsset} />
                ) : (
                  <ContentViewer manifest={assetManifest} />
                ))}

              {/* Overview & Notes box below Video assets (just like Student VideoLesson.jsx) */}
              {currentAsset && isVideoAsset && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-7 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-700 flex items-center gap-8">
                    <button
                      type="button"
                      onClick={() => setVideoTab('overview')}
                      className={tabClass('overview')}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoTab('notes')}
                      className={tabClass('notes')}
                    >
                      Notes
                    </button>
                  </div>

                  {videoTab === 'overview' && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {currentAsset.description}
                      </p>
                    </div>
                  )}

                  {videoTab === 'notes' && (
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Your Teaching Notepad
                      </label>
                      <textarea
                        rows="5"
                        value={notesByAsset[currentAsset.id] || ''}
                        onChange={(e) =>
                          setNotesByAsset((prev) => ({
                            ...prev,
                            [currentAsset.id]: e.target.value,
                          }))
                        }
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15ab5d] font-mono leading-relaxed"
                        placeholder="Type your personal teaching takeaways here..."
                      />
                      <div className="flex items-center justify-end gap-3">
                        {noteSaved && (
                          <span className="text-xs font-bold text-[#15ab5d]">
                            ✓ Saved
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setNoteSaved(true);
                            setTimeout(() => setNoteSaved(false), 2000);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#15ab5d] text-white font-bold text-xs shadow-md hover:bg-[#129650] transition-all cursor-pointer"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Right Navigation Sidebar (matches Student VideoLesson.jsx) ── */}
            {isSidebarOpen && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4 sticky top-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#15ab5d]">
                      Teacher Module {TEACHER_TRAINING_COURSE.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Hide Menu"
                    >
                      <PanelRight className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display leading-snug">
                    {TEACHER_TRAINING_COURSE.title}
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
                          className="bg-[#15ab5d] h-full rounded-full transition-all duration-500"
                          style={{ width: `${unitProgress.pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Unit -> Subtopic -> Asset tree */}
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {units.map((unit) => (
                    <UnitSection
                      key={unit.id}
                      unit={unit}
                      isCurrentUnit={unit.id === currentUnit?.id}
                      currentAssetId={currentAsset?.id}
                      completedIds={completedIds}
                      onSelectAsset={handleSelectAsset}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
