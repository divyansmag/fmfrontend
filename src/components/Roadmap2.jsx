import { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Award, BookOpen, Check, ChevronRight, Compass, Flame, Lock, Star, Target, Trophy, Zap, Gift, ArrowDown, ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getSortedChapters, getSortedUnits, getSortedSubtopics, getSortedAssets } from '../data/courseData';

/**
 * Roadmap2 — Duolingo-style winding path.
 *
 * VISUAL DESIGN: preserved from original.
 * DATA SOURCE:   now reads from courseData via AppContext.
 *
 * Mapping strategy:
 *   - The "Unit Header Card" shows the first active unit of the first active chapter
 *   - The 3 path nodes represent the subtopics of that unit (up to 3 shown)
 *   - The "Upcoming Unit" banner shows the next unit
 *   - The "Active Next" node shows the first incomplete subtopic's first asset
 *   - The Quick Jump sidebar lists all units in the chapter
 */


export default function Roadmap2() {
  const {
    user,
    courseData,
    chapters,
    navigateToAsset,
    navigateTo,
    showToast,
    completedAssetIds,
    getUnitProgress,
    getSubtopicProgress,
    openChapterModal,
  } = useApp();

  const sortedChapters = chapters;

  // Flatten all subtopics across all chapters and units for dynamic Duolingo roadmap
  const roadmapNodes = useMemo(() => {
    const nodes = [];
    let globalIndex = 0;
    for (let ci = 0; ci < sortedChapters.length; ci++) {
      const ch = sortedChapters[ci];
      const chUnits = getSortedUnits(ch);
      for (let ui = 0; ui < chUnits.length; ui++) {
        const u = chUnits[ui];
        const uSubs = getSortedSubtopics(u);
        for (let si = 0; si < uSubs.length; si++) {
          const sub = uSubs[si];
          nodes.push({
            id: sub.id,
            subtopic: sub,
            unit: u,
            chapter: ch,
            globalIndex: globalIndex++,
            isFirstInUnit: si === 0,
            isFirstInChapter: ui === 0 && si === 0,
          });
        }
      }
    }
    return nodes;
  }, [sortedChapters]);

  // Identify next upcoming incomplete node (for "Start Next Up" / Mascot)
  const nextIncompleteNode = roadmapNodes.find((n) => {
    if (n.chapter.status === 'locked') return false;
    const p = getSubtopicProgress(n.subtopic);
    return p.pct < 100 && p.total > 0;
  }) || roadmapNodes.find(n => getSubtopicProgress(n.subtopic).total > 0) || roadmapNodes[0];

  // Find active chapter and active unit based on the next incomplete node
  const activeChapter = nextIncompleteNode?.chapter || sortedChapters.find((ch) => ch.status === 'active') || sortedChapters[0];
  const [expandedChapterId, setExpandedChapterId] = useState(activeChapter?.id);
  const units = activeChapter ? getSortedUnits(activeChapter) : [];
  const activeUnit = nextIncompleteNode?.unit || units.find((u) => getUnitProgress(u).pct < 100) || units[0];
  const activeUnitProgress = activeUnit ? getUnitProgress(activeUnit) : { pct: 0, completed: 0, total: 0 };

  const activeTheme = {
    bg: 'from-purple-700 to-purple-600', shadow: 'shadow-purple-500/20', border: 'border-purple-600/50', glow: 'bg-purple-400/20',
    ambient1: 'from-purple-500/15 to-indigo-500/15', ambient2: 'bg-fuchsia-500/10', ambient3: 'bg-indigo-500/10',
    pathStart: '#C084FC', pathMid: '#7C3AED', pathEnd: '#4F46E5', pathShadow: 'rgba(124, 58, 237, 0.5)',
    unitBg: 'from-indigo-500 to-purple-600', nodeActive: 'from-purple-700 via-purple-600 to-indigo-600 shadow-purple-600/50 ring-purple-300'
  };

  const activeNodeRef = useRef(null);
  const [showJumpToCurrent, setShowJumpToCurrent] = useState(false);
  const [jumpDirection, setJumpDirection] = useState('down');

  useEffect(() => {
    if (!activeNodeRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setShowJumpToCurrent(!entry.isIntersecting);

      if (!entry.isIntersecting) {
        const rect = activeNodeRef.current.getBoundingClientRect();
        setJumpDirection(rect.top < 0 ? 'up' : 'down');
      }
    }, { threshold: [0, 0.1, 0.9, 1] });

    observer.observe(activeNodeRef.current);
    return () => observer.disconnect();
  }, [nextIncompleteNode]);

  function scrollToCurrent() {
    activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleNodeClick(node) {
    if (node.chapter.status === 'locked') {
      showToast('Chapter Locked', `Complete previous chapters to unlock "${node.chapter.title}".`, 'info');
      return;
    }
    const assets = getSortedAssets(node.subtopic);
    if (!assets.length) {
      showToast('No Content', 'This subtopic has no assets yet. Add some in the CMS!', 'info');
      return;
    }
    // Find first incomplete asset or fall back to first
    const targetAsset = assets.find((a) => !completedAssetIds.has(a.id)) || assets[0];
    navigateToAsset(node.chapter.id, node.unit.id, node.subtopic.id, targetAsset.id);
  }



  // Dynamic position layout calculation to guarantee pixel-perfect SVG path alignment
  const NODE_Y_SPACING = 140;
  const BANNER_HEIGHT = 90;

  const nodeLayout = useMemo(() => {
    let y = 120; // Increased initial Y offset to accommodate header overlap
    const layout = [];
    roadmapNodes.forEach((node, i) => {
      // Only render chapter banner for new chapters (skip the first one since it's in the top header)
      if (node.isFirstInChapter && node.chapter.id !== roadmapNodes[0].chapter.id) {
        layout.push({ type: 'chapter-banner', node, y });
        y += 120; // Space for the large purple banner
      }

      if (node.isFirstInUnit) {
        layout.push({ type: 'unit-banner', node, y });
        y += BANNER_HEIGHT;
      }

      const pattern = [78, 22]; // percentage X positions (right, left)
      const xPct = pattern[i % pattern.length];
      const xSvg = (xPct / 100) * 500;

      layout.push({ type: 'node', node, index: i, y, xPct, xSvg });
      y += NODE_Y_SPACING;
    });
    return { layout, totalHeight: Math.max(600, y + 40) };
  }, [roadmapNodes]);

  // Dynamically compute SVG path connecting all nodes based on their exact Y coordinates
  const { solidPath, dashedPath } = useMemo(() => {
    const nodesList = nodeLayout.layout.filter(item => item.type === 'node');
    if (nodesList.length === 0) {
      return { solidPath: 'M 250 10 L 250 400', dashedPath: 'M 250 400 L 250 600' };
    }

    let lastCompletedIndex = -1;
    for (let i = 0; i < nodesList.length; i++) {
      const p = getSubtopicProgress(nodesList[i].node.subtopic);
      if (p.pct === 100) {
        lastCompletedIndex = i;
      } else {
        break; // Stop at the first incomplete node
      }
    }

    let dSolid = 'M 250 0';
    let prevX = 250;
    let prevY = 0;

    for (let i = 0; i <= lastCompletedIndex; i++) {
      const item = nodesList[i];
      const targetX = item.xSvg;
      const targetY = item.y;
      const midY = (prevY + targetY) / 2;
      dSolid += ` C ${prevX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
      prevX = targetX;
      prevY = targetY;
    }

    let dDashed = `M ${prevX} ${prevY}`;
    for (let i = lastCompletedIndex + 1; i < nodesList.length; i++) {
      const item = nodesList[i];
      const targetX = item.xSvg;
      const targetY = item.y;
      const midY = (prevY + targetY) / 2;
      dDashed += ` C ${prevX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
      prevX = targetX;
      prevY = targetY;
    }

    const endY = prevY + 80;
    dDashed += ` C ${prevX} ${prevY + 40}, 250 ${prevY + 50}, 250 ${endY}`;
    return { solidPath: dSolid, dashedPath: dDashed };
  }, [nodeLayout, getSubtopicProgress]);

  return (
    <main id="view-roadmap-2" className="view-container p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Main Learning Pathway ── */}
        <div className="lg:col-span-2 bg-gradient-to-b from-white via-purple-50/40 to-indigo-50/20 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-purple-900/5 border border-purple-100 dark:border-purple-950/50 relative overflow-hidden flex flex-col items-center min-h-[960px]">

          {/* Decorative ambient background */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />



          {/* Unit Header Card — dynamically shows the active unit and chapter */}
          <div className="w-full bg-gradient-to-r from-purple-700 to-purple-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-purple-500/20 flex items-center justify-between z-30 relative overflow-hidden border border-purple-600/50">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md border border-white/10">
                  {user.grade || 'Grade 6'} Curriculum
                </span>
                <button
                  type="button"
                  onClick={openChapterModal}
                  className="px-3 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-all text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md border border-white/10 flex items-center gap-1 cursor-pointer"
                  title="Click to view full course syllabus"
                >
                  Chapter {activeChapter?.number ?? '01'} · View Syllabus
                </button>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-sm">
                {activeChapter?.title ?? 'Your Learning Path'}
              </h3>
              <p className="text-purple-100 text-xs sm:text-sm mt-1 font-medium max-w-md">
                {roadmapNodes.length} dynamic lesson nodes
              </p>
            </div>
            <div className="relative z-10 hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="px-3.5 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md text-xs font-black flex items-center gap-1.5 shadow-inner border border-white/10">
                <Check className="w-4 h-4 stroke-[3] text-emerald-300" />
                {activeUnitProgress.completed}/{activeUnitProgress.total} Done
              </span>
            </div>
          </div>

          {/* Winding SVG Path + Completely Dynamic Nodes */}
          <div className="relative w-full mx-auto shrink-0 py-0 -mt-8" style={{ height: nodeLayout.totalHeight, minHeight: nodeLayout.totalHeight }}>

            {/* Constrained container for SVG path and nodes */}
            <div className="absolute inset-0 w-full max-w-md mx-auto pointer-events-none z-10">
              <svg
                className="absolute inset-0 w-full h-full drop-shadow-md z-0"
                viewBox={`0 0 500 ${nodeLayout.totalHeight}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                {/* Smooth Unfinished Path */}
                <path
                  d={dashedPath}
                  stroke="#E2E8F0"
                  strokeWidth="26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Flowing Energy Line inside the Unfinished Path */}
                <path
                  d={dashedPath}
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="20 30"
                  className="opacity-50"
                  style={{ animation: 'dash 15s linear infinite' }}
                />

                {/* Solid Completed Path with Glow */}
                <path
                  d={solidPath}
                  stroke="url(#dynamicGradient)"
                  strokeWidth="26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 12px ${activeTheme.pathShadow})` }}
                />

                {/* Flowing Energy Line inside the Solid Path */}
                <path
                  d={solidPath}
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="20 30"
                  className="opacity-60"
                  style={{ animation: 'dash 15s linear infinite' }}
                />
                <defs>
                  <linearGradient id="dynamicGradient" x1="250" y1="15" x2="250" y2={nodeLayout.totalHeight} gradientUnits="userSpaceOnUse">
                    <stop stopColor={activeTheme.pathStart} />
                    <stop offset="0.5" stopColor={activeTheme.pathMid} />
                    <stop offset="1" stopColor={activeTheme.pathEnd} />
                  </linearGradient>
                </defs>
              </svg>
              {nodeLayout.layout.map((item, idx) => {
                if (item.type === 'node') {
                  const node = item.node;
                  const progress = getSubtopicProgress(node.subtopic);
                  const isNextUp = nextIncompleteNode?.id === node.id;

                  let state = 'available';
                  if (node.chapter.status === 'locked') state = 'locked';
                  else if (progress.total === 0) state = 'empty';
                  else if (progress.pct === 100) state = 'completed';
                  else if (isNextUp) state = 'active';
                  else if (progress.pct > 0) state = 'active';

                  const IconComponent = [Target, Compass, Star, Zap, Flame, Award, BookOpen, Trophy][item.index % 8];

                  return (
                    <div
                      key={`node-${node.id}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 pointer-events-auto"
                      style={{ left: `${item.xPct}%`, top: item.y }}
                      ref={(el) => { if (isNextUp) activeNodeRef.current = el; }}
                    >

                      {/* Tooltip */}
                      <div className={`absolute ${item.xPct > 50 ? 'right-20' : 'left-20'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[11px] font-extrabold px-3.5 py-2 rounded-2xl shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-md z-30 border border-slate-700/50 dark:border-slate-200/50`}>
                        <div className="font-black">{node.subtopic.title}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {node.unit.title} · {progress.completed}/{progress.total} Assets
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNodeClick(node)}
                        className={`w-16 h-16 rounded-full text-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all ring-4 ring-white dark:ring-slate-900 relative ${state === 'completed'
                          ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 shadow-emerald-500/40'
                          : state === 'active'
                            ? `bg-gradient-to-tr ${activeTheme.nodeActive} animate-pulse`
                            : state === 'locked'
                              ? 'bg-gradient-to-tr from-slate-400 via-slate-500 to-slate-600 shadow-slate-500/30 opacity-60'
                              : `bg-gradient-to-tr ${activeTheme.unitBg} shadow-slate-500/30`
                          }`}
                      >
                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {state === 'completed' ? (
                          <Check className="w-7 h-7 stroke-[3]" />
                        ) : state === 'locked' ? (
                          <Lock className="w-5 h-5" />
                        ) : state === 'active' ? (
                          <IconComponent className="w-6 h-6 stroke-[2.5]" />
                        ) : (
                          <IconComponent className="w-6 h-6 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Full-width container for Banners */}
            {nodeLayout.layout.map((item, idx) => {
              if (item.type === 'chapter-banner') {
                const node = item.node;
                const chapterNodeCount = node.chapter.units?.reduce((a, u) => a + (u.subtopics?.length || 0), 0) || 0;
                let completed = 0;
                let total = 0;
                node.chapter.units?.forEach(u => {
                  u.subtopics?.forEach(s => {
                    const p = getSubtopicProgress(s);
                    completed += p.completed;
                    total += p.total;
                  });
                });

                return (
                  <div
                    key={`chapter-${node.chapter.id}`}
                    className="absolute w-full px-4 -translate-y-1/2 z-20"
                    style={{ top: item.y, left: 0 }}
                  >
                    <div className="w-full bg-gradient-to-r from-purple-700 to-purple-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-purple-500/20 flex items-center justify-between z-30 relative overflow-hidden border border-purple-600/50">
                      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-lg pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md border border-white/10">
                            {user.grade || 'Grade 6'} Curriculum
                          </span>
                          <span className="px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md border border-white/10">
                            Chapter {node.chapter.number}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-sm">
                          {node.chapter.title}
                        </h3>
                        <p className="text-purple-100 text-xs sm:text-sm mt-1 font-medium max-w-md">
                          {chapterNodeCount} dynamic lesson nodes
                        </p>
                      </div>
                      <div className="relative z-10 hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                          <Award className="w-6 h-6 text-emerald-300" />
                        </div>
                        <span className="px-3.5 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md text-xs font-black flex items-center gap-1.5 shadow-inner border border-white/10">
                          <Check className="w-4 h-4 stroke-[3] text-emerald-300" />
                          {completed}/{total} Done
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.type === 'unit-banner' || item.type === 'banner') {
                const node = item.node;
                const progress = getSubtopicProgress(node.subtopic);
                return (
                  <div
                    key={`banner-${node.id}`}
                    className="absolute w-full max-w-md left-1/2 -translate-x-1/2 px-4 -translate-y-1/2 z-20"
                    style={{ top: item.y }}
                  >
                    <div className="w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTheme.unitBg} text-white flex items-center justify-center font-black text-xs shadow-sm`}>
                          U{node.unit.order}
                        </div>
                        <div>
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            Unit {node.unit.order}
                          </div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white font-display">
                            {node.unit.title}
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 text-[10px] font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/50">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            {/* Render mascots as polaroids along the path */}
            {(() => {
                const placements = [];
                let lastSide = 'right'; // Next side will be 'left'
                let mIdx = 0;
                
                const allUnits = Array.from(new Set(roadmapNodes.map(n => n.unit.id)));
                
                allUnits.forEach(unitId => {
                  const uNodes = roadmapNodes.filter(n => n.unit.id === unitId);
                  if (uNodes.length > 0) {
                    lastSide = lastSide === 'left' ? 'right' : 'left';
                    placements.push({ nodeId: uNodes[0].id, side: lastSide, mIdx: mIdx++ });
                  }
                  if (uNodes.length > 4) {
                    lastSide = lastSide === 'left' ? 'right' : 'left';
                    placements.push({ nodeId: uNodes[3].id, side: lastSide, mIdx: mIdx++ }); // Place 2nd polaroid on the 4th node of the unit
                  }
                });

                return nodeLayout.layout.map((item, idx) => {
                  if (item.type !== 'node') return null;
                  
                  const p = placements.find(x => x.nodeId === item.node.id);
                  if (!p) return null;

                  const mascots = [
                    { src: 'dist/assets/sage_roadmap2.gif', pin: 'bg-rose-500', border: 'border-rose-700' },
                    { src: 'dist/assets/orin_login.gif', pin: 'bg-blue-500', border: 'border-blue-700' },
                    { src: '/lumi_roadmap2.gif?v=2', pin: 'bg-amber-500', border: 'border-amber-700' },
                    { src: 'dist/assets/eli_roadmap2.gif', pin: 'bg-purple-500', border: 'border-purple-700' }
                  ];
                  const captions = [
                    "Let's do this!",
                    "Wise choice! Keep discovering!",
                    "Just read something amazing!",
                    "Keep going, you've got this!",
                    "Every step makes you smarter!",
                    "Believe in your big ideas!",
                    "Every page sparks a new idea!",
                    "Awesome progress! Keep it up!"
                  ];

                  const mascot = {
                    ...mascots[p.mIdx % mascots.length],
                    text: captions[p.mIdx % captions.length]
                  };
                  const sideStyle = p.side === 'left' ? { right: 'calc(50% + 11rem)' } : { left: 'calc(50% + 11rem)' };
                  const rotateClass = p.side === 'left' ? 'rotate-[-4deg]' : 'rotate-[5deg]';

                  return (
                    <div
                      key={`mascot-${item.node.id}`}
                      className={`absolute pointer-events-none z-20 transition-transform duration-500 drop-shadow-lg hidden sm:block ${rotateClass}`}
                      style={{ ...sideStyle, top: `calc(${item.y}px - 2rem)` }}
                    >
                      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${mascot.pin} shadow-sm border-b-[1.5px] ${mascot.border} z-30 flex items-start justify-center pt-0.5`}>
                         <div className="w-1 h-1 rounded-full bg-white/70"></div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-2 pb-4 rounded-sm shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="w-28 h-28 bg-slate-200 overflow-hidden border border-slate-300/50 shadow-inner">
                          <img src={mascot.src} alt="Mascot" className="w-full h-full object-cover object-[center_20%]" />
                        </div>
                        <div className="text-center mt-3 font-bold text-slate-700 text-[10px] tracking-wide italic leading-snug break-words px-1 max-w-[7rem]">
                          {mascot.text}
                        </div>
                      </div>
                    </div>
                  );
                });
            })()}
          </div>
        </div>
        {/* ── Sidebar Widgets ── */}
        <div className="space-y-6">

          {/* Daily Quests Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-700/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-inner border border-amber-200/50 dark:border-amber-900/50">
                  <Flame className="w-4 h-4 fill-current animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base font-display">Daily Quests</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Boost your XP</p>
                </div>
              </div>
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/50">Resets in 4h</span>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/70 space-y-2.5 transition-all hover:bg-slate-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-inner border border-rose-200/50">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">Earn 50 XP</span>
                      <span className={`font-black px-2 py-0.5 rounded-md ${15 >= 50 ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'}`}>
                        15 / 50 XP
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                      <div className={`h-full w-[30%] rounded-full transition-all duration-500 shadow-sm ${15 >= 50 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/70 space-y-2.5 transition-all hover:bg-slate-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center flex-shrink-0 shadow-inner border border-emerald-200/50">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">Complete 2 lessons</span>
                      <span className="text-slate-400 font-bold bg-slate-200/60 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                        {Math.min(completedAssetIds.size, 2)} / 2
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${Math.min(completedAssetIds.size / 2, 1) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Jump Widget — lists units from active chapter */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-700/80 space-y-4 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-700 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-inner border border-blue-200/50">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base font-display">Quick Jump</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chapter Index</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {sortedChapters.map((chapter) => {
                const isExpanded = expandedChapterId === chapter.id;
                const isLockedChapter = chapter.status === 'locked';
                const chapterUnits = getSortedUnits(chapter);

                return (
                  <div key={chapter.id} className="w-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 overflow-hidden transition-all shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedChapterId(isExpanded ? null : chapter.id);
                      }}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isLockedChapter ? 'opacity-60 bg-slate-50 dark:bg-slate-900/40' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isExpanded ? 'bg-blue-600 text-white' : isLockedChapter ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                          {chapter.number}
                        </div>
                        <div className="text-left">
                          <div className={`text-xs font-bold ${isLockedChapter ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {chapter.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {isLockedChapter ? 'LOCKED' : `${chapterUnits.length} UNITS`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLockedChapter && <Lock className="w-4 h-4 text-slate-400" />}
                        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700/50 p-2 gap-1.5">
                        {chapterUnits.map((unit) => {
                          const progress = getUnitProgress(unit);
                          const isCurrent = unit.id === activeUnit?.id && chapter.id === activeChapter.id;
                          const isDone = progress.pct === 100;
                          const isUnitLocked = !isCurrent && !isDone && (chapter.id !== activeChapter.id || chapterUnits.indexOf(unit) > chapterUnits.indexOf(activeUnit));

                          return (
                            <button
                              key={unit.id}
                              type="button"
                              onClick={() => {
                                if (isUnitLocked) {
                                  showToast('Locked', `Complete previous units first!`, 'info');
                                  return;
                                }
                                const firstSub = getSortedSubtopics(unit)[0];
                                const firstAsset = firstSub ? getSortedAssets(firstSub)[0] : null;
                                if (firstAsset) navigateToAsset(chapter.id, unit.id, firstSub.id, firstAsset.id);
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${isCurrent
                                ? 'bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800'
                                : isDone
                                  ? 'hover:bg-white dark:hover:bg-slate-800 border border-transparent'
                                  : 'opacity-60 cursor-not-allowed border border-transparent'}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`text-xs font-bold w-5 text-center ${isCurrent ? 'text-blue-700' : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                                  {unit.order}
                                </div>
                                <div className={`text-[11px] font-bold ${isCurrent ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {unit.title}
                                </div>
                              </div>
                              {isCurrent ? (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                  <ChevronRight className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : isDone ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


          </div>

        </div>
      </div>
      {/* Floating Jump to Current Button */}
      {showJumpToCurrent && nextIncompleteNode && typeof document !== 'undefined' && createPortal(
        <button
          onClick={scrollToCurrent}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black shadow-2xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group border border-purple-400/30"
        >
          {jumpDirection === 'up' ? <ArrowUp className="w-5 h-5 stroke-[3] animate-bounce" /> : <ArrowDown className="w-5 h-5 stroke-[3] animate-bounce" />}
          <span className="text-xs uppercase tracking-widest hidden sm:inline">Current Lesson</span>
        </button>,
        document.body
      )}
    </main>
  );
}