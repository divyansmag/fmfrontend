import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';
import { useApp } from '../../context/AppContext.jsx';
import ContentViewer from '../../components/content/ContentViewer.jsx';
import {
  getSortedChapters,
  getSortedUnits,
  getSortedSubtopics,
  getSortedAssets,
} from '../../data/courseData';
import { studentsData } from '../data/studentsData';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Gamepad2,
  HelpCircle,
  MonitorPlay,
  PanelLeft,
  Play,
  Sparkles,
  Users,
  Zap,
  CheckSquare,
  RotateCcw,
  Eye,
  GraduationCap,
} from 'lucide-react';

const ASSET_META = {
  video:      { label: 'Video Lesson', short: 'Video',   color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  summary:    { label: 'Theory & Summary', short: 'Summary', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/40' },
  game:       { label: 'Interactive Game', short: 'Game', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  quiz:       { label: 'Class Quiz',   short: 'Quiz',    color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-100 dark:bg-rose-900/40' },
  mindmap:    { label: 'Mindmap',      short: 'Mindmap', color: 'text-teal-600 dark:text-teal-400',     bg: 'bg-teal-100 dark:bg-teal-900/40' },
  flashcards: { label: 'Flashcards',   short: 'Cards',   color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  lab:        { label: 'Hands-on Lab', short: 'Lab',     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
};

function assetIcon(type, className = 'w-4 h-4') {
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

export const TeacherStudentMaterialPage = () => {
  const {
    courseData,
    completedAssetIds,
    teacherClassCompleted,
    getAssetCompleted,
    getSubtopicProgress,
    getUnitProgress,
    getChapterProgress,
    markAssetsCompleteForClass,
    navigateTo,
    loginAsRole,
  } = useApp();

  // Grade & Section selection
  const [selectedGrade, setSelectedGrade] = useState('6');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);

  // Target scope for marking complete: 'all' (Entire Class) or 'selected' (Specific Students)
  const [completionMode, setCompletionMode] = useState('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState(() =>
    studentsData.map((s) => s.id)
  );
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Filter chapters for selected grade
  const gradeChapters = useMemo(() => {
    return getSortedChapters(courseData).filter(
      (c) => String(c.grade || '6') === String(selectedGrade)
    );
  }, [courseData, selectedGrade]);

  const [activeChapterId, setActiveChapterId] = useState(() => gradeChapters[0]?.id || null);
  const [activeUnitId, setActiveUnitId] = useState(() => gradeChapters[0]?.units?.[0]?.id || null);
  const [activeSubtopicId, setActiveSubtopicId] = useState(
    () => gradeChapters[0]?.units?.[0]?.subtopics?.[0]?.id || null
  );
  const [activeAssetId, setActiveAssetId] = useState(
    () => gradeChapters[0]?.units?.[0]?.subtopics?.[0]?.assets?.[0]?.id || null
  );

  // Expanded tree state
  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});

  // Sync active selection when grade changes
  useEffect(() => {
    const firstCh = gradeChapters[0];
    if (!firstCh) return;
    setActiveChapterId(firstCh.id);
    const firstUnit = getSortedUnits(firstCh)[0];
    setActiveUnitId(firstUnit?.id || null);
    const firstSub = firstUnit ? getSortedSubtopics(firstUnit)[0] : null;
    setActiveSubtopicId(firstSub?.id || null);
    const firstAsset = firstSub ? getSortedAssets(firstSub)[0] : null;
    setActiveAssetId(firstAsset?.id || null);

    if (firstUnit) {
      setExpandedUnits((prev) => ({ ...prev, [firstUnit.id]: true }));
    }
    if (firstSub) {
      setExpandedSubtopics((prev) => ({ ...prev, [firstSub.id]: true }));
    }
  }, [selectedGrade, gradeChapters]);

  const activeChapter = useMemo(
    () => gradeChapters.find((c) => c.id === activeChapterId) || gradeChapters[0],
    [gradeChapters, activeChapterId]
  );

  const units = useMemo(
    () => (activeChapter ? getSortedUnits(activeChapter) : []),
    [activeChapter]
  );

  const activeUnit = useMemo(
    () => units.find((u) => u.id === activeUnitId) || units[0],
    [units, activeUnitId]
  );

  const subtopics = useMemo(
    () => (activeUnit ? getSortedSubtopics(activeUnit) : []),
    [activeUnit]
  );

  const activeSubtopic = useMemo(
    () => subtopics.find((s) => s.id === activeSubtopicId) || subtopics[0],
    [subtopics, activeSubtopicId]
  );

  const subtopicAssets = useMemo(
    () => (activeSubtopic ? getSortedAssets(activeSubtopic) : []),
    [activeSubtopic]
  );

  const activeAsset = useMemo(
    () => subtopicAssets.find((a) => a.id === activeAssetId) || subtopicAssets[0],
    [subtopicAssets, activeAssetId]
  );

  // Build manifest for ContentViewer
  const assetManifest = useMemo(() => {
    if (!activeAsset) return null;
    return {
      id: activeAsset.id,
      type: activeAsset.type,
      title: activeAsset.title,
      description: activeAsset.description || '',
      data: activeAsset.data || {},
    };
  }, [activeAsset]);

  // Flat list of all assets in the current chapter for easy Prev / Next navigation
  const flatChapterAssets = useMemo(() => {
    if (!activeChapter) return [];
    const list = [];
    for (const u of getSortedUnits(activeChapter)) {
      for (const s of getSortedSubtopics(u)) {
        for (const a of getSortedAssets(s)) {
          list.push({
            chapterId: activeChapter.id,
            unitId: u.id,
            subtopicId: s.id,
            asset: a,
          });
        }
      }
    }
    return list;
  }, [activeChapter]);

  const currentFlatIndex = useMemo(
    () => flatChapterAssets.findIndex((item) => item.asset.id === activeAsset?.id),
    [flatChapterAssets, activeAsset]
  );

  const handleSelectAsset = (chapterId, unitId, subtopicId, assetId) => {
    setActiveChapterId(chapterId);
    setActiveUnitId(unitId);
    setActiveSubtopicId(subtopicId);
    setActiveAssetId(assetId);
    setExpandedUnits((prev) => ({ ...prev, [unitId]: true }));
    setExpandedSubtopics((prev) => ({ ...prev, [subtopicId]: true }));
  };

  const handleNavigateAdjacent = (dir) => {
    if (currentFlatIndex === -1) return;
    const targetIdx = dir === 'next' ? currentFlatIndex + 1 : currentFlatIndex - 1;
    if (targetIdx >= 0 && targetIdx < flatChapterAssets.length) {
      const target = flatChapterAssets[targetIdx];
      handleSelectAsset(target.chapterId, target.unitId, target.subtopicId, target.asset.id);
    }
  };

  const getScopeLabel = () => {
    if (completionMode === 'all' || selectedStudentIds.length === studentsData.length) {
      return `Grade ${selectedGrade} – ${selectedSection} (All Students)`;
    }
    return `${selectedStudentIds.length} Selected Students in Grade ${selectedGrade}`;
  };

  const isCurrentAssetCompleted = activeAsset ? getAssetCompleted(activeAsset.id) : false;
  const currentAssetClassMeta = activeAsset ? teacherClassCompleted[activeAsset.id] : null;
  const subtopicProgress = activeSubtopic ? getSubtopicProgress(activeSubtopic) : { completed: 0, total: 0, pct: 0 };
  const chapterProgress = activeChapter ? getChapterProgress(activeChapter) : { completed: 0, total: 0, pct: 0 };

  const handleToggleCurrentAssetComplete = () => {
    if (!activeAsset) return;
    markAssetsCompleteForClass([activeAsset.id], !isCurrentAssetCompleted, {
      scope: getScopeLabel(),
      studentIds: completionMode === 'all' ? 'all' : selectedStudentIds,
    });
  };

  const handleMarkSubtopicComplete = () => {
    if (!subtopicAssets.length) return;
    const allIds = subtopicAssets.map((a) => a.id);
    const allDone = allIds.every((id) => getAssetCompleted(id));
    markAssetsCompleteForClass(allIds, !allDone, {
      scope: getScopeLabel(),
      studentIds: completionMode === 'all' ? 'all' : selectedStudentIds,
    });
  };

  const handleMarkUnitComplete = (unit) => {
    const unitAssetIds = [];
    for (const s of getSortedSubtopics(unit)) {
      for (const a of getSortedAssets(s)) {
        unitAssetIds.push(a.id);
      }
    }
    if (!unitAssetIds.length) return;
    const allDone = unitAssetIds.every((id) => getAssetCompleted(id));
    markAssetsCompleteForClass(unitAssetIds, !allDone, {
      scope: getScopeLabel(),
      studentIds: completionMode === 'all' ? 'all' : selectedStudentIds,
    });
  };

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePreviewAsStudent = () => {
    loginAsRole('student', { grade: `Grade ${selectedGrade}` });
    navigateTo('dashboard');
  };

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {!presentationMode && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {!presentationMode && <DashboardHeader />}

        <main className={`flex-1 ${presentationMode ? 'p-4 md:p-6 max-w-[1600px]' : 'p-6 md:p-8 max-w-7xl'} w-full mx-auto space-y-6`}>
          {/* Page Header & Classroom Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#16b364] bg-[#e6f7ee] dark:bg-[#183928] px-3 py-1 rounded-full">
                  <MonitorPlay className="w-3.5 h-3.5" />
                  Classroom Teaching & Student Material
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-full">
                  Auto-Syncs with Student Portal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display pt-1">
                Student Material & Classroom Mode
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                Present videos, quizzes, games, labs, and summaries in class. Marking any material complete here automatically marks it complete for your students.
              </p>
            </div>

            {/* Grade, Class & View Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Grade Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
                {['6', '7', '8'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      selectedGrade === g
                        ? 'bg-[#15ab5d] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>

              {/* Section Selector */}
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15ab5d]/40 cursor-pointer"
              >
                <option value="Section A">Section A (42 Students)</option>
                <option value="Section B">Section B (38 Students)</option>
              </select>

              {/* Target Students Selector Button */}
              <button
                type="button"
                onClick={() => setShowStudentModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Choose which students get marked complete"
              >
                <Users className="w-3.5 h-3.5" />
                <span>
                  {completionMode === 'all'
                    ? 'Target: Entire Class'
                    : `Target: ${selectedStudentIds.length} Students`}
                </span>
              </button>

              {/* Presentation Mode Toggle */}
              <button
                type="button"
                onClick={() => setPresentationMode((p) => !p)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  presentationMode
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title="Hide portal navigation for projector / smartboard view"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>{presentationMode ? 'Exit Projector Mode' : 'Projector Mode'}</span>
              </button>

              {/* Preview Student Portal Button */}
              <button
                type="button"
                onClick={handlePreviewAsStudent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/70 hover:bg-purple-100 transition-colors cursor-pointer"
                title="Switch to Student View to verify synced completion"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Verify as Student</span>
              </button>
            </div>
          </div>

          {/* Chapter Selector Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {gradeChapters.map((ch) => {
              const isSelected = ch.id === activeChapter?.id;
              const prog = getChapterProgress(ch);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setActiveChapterId(ch.id);
                    const firstU = getSortedUnits(ch)[0];
                    setActiveUnitId(firstU?.id || null);
                    const firstS = firstU ? getSortedSubtopics(firstU)[0] : null;
                    setActiveSubtopicId(firstS?.id || null);
                    const firstA = firstS ? getSortedAssets(firstS)[0] : null;
                    setActiveAssetId(firstA?.id || null);
                    if (firstU) setExpandedUnits((prev) => ({ ...prev, [firstU.id]: true }));
                    if (firstS) setExpandedSubtopics((prev) => ({ ...prev, [firstS.id]: true }));
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-left transition-all flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#15ab5d] text-white border-[#15ab5d] shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-[#15ab5d]/50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#15ab5d]'
                    }`}
                  >
                    {ch.number || ch.order}
                  </span>
                  <div>
                    <div className="text-xs font-extrabold leading-tight max-w-[200px] truncate">
                      {ch.title}
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {prog.completed}/{prog.total} Assets Done ({prog.pct}%)
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Classroom Split Layout */}
          <div className={`grid grid-cols-1 ${isCurriculumOpen ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start`}>
            {/* Left Curriculum Tree Sidebar (4 cols) */}
            {isCurriculumOpen && (
              <aside className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4 lg:sticky lg:top-24">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#15ab5d]">
                      Chapter {activeChapter?.number ?? '01'} Curriculum
                    </span>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug mt-0.5">
                      {activeChapter?.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCurriculumOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Collapse Curriculum Tree"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Chapter overall completion bar */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600 dark:text-slate-300">Class Chapter Completion</span>
                    <span className="text-[#15ab5d] font-extrabold">
                      {chapterProgress.completed}/{chapterProgress.total} ({chapterProgress.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="bg-[#15ab5d] h-full rounded-full transition-all duration-500"
                      style={{ width: `${chapterProgress.pct}%` }}
                    />
                  </div>
                </div>

                {/* Units -> Subtopics -> Assets Tree */}
                <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                  {units.map((unit) => {
                    const unitProg = getUnitProgress(unit);
                    const isUnitOpen = expandedUnits[unit.id] ?? unit.id === activeUnit?.id;
                    const unitSubs = getSortedSubtopics(unit);

                    return (
                      <div
                        key={unit.id}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 overflow-hidden bg-slate-50/40 dark:bg-slate-900/30"
                      >
                        {/* Unit Header */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/70 dark:bg-slate-800/80">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedUnits((prev) => ({ ...prev, [unit.id]: !isUnitOpen }))
                            }
                            className="flex items-center gap-2.5 flex-1 text-left min-w-0 cursor-pointer"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#15ab5d] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                              U{unit.order}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
                                {unit.title}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                {unitProg.completed}/{unitProg.total} completed ({unitProg.pct}%)
                              </div>
                            </div>
                            {isUnitOpen ? (
                              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkUnitComplete(unit)}
                            title={
                              unitProg.pct === 100
                                ? 'Unmark unit for class'
                                : 'Mark entire unit complete for class'
                            }
                            className={`ml-2 px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                              unitProg.pct === 100
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-[#15ab5d] hover:text-[#15ab5d]'
                            }`}
                          >
                            <CheckSquare className="w-3 h-3" />
                            <span>{unitProg.pct === 100 ? 'Unit Done' : 'Complete Unit'}</span>
                          </button>
                        </div>

                        {/* Subtopics List */}
                        {isUnitOpen && (
                          <div className="p-2 space-y-1.5">
                            {unitSubs.map((sub) => {
                              const subProg = getSubtopicProgress(sub);
                              const isSubOpen =
                                expandedSubtopics[sub.id] ?? sub.id === activeSubtopic?.id;
                              const assets = getSortedAssets(sub);
                              const allSubDone = subProg.total > 0 && subProg.pct === 100;

                              return (
                                <div
                                  key={sub.id}
                                  className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-2"
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedSubtopics((prev) => ({
                                          ...prev,
                                          [sub.id]: !isSubOpen,
                                        }))
                                      }
                                      className="flex items-center gap-2 text-left flex-1 min-w-0 py-1 px-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer"
                                    >
                                      {isSubOpen ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                      )}
                                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1">
                                        {sub.title}
                                      </span>
                                      <span
                                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                          allSubDone
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                            : 'text-slate-400'
                                        }`}
                                      >
                                        {subProg.completed}/{subProg.total}
                                      </span>
                                    </button>

                                    {assets.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const ids = assets.map((a) => a.id);
                                          markAssetsCompleteForClass(ids, !allSubDone, {
                                            scope: getScopeLabel(),
                                            studentIds:
                                              completionMode === 'all' ? 'all' : selectedStudentIds,
                                          });
                                        }}
                                        title={
                                          allSubDone
                                            ? 'Reset topic completion'
                                            : 'Mark all assets in this topic complete for students'
                                        }
                                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                          allSubDone
                                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
                                            : 'text-slate-400 hover:text-[#15ab5d] hover:bg-emerald-50/50'
                                        }`}
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Assets inside Subtopic */}
                                  {isSubOpen && (
                                    <div className="mt-1.5 pl-4 space-y-1 border-l-2 border-slate-100 dark:border-slate-700 ml-2">
                                      {assets.map((asset) => {
                                        const isActive = asset.id === activeAsset?.id;
                                        const isDone = getAssetCompleted(asset.id);
                                        const meta = ASSET_META[asset.type] || ASSET_META.summary;

                                        return (
                                          <div
                                            key={asset.id}
                                            className={`flex items-center justify-between gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${
                                              isActive
                                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/40 border border-transparent'
                                            }`}
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleSelectAsset(
                                                  activeChapter.id,
                                                  unit.id,
                                                  sub.id,
                                                  asset.id
                                                )
                                              }
                                              className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
                                            >
                                              <span
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}
                                              >
                                                {assetIcon(asset.type, 'w-3.5 h-3.5')}
                                              </span>
                                              <div className="min-w-0 flex-1">
                                                <div
                                                  className={`text-xs truncate ${
                                                    isActive
                                                      ? 'font-extrabold text-emerald-800 dark:text-emerald-300'
                                                      : 'font-semibold text-slate-700 dark:text-slate-300'
                                                  }`}
                                                >
                                                  {asset.title || meta.label}
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                  {meta.short}
                                                </div>
                                              </div>
                                            </button>

                                            {/* Quick Mark Complete toggle checkbox */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                markAssetsCompleteForClass([asset.id], !isDone, {
                                                  scope: getScopeLabel(),
                                                  studentIds:
                                                    completionMode === 'all'
                                                      ? 'all'
                                                      : selectedStudentIds,
                                                })
                                              }
                                              title={
                                                isDone
                                                  ? 'Completed for class (click to undo)'
                                                  : 'Mark complete for students'
                                              }
                                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                                                isDone
                                                  ? 'bg-[#15ab5d] text-white shadow-2xs'
                                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-emerald-100 hover:text-[#15ab5d]'
                                              }`}
                                            >
                                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}

            {/* Right Main Material Viewer & In-Class Action Bar */}
            <div className={`${isCurriculumOpen ? 'lg:col-span-8' : 'lg:col-span-1'} space-y-5`}>
              {/* Subtopic Asset Switcher Tabs + Classroom Action Bar */}
              {activeSubtopic && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                  {/* Breadcrumb & Expand Tree Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                      {!isCurriculumOpen && (
                        <button
                          type="button"
                          onClick={() => setIsCurriculumOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#15ab5d] font-bold text-xs border border-emerald-200 dark:border-emerald-800 mr-1 cursor-pointer"
                        >
                          <PanelLeft className="w-3.5 h-3.5" />
                          <span>Show Curriculum</span>
                        </button>
                      )}
                      <span>{activeChapter?.title}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span>{activeUnit?.title}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span className="text-[#15ab5d] font-extrabold">{activeSubtopic?.title}</span>
                    </div>

                    {/* Mark Entire Topic Complete Button */}
                    <button
                      type="button"
                      onClick={handleMarkSubtopicComplete}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                        subtopicProgress.pct === 100
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-[#15ab5d] hover:text-white hover:border-[#15ab5d]'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>
                        {subtopicProgress.pct === 100
                          ? `Topic Completed (${subtopicProgress.completed}/${subtopicProgress.total})`
                          : `Complete All ${subtopicProgress.total} Topic Assets for Class`}
                      </span>
                    </button>
                  </div>

                  {/* Quick Asset Pills for Current Subtopic (Video, Summary, Flashcards, Game, Quiz, Mindmap, Lab) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {subtopicAssets.map((asset) => {
                      const isSelected = asset.id === activeAsset?.id;
                      const isDone = getAssetCompleted(asset.id);
                      const meta = ASSET_META[asset.type] || ASSET_META.summary;

                      return (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => setActiveAssetId(asset.id)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                              : isDone
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70'
                              : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                          ) : (
                            assetIcon(asset.type, 'w-3.5 h-3.5')
                          )}
                          <span>{meta.short}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Asset Control Bar: Title + Prev/Next + Mark Complete for Students */}
                  {activeAsset && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                              ASSET_META[activeAsset.type]?.bg || 'bg-purple-100'
                            } ${ASSET_META[activeAsset.type]?.color || 'text-purple-600'}`}
                          >
                            {ASSET_META[activeAsset.type]?.label || activeAsset.type}
                          </span>
                          {isCurrentAssetCompleted && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              {currentAssetClassMeta
                                ? `Completed in class (${currentAssetClassMeta.scope})`
                                : 'Synced as Complete for Students'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
                          {activeAsset.title || ASSET_META[activeAsset.type]?.label}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <button
                          type="button"
                          disabled={currentFlatIndex <= 0}
                          onClick={() => handleNavigateAdjacent('prev')}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </button>

                        <button
                          type="button"
                          disabled={
                            currentFlatIndex === -1 ||
                            currentFlatIndex >= flatChapterAssets.length - 1
                          }
                          onClick={() => handleNavigateAdjacent('next')}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Primary Classroom Action: Mark Complete for Students */}
                        <button
                          type="button"
                          id="teacher-mark-complete-btn"
                          onClick={handleToggleCurrentAssetComplete}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
                            isCurrentAssetCompleted
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                              : 'bg-[#15ab5d] hover:bg-[#129650] text-white shadow-emerald-500/25 hover:scale-[1.02]'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>
                            {isCurrentAssetCompleted
                              ? 'Completed for Students (Click to Undo)'
                              : 'Mark Complete for Students'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Embedded Student Content Viewer (Video, Quiz, Game, Flashcards, Mindmap, Lab, Summary) */}
              {assetManifest ? (
                <ContentViewer key={assetManifest.id} manifest={assetManifest} />
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700/80">
                  <Sparkles className="w-10 h-10 text-[#15ab5d] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Select a Lesson Asset
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose any chapter, unit, or subtopic from the curriculum panel to present to the class.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {!presentationMode && <Footer />}
      </div>

      {/* Modal: Choose Specific Students or Whole Class */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#15ab5d]">
                  In-Class Completion Sync
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
                  Who attended this classroom session?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Assets marked complete will automatically reflect as completed (+20 XP) on these students&apos; dashboards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Mode Radio Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCompletionMode('all')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  completionMode === 'all'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#15ab5d] text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-extrabold">Entire Class (42 Students)</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Everyone in Grade {selectedGrade} – {selectedSection}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCompletionMode('selected')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  completionMode === 'selected'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#15ab5d] text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-extrabold">Select Specific Students</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Only students present in class today
                </div>
              </button>
            </div>

            {completionMode === 'selected' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 border-t border-slate-100 dark:border-slate-700 pt-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>Select Students ({selectedStudentIds.length} selected)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStudentIds(
                        selectedStudentIds.length === studentsData.length
                          ? []
                          : studentsData.map((s) => s.id)
                      )
                    }
                    className="text-[#15ab5d] hover:underline cursor-pointer"
                  >
                    {selectedStudentIds.length === studentsData.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                {studentsData.map((student) => {
                  const checked = selectedStudentIds.includes(student.id);
                  return (
                    <label
                      key={student.id}
                      onClick={() => toggleStudentSelection(student.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        checked
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                          : 'border-slate-100 dark:border-slate-700/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="rounded text-[#15ab5d] focus:ring-[#15ab5d]"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {student.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{student.grade}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {student.overallProgress}% Progress
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="px-5 py-2 rounded-xl bg-[#15ab5d] hover:bg-[#129650] text-white text-xs font-extrabold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherStudentMaterialPage;
