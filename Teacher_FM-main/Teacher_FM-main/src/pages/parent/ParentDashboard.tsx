import React, { useState } from 'react';
import { ParentSidebar } from '../../components/parent/ParentSidebar';
import { ParentHeader } from '../../components/parent/ParentHeader';
import { ChildProfileSummaryCard } from '../../components/parent/ChildProfileSummaryCard';
import { ParentKpiCard } from '../../components/parent/ParentKpiCard';
import { ChildProgressChart } from '../../components/parent/ChildProgressChart';
import { AiInsightCard } from '../../components/parent/AiInsightCard';
import { TrendingUp, GraduationCap, Calendar, AlertTriangle, ChevronDown } from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState('Ananya Patel');
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-blue-100 dark:selection:bg-blue-900/40 transition-colors">
      {/* Left Sidebar */}
      <ParentSidebar />

      {/* Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Profile Header */}
        <ParentHeader />

        {/* Dashboard Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Greeting & Child Selector Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Good morning, Priya!
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                Here's an overview of your child's learning progress.
              </p>
            </div>

            {/* Child Selector */}
            <div className="relative">
              <button
                onClick={() => setIsChildSelectorOpen(!isChildSelectorOpen)}
                className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-[#27272f] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 cursor-pointer shadow-2xs hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors"
              >
                <span>Child: <strong className="font-bold text-gray-900 dark:text-white">{selectedChild}</strong></span>
                <ChevronDown className="w-4 h-4 text-gray-500 stroke-[2]" />
              </button>

              {isChildSelectorOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#18181b] rounded-xl shadow-lg border border-gray-100 dark:border-[#27272f] py-1.5 z-30">
                  {['Ananya Patel'].map((child) => (
                    <button
                      key={child}
                      onClick={() => {
                        setSelectedChild(child);
                        setIsChildSelectorOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/60 cursor-pointer"
                    >
                      {child} (Grade 8)
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Child Profile Summary Card */}
          <div className="mb-6">
            <ChildProfileSummaryCard childName={selectedChild} />
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Card 1: Overall Progress */}
            <ParentKpiCard
              icon={TrendingUp}
              iconBgColor="bg-blue-50 dark:bg-blue-950/60"
              iconColor="text-[#0d52ce] dark:text-[#3b82f6]"
              value="78%"
              subValue={
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">↑6%</span> month
                </>
              }
              label="Overall Progress"
            />

            {/* Card 2: Lessons Completed */}
            <ParentKpiCard
              icon={GraduationCap}
              iconBgColor="bg-blue-50 dark:bg-blue-950/60"
              iconColor="text-[#0d52ce] dark:text-[#3b82f6]"
              value={36}
              subValue={
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">85.7%</span> active week
                </>
              }
              label="Lessons Completed"
            />

            {/* Card 3: Attendance */}
            <ParentKpiCard
              icon={Calendar}
              iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
              iconColor="text-emerald-600 dark:text-emerald-400"
              value="92%"
              subValue={
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Excellent this month
                </span>
              }
              label="Attendance"
            />

            {/* Card 4: Areas to Improve */}
            <ParentKpiCard
              icon={AlertTriangle}
              iconBgColor="bg-amber-50 dark:bg-amber-950/60"
              iconColor="text-amber-600 dark:text-amber-500"
              value={2}
              subValue={
                <span className="text-amber-600 dark:text-amber-500 font-semibold hover:underline cursor-pointer">
                  View recommendations
                </span>
              }
              label="Areas to Improve"
            />
          </div>

          {/* Progress Chart & AI Insight Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-8">
            <div className="lg:col-span-2">
              <ChildProgressChart />
            </div>
            <div className="lg:col-span-1">
              <AiInsightCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
