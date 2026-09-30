
import { useApp } from '../context/AppContext.jsx';
import { LayoutGrid, Map, MessageSquareText, BarChart2, Flame, Layers } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', view: 'dashboard', label: 'Dashboard', Icon: LayoutGrid },
  { key: 'roadmap', view: 'roadmap-1', label: 'Roadmap', Icon: Map },
  { key: 'ai-tutor', view: 'ai-tutor', label: 'AI Tutor', Icon: MessageSquareText },
  { key: 'progress', view: 'progress', label: 'Progress', Icon: BarChart2 },
];

const ACTIVE_BTN =
  'flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-purple-700 text-white font-semibold shadow-md shadow-purple-600/25 transition-all';
const IDLE_BTN =
  'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all';

export default function Sidebar() {
  const { user, navKey, navigateTo, closeMobileSidebar, toggleSidebar, sidebarCollapsed, mobileSidebarOpen } = useApp();

  const classNames = [
    'w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-4 sm:p-5 z-30 flex-shrink-0 sticky top-0 md:h-screen transition-all duration-300',
    sidebarCollapsed ? 'collapsed' : '',
    mobileSidebarOpen ? 'mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        id="mobile-sidebar-backdrop"
        className={mobileSidebarOpen ? 'active' : ''}
        onClick={closeMobileSidebar}
      />

      <aside id="app-sidebar" className={classNames}>
        <div>
          <div className="flex items-center justify-between px-2 py-2 mb-6">
            <div className="flex items-center gap-3 cursor-pointer overflow-hidden" onClick={() => navigateTo('dashboard')}>
              <img src="dist\assets\logo.png" alt="FutureMinds Logo" className="w-10 h-10 object-contain flex-shrink-0 dark:hidden" />
              <img src="dist\assets\logodark.png" alt="FutureMinds Logo Dark" className="w-10 h-10 object-contain flex-shrink-0 hidden dark:block" />
              <div className="sidebar-brand-text">
                <div className="text-lg font-extrabold text-purple-700 dark:text-purple-400 font-display leading-tight">FutureMinds</div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">MYAIGURU</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                id={`sidebar-btn-${item.key}`}
                type="button"
                title={item.label}
                onClick={() => {
                  navigateTo(item.view);
                  closeMobileSidebar();
                }}
                className={`sidebar-btn w-full ${navKey === item.key ? ACTIVE_BTN : IDLE_BTN}`}
              >
                <item.Icon className="w-5 h-5 flex-shrink-0" />
                <span className="sidebar-text text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`sidebar-streak-details relative overflow-hidden rounded-2xl mt-2 pt-4 px-3 pb-3 border border-orange-200/70 dark:border-orange-500/20 bg-gradient-to-r from-amber-300 via-orange-300 to-red-400 dark:from-orange-950/40 dark:via-slate-900 dark:to-red-950/30 shadow-[0_0_24px_rgba(249,115,22,0.18)] ${sidebarCollapsed ? 'hidden' : ''}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.28),_transparent_58%)]" />
          <div className="absolute -right-5 -top-6 h-20 w-20 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="relative">
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white shadow-lg shadow-orange-500/50  ring-2 ring-orange-300/40">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                </span>
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text font-bold text-slate dark:from-orange-300 dark:via-red-300 dark:to-rose-300">Daily Streak</span>
              </div>
              <span className="global-user-streak font-black text-black dark:text-orange-300">{user.streak} Days</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100 ring-1 ring-orange-200/80 dark:bg-slate-800 dark:ring-orange-800/50">
              <div className="h-full rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]" style={{ width: '85%' }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate dark:text-slate-400">
              <span className="global-user-level font-semibold">Level {user.levelNumber}</span>
              <span className="global-user-xp font-black text-black dark:text-orange-300">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>


        <div
          className="sidebar-mini-badge flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 p-2 text-xs font-black text-white shadow-[0_0_18px_rgba(249,115,22,0.45)] ring-1 ring-orange-200/80 transition-transform hover:scale-105 dark:ring-orange-700/50"
          onClick={toggleSidebar}
          title={`${user.streak}-Day Streak • ${user.xp.toLocaleString()} XP`}
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>{user.streak}</span>
        </div>

      </aside>
    </>
  );
}
