import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ClassSelector } from '../components/ClassSelector';
import { KpiCard } from '../components/KpiCard';
import { ClassProgressChart } from '../components/ClassProgressChart';
import { AddAssignmentCard } from '../components/AddAssignmentCard';

import { Users, GraduationCap, TrendingUp, AlertTriangle, MonitorPlay, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from '../nav.jsx';

export const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Profile Header */}
        <DashboardHeader />

        {/* Dashboard Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Class Selector Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Classroom Mode Quick Launch Banner */}
            <div className="flex items-center gap-3.5 bg-white dark:bg-slate-800 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl px-4 py-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#e6f7ee] dark:bg-[#183928] text-[#15ab5d] flex items-center justify-center flex-shrink-0">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  Teaching in class today?
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Present student videos & assets on screen and mark them complete for the whole class.
                </div>
              </div>
              <div className="ml-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/teacher/teacher-content')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#15ab5d] border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Teacher Content & Tips</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/teacher/student-material')}
                  className="px-3.5 py-2 rounded-xl bg-[#15ab5d] hover:bg-[#129650] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Open Student Material</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Class Selector */}
            <ClassSelector />
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Students Enrolled */}
            <KpiCard
              icon={Users}
              iconBgColor="bg-[#dcfce7] dark:bg-[#12a35a]/20"
              iconColor="text-[#16b364] dark:text-[#16b364]"
              value={42}
              label="Students enrolled" />


            {/* Card 2: Active This Week */}
            <KpiCard
              icon={GraduationCap}
              iconBgColor="bg-[#dbeafe] dark:bg-[#162744]"
              iconColor="text-[#3b82f6] dark:text-[#60a5fa]"
              value={36}
              subLabel={
                <>
                  <span className="text-[#16b364] dark:text-[#16b364] font-semibold">85.7%</span> active this week
                </>
              } />


            {/* Card 3: Average Progress */}
            <KpiCard
              icon={TrendingUp}
              iconBgColor="bg-[#fce7f3] dark:bg-[#513143]"
              iconColor="text-[#ec4899] dark:text-[#f472b6]"
              value="78%"
              subLabel={
                <>
                  <span className="text-[#16b364] dark:text-[#16b364] font-semibold">↑6%</span> this month
                </>
              } />


            {/* Card 4: Require Follow-up */}
            <KpiCard
              icon={AlertTriangle}
              iconBgColor="bg-[#fee2e2] dark:bg-[#3f191b]"
              iconColor="text-[#ef4444] dark:text-[#f87171]"
              value={6}
              subLabel={
                <span className="text-[#ef4444] dark:text-[#f87171] font-semibold">
                  Require follow-up
                </span>
              } />

          </div>

          {/* Main Content Layout: Two-Column (Class Progress Overview & Add Assignment) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left: Class Progress Overview (spans 2 columns on desktop) */}
            <div className="lg:col-span-2">
              <ClassProgressChart />
            </div>

            {/* Right: Add Assignment Panel (spans 1 column on desktop) */}
            <div className="lg:col-span-1">
              <AddAssignmentCard />
            </div>
          </div>
        </main>
      </div>
    </div>);

};