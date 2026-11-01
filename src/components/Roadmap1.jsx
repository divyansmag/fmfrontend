import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Roadmap1() {
  const { navigateTo, navigateToAsset, showToast, chapters = [], getChapterProgress } = useApp();
  const [activeRealm, setActiveRealm] = useState('chapter_0');
  const [popupType, setPopupType] = useState('welcome');

  const baseKeys = ['forest', 'mountains', 'desert', 'castle', 'sky', 'treasure'];

  // Base realm configuration for dynamic card rendering
  const baseRealmsData = {
    forest: {
      realmName: 'Enchanted Forest',
      stars: 3,
      description: 'Explore the core fundamentals of AI and discover its amazing applications in daily life.',
      imgUrl: '/dist/assets/forest.jpg',
      subtopics: ['What is AI?', 'Machine Learning', 'Neural Nets', 'Everyday AI'],
    },
    mountains: {
      realmName: 'Crystal Mountains',
      stars: 0,
      description: 'Master the fundamentals of neural pathways and algorithms while navigating the frosty cliffs of cognitive bias.',
      imgUrl: '/dist/assets/mountain.jpg',
      subtopics: ['Deep Learning', 'Data Bias', 'Algorithm Design', 'Optimization'],
    },
    desert: {
      realmName: 'Golden Desert',
      stars: 0,
      description: 'Traverse through historical paradigms. Learn how Expert Systems and the Turing Test shaped the early days of AI.',
      imgUrl: '/dist/assets/desert.jpg',
      subtopics: ['History of AI', 'Turing Test', 'Expert Systems', 'AI Winter'],
    },
    castle: {
      realmName: 'Royal Castle',
      stars: 0,
      description: 'Delve deep into cognitive storage networks. Master the mechanics behind Large Language Models and Attention Mechanisms.',
      imgUrl: '/dist/assets/castle.jpg',
      subtopics: ['Transformers', 'LLMs', 'Attention Mechanism', 'Vector DBs'],
    },
    sky: {
      realmName: 'Floating Sky Islands',
      stars: 0,
      description: 'Elevate your skills by understanding Generative AI, Computer Vision, and the incredible world of Robotics.',
      imgUrl: '/dist/assets/islands.jpg',
      subtopics: ['Generative AI', 'Computer Vision', 'NLP', 'Robotics'],
    },
    treasure: {
      realmName: 'Treasure Chest',
      stars: 0,
      description: 'You have reached the final destination! Complete your final project to achieve mastery and earn your certification.',
      imgUrl: '/dist/assets/chest_transparent.png',
      subtopics: ['Final Project', 'Certification', 'Next Steps', 'Mastery'],
    },
  };

  const realmThemes = {
    forest: { badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700', text: 'text-emerald-600', bar: 'bg-emerald-500 shadow-emerald-500/50', circleActive: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]', circleInactive: 'border-emerald-500', overlay: 'bg-emerald-600/30', mapBtnBg: 'hover:bg-emerald-50', mapBtnText: 'text-emerald-600 group-hover:text-emerald-700' },
    mountains: { badge: 'bg-cyan-100 text-cyan-700', btn: 'bg-cyan-600 hover:bg-cyan-700', text: 'text-cyan-600', bar: 'bg-cyan-500 shadow-cyan-500/50', circleActive: 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]', circleInactive: 'border-cyan-500', overlay: 'bg-cyan-600/30', mapBtnBg: 'hover:bg-cyan-50', mapBtnText: 'text-cyan-600 group-hover:text-cyan-700' },
    desert: { badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700', text: 'text-amber-600', bar: 'bg-amber-500 shadow-amber-500/50', circleActive: 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]', circleInactive: 'border-amber-500', overlay: 'bg-amber-600/30', mapBtnBg: 'hover:bg-amber-50', mapBtnText: 'text-amber-600 group-hover:text-amber-700' },
    castle: { badge: 'bg-rose-100 text-rose-700', btn: 'bg-rose-600 hover:bg-rose-700', text: 'text-rose-600', bar: 'bg-rose-500 shadow-rose-500/50', circleActive: 'border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.6)]', circleInactive: 'border-rose-500', overlay: 'bg-rose-600/30', mapBtnBg: 'hover:bg-rose-50', mapBtnText: 'text-rose-600 group-hover:text-rose-700' },
    sky: { badge: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-600', bar: 'bg-blue-500 shadow-blue-500/50', circleActive: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]', circleInactive: 'border-blue-500', overlay: 'bg-blue-600/30', mapBtnBg: 'hover:bg-blue-50', mapBtnText: 'text-blue-600 group-hover:text-blue-700' },
    treasure: { badge: 'bg-yellow-100 text-yellow-700', btn: 'bg-yellow-500 hover:bg-yellow-600', text: 'text-yellow-600', bar: 'bg-yellow-400 shadow-yellow-400/50', circleActive: 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]', circleInactive: 'border-yellow-400', overlay: 'bg-yellow-500/30', mapBtnBg: 'hover:bg-yellow-50', mapBtnText: 'text-yellow-600 group-hover:text-yellow-700' },
    default: { badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700', text: 'text-emerald-600', bar: 'bg-emerald-500 shadow-emerald-500/50', circleActive: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]', circleInactive: 'border-emerald-500', overlay: 'bg-emerald-600/30', mapBtnBg: 'hover:bg-emerald-50', mapBtnText: 'text-emerald-600 group-hover:text-emerald-700' }
  };

  const dynamicKeys = [];
  const realmsData = {};

  chapters.forEach((chapter, index) => {
    const styleKey = baseKeys[index % baseKeys.length];
    const uniqueKey = `chapter_${index}`;
    dynamicKeys.push(uniqueKey);

    const base = baseRealmsData[styleKey];
    const progress = getChapterProgress(chapter);
    const isLocked = chapter.status === 'locked';
    const isCompleted = chapter.status === 'completed';
    const theme = realmThemes[styleKey] || realmThemes.default;

    // Extract actual unit titles to show as tags on the land card
    let actualSubtopics = base.subtopics;
    if (chapter.units && chapter.units.length > 0) {
      actualSubtopics = chapter.units.map(u => u.title);
      if (actualSubtopics.length > 3) {
        const remaining = actualSubtopics.length - 3;
        actualSubtopics = actualSubtopics.slice(0, 3);
        actualSubtopics.push(`+${remaining} more`);
      }
    }

    realmsData[uniqueKey] = {
      ...base,
      title: chapter.title,
      subtopics: actualSubtopics,
      realmName: Math.floor(index / baseKeys.length) > 0 ? `${base.realmName} ${Math.floor(index / baseKeys.length) + 1}` : base.realmName,
      status: isCompleted ? 'Completed Realm' : isLocked ? 'Locked Realm' : 'Active Realm',
      badgeClass: isCompleted ? 'bg-emerald-100 text-emerald-700' : isLocked ? 'bg-slate-100 text-slate-600' : theme.badge,
      icon: isCompleted ? 'check_circle' : isLocked ? 'lock' : 'play_arrow',
      progress: `${progress.pct}%`,
      isLocked: isLocked,
      styleKey,
      chapter,
    };
  });

  const treasureKey = 'treasure';
  dynamicKeys.push(treasureKey);
  realmsData[treasureKey] = {
    ...baseRealmsData.treasure,
    title: 'Final Mastery',
    status: 'Locked Realm',
    badgeClass: 'bg-slate-100 text-slate-600',
    icon: 'lock',
    progress: '0%',
    isLocked: true,
    styleKey: 'treasure',
  };

  useEffect(() => {
    if (!dynamicKeys.includes(activeRealm) && dynamicKeys.length > 0) {
      setActiveRealm(dynamicKeys[0]);
    }
  }, [chapters, activeRealm, dynamicKeys]);

  const currentRealm = realmsData[activeRealm] || realmsData[dynamicKeys[0]] || {};
  const activeTheme = realmThemes[currentRealm.styleKey] || realmThemes.default;

  const getHeroBgClass = () => {
    const key = currentRealm.styleKey;
    if (key === 'forest') return "bg-[url('/dist/assets/forest.jpg')]";
    if (key === 'mountains') return "bg-[url('/dist/assets/mountain.jpg')]";
    if (key === 'desert') return "bg-[url('/dist/assets/desert.jpg')]";
    if (key === 'castle') return "bg-[url('/dist/assets/castle.jpg')]";
    if (key === 'sky') return "bg-[url('/dist/assets/islands.jpg')]";
    return "bg-[url('https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=1600&auto=format&fit=crop&q=80')]";
  };

  return (
    <main
      id="view-roadmap-1"
      className="view-container relative w-full overflow-hidden bg-surface-container-lowest group"
      style={{ height: 'calc(100vh - 5rem)' }}
    >
      {/* Map button and arrow moved into the shared container below */}

      {/* Welcome Popup Overlay */}
      {popupType !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">

          <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-2xl max-w-3xl w-full mx-4 md:mx-auto flex flex-col transform scale-100 transition-all duration-500">

            {/* Map Area */}
            <div className={`w-full relative flex-shrink-0 bg-slate-900 ${popupType === 'map' ? 'rounded-[1.5rem]' : ''}`}>
              <img
                src="/dist/assets/map.jpg"
                alt="Map of the Realms"
                className={`w-full drop-shadow-2xl transition-transform duration-700 ${popupType === 'map' ? 'h-auto max-h-[85vh] object-contain' : 'aspect-[4/3] md:aspect-video object-cover hover:scale-[1.02]'}`}
              />
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                  <span className={`material-symbols-outlined ${activeTheme.text} text-xs`}>explore</span>
                  World Map
                </p>
              </div>
              {popupType === 'map' && (
                <button
                  onClick={() => setPopupType(null)}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md p-2 rounded-full shadow-lg transition-colors border border-white/20"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Content & Action Area (Only show on 'welcome') */}
            {popupType === 'welcome' && (
              <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between bg-white shrink-0 gap-3 md:gap-4 border-t border-slate-100">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1 tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Welcome to your Journey!
                  </h2>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                    Embark on an epic adventure through these mystical realms. Conquer all the lands, master the challenges, and reach the final treasure chest!
                  </p>
                </div>

                <button
                  onClick={() => setPopupType(null)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_8px_16px_-6px_rgba(147,51,234,0.5)] hover:shadow-[0_12px_20px_-6px_rgba(147,51,234,0.6)] hover:-translate-y-1 flex items-center justify-center gap-1.5 group whitespace-nowrap shrink-0 text-sm w-full md:w-auto"
                >
                  Let's Go!
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">rocket_launch</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Background Hero Image & Gradients (Dynamic based on active realm) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat rm1-hero-zoom origin-center scale-105 transition-all duration-700 ${getHeroBgClass()}`}
        />
        <div className="absolute inset-0 bg-slate-900/30" />
      </div>

      {/* Shared Container for Active Realm Card & Map Button */}
      <div className="absolute bottom-48 left-1/2 -translate-x-1/2 flex justify-between items-start max-w-3xl lg:max-w-4xl xl:max-w-5xl w-full pointer-events-none px-6 md:px-0 transition-all duration-500">

        {/* Active Realm Card */}
        <div className="relative z-20 flex flex-col items-start max-w-sm md:max-w-md w-full pointer-events-auto">
          <div className="bg-white p-5 md:p-6 rounded-3xl w-full transform transition-transform group-hover:translate-x-1 duration-500 border border-outline-variant/30 shadow-2xl animate-fade-in min-h-[400px] flex flex-col justify-between">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`${currentRealm.badgeClass} font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1`}>
                  {currentRealm.icon && <span className="material-symbols-outlined text-xs">{currentRealm.icon}</span>}
                  {currentRealm.status}
                </span>
              </div>

              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-1.5 drop-shadow-sm tracking-tight capitalize"
                style={{ fontFamily: 'Sora, sans-serif', lineHeight: 1.15 }}
              >
                {currentRealm.realmName || activeRealm}
              </h2>

              <p className="text-sm md:text-base text-slate-800 font-bold mb-1.5 leading-tight pr-4">
                {currentRealm.title}
              </p>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                {currentRealm.description}
              </p>

              {currentRealm.subtopics && currentRealm.subtopics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentRealm.subtopics.map((topic, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200 shadow-sm`}>
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {currentRealm.isLocked ? (
                  <button
                    type="button"
                    onClick={() => showToast(currentRealm.title, 'Complete previous realms to unlock!', 'info')}
                    className="bg-slate-200 text-slate-600 font-semibold text-sm px-5 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 flex-1"
                  >
                    <span className="material-symbols-outlined text-lg">lock</span>
                    Locked Realm
                  </button>
                ) : currentRealm.status === 'Completed Realm' ? (
                  <button
                    type="button"
                    onClick={() => showToast(currentRealm.title, 'Reviewing completed realm lessons...', 'success')}
                    className="bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all duration-300 shadow-md flex items-center justify-center gap-2 group/btn cursor-pointer flex-1"
                  >
                    <span className="material-symbols-outlined text-lg group-hover/btn:scale-110 transition-transform">visibility</span>
                    Review Realm
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentRealm.chapter && currentRealm.chapter.units && currentRealm.chapter.units[0]) {
                        const firstUnit = currentRealm.chapter.units[0];
                        if (firstUnit.subtopics && firstUnit.subtopics[0] && firstUnit.subtopics[0].assets && firstUnit.subtopics[0].assets[0]) {
                          navigateToAsset(currentRealm.chapter.id, firstUnit.id, firstUnit.subtopics[0].id, firstUnit.subtopics[0].assets[0].id);
                        } else {
                          navigateTo('video');
                        }
                      } else {
                        navigateTo('video');
                      }
                    }}
                    className={`${activeTheme.btn} text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 group/btn cursor-pointer flex-1`}
                  >
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">play_arrow</span>
                    Continue Adventure
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigateTo('roadmap-2')}
                  className="bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-1"
                >
                  <span className="material-symbols-outlined text-lg">map</span>
                  View Path
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Realm Progress</span>
                  <span className={`text-xs font-bold ${activeTheme.text}`}>{currentRealm.progress}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`${activeTheme.bar} h-full rounded-full transition-all duration-500`} style={{ width: currentRealm.progress, boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Map Button (Aligned perfectly with top of card) */}
        <div className={`relative pointer-events-auto mt-[5px] ${popupType === 'welcome' ? 'z-[60]' : 'z-40'}`}>
          <button
            onClick={() => setPopupType('map')}
            className={`bg-white shadow-xl border border-slate-100 text-slate-800 p-3.5 rounded-2xl hover:scale-105 ${activeTheme.mapBtnBg} transition-all flex items-center justify-center group`}
            title="View World Map"
          >
            <span className={`material-symbols-outlined text-2xl ${activeTheme.mapBtnText}`}>map</span>
          </button>

          {/* Arrow pointing to the map button */}
          {popupType === 'welcome' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex flex-col items-center gap-1 text-white drop-shadow-xl z-[60] pointer-events-none transition-all">
              <div className="animate-pulse">
                <span className={`material-symbols-outlined text-3xl md:text-4xl ${activeTheme.text}`}>arrow_upward</span>
              </div>
              <span className="text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 whitespace-nowrap translate-x-6">Access map here!</span>
            </div>
          )}
        </div>

      </div>
      {/* Bottom World Map Navigation Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex max-w-3xl lg:max-w-4xl xl:max-w-5xl w-full px-6 md:px-0">
        <div className="bg-white rounded-2xl overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent flex items-center border border-slate-200 shadow-2xl w-full relative">

          <div className="text-xs font-bold text-slate-700 whitespace-nowrap uppercase tracking-widest px-6 hidden md:flex items-center sticky left-0 z-30 bg-white/95 backdrop-blur-md self-stretch border-r border-slate-100 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.05)]">
            World Map
          </div>

          <div className="flex items-center min-w-max py-3 px-4 pl-6">
            {dynamicKeys.map((key, i) => {
              const realm = realmsData[key];
              const isActive = activeRealm === key;
              const isLocked = realm.isLocked;
              const isCompleted = realm.status === 'Completed Realm';
              const styleKey = realm.styleKey;

              return (
                <div key={key} className="flex items-center">
                  <div
                    className={`group/node flex flex-col items-center gap-1 ${styleKey === 'treasure' ? 'cursor-default' : 'cursor-pointer'} transition-all duration-300 inline-flex ${isActive ? 'w-24 md:w-32 relative z-10' : 'w-20 md:w-28 opacity-80 hover:opacity-100'
                      }`}
                    onClick={() => {
                      if (styleKey === 'treasure') return;
                      setActiveRealm(key);
                      if (isLocked) {
                        showToast(realm.title, 'Unlock previous realms first!', 'info');
                      }
                    }}
                  >
                    {styleKey === 'treasure' ? (
                      <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0 transition-transform hover:scale-110 group-hover/node:scale-110 drop-shadow-xl z-20">
                        <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url('/dist/assets/chest_transparent.png')` }} />
                      </div>
                    ) : (
                      <div className={`rounded-full border-3 ${isLocked ? 'bg-slate-50' : 'bg-white'} p-1 relative overflow-hidden flex-shrink-0 transition-transform ${isActive
                        ? (isLocked ? 'w-14 h-14 md:w-18 md:h-18 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.5)] scale-110' : `w-14 h-14 md:w-18 md:h-18 ${realmThemes[styleKey]?.circleActive || realmThemes.default.circleActive} scale-110`)
                        : (isLocked ? 'w-12 h-12 md:w-15 md:h-15 border-slate-300 group-hover/node:scale-105 shadow-sm' : `w-12 h-12 md:w-15 md:h-15 ${realmThemes[styleKey]?.circleInactive || realmThemes.default.circleInactive} group-hover/node:scale-105 shadow-sm`)
                        }`}>
                        <div className={`w-full h-full rounded-full bg-cover bg-center ${isLocked ? 'opacity-60' : ''}`} style={{ backgroundImage: `url('${realm.imgUrl}?w=400&auto=format&fit=crop&q=80')` }} />

                        {isCompleted ? (
                          <div className={`absolute inset-0 ${realmThemes[styleKey]?.overlay || realmThemes.default.overlay} flex items-center justify-center rounded-full`}>
                            <span className="material-symbols-outlined text-white drop-shadow-md text-base">check_circle</span>
                          </div>
                        ) : isLocked ? (
                          <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center rounded-full">
                            <span className="material-symbols-outlined text-white text-sm">lock</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                    <span className={`text-xs text-center leading-tight truncate w-full ${isActive ? (isLocked ? 'font-bold text-slate-900 mt-0.5' : `font-bold mt-0.5 ${realmThemes[styleKey]?.text || realmThemes.default.text}`) : 'font-semibold text-slate-800'}`}>
                      {realm.realmName || realm.title}
                    </span>
                  </div>

                  {i < dynamicKeys.length - 1 && (
                    <div className={`w-6 md:w-10 border-t-2 border-dashed flex-shrink-0 mb-5 ml-1 mr-1 ${isCompleted || (!isLocked && activeRealm !== key) ? 'border-slate-400 opacity-70' : 'border-slate-300 opacity-70'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}