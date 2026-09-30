import { useState } from 'react';
import { 
  Award, 
  Check, 
  CheckCircle, 
  Flame, 
  ShoppingBag, 
  Star, 
  Trophy, 
  Zap, 
  Code, 
  Compass, 
  Palette, 
  Bot 
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const BADGES = [
  { icon: Zap, title: 'Quick Learner', desc: 'Complete 5 lessons in 1 day', wrap: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' },
  { icon: Code, title: 'Prompt Engineer', desc: 'Write 100 successful AI prompts', wrap: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' },
  { icon: Compass, title: 'AI Explorer', desc: 'Discover all hidden interactions', wrap: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400' },
];

const LEADERBOARD_TABS = ['Global', 'Class', 'Friends'];

const LEADERBOARD = [
  { rank: 1, initials: 'AS', name: 'Arjun S.', level: 'Lvl 15', xp: '12,400 XP', style: 'first', avatar: '/assets/avatar1.jpg' },
  { rank: 2, initials: 'PV', name: 'Priya V.', level: 'Lvl 14', xp: '11,800 XP', avatar: '/assets/avatar2.jpg' },
  { rank: 3, initials: 'IM', name: 'Ishaan M.', level: 'Lvl 13', xp: '11,280 XP', bronze: true, avatar: '/assets/avatar3.jpg' },
];

export default function Progress() {
  const { user, redeemReward, showToast } = useApp();
  const [boardTab, setBoardTab] = useState('Global');
  const darkUnlocked = user.darkThemeUnlocked || user.redeemedItems.includes('dark-theme');

  return (
    <main id="view-progress" className="view-container p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" className="text-slate-100 dark:text-slate-700 stroke-current" strokeWidth="10" fill="transparent" />
                <circle cx="60" cy="60" r="50" className="text-purple-600 stroke-current" strokeWidth="10" strokeDasharray="314.15" strokeDashoffset="44" strokeLinecap="round" fill="transparent" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">86%</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">COMPLETE</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1.5">
                <Award className="w-4 h-4" />
                <span>Current Rank</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-display">Level {user.levelNumber}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">AI Apprentice</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70">
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mb-1.5">
                <Star className="w-4 h-4" />
                <span>Total XP</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1 global-user-xp font-display">{user.xp.toLocaleString()} XP</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Top 15% in class</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mb-1.5">
                <Flame className="w-4 h-4" />
                <span>Streak</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-display">8 Days</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Personal best: 14</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/70">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold mb-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Modules</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-display">128</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Modules finished</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Achievements Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">Achievements</h3>
                  <p className="text-[11px] font-medium text-slate-400">14 Badges Earned</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => showToast('Achievements', 'Showing all 14 unlocked student badges', 'info')} 
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BADGES.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.title} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-2xl ${badge.wrap} flex items-center justify-center mb-3 shadow-inner`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-display">{badge.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">{badge.desc}</p>
                    <span className="px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Earned
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reward Shop Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">Reward Shop</h3>
                  <p className="text-[11px] font-medium text-slate-400">Spend your XP</p>
                </div>
              </div>
              <span id="shop-balance-display" className="px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold text-xs shadow-sm">
                Balance: {user.xp.toLocaleString()} XP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-display">Dark Theme Unlock</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Unlock the exclusive dark mode UI.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">500 XP</span>
                  <button
                    id="redeem-dark-theme-btn"
                    type="button"
                    disabled={darkUnlocked}
                    onClick={() => redeemReward('dark-theme', 500)}
                    className={darkUnlocked ? 'px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold text-xs cursor-not-allowed uppercase tracking-wider' : 'px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-105 active:scale-100 uppercase tracking-wider cursor-pointer'}
                  >
                    {darkUnlocked ? 'Unlocked' : 'Redeem'}
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-display">Extra AI Tutor Hour</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Get an extra 60 mins of 1-on-1 tutoring.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">300 XP</span>
                  <button 
                    type="button" 
                    onClick={() => redeemReward('ai-hour', 300)} 
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-105 active:scale-100 uppercase tracking-wider cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Column */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mb-2">Leaderboard</h3>
          
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl mb-4 text-xs font-bold text-center">
            {LEADERBOARD_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setBoardTab(tab)}
                className={`py-2 rounded-xl transition-all cursor-pointer ${boardTab === tab ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-purple-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {LEADERBOARD.map((row) => (
              <div key={row.rank} className={`flex items-center justify-between p-2.5 rounded-2xl ${row.style === 'first' ? 'bg-slate-50 dark:bg-slate-700/40' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black w-4 text-center ${row.rank === 1 ? 'text-amber-500' : row.bronze ? 'text-amber-700' : 'text-slate-400'}`}>{row.rank}</span>
                  {row.avatar ? (
                    <img src={row.avatar} alt={row.name} className={`w-8 h-8 rounded-full object-cover shadow-sm ${row.rank === 1 ? 'ring-2 ring-amber-400 ring-offset-1 p-[1px]' : ''}`} />
                  ) : (
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${row.rank === 1 ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' : row.bronze ? 'bg-amber-50 dark:bg-amber-950 text-amber-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {row.initials}
                    </div>
                  )}
                  <div>
                    <div className={`text-xs ${row.rank === 1 ? 'font-bold' : 'font-semibold'} text-slate-800 dark:text-slate-200`}>{row.name}</div>
                    <div className="text-[10px] text-slate-400">{row.level}</div>
                  </div>
                </div>
                <span className={`text-xs ${row.rank === 1 ? 'font-extrabold text-slate-700 dark:text-slate-300' : 'font-bold text-slate-600 dark:text-slate-400'}`}>{row.xp}</span>
              </div>
            ))}
            
            <div className="text-center text-slate-400 text-xs py-0.5">• • •</div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 w-4 text-center">48</span>
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">DN</div>
                <div>
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-200">{user.name} (You)</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Lvl {user.levelNumber}</div>
                </div>
              </div>
              <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">{user.xp.toLocaleString()} XP</span>
            </div>

            {[
              { rank: 49, initials: 'DK', name: 'David K.', xp: '2,420 XP' },
              { rank: 50, initials: 'ES', name: 'Emma S.', xp: '2,390 XP' },
            ].map((row) => (
              <div key={row.rank} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black w-4 text-center text-slate-400">{row.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">{row.initials}</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.name}</div>
                    <div className="text-[10px] text-slate-400">Lvl 12</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{row.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}