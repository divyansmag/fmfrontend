import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ClassSelector } from '../components/ClassSelector';
import { ProgressKpiCard } from '../components/ProgressKpiCard';
import { StudentTable } from '../components/StudentTable';
import { StudentDetailDrawer } from '../components/StudentDetailDrawer';
import { Footer } from '../components/Footer';
import type { StudentDetail } from '../data/studentsData';

import { Users, TrendingUp, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

export const StudentProgressPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectStudent = (student: StudentDetail) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-purple-100 dark:selection:bg-purple-900/40 transition-colors relative">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Profile Header */}
        <DashboardHeader />

        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
                Student Progress
              </h1>
              <p className="text-sm text-gray-500 dark:text-[#a1a1aa] font-medium mt-1 max-w-2xl">
                Track individual student performance, learning progress, and areas that need attention.
              </p>
            </div>

            {/* Right Action Controls: Class Selector + Export Report Button */}
            <div className="flex flex-wrap items-center gap-3">
              <ClassSelector />

              <button
                onClick={() => alert('Exporting student progress report...')}
                className="bg-[#15ab5d] hover:bg-[#129953] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.2]" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Card 1: Total Students */}
            <ProgressKpiCard
              label="TOTAL STUDENTS"
              value={42}
              icon={Users}
              iconColor="text-gray-400 dark:text-gray-500"
            />

            {/* Card 2: Avg Progress */}
            <ProgressKpiCard
              label="AVG PROGRESS"
              value="78%"
              subValue="↑4%"
              icon={TrendingUp}
              iconColor="text-[#15ab5d]"
              valueColor="text-[#15ab5d]"
            />

            {/* Card 3: Avg Completion */}
            <ProgressKpiCard
              label="AVG COMPLETION"
              value="84%"
              icon={CheckCircle2}
              iconColor="text-blue-500 dark:text-blue-400"
              valueColor="text-[#2563eb] dark:text-[#3b82f6]"
            />

            {/* Card 4: Needs Attention */}
            <ProgressKpiCard
              label="NEEDS ATTENTION"
              value={6}
              icon={AlertTriangle}
              iconColor="text-red-500 dark:text-red-400"
              valueColor="text-[#dc2626] dark:text-[#ef4444]"
            />
          </div>

          {/* Student Table Section */}
          <StudentTable onSelectStudent={handleSelectStudent} />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Slide-Over Right Student Detail Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};
