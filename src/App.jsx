import { useEffect } from 'react';
import { useApp } from './context/AppContext.jsx';
import Toast from './components/Toast.jsx';
import AuthHeader from './components/AuthHeader.jsx';
import AuthFooter from './components/AuthFooter.jsx';
import RoleSelect from './components/RoleSelect.jsx';
import AuthLogin from './components/AuthLogin.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import Roadmap1 from './components/Roadmap1.jsx';
import Roadmap2 from './components/Roadmap2.jsx';
import VideoLesson from './components/VideoLesson.jsx';
import AITutor from './components/AITutor.jsx';
import Progress from './components/Progress.jsx';
import Settings from './components/Settings.jsx';
import ChapterModal from './components/ChapterModal.jsx';
import CMS from './components/CMS.jsx';

const AUTH_VIEWS = ['student-login', 'teacher-login', 'parent-login', 'admin-login', 'role-select'];

export default function App() {
  const { currentTheme, currentView, closeDropdowns } = useApp();
  const isAuth = AUTH_VIEWS.includes(currentView);

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
      ) : (
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
            {currentView === 'cms' && <CMS />}
          </div>
        </div>
      )}

      <ChapterModal />
    </>
  );
}