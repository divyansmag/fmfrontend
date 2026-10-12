import { Bell, Layers, LogOut, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const TOP_NAV = [
  { key: 'dashboard', view: 'dashboard', label: 'Dashboard' },
  { key: 'roadmap', view: 'roadmap-1', label: 'Roadmap' },
  { key: 'ai-tutor', view: 'ai-tutor', label: 'AI Tutor' },
  { key: 'progress', view: 'progress', label: 'Progress' },
];

const ACTIVE_TOP =
  "relative text-sm font-bold text-purple-600 dark:text-purple-400 pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 after:rounded-full";
const IDLE_TOP =
  'relative text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 pb-1 transition-colors';

export default function Header() {
  const {
    user,
    navKey,
    navigateTo,
    toggleSidebar,
    toggleNotificationDropdown,
    toggleProfileDropdown,
    toggleTheme,
    handleLogout,
    showToast,
    notifOpen,
    profileOpen,
  } = useApp();

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors shadow-sm"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="hidden sm:flex items-center justify-center gap-6 lg:gap-8 flex-1">
        {TOP_NAV.map((item) => (
          <button
            key={item.key}
            id={`topnav-btn-${item.key}`}
            type="button"
            onClick={() => navigateTo(item.view)}
            className={navKey === item.key ? ACTIVE_TOP : IDLE_TOP}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="Search topics, lessons..."
            className="w-48 xl:w-56 pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-800 dark:text-slate-200"
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="relative" id="notification-container">
          <button
            type="button"
            onClick={toggleNotificationDropdown}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {notifOpen && (
            <div id="notification-dropdown" className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 cursor-pointer"
                  onClick={() => showToast('Notifications', 'All marked as read', 'info')}
                >
                  Mark read
                </button>
              </div>
              <div className="py-2 space-y-2">
                <div
                  className="p-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex items-start gap-3 cursor-pointer"
                  onClick={() => navigateTo('video')}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs">🎓</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Project Due Soon</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Neural Networks Project Unit 1 is due Fri 11:59 PM.</div>
                  </div>
                </div>
                <div
                  className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-start gap-3 cursor-pointer"
                  onClick={() => navigateTo('progress')}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-xs">🔥</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">12-Day Streak Achieved!</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">+50 XP bonus credited to your balance.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Moon className="w-5 h-5 dark:hidden" />
          <Sun className="w-5 h-5 hidden dark:block" />
        </button>

        <div className="relative" id="profile-dropdown-container">
          <button
            type="button"
            onClick={toggleProfileDropdown}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-600/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
          >
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-sm overflow-hidden">
              <User className="w-5 h-5" />
            </div>
          </button>

          {profileOpen && (
            <div id="profile-dropdown" className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white global-user-name">{user.name}</h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold global-user-level">{user.level}</p>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => navigateTo('cms')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span>Content CMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
