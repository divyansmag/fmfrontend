import { useState } from 'react';
import { Bell, Camera, Edit3, Eye, LogOut, User, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const THEME_OPTIONS = [
  { id: 'light', title: 'Light', preview: '☀️', previewClass: 'bg-purple-100 border border-purple-300' },
  { id: 'dark', title: 'Dark', preview: '🌙', previewClass: 'bg-slate-900 border border-slate-700' },
  { id: 'system', title: 'System', preview: '💻', previewClass: 'bg-gradient-to-br from-purple-100 to-slate-900 border border-slate-400' },
];

export default function Settings() {
  const { user, updateProfile, currentTheme, setTheme, handleLogout, showToast } = useApp();
  
  const [profile, setProfile] = useState({
    name: user.name || 'Aanya Sharma',
    email: user.email || 'aanya@futureminds.demo',
    phone: user.phone || '+91 98765 43210',
    grade: user.grade || 'Grade 8 — Section A',
  });

  const [prefs, setPrefs] = useState({
    emailDigest: true,
    importantAlerts: true,
  });

  const updateField = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profile);
  };

  return (
    <main id="view-settings" className="view-container p-4 sm:p-5 max-w-7xl mx-auto w-full space-y-5">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center text-2xl font-bold shadow-inner overflow-hidden">👩‍🎓</div>
            <button type="button" onClick={() => showToast('Profile Photo', 'Photo upload modal opened', 'info')} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">{profile.name}</h2>
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Student • FutureMinds AI Labs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button type="button" onClick={handleLogout} className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border-2 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-extrabold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer">
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid - 2x2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left Column (Profile & Security) */}
        <form onSubmit={handleSaveProfile} className="space-y-5 w-full">
          {/* Profile Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Personal Profile</h3>
                  <p className="text-[10px] font-medium text-slate-400">Update your contact details</p>
                </div>
              </div>
              <button 
                type="submit" 
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] shadow-sm shadow-purple-600/20 transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Save</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                ['name', 'Full Name', 'text', false],
                ['email', 'Email Address', 'email', false],
                ['phone', 'Phone', 'text', false],
                ['grade', 'Grade/Class', 'text', true],
              ].map(([key, label, type, isReadOnly]) => (
                <div key={key} className="space-y-1">
                  <label className="block font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">{label}</label>
                  <input
                    type={type}
                    value={profile[key]}
                    onChange={(event) => !isReadOnly && updateField(key, event.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                      isReadOnly 
                        ? 'bg-slate-100/50 dark:bg-slate-700/20 border-slate-200/60 dark:border-slate-700/40 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-50 dark:bg-slate-700/40 border-slate-100 dark:border-slate-700/70 text-slate-900 dark:text-white'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Security</h3>
                  <p className="text-[10px] font-medium text-slate-400">Manage your password</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 text-xs">
              <div className="space-y-1">
                <label className="block font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">Password</label>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70">
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">••••••••</span>
                  <button type="button" onClick={() => showToast('Password', 'Change password flow triggered', 'info')} className="text-purple-600 dark:text-purple-400 font-bold text-[10px] hover:underline cursor-pointer">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right Column (Appearance & Communication) */}
        <div className="space-y-5 w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Appearance</h3>
                <p className="text-[10px] font-medium text-slate-400">Choose your visual theme</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((option) => {
                const selected = currentTheme === option.id;
                return (
                  <div
                    key={option.id}
                    id={`theme-card-${option.id}`}
                    onClick={() => setTheme(option.id)}
                    className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      selected
                        ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/50 dark:bg-slate-700/40'
                        : 'border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg flex items-center justify-center text-base shadow-inner ${option.previewClass}`}>{option.preview}</div>
                    <div className="text-[10px] font-extrabold text-slate-900 dark:text-white font-display">{option.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Communication Preferences Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Notifications</h3>
                <p className="text-[10px] font-medium text-slate-400">Manage communication</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                ['emailDigest', 'Email Digest', 'Weekly summary of progress'],
                ['importantAlerts', 'Important Alerts', 'Critical updates & security'],
              ].map(([key, title, desc]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-1.5 border-b last:border-0 border-slate-50 dark:border-slate-700/50">
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white font-display">{title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-8 h-4 flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                      prefs[key] ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                        prefs[key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}