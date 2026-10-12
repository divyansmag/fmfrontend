import React from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { PlatformSummaryCard } from '../../components/admin/PlatformSummaryCard';
import { AdminKpiCard } from '../../components/admin/AdminKpiCard';
import { PlatformActivityChart } from '../../components/admin/PlatformActivityChart';

import { adminPortalData } from '../../data/adminData';
import { GraduationCap, User, Users, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Header */}
        <AdminHeader />

        {/* Dashboard Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Overview Selector Header */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6">
            {/* Right Controls: Date & Platform Overview Button */}
            <div className="flex items-center space-x-4">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hidden sm:inline-block">
                August 24, 2026
              </span>

              <button
                className="bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 shadow-2xs cursor-default">
                
                <span>Platform Overview</span>
              </button>
            </div>
          </div>

          {/* Platform Summary Card */}
          <div className="mb-6">
            <PlatformSummaryCard info={adminPortalData.info} />
          </div>

          {/* 4 KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Card 1: Total Students */}
            <AdminKpiCard
              icon={GraduationCap}
              iconBgColor="bg-amber-50 dark:bg-amber-950/60"
              iconColor="text-[#ff8a00] dark:text-[#f97316]"
              value={adminPortalData.kpis.totalStudents}
              growth={adminPortalData.kpis.studentsGrowth}
              label="TOTAL STUDENTS" />
            

            {/* Card 2: Total Teachers */}
            <AdminKpiCard
              icon={User}
              iconBgColor="bg-blue-50 dark:bg-blue-950/60"
              iconColor="text-blue-600 dark:text-blue-400"
              value={adminPortalData.kpis.totalTeachers}
              growth={adminPortalData.kpis.teachersGrowth}
              label="TOTAL TEACHERS" />
            

            {/* Card 3: Total Parents */}
            <AdminKpiCard
              icon={Users}
              iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
              iconColor="text-emerald-600 dark:text-emerald-400"
              value={adminPortalData.kpis.totalParents}
              growth={adminPortalData.kpis.parentsGrowth}
              label="TOTAL PARENTS" />
            

            {/* Card 4: Platform Activity */}
            <AdminKpiCard
              icon={TrendingUp}
              iconBgColor="bg-amber-50 dark:bg-amber-950/60"
              iconColor="text-[#ff8a00] dark:text-[#f97316]"
              value={`${adminPortalData.kpis.platformActivity}%`}
              growth={adminPortalData.kpis.activityGrowth}
              label="PLATFORM ACTIVITY" />
            
          </div>

          {/* Platform Activity Overview Chart */}
          <div className="mb-8">
            <PlatformActivityChart data={adminPortalData.activityChart} />
          </div>
        </main>
      </div>
    </div>);

};