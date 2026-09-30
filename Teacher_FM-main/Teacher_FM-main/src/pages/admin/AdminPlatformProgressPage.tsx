import React, { useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminPlatformKpiCards } from '../../components/admin/AdminPlatformKpiCards';
import { PlatformPerformanceCard } from '../../components/admin/PlatformPerformanceCard';
import { LearningOverviewCard } from '../../components/admin/LearningOverviewCard';
import { LearningActivityChart } from '../../components/admin/LearningActivityChart';
import { AdminQuickActionsCard } from '../../components/admin/AdminQuickActionsCard';
import { SystemStatusCard } from '../../components/admin/SystemStatusCard';
import { Footer } from '../../components/Footer';

import { adminPortalData } from '../../data/adminData';
import { Calendar, ChevronDown } from 'lucide-react';

export const AdminPlatformProgressPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('August 24, 2026');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-amber-100 dark:selection:bg-amber-900/40 transition-colors">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader />

        {/* Page Main Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Header Row: Title & Date/Period Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Platform Progress
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 max-w-3xl">
                Detailed insights into platform performance, learning activity, and areas requiring attention.
              </p>
            </div>

            {/* Right Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDateOpen(!isDateOpen);
                    setIsPeriodOpen(false);
                  }}
                  className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-[#27272f] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2.5 cursor-pointer shadow-2xs hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-gray-400 stroke-[2]" />
                  <span>{selectedDate}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 stroke-[2]" />
                </button>

                {isDateOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#18181b] rounded-xl shadow-lg border border-gray-100 dark:border-[#27272f] py-1.5 z-30">
                    {['August 24, 2026', 'August 17, 2026', 'August 10, 2026'].map((date) => (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setIsDateOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-800/60 cursor-pointer"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Period Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsPeriodOpen(!isPeriodOpen);
                    setIsDateOpen(false);
                  }}
                  className="bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-[#27272f] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 cursor-pointer shadow-2xs hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors"
                >
                  <span>{selectedPeriod}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 stroke-[2]" />
                </button>

                {isPeriodOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#18181b] rounded-xl shadow-lg border border-gray-100 dark:border-[#27272f] py-1.5 z-30">
                    {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setIsPeriodOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-800/60 cursor-pointer"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top 4 KPI Cards */}
          <AdminPlatformKpiCards items={adminPortalData.platformKpis} />

          {/* Middle Row 1: Platform Performance & Learning Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
            <PlatformPerformanceCard metrics={adminPortalData.platformPerformance} />
            <LearningOverviewCard stats={adminPortalData.learningOverviewStats} />
          </div>

          {/* Middle Row 2: Expanded Learning Activity (Full Width) */}
          <div className="mb-8">
            <LearningActivityChart data={adminPortalData.learningActivityChart} />
          </div>

          {/* Bottom Row 3: Reflowed Quick Actions & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
            <AdminQuickActionsCard />
            <SystemStatusCard statuses={adminPortalData.systemStatuses} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
