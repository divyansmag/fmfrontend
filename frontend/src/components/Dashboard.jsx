import { useRef, useMemo, useState } from 'react';
import {
  Atom,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  Flame,
  FlaskConical,
  List,
  Lock,
  ShieldCheck,
  Sparkles,
  PartyPopper,
  UploadCloud,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getSortedChapters, getSortedUnits, getSortedSubtopics, getSortedAssets } from '../data/courseData';
import ChapterCard from './ChapterCard.jsx';
import AssignmentModal from './AssignmentModal.jsx';
import AllAssignmentsModal from './AllAssignmentsModal.jsx';

export const LEADERBOARD = {
  '6': [
    { rank: 1, initials: 'AS', name: 'Arjun S.', level: 'Lvl 15', xp: '12.4k XP', highlight: 'first', avatar: '/assets/avatar1.jpg' },
    { rank: 2, initials: 'PV', name: 'Priya V.', level: 'Lvl 14', xp: '11.8k XP', avatar: '/assets/avatar2.jpg' },
    { rank: 3, initials: 'IM', name: 'Ishaan M.', level: 'Lvl 13', xp: '11.2k XP', bronze: true, avatar: '/assets/avatar3.jpg' },
  ],
  '7': [
    { rank: 1, initials: 'RK', name: 'Rohan K.', level: 'Lvl 20', xp: '15.1k XP', highlight: 'first', avatar: '/assets/avatar3.jpg' },
    { rank: 2, initials: 'SJ', name: 'Sia J.', level: 'Lvl 19', xp: '14.2k XP', avatar: '/assets/avatar2.jpg' },
    { rank: 3, initials: 'AK', name: 'Aman K.', level: 'Lvl 18', xp: '13.9k XP', bronze: true, avatar: '/assets/avatar1.jpg' },
  ],
  '8': [
    { rank: 1, initials: 'VM', name: 'Vikram M.', level: 'Lvl 28', xp: '18.4k XP', highlight: 'first', avatar: '/assets/avatar1.jpg' },
    { rank: 2, initials: 'NT', name: 'Neha T.', level: 'Lvl 27', xp: '17.6k XP', avatar: '/assets/avatar2.jpg' },
    { rank: 3, initials: 'KS', name: 'Karan S.', level: 'Lvl 26', xp: '16.9k XP', bronze: true, avatar: '/assets/avatar3.jpg' },
  ]
};

const ACHIEVEMENTS = [
  {
    title: 'Perceptron Pioneer',
    icon: Atom,
    className: 'bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600',
  },
  {
    title: 'Hot Streak',
    icon: Flame,
    className: 'bg-rose-100 dark:bg-rose-950 text-rose-600',
  },
  {
    title: 'Explorer',
    icon: Compass,
    className: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
  },
  {
    title: 'Lab Master',
    icon: FlaskConical,
    className: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
  },
  {
    title: 'Spark of Genius',
    icon: Sparkles,
    className: 'bg-amber-100 dark:bg-amber-950 text-amber-600',
  },
  {
    title: 'Verified Scholar',
    icon: ShieldCheck,
    className: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600',
  },
  {
    title: 'Locked',
    icon: Lock,
    className: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700',
    locked: true,
  },
  {
    title: 'Locked',
    icon: Lock,
    className: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700',
    locked: true,
  },
];

const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'Neural Networks Project',
    module: 'Unit 1 Capstone',
    xp: 100,
    dueDate: 'Fri 11:59 PM',
    dueStatus: 'Due Soon',
    dueUrgent: true,
    description: 'Build and train a 2-layer perceptron neural network model on synthetic datasets. Submit your Python script (.py) or Jupyter notebook (.ipynb) along with accuracy evaluation curves.',
    status: 'pending',
  },
  {
    id: 'asg-2',
    title: 'Computer Vision Challenge',
    module: 'Module 02 • In 2 days',
    xp: 80,
    dueDate: 'Wednesday',
    dueStatus: 'Upcoming',
    dueUrgent: false,
    description: 'Implement Sobel and Laplacian edge detection filters and test on sample high-resolution images. Upload your code files and output comparisons in a ZIP or notebook.',
    status: 'pending',
  },
  {
    id: 'asg-3',
    title: 'Prompt Engineering Capstone',
    module: 'Unit 2 Capstone • Next Week',
    xp: 90,
    dueDate: 'Next Monday',
    dueStatus: 'Upcoming',
    dueUrgent: false,
    description: 'Design few-shot and chain-of-thought prompts to solve multi-step reasoning puzzles. Submit your prompt logs, outputs, and reflection report.',
    status: 'pending',
  },
  {
    id: 'asg-4',
    title: 'NLP Sentiment Classifier',
    module: 'Module 03 • Advanced',
    xp: 120,
    dueDate: 'In 2 weeks',
    dueStatus: 'Upcoming',
    dueUrgent: false,
    description: 'Train a Naive Bayes or Transformer classifier to detect sentiment in student course reviews with >=85% accuracy.',
    status: 'pending',
  },
];

export default function Dashboard() {
  const { user, chapters, courseData, completedAssetIds, navigateTo, showToast, updateProfile, clearAllChatSessions } = useApp();
  const scrollerRef = useRef(null);
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('futureminds_assignments_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
      return INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });
  const [activeAssignmentModal, setActiveAssignmentModal] = useState(null);
  const [allAssignmentsOpen, setAllAssignmentsOpen] = useState(false);

  const handleSubmitAssignment = (assignmentId, submissionData) => {
    setAssignments((prev) => {
      const next = prev.map((item) =>
        item.id === assignmentId
          ? {
              ...item,
              status: 'submitted',
              submission: submissionData,
            }
          : item
      );
      try {
        localStorage.setItem('futureminds_assignments_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('Assignment Submitted', `"${submissionData.fileName}" submitted successfully (+100 XP)`, 'success');
  };

  const openAssignmentModal = (assignment) => {
    setActiveAssignmentModal(assignment);
  };

  // ── Derive active chapter progress dynamically ──────────────────────────
  const { activeChapterLabel, progressPct, labAssets } = useMemo(() => {
    // Find the first active or in-progress chapter, else first chapter
    const active = chapters.find((c) => c.status === 'active') || chapters[0];
    let totalAssets = 0;
    let doneAssets = 0;
    const labs = [];
    if (active) {
      for (const unit of getSortedUnits(active)) {
        for (const sub of getSortedSubtopics(unit)) {
          for (const asset of getSortedAssets(sub)) {
            totalAssets++;
            if (completedAssetIds.has(asset.id)) doneAssets++;
            if (['lab', 'quiz', 'flashcards', 'game'].includes(asset.type)) {
              labs.push({ title: asset.title, meta: `${sub.title} · ${unit.title}`, assetId: asset.id });
            }
          }
        }
      }
    }
    const pct = totalAssets > 0 ? Math.round((doneAssets / totalAssets) * 100) : 0;
    return {
      activeChapterLabel: active ? `CH. ${active.number || active.id}` : 'CHAPTER',
      progressPct: pct,
      labAssets: labs.slice(0, 2),
    };
  }, [chapters, completedAssetIds]);

  const scrollChapters = (offset) => {
    scrollerRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <main id="view-dashboard" className="view-container p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 bg-gradient-to-r from-purple-700 to-purple-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-purple-500/20 flex flex-col justify-between">
          <div className="relative z-10">
            <select
              value={user.grade?.replace('Grade ', '') || '6'}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '6') updateProfile({ name: 'Divya N', grade: 'Grade 6', xp: 2450, streak: 12, levelNumber: 12, email: 'divya@futureminds.demo' });
                if (v === '7') updateProfile({ name: 'Aryan Patel', grade: 'Grade 7', xp: 5120, streak: 24, levelNumber: 18, email: 'aryan@futureminds.demo' });
                if (v === '8') updateProfile({ name: 'Kiara Mehta', grade: 'Grade 8', xp: 12050, streak: 45, levelNumber: 26, email: 'kiara@futureminds.demo' });
                clearAllChatSessions();
                showToast('Profile Switched', `Loaded student profile for Grade ${v}`, 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider mb-3 -ml-2 outline-none cursor-pointer border-none"
            >
              <option value="6" className="text-slate-900 bg-white">Grade 6</option>
              <option value="7" className="text-slate-900 bg-white">Grade 7</option>
              <option value="8" className="text-slate-900 bg-white">Grade 8</option>
            </select>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Welcome Back, <span className="global-user-name">{user.name.split(' ')[0]}</span>
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
              You&apos;re on a legendary {user.streak} day streak! Your momentum is unstoppable, keep pushing those boundaries.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-purple-100 uppercase tracking-wider">
                <span>{activeChapterLabel}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-purple-200 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigateTo('video');
                showToast('Resuming Lesson', 'Now playing: Neural Basics', 'info');
              }}
              className="px-7 py-3 rounded-2xl bg-white text-purple-700 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-purple-50 transition-all hover:scale-105 active:scale-100 whitespace-nowrap"
            >
              Continue
            </button>
          </div>

          <div className="absolute right-6 top-6 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center transform rotate-12 pointer-events-none border border-white/10">
            <PartyPopper className="h-7 w-7 text-purple-100 drop-shadow-sm" aria-label="Celebration" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-7 shadow-sm border border-purple-100/70 dark:border-slate-700/60 relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-3xl shadow-inner overflow-hidden">
              <img src='/dist/assets/eli_login.gif' alt="Elephant" className="w-14 h-14 object-cover" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          </div>
          <div className="my-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">ELI SAYS...</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              &quot;A wise elephant never forgets that every great journey begins with a single step. You&apos;ve mastered {progressPct}% of this unit, keep those foundations strong, and the rest will follow beautifully!&quot;
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>Got Questions?</span>
            <button type="button" onClick={() => navigateTo('ai-tutor')} className="text-purple-600 dark:text-purple-400 hover:underline">
              Ask Eli →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">Chapters</h3>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">{progressPct}% UNIT PROGRESS</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scrollChapters(-340)} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-sm" title="Previous Chapters">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scrollChapters(340)} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-sm" title="Next Chapters">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div id="dashboard-chapters-container" ref={scrollerRef} className="horizontal-scroll-container gap-4 pb-3 pt-1">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Lab Activity</h4>
                </div>
                <div className="space-y-3">
                  {labAssets.length > 0 ? labAssets.map((lab) => (
                    <div key={lab.assetId} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer" onClick={() => navigateTo('video')}>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{lab.title}</div>
                        <div className="text-[10px] text-slate-400">{lab.meta}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  )) : (
                    <div className="text-xs text-slate-400 text-center py-4">No lab assets yet. Add one via CMS.</div>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => navigateTo('video')} className="w-full mt-4 py-2.5 rounded-2xl bg-emerald-600 dark:bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <List className="w-3.5 h-3.5" />
                <span>VIEW ALL</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner border border-blue-200/50 dark:border-blue-800/40">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Assignments</h4>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {assignments.filter(a => a.status === 'submitted').length}/{assignments.length} SUBMITTED
                  </span>
                </div>
                <div className="space-y-3">
                  {assignments.slice(0, 2).map((item) => {
                    const isSubmitted = item.status === 'submitted';
                    return (
                      <div
                        key={item.id}
                        id={`assignment-item-${item.id}`}
                        onClick={() => openAssignmentModal(item)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                          isSubmitted
                            ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/80'
                            : item.dueUrgent
                              ? 'border-blue-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/40 dark:hover:bg-slate-700/50'
                              : 'border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                          {isSubmitted ? (
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Submitted</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {item.dueUrgent ? (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                              )}
                              <span className={item.dueUrgent ? 'text-blue-600 dark:text-blue-400 uppercase tracking-wider' : 'text-slate-500 uppercase tracking-wider'}>
                                {item.dueStatus}
                              </span>
                            </div>
                          )}
                          <span className={isSubmitted ? 'text-emerald-600 dark:text-emerald-400' : item.dueUrgent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                            {isSubmitted ? 'Under Review' : item.dueDate}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-xs font-bold ${isSubmitted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'}`}>
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {item.module} • {item.xp} XP
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-xl transition-all ${
                            isSubmitted
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                          }`}>
                            {isSubmitted ? 'View / Resubmit' : 'Upload & Submit →'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                id="btn-view-all-assignments"
                type="button"
                onClick={() => setAllAssignmentsOpen(true)}
                className="w-full mt-4 py-2.5 rounded-2xl bg-blue-600 dark:bg-blue-700 text-white font-bold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.01] active:scale-100"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>VIEW ALL ASSIGNMENTS</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {LEADERBOARD[user.grade?.replace('Grade ', '') || '6'].map((row) => (
                <div key={row.rank} className={`flex items-center justify-between p-2 rounded-2xl ${row.highlight === 'first' ? 'bg-purple-50/80 dark:bg-purple-900/20 ring-1 ring-purple-100 dark:ring-purple-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black w-4 text-center ${row.rank === 1 ? 'text-amber-500' : row.bronze ? 'text-amber-700' : 'text-slate-400'}`}>{row.rank}</span>
                    {row.avatar ? (
                      <img src={row.avatar} alt={row.name} className={`w-8 h-8 rounded-full object-cover shadow-sm ${row.rank === 1 ? 'ring-2 ring-amber-400 ring-offset-1 p-[1px]' : ''}`} />
                    ) : (
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${row.rank === 1 ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' : row.bronze ? 'bg-amber-50 dark:bg-amber-950 text-amber-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{row.initials}</div>
                    )}
                    <span className={`text-xs ${row.rank === 1 ? 'font-bold' : 'font-semibold'} text-slate-800 dark:text-slate-200`}>{row.name}</span>
                  </div>
                  <span className={`text-xs ${row.rank === 1 ? 'font-extrabold text-slate-700 dark:text-slate-300' : 'font-bold text-slate-600 dark:text-slate-400'}`}>{row.xp}</span>
                </div>
              ))}
              <div className="text-center text-slate-400 text-xs py-0.5">• • •</div>
              <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black w-4 text-center text-slate-400">6</span>
                  <div className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {user.xp >= 1000 ? (user.xp / 1000).toFixed(1) + 'k XP' : user.xp + ' XP'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">Achievements</h3>
              <button type="button" onClick={() => navigateTo('progress')} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((badge, index) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={`${badge.title}-${index}`}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${badge.className} shadow-inner border border-black/5 dark:border-white/20 ${badge.locked ? '' : 'hover:scale-110 transition-transform cursor-pointer'}`}
                    title={badge.title}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Upload & Submission Modal */}
      <AssignmentModal
        isOpen={Boolean(activeAssignmentModal)}
        assignment={activeAssignmentModal}
        onClose={() => setActiveAssignmentModal(null)}
        onSubmitAssignment={handleSubmitAssignment}
      />

      {/* All Assignments Popup Modal */}
      <AllAssignmentsModal
        isOpen={allAssignmentsOpen}
        onClose={() => setAllAssignmentsOpen(false)}
        assignments={assignments}
        onOpenSubmission={(asg) => setActiveAssignmentModal(asg)}
      />
    </main>
  );
}
