import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_AI_TUTOR,
  INITIAL_USER,
  INITIAL_VIDEO,
} from '../data/initialState';
import { api, getToken, setToken } from '../lib/api.js';
import {
  loadCourseData,
  saveCourseData,
  getSortedChapters,
  getSortedUnits,
  getSortedSubtopics,
  getSortedAssets,
  findChapter,
  findUnit,
  findSubtopic,
  findAsset,
  getFirstAsset,
  countSubtopicAssets,
  countUnitAssets,
  countChapterAssets,
} from '../data/courseData';

const AppContext = createContext(null);

const ROLE_PROFILES = {
  student: { name: 'Divya N', role: 'Student', alias: 'Aanya Sharma' },
  teacher: { name: 'Anaya Sharma', role: 'Teacher' },
  parent: { name: 'Priya Sharma', role: 'Parent' },
  admin: { name: 'System Admin', role: 'Admin' },
};

const ROLE_HOME = {
  student: 'dashboard',
  teacher: 'teacher-dashboard',
  parent: 'parent-dashboard',
  admin: 'admin-dashboard',
};

const AUTH_VIEWS = ['student-login', 'teacher-login', 'parent-login', 'admin-login', 'role-select'];
const STUDENT_VIEWS = new Set(['dashboard', 'roadmap-1', 'roadmap-2', 'video', 'ai-tutor', 'progress', 'settings']);

// UI-level routing guard. The REAL protection is the API (every write is checked server-side);
// this just stops people landing on screens that aren't theirs.
function viewAllowed(view, role) {
  if (AUTH_VIEWS.includes(view)) return true;
  if (view === 'cms') return role === 'admin';
  if (view.startsWith('admin-')) return role === 'admin';
  if (view.startsWith('teacher-')) return role === 'teacher';
  if (view.startsWith('parent-')) return role === 'parent';
  if (STUDENT_VIEWS.has(view)) return role === 'student';
  return false;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('futureminds_user_v1');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });
  const [currentView, setCurrentView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view')) {
        const view = params.get('view');
        window.history.replaceState({}, '', window.location.pathname);
        return view;
      }
      const saved = localStorage.getItem('futureminds_view_v1');
      if (saved && saved !== 'student-login' && saved !== 'role-select') return saved;
    } catch {}
    return 'role-select';
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem('futureminds_theme_mode') || 'light';
    } catch {
      return 'light';
    }
  });
  const [video, setVideo] = useState(INITIAL_VIDEO);
  const [aiTutor, setAiTutor] = useState(() => {
    try {
      const saved = localStorage.getItem('futureminds_ai_sessions_v1');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_AI_TUTOR;
  });
  const [toasts, setToasts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [discussionInput, setDiscussionInput] = useState('');
  const toastSeq = useRef(0);
  const typingRef = useRef(false);
  const aiTutorRef = useRef(null);
  const syncTutorSessionsRef = useRef(null);

  // ─── Save User & View Session ────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('futureminds_user_v1', JSON.stringify(user));
    } catch { /* ignore quota */ }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('futureminds_view_v1', currentView);
    } catch { /* ignore quota */ }
  }, [currentView]);

  useEffect(() => {
    try {
      localStorage.setItem('futureminds_theme_mode', currentTheme);
    } catch { /* ignore quota */ }
  }, [currentTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('futureminds_ai_sessions_v1', JSON.stringify(aiTutor));
    } catch { /* ignore quota */ }
  }, [aiTutor]);

  // ─── Course State ────────────────────────────────────────────────────────
  const [courseData, setCourseDataState] = useState(() => loadCourseData());
  const [currentChapterId, setCurrentChapterId] = useState(() => {
    const d = loadCourseData();
    return d.chapters[0]?.id ?? null;
  });
  const [currentUnitId, setCurrentUnitId] = useState(() => {
    const d = loadCourseData();
    return d.chapters[0]?.units[0]?.id ?? null;
  });
  const [currentSubtopicId, setCurrentSubtopicId] = useState(() => {
    const d = loadCourseData();
    return d.chapters[0]?.units[0]?.subtopics[0]?.id ?? null;
  });
  const [currentAssetId, setCurrentAssetId] = useState(() => {
    const d = loadCourseData();
    return d.chapters[0]?.units[0]?.subtopics[0]?.assets[0]?.id ?? null;
  });
  // Modal chapter tab selection (for ChapterModal sidebar)
  const [selectedChapterId, setSelectedChapterId] = useState(() => {
    const d = loadCourseData();
    return d.chapters[0]?.id ?? null;
  });
  // Completed asset IDs — persisted per session
  const [completedAssetIds, setCompletedAssetIds] = useState(() => {
    try {
      const raw = localStorage.getItem('futureminds_completed_assets_v1');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  // ─── Persist completed assets ────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(
        'futureminds_completed_assets_v1',
        JSON.stringify([...completedAssetIds])
      );
    } catch { /* ignore quota */ }
  }, [completedAssetIds]);

  // ─── Derived course objects ───────────────────────────────────────────────
  const chapters = useMemo(() => {
    return getSortedChapters(courseData).filter(
      (c) => (c.grade || '6') === (user.grade?.replace('Grade ', '') || '6')
    );
  }, [courseData, user.grade]);

  const currentChapter = useMemo(
    () => chapters.find(c => c.id === currentChapterId) || chapters[0] || courseData.chapters[0],
    [chapters, currentChapterId, courseData]
  );
  const currentUnit = useMemo(
    () => findUnit(currentChapter, currentUnitId) || currentChapter?.units?.[0],
    [currentChapter, currentUnitId]
  );
  const currentSubtopic = useMemo(
    () => findSubtopic(currentUnit, currentSubtopicId) || currentUnit?.subtopics?.[0],
    [currentUnit, currentSubtopicId]
  );
  const currentAsset = useMemo(
    () => findAsset(currentSubtopic, currentAssetId) || currentSubtopic?.assets?.[0],
    [currentSubtopic, currentAssetId]
  );

  const selectedChapter = useMemo(
    () => findChapter(courseData, selectedChapterId) || chapters[0] || courseData.chapters[0],
    [courseData, selectedChapterId, chapters]
  );

  // ─── Progress helpers ────────────────────────────────────────────────────
  const getAssetCompleted = useCallback(
    (assetId) => completedAssetIds.has(assetId),
    [completedAssetIds]
  );

  const getSubtopicProgress = useCallback(
    (subtopic) => {
      if (!subtopic?.assets?.length) return { completed: 0, total: 0, pct: 0 };
      const total = subtopic.assets.length;
      const completed = subtopic.assets.filter((a) => completedAssetIds.has(a.id)).length;
      return { completed, total, pct: Math.round((completed / total) * 100) };
    },
    [completedAssetIds]
  );

  const getUnitProgress = useCallback(
    (unit) => {
      const total = countUnitAssets(unit);
      if (!total) return { completed: 0, total: 0, pct: 0 };
      let completed = 0;
      for (const subtopic of unit.subtopics ?? []) {
        for (const asset of subtopic.assets ?? []) {
          if (completedAssetIds.has(asset.id)) completed++;
        }
      }
      return { completed, total, pct: Math.round((completed / total) * 100) };
    },
    [completedAssetIds]
  );

  const getChapterProgress = useCallback(
    (chapter) => {
      const total = countChapterAssets(chapter);
      if (!total) return { completed: 0, total: 0, pct: 0 };
      let completed = 0;
      for (const unit of chapter.units ?? []) {
        for (const subtopic of unit.subtopics ?? []) {
          for (const asset of subtopic.assets ?? []) {
            if (completedAssetIds.has(asset.id)) completed++;
          }
        }
      }
      return { completed, total, pct: Math.round((completed / total) * 100) };
    },
    [completedAssetIds]
  );

  // ─── CMS: update course data ─────────────────────────────────────────────
  const userRef = useRef(user);
  userRef.current = user;
  const toastRef = useRef(() => {});
  const saveTimer = useRef(null);
  const pendingTree = useRef(null);

  const scheduleServerSave = useCallback((tree) => {
    if (!getToken() || String(userRef.current.role).toLowerCase() !== 'admin') return;
    pendingTree.current = tree;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        await api.saveCourse(pendingTree.current);
      } catch (err) {
        toastRef.current('Save failed', `${err.message} Your latest change is NOT stored on the server yet.`, 'error');
      }
    }, 700);
  }, []);

  const updateCourseData = useCallback((newDataOrUpdater) => {
    setCourseDataState((prev) => {
      const next = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prev) : newDataOrUpdater;
      saveCourseData(next);
      scheduleServerSave(next);
      return next;
    });
  }, [scheduleServerSave]);

  // Replace local course state with what the server has (no echo save back).
  const applyServerCourse = useCallback((tree) => {
    if (!tree || !Array.isArray(tree.chapters) || tree.chapters.length === 0) return;
    setCourseDataState(tree);
    saveCourseData(tree);
    const ch = tree.chapters.find(Boolean);
    const un = ch?.units?.[0];
    const st = un?.subtopics?.[0];
    const as = st?.assets?.[0];
    const hasChapter = (id) => tree.chapters.some((c) => c && c.id === id);
    // If the remembered lesson no longer exists, fall back to the first one.
    setCurrentChapterId((id) => (hasChapter(id) ? id : ch?.id ?? null));
    setSelectedChapterId((id) => (hasChapter(id) ? id : ch?.id ?? null));
    setCurrentUnitId((id) => (tree.chapters.some((c) => c?.units?.some((u) => u.id === id)) ? id : un?.id ?? null));
    setCurrentSubtopicId((id) => (tree.chapters.some((c) => c?.units?.some((u) => u.subtopics?.some((s) => s.id === id))) ? id : st?.id ?? null));
    setCurrentAssetId((id) => (tree.chapters.some((c) => c?.units?.some((u) => u.subtopics?.some((s) => s.assets?.some((a) => a.id === id)))) ? id : as?.id ?? null));
  }, []);

  const refreshCourse = useCallback(async () => {
    if (!getToken()) return;
    try {
      applyServerCourse(await api.getCourse());
    } catch (err) {
      if (err.status !== 401) console.warn('[course] using cached copy:', err.message);
    }
  }, [applyServerCourse]);

  // ─── Session: verify the stored token with the server, then pull the live course ───
  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    api.me()
      .then(({ user: account }) => {
        if (cancelled) return;
        // Trust the server's role, not whatever is sitting in localStorage.
        loginAsRole(account.role, { name: account.name, email: account.email });
        refreshCourse();
        syncTutorSessionsRef.current?.();
      })
      .catch((err) => {
        if (cancelled || err.status !== 401) return;
        setToken(null);
        setCurrentView('role-select');
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No token -> login screens only. Wrong role for a screen (e.g. CMS) -> bounce to own home.
  useEffect(() => {
    if (AUTH_VIEWS.includes(currentView)) return;
    if (!getToken()) { setCurrentView('role-select'); return; }
    const role = String(user.role || 'student').toLowerCase();
    if (!viewAllowed(currentView, role)) setCurrentView(ROLE_HOME[role] || 'role-select');
  }, [currentView, user.role]);

  // ─── Navigation ─────────────────────────────────────────────────────────
  const showToast = useCallback((title, message, icon = 'info') => {
    const id = ++toastSeq.current;
    setToasts((prev) => [...prev, { id, title, message, icon }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);
  toastRef.current = showToast;

  const closeDropdowns = useCallback(() => {
    setProfileOpen(false);
    setNotifOpen(false);
  }, []);

  const closeAllModals = useCallback(() => {
    closeDropdowns();
    setChapterModalOpen(false);
  }, [closeDropdowns]);

  const navigateTo = useCallback((viewName) => {
    setCurrentView(viewName);
    closeAllModals();
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeAllModals]);

  /** Navigate to a specific asset in the VideoLesson view */
  const navigateToAsset = useCallback((chapterId, unitId, subtopicId, assetId) => {
    setCurrentChapterId(chapterId);
    setCurrentUnitId(unitId);
    setCurrentSubtopicId(subtopicId);
    setCurrentAssetId(assetId);
    closeAllModals();
    setMobileSidebarOpen(false);
    setCurrentView('video');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeAllModals]);

  /** Mark current asset complete and award XP */
  const markAssetComplete = useCallback((assetId) => {
    if (completedAssetIds.has(assetId)) return;
    setCompletedAssetIds((prev) => new Set([...prev, assetId]));
    addXP(20, 'Completed a lesson asset');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedAssetIds]);

  /** Navigate to adjacent asset within the lesson panel */
  const navigateAdjacentAsset = useCallback((direction) => {
    if (!currentChapter || !currentUnit || !currentSubtopic || !currentAsset) return;

    const sortedAssets = getSortedAssets(currentSubtopic);
    const assetIndex = sortedAssets.findIndex((a) => a.id === currentAssetId);

    if (direction === 'next') {
      if (assetIndex < sortedAssets.length - 1) {
        setCurrentAssetId(sortedAssets[assetIndex + 1].id);
        return;
      }
      // Try next subtopic
      const subtopics = getSortedSubtopics(currentUnit);
      const subtopicIndex = subtopics.findIndex((s) => s.id === currentSubtopicId);
      if (subtopicIndex < subtopics.length - 1) {
        const nextSubtopic = subtopics[subtopicIndex + 1];
        const nextAssets = getSortedAssets(nextSubtopic);
        if (nextAssets.length) {
          setCurrentSubtopicId(nextSubtopic.id);
          setCurrentAssetId(nextAssets[0].id);
        }
        return;
      }
      // Try next unit
      const units = getSortedUnits(currentChapter);
      const unitIndex = units.findIndex((u) => u.id === currentUnitId);
      if (unitIndex < units.length - 1) {
        const nextUnit = units[unitIndex + 1];
        const nextSub = getSortedSubtopics(nextUnit)[0];
        const nextAsset = nextSub ? getSortedAssets(nextSub)[0] : null;
        if (nextUnit && nextSub && nextAsset) {
          setCurrentUnitId(nextUnit.id);
          setCurrentSubtopicId(nextSub.id);
          setCurrentAssetId(nextAsset.id);
        }
      }
    } else {
      if (assetIndex > 0) {
        setCurrentAssetId(sortedAssets[assetIndex - 1].id);
        return;
      }
      // Try previous subtopic
      const subtopics = getSortedSubtopics(currentUnit);
      const subtopicIndex = subtopics.findIndex((s) => s.id === currentSubtopicId);
      if (subtopicIndex > 0) {
        const prevSubtopic = subtopics[subtopicIndex - 1];
        const prevAssets = getSortedAssets(prevSubtopic);
        if (prevAssets.length) {
          setCurrentSubtopicId(prevSubtopic.id);
          setCurrentAssetId(prevAssets[prevAssets.length - 1].id);
        }
      }
    }
  }, [currentChapter, currentUnit, currentSubtopic, currentAsset, currentAssetId, currentSubtopicId, currentUnitId]);

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
    }
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
    if (currentTheme !== 'system') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [currentTheme, applyTheme]);

  const setTheme = useCallback((theme) => {
    setCurrentTheme(theme);
    showToast('Theme Updated', `Switched to ${theme.toUpperCase()} mode`, 'info');
  }, [showToast]);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }, [currentTheme, setTheme]);

  const loginAsRole = useCallback((role, userDetails = {}) => {
    const profile = ROLE_PROFILES[role] || ROLE_PROFILES.student;
    setUser((prev) => ({
      ...prev,
      ...profile,
      ...userDetails,
      role: profile.role,
      name: userDetails.name || profile.name,
      email: userDetails.email || `${role}@futureminds.demo`,
    }));
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile Updated', 'Your details have been successfully saved.', 'success');
  }, [showToast]);

  // Real sign-in: the server checks the password AND that the account really has this role.
  const handleLogin = useCallback(async (event, email, role = 'student', password = '') => {
    if (event) event.preventDefault();
    try {
      const { token, user: account } = await api.login(email, password, role);
      setToken(token);
      loginAsRole(role, {
        name: account.name,
        email: account.email,
        ...(account.grade ? { grade: `Grade ${account.grade}` } : {}),
      });
      refreshCourse();
      syncTutorSessionsRef.current?.();
      showToast(`Welcome back, ${account.name.split(' ')[0]}!`, 'Successfully signed into FutureMinds', 'success');
      navigateTo(ROLE_HOME[role] || 'dashboard');
    } catch (err) {
      showToast('Sign-in failed', err.message, 'error');
    }
  }, [loginAsRole, navigateTo, refreshCourse, showToast]);

  const handleLogout = useCallback(() => {
    window.clearTimeout(saveTimer.current);
    setToken(null);
    closeAllModals();
    showToast('Logged Out', 'You have been safely signed out.', 'info');
    navigateTo('role-select');
  }, [closeAllModals, navigateTo, showToast]);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen((open) => !open);
      return;
    }
    setSidebarCollapsed((collapsed) => {
      const next = !collapsed;
      showToast('Sidebar', next ? 'Collapsed to icon-only mode' : 'Expanded navigation', 'info');
      return next;
    });
  }, [showToast]);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const toggleProfileDropdown = useCallback((event) => {
    if (event) event.stopPropagation();
    setProfileOpen((open) => {
      const next = !open;
      if (next) setNotifOpen(false);
      return next;
    });
  }, []);

  const toggleNotificationDropdown = useCallback((event) => {
    if (event) event.stopPropagation();
    setNotifOpen((open) => {
      const next = !open;
      if (next) setProfileOpen(false);
      return next;
    });
  }, []);

  const openChapterModal = useCallback((chapterId) => {
    setSelectedChapterId(chapterId ?? courseData.chapters[0]?.id);
    setChapterModalOpen(true);
  }, [courseData]);

  const closeChapterModal = useCallback(() => {
    setChapterModalOpen(false);
  }, []);

  const selectModalChapter = useCallback((chapterId) => {
    setSelectedChapterId(chapterId);
  }, []);

  /** Launch a lesson — can accept an asset reference or legacy (type, title) call */
  const launchLesson = useCallback((chapterIdOrType, unitIdOrTitle, subtopicId, assetId) => {
    // Legacy call from old code: launchLesson('VIDEO', 'title')
    if (typeof chapterIdOrType === 'string' && !unitIdOrTitle?.startsWith('ch')) {
      const first = getFirstAsset(courseData, chapters[0]?.id);
      if (first) {
        navigateToAsset(first.chapterId, first.unitId, first.subtopicId, first.assetId);
      } else {
        navigateTo('video');
      }
      return;
    }
    navigateToAsset(chapterIdOrType, unitIdOrTitle, subtopicId, assetId);
  }, [courseData, chapters, navigateToAsset, navigateTo]);

  const addXP = useCallback((amount, reason = 'Completed Activity') => {
    setUser((prev) => ({ ...prev, xp: prev.xp + amount }));
    showToast(`+${amount} XP Earned!`, reason, 'star');
  }, [showToast]);

  // Make markAssetComplete reference addXP correctly (define after addXP)
  const markAssetCompleteFinal = useCallback((assetId) => {
    const id = assetId ?? currentAssetId;
    if (!id || completedAssetIds.has(id)) return;
    setCompletedAssetIds((prev) => new Set([...prev, id]));
    setUser((prev) => ({ ...prev, xp: prev.xp + 20 }));
    showToast('+20 XP Earned!', 'Asset marked as complete!', 'star');
  }, [completedAssetIds, currentAssetId, showToast]);

  const toggleAssetComplete = useCallback((assetId) => {
    const id = assetId ?? currentAssetId;
    if (!id) return;
    setCompletedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Marked Incomplete', 'Asset completion status updated.', 'info');
      } else {
        next.add(id);
        setUser((prevUser) => ({ ...prevUser, xp: prevUser.xp + 20 }));
        showToast('+20 XP Earned!', 'Asset marked as complete!', 'star');
      }
      return next;
    });
  }, [currentAssetId, showToast]);

  const redeemReward = useCallback((rewardType, cost) => {
    setUser((prev) => {
      if (prev.xp < cost) {
        showToast('Insufficient XP', `You need ${cost} XP to redeem this reward. Current balance: ${prev.xp} XP`, 'info');
        return prev;
      }
      const next = {
        ...prev,
        xp: prev.xp - cost,
        redeemedItems: [...prev.redeemedItems, rewardType],
      };
      if (rewardType === 'dark-theme') {
        next.darkThemeUnlocked = true;
        showToast('Reward Unlocked!', 'Dark Theme is now available in your Settings!', 'star');
      } else if (rewardType === 'ai-hour') {
        next.aiHoursUnlocked += 1;
        showToast('Reward Unlocked!', '+1 Hour of 1-on-1 AI Tutoring credited to your account!', 'star');
      }
      return next;
    });
  }, [showToast]);

  const toggleVideoPlay = useCallback(() => {
    setVideo((prev) => {
      const isPlaying = !prev.isPlaying;
      showToast(isPlaying ? 'Playing Lesson' : 'Paused', currentAsset?.title || 'Lesson', 'info');
      return { ...prev, isPlaying };
    });
  }, [showToast, currentAsset]);

  const switchVideoTab = useCallback((tabName) => {
    setVideo((prev) => ({ ...prev, activeTab: tabName }));
  }, []);

  const saveVideoNote = useCallback((notes) => {
    setVideo((prev) => ({ ...prev, notes }));
    showToast('Note Saved', 'Your study notes have been synced to your profile!', 'success');
  }, [showToast]);

  const postDiscussionReply = useCallback(() => {
    const text = discussionInput.trim();
    if (!text) return;
    setVideo((prev) => ({
      ...prev,
      discussion: [{ author: user.name, time: 'Just now', text }, ...prev.discussion],
    }));
    setDiscussionInput('');
    showToast('Comment Posted', 'Your reply is visible to the study group', 'success');
    addXP(5, 'Participated in Discussion');
  }, [addXP, discussionInput, showToast, user.name]);

  const loadSessionMessages = useCallback(async (sessionId) => {
    if (!getToken()) return;
    try {
      const messages = await api.tutorMessages(String(sessionId));
      if (Array.isArray(messages)) {
        setAiTutor((prev) => ({
          ...prev,
          sessions: prev.sessions.map((session) => {
            if (String(session.id) !== String(sessionId)) return session;
            const mapped = messages.length > 0
              ? messages.map((m) => ({
                  sender: m.role === 'assistant' ? 'owl' : 'user',
                  name: m.role === 'assistant' ? 'Professor Owl' : userRef.current?.name || 'Student',
                  text: m.content,
                }))
              : session.messages;
            return { ...session, messages: mapped };
          }),
        }));
      }
    } catch {
      // fallback to localStorage, do not crash
    }
  }, []);

  const selectChatSession = useCallback((sessionId) => {
    setAiTutor((prev) => ({ ...prev, currentSessionId: sessionId }));
    loadSessionMessages(sessionId);
  }, [loadSessionMessages]);

  const syncTutorSessions = useCallback(async () => {
    if (!getToken()) return;
    try {
      const serverSessions = await api.tutorSessions();
      if (!Array.isArray(serverSessions)) return;

      setAiTutor((prev) => {
        const localMap = new Map((prev.sessions || []).map((s) => [String(s.id), s]));
        const merged = [];
        const seen = new Set();

        // Server wins on conflict: newest first
        for (const s of serverSessions) {
          const sId = String(s.id);
          seen.add(sId);
          const existing = localMap.get(sId);
          merged.push({
            id: isNaN(Number(s.id)) ? s.id : (Number(s.id) || s.id),
            title: s.title || existing?.title || 'AI Chat',
            messages: existing?.messages && existing.messages.length > 0 ? existing.messages : [],
          });
        }

        // Keep local-only sessions that aren't on server yet
        for (const [idStr, localSess] of localMap.entries()) {
          if (!seen.has(idStr)) {
            merged.push(localSess);
          }
        }

        const fallback = merged.length > 0 ? merged : prev.sessions;
        const currentValid = fallback.some((s) => String(s.id) === String(prev.currentSessionId));
        const activeId = currentValid ? prev.currentSessionId : (fallback[0]?.id ?? prev.currentSessionId);

        return {
          ...prev,
          sessions: fallback,
          currentSessionId: activeId,
        };
      });

      setAiTutor((curr) => {
        if (curr.currentSessionId) {
          loadSessionMessages(curr.currentSessionId);
        }
        return curr;
      });
    } catch {
      // fallback to localStorage, do not crash
    }
  }, [loadSessionMessages]);

  syncTutorSessionsRef.current = syncTutorSessions;

  useEffect(() => {
    if (currentView === 'ai-tutor') {
      syncTutorSessions();
    }
  }, [currentView, syncTutorSessions]);

  const createNewSession = useCallback(() => {
    const newId = Date.now();
    setAiTutor((prev) => ({
      ...prev,
      currentSessionId: newId,
      sessions: [
        {
          id: newId,
          title: 'New AI Exploration',
          messages: [
            {
              sender: 'owl',
              name: 'Professor Owl',
              text: "Hello Divya! I'm your AI Guru. Ask me anything about Artificial Intelligence, Python, Math, or your current homework!",
            },
          ],
        },
        ...prev.sessions,
      ],
    }));
    showToast('New Session', 'Started a fresh AI Tutor conversation', 'info');
  }, [showToast]);

  const deleteChatSession = useCallback((sessionId, event) => {
    if (event) event.stopPropagation();
    api.tutorDeleteSession(String(sessionId)).catch(() => {});
    setAiTutor((prev) => {
      let sessions = prev.sessions.filter((session) => String(session.id) !== String(sessionId));
      let currentSessionId = prev.currentSessionId;
      if (String(currentSessionId) === String(sessionId)) {
        if (sessions.length > 0) {
          currentSessionId = sessions[0].id;
        } else {
          const newId = Date.now();
          sessions = [
            {
              id: newId,
              title: 'New AI Exploration',
              messages: [
                {
                  sender: 'owl',
                  name: 'Professor Owl',
                  text: "Hello Divya! I'm your AI Guru. Ask me anything about Artificial Intelligence, Python, Math, or your current homework!",
                },
              ],
            },
          ];
          currentSessionId = newId;
        }
      }
      return { ...prev, sessions, currentSessionId };
    });
    showToast('Conversation Deleted', 'Chat session was successfully removed', 'info');
  }, [showToast]);

  const clearCurrentChat = useCallback(() => {
    setAiTutor((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === prev.currentSessionId
          ? {
              ...session,
              messages: [
                { sender: 'owl', name: 'Professor Owl', text: 'Conversation cleared! What would you like to explore next?' },
              ],
            }
          : session
      ),
    }));
    showToast('Chat Cleared', 'Messages in this conversation were reset', 'info');
  }, [showToast]);

  const clearAllChatSessions = useCallback(() => {
    const newId = Date.now();
    setAiTutor({
      currentSessionId: newId,
      isTyping: false,
      sessions: [
        {
          id: newId,
          title: 'New AI Exploration',
          messages: [
            { sender: 'owl', name: 'Professor Owl', text: 'All chat history cleared! Ask me anything to start a new exploration.' },
          ],
        },
      ],
    });
    showToast('All Chats Cleared', 'Chat history has been completely reset', 'info');
  }, [showToast]);

  const deleteChatMessage = useCallback((index) => {
    setAiTutor((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) => {
        if (session.id !== prev.currentSessionId) return session;
        const messages = session.messages.filter((_, i) => i !== index);
        if (messages.length === 0) {
          messages.push({ sender: 'owl', name: 'Professor Owl', text: 'What would you like to explore next?' });
        }
        return { ...session, messages };
      }),
    }));
    showToast('Message Deleted', 'Message removed from conversation.', 'info');
  }, [showToast]);

  aiTutorRef.current = aiTutor;

  const sendAiMessage = useCallback((promptText = null) => {
    const text = (promptText ?? aiInput).trim();
    if (!text || typingRef.current) return;
    setAiInput('');
    typingRef.current = true;

    setAiTutor((prev) => ({
      ...prev,
      isTyping: true,
      sessions: prev.sessions.map((session) =>
        session.id === prev.currentSessionId
          ? { ...session, messages: [...session.messages, { sender: 'user', name: user.name, text }] }
          : session
      ),
    }));

    // Real tutor: the server calls Gemini (the API key never reaches the browser). While viewing a lesson,
    // we pass its id so the tutor can use that lesson's content as context.
    let answered = false;
    api
      .tutorChat({
        sessionId: aiTutorRef.current.currentSessionId,
        message: text,
        assetId: currentView === 'video' ? currentAssetId : undefined,
      })
      .then(({ reply }) => {
        answered = true;
        return reply;
      })
      .catch((err) =>
        err.status === 401
          ? 'Your session has expired. Please sign in again to keep chatting.'
          : err.message || 'Professor Owl is resting right now. Please try again.'
      )
      .then((reply) => {
        setAiTutor((prev) => ({
          ...prev,
          isTyping: false,
          sessions: prev.sessions.map((session) =>
            session.id === prev.currentSessionId
              ? { ...session, messages: [...session.messages, { sender: 'owl', name: 'Professor Owl', text: reply }] }
              : session
          ),
        }));
        typingRef.current = false;
        if (answered) addXP(10, 'Asked Professor Owl');
      });
  }, [addXP, aiInput, user.name, currentView, currentAssetId]);

  const navKey = useMemo(() => {
    if (currentView === 'roadmap-1' || currentView === 'roadmap-2' || currentView === 'video') {
      return 'roadmap';
    }
    return currentView;
  }, [currentView]);

  const currentSession = useMemo(
    () => aiTutor.sessions.find((session) => session.id === aiTutor.currentSessionId) || aiTutor.sessions[0],
    [aiTutor]
  );

  const filteredSessions = useMemo(() => {
    const query = aiSearchQuery.toLowerCase().trim();
    if (!query) return aiTutor.sessions;
    return aiTutor.sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(query) ||
        session.messages.some((message) => message.text.toLowerCase().includes(query))
    );
  }, [aiSearchQuery, aiTutor.sessions]);

  const value = useMemo(
    () => ({
      // ── User & UI ───────────────────────────────────────
      user,
      currentView,
      currentTheme,
      video,
      aiTutor,
      toasts,
      sidebarCollapsed,
      mobileSidebarOpen,
      profileOpen,
      notifOpen,
      chapterModalOpen,
      aiSearchQuery,
      setAiSearchQuery,
      aiInput,
      setAiInput,
      discussionInput,
      setDiscussionInput,
      navKey,
      currentSession,
      filteredSessions,
      // ── Course Data ────────────────────────────────────
      courseData,
      chapters,
      updateCourseData,
      applyServerCourse,
      refreshCourse,
      // ── Current Position ──────────────────────────────
      currentChapterId,
      currentUnitId,
      currentSubtopicId,
      currentAssetId,
      currentChapter,
      currentUnit,
      currentSubtopic,
      currentAsset,
      // ── Modal Chapter Selection ────────────────────────
      selectedChapterId,
      selectedChapter,
      // ── Progress ──────────────────────────────────────
      completedAssetIds,
      getAssetCompleted,
      getSubtopicProgress,
      getUnitProgress,
      getChapterProgress,
      markAssetComplete: markAssetCompleteFinal,
      toggleAssetComplete,
      // ── Navigation Actions ────────────────────────────
      navigateTo,
      navigateToAsset,
      navigateAdjacentAsset,
      showToast,
      setTheme,
      toggleTheme,
      updateProfile,
      handleLogin,
      loginAsRole,
      handleLogout,
      toggleSidebar,
      closeMobileSidebar,
      toggleProfileDropdown,
      toggleNotificationDropdown,
      closeDropdowns,
      closeAllModals,
      openChapterModal,
      closeChapterModal,
      selectModalChapter,
      launchLesson,
      addXP,
      redeemReward,
      toggleVideoPlay,
      switchVideoTab,
      saveVideoNote,
      setVideo,
      postDiscussionReply,
      selectChatSession,
      createNewSession,
      deleteChatSession,
      clearCurrentChat,
      clearAllChatSessions,
      deleteChatMessage,
      sendAiMessage,
      syncTutorSessions,
    }),
    [
      user, currentView, currentTheme, video, aiTutor, toasts,
      sidebarCollapsed, mobileSidebarOpen, profileOpen, notifOpen, chapterModalOpen,
      aiSearchQuery, aiInput, discussionInput, navKey, currentSession, filteredSessions,
      courseData, chapters, updateCourseData, applyServerCourse, refreshCourse,
      currentChapterId, currentUnitId, currentSubtopicId, currentAssetId,
      currentChapter, currentUnit, currentSubtopic, currentAsset,
      selectedChapterId, selectedChapter,
      completedAssetIds, getAssetCompleted, getSubtopicProgress, getUnitProgress, getChapterProgress,
      markAssetCompleteFinal, toggleAssetComplete,
      navigateTo, navigateToAsset, navigateAdjacentAsset,
      showToast, setTheme, toggleTheme, updateProfile,
      handleLogin, loginAsRole, handleLogout, toggleSidebar, closeMobileSidebar,
      toggleProfileDropdown, toggleNotificationDropdown,
      closeDropdowns, closeAllModals,
      openChapterModal, closeChapterModal, selectModalChapter,
      launchLesson, addXP, redeemReward,
      toggleVideoPlay, switchVideoTab, saveVideoNote,
      postDiscussionReply, selectChatSession, createNewSession,
      deleteChatSession, clearCurrentChat, clearAllChatSessions,
      deleteChatMessage, sendAiMessage, syncTutorSessions,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
