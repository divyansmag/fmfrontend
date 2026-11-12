import { useEffect, lazy, Suspense } from 'react';
import { useApp } from './context/AppContext.jsx';
import Toast from './components/Toast.jsx';
import AuthHeader from './components/AuthHeader.jsx';
import AuthFooter from './components/AuthFooter.jsx';
import RoleSelect from './components/RoleSelect.jsx';
import AuthLogin from './components/AuthLogin.jsx';

// Lazy-load non-auth views so login and role-select load instantly without compiling 2,000+ modules
const Sidebar = lazy(() => import('./components/Sidebar.jsx'));
const Header = lazy(() => import('./components/Header.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const Roadmap1 = lazy(() => import('./components/Roadmap1.jsx'));
const Roadmap2 = lazy(() => import('./components/Roadmap2.jsx'));
const VideoLesson = lazy(() => import('./components/VideoLesson.jsx'));
const AITutor = lazy(() => import('./components/AITutor.jsx'));
const Progress = lazy(() => import('./components/Progress.jsx'));
const Settings = lazy(() => import('./components/Settings.jsx'));
const ChapterModal = lazy(() => import('./components/ChapterModal.jsx'));
const CMS = lazy(() => import('./components/CMS.jsx'));
const CmsGate = lazy(() => import('./components/CmsGate.jsx'));
const PortalApp = lazy(() => import('./portals/PortalApp.jsx'));

const AUTH_VIEWS = ['student-login', 'teacher-login', 'parent-login', 'admin-login', 'role-select'];

const PORTAL_VIEWS = new Set([
  'teacher-dashboard',
  'teacher-assignments',
  'teacher-announcements',
  'teacher-progress',
  'teacher-settings',
  'teacher-lab-guide',
  'parent-dashboard',
  'parent-progress',
  'parent-settings',
  'admin-dashboard',
  'admin-users',
  'admin-progress',
  'admin-settings',
]);

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] dark:bg-[#0F172A]">
    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const { currentTheme, currentView, closeDropdowns } = useApp();
  const isAuth = AUTH_VIEWS.includes(currentView);
  const isPortal = PORTAL_VIEWS.has(currentView);

  // Apply dark mode class to root html/body based on currentTheme state
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System default check
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [currentTheme]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (
        !event.target.closest('#profile-dropdown-container') &&
        !event.target.closest('#profile-dropdown') &&
        !event.target.closest('#notification-container') &&
        !event.target.closest('#notification-dropdown')
      ) {
        closeDropdowns();
      }
    };
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [closeDropdowns]);

  return (
    <>
      <Toast />

      {isAuth ? (
        <div
          id="auth-shell"
          className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-purple-50/60 via-white to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20"
        >
          <AuthHeader />
          {currentView === 'role-select' ? <RoleSelect /> : <AuthLogin />}
          <AuthFooter />
        </div>
      ) : isPortal ? (
        <Suspense fallback={<PageLoadingFallback />}>
          <PortalApp view={currentView} />
        </Suspense>
      ) : (
        <Suspense fallback={<PageLoadingFallback />}>
          <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
              <Header />
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'roadmap-1' && <Roadmap1 />}
              {currentView === 'roadmap-2' && <Roadmap2 />}
              {currentView === 'video' && <VideoLesson />}
              {currentView === 'ai-tutor' && <AITutor />}
              {currentView === 'progress' && <Progress />}
              {currentView === 'settings' && <Settings />}
              {currentView === 'cms' && <CmsGate><CMS /></CmsGate>}
            </div>
          </div>
          <ChapterModal />
        </Suspense>
      )}
    </>
  );
}
// force reload

// force reload again
