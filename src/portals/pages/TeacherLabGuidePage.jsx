import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';
import {
  FlaskConical, Clock, GraduationCap, Target, Package, ListChecks,
  Lightbulb, HelpCircle, BookOpen, ChevronRight,
} from 'lucide-react';
import { LAB_GUIDES, GENERAL_INSTRUCTIONS } from '../data/labGuides';

const Card = ({ icon: Icon, title, accent = 'text-emerald-600', children }) => (
  <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
    <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-4">
      <Icon className={`w-4.5 h-4.5 ${accent}`} /> {title}
    </h3>
    {children}
  </section>
);

const Bullets = ({ items, dot = 'bg-emerald-500' }) => (
  <ul className="space-y-2">
    {items.map((t, i) => (
      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
        {t}
      </li>
    ))}
  </ul>
);

function LabDetail({ lab }) {
  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${lab.color} shadow-lg`}>
        <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-90">{lab.chapter}</span>
        <h2 className="text-2xl font-extrabold font-display mt-1">{lab.title}</h2>
        <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold">
          <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"><Clock className="w-3.5 h-3.5" />{lab.duration}</span>
          <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"><GraduationCap className="w-3.5 h-3.5" />{lab.grade}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{lab.difficulty}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card icon={Target} title="Learning Objectives"><Bullets items={lab.objectives} /></Card>
        <Card icon={Package} title="Materials Needed" accent="text-sky-600"><Bullets items={lab.materials} dot="bg-sky-500" /></Card>
      </div>

      <Card icon={ListChecks} title="Lab Content & Flow">
        <ol className="relative border-l-2 border-emerald-100 dark:border-emerald-900/50 ml-3 space-y-5">
          {lab.steps.map((s, i) => (
            <li key={i} className="pl-6 relative">
              <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <p className="font-bold text-slate-800 dark:text-white text-sm">{s.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{s.detail}</p>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card icon={Lightbulb} title="Teaching Tips" accent="text-amber-500"><Bullets items={lab.tips} dot="bg-amber-400" /></Card>
        <Card icon={HelpCircle} title="Discussion / Exit Questions" accent="text-violet-600"><Bullets items={lab.questions} dot="bg-violet-500" /></Card>
      </div>
    </div>
  );
}

function GeneralInstructions() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg">
        <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-80">Applies to every lab</span>
        <h2 className="text-2xl font-extrabold font-display mt-1">How to Conduct a Lab</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {GENERAL_INSTRUCTIONS.map((g) => (
          <Card key={g.title} icon={BookOpen} title={g.title}><Bullets items={g.points} /></Card>
        ))}
      </div>
    </div>
  );
}

export const TeacherLabGuidePage = () => {
  const [selected, setSelected] = useState('general');
  const lab = LAB_GUIDES.find((l) => l.id === selected);

  const itemCls = (active) =>
    `w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
      active
        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 shadow-sm'
        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 hover:-translate-y-0.5'
    }`;

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#16b364]">Teacher Portal • Lab Guide</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">Lab Guide</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Lab content, teaching tips and instructions for running each lab in class.
            </p>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
            <aside className="space-y-3 lg:sticky lg:top-24">
              <button id="lab-guide-general" onClick={() => setSelected('general')} className={itemCls(selected === 'general')}>
                <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">General Instructions</p>
                  <p className="text-xs text-slate-500">How to conduct any lab</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pt-2">Labs ({LAB_GUIDES.length})</p>
              {LAB_GUIDES.map((l) => (
                <button key={l.id} id={`lab-guide-${l.id}`} onClick={() => setSelected(l.id)} className={itemCls(selected === l.id)}>
                  <span className={`w-9 h-9 rounded-lg bg-gradient-to-br ${l.color} flex items-center justify-center flex-shrink-0`}>
                    <FlaskConical className="w-4.5 h-4.5 text-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{l.title}</p>
                    <p className="text-xs text-slate-500">{l.duration} · {l.difficulty}</p>
                  </div>
                </button>
              ))}
            </aside>

            <div>{lab ? <LabDetail lab={lab} /> : <GeneralInstructions />}</div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
