import React, { useState } from 'react';
import { ParentSidebar } from '../../components/parent/ParentSidebar';
import { ParentHeader } from '../../components/parent/ParentHeader';
import { ChildProfileSummaryCard } from '../../components/parent/ChildProfileSummaryCard';
import { ChildProgressKpiCards } from '../../components/parent/ChildProgressKpiCards';
import { LearningProgressCard } from '../../components/parent/LearningProgressCard';
import { NeedsAttentionCard } from '../../components/parent/NeedsAttentionCard';
import { ClassPerformanceCard } from '../../components/parent/ClassPerformanceCard';
import { RecentLearningActivityCard } from '../../components/parent/RecentLearningActivityCard';
import { Footer } from '../../components/Footer';

import { childProgressData } from '../../data/parentChildProgressData';
import { ChevronDown, Download } from 'lucide-react';
import studentAvatar from '../../assets/avatars/anaya_sharma.png';

export const ParentChildProgressPage = () => {
  const [selectedChild, setSelectedChild] = useState('Ananya Patel');
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false);

  const handleDownloadReport = () => {
    const reportContent = `
==================================================
FUTUREMINDS AI - PARENT PROGRESS REPORT
==================================================
Child Name: ${childProgressData.childName}
School & Grade: ${childProgressData.gradeSection} (${childProgressData.school})
Status: ${childProgressData.status}
Last Active: ${childProgressData.lastActive}

--------------------------------------------------
KEY PERFORMANCE INDICATORS
--------------------------------------------------
- Overall Progress: ${childProgressData.overallProgress}% (+${childProgressData.overallChange}% this month)
- Module Completion: ${childProgressData.modulesCompleted}/${childProgressData.totalModules} (${Math.round(childProgressData.modulesCompleted / childProgressData.totalModules * 100)}%)
- Average Quiz Score: ${childProgressData.avgQuizScore}% (+${childProgressData.quizScoreChange}% this month)
- Learning Streak: ${childProgressData.learningStreak} Days

--------------------------------------------------
SUBJECT BREAKDOWN
--------------------------------------------------
${childProgressData.subjects.map((s) => `- ${s.name}: ${s.progress}%`).join('\n')}

--------------------------------------------------
NEEDS ATTENTION
--------------------------------------------------
${childProgressData.needsAttention.map((n) => `- ${n.title} (${n.score}%): ${n.subtitle}`).join('\n')}

--------------------------------------------------
CLASS POSITION
--------------------------------------------------
Rank: #${childProgressData.childRank} (${childProgressData.rankAboveAvgPercent}% above class average of ${childProgressData.classAverage}%)

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ananya_Patel_Progress_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <ParentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Header */}
        <ParentHeader />

        {/* Page Main Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Header Row: Title & Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-4 mb-6">
            {/* Right Action Controls (Aligned Right) */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              {/* Child Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsChildSelectorOpen(!isChildSelectorOpen)}
                  className="bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2.5 cursor-pointer shadow-2xs hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors">
                  
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <img src={studentAvatar} alt={selectedChild} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase leading-none">Child: {selectedChild}</span>
                    <span className="block text-xs font-bold text-gray-900 dark:text-white">Grade 8 – Section A</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 stroke-[2]" />
                </button>

                {isChildSelectorOpen &&
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700/80 py-1.5 z-30">
                    {['Ananya Patel'].map((child) =>
                  <button
                    key={child}
                    onClick={() => {
                      setSelectedChild(child);
                      setIsChildSelectorOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/60 cursor-pointer">
                    
                        {child} (Grade 8 – Section A)
                      </button>
                  )}
                  </div>
                }
              </div>

              {/* Download Child Report */}
              <button
                onClick={handleDownloadReport}
                className="bg-white dark:bg-slate-800 border border-blue-500/80 text-[#0d52ce] dark:text-[#3b82f6] hover:bg-blue-50 dark:hover:bg-[#202028] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 cursor-pointer transition-colors shadow-2xs">
                
                <Download className="w-4 h-4 stroke-[2.2]" />
                <span>Download Child Report</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <ChildProgressKpiCards data={childProgressData} />

          {/* Child Profile Summary Card */}
          <div className="mb-8">
            <ChildProfileSummaryCard
              childName={childProgressData.childName}
              gradeSchool={`${childProgressData.gradeSection.split('–')[0].trim()} • ${childProgressData.school}`}
              status={childProgressData.status}
              lastActive={childProgressData.lastActive} />
            
          </div>

          {/* Two-Column Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-8">
            {/* Left Column: Learning Progress & Recent Activity */}
            <div className="space-y-6">
              <LearningProgressCard subjects={childProgressData.subjects} />
              <RecentLearningActivityCard activities={childProgressData.recentActivities} />
            </div>

            {/* Right Column: Needs Attention & Class Performance */}
            <div className="space-y-6">
              <NeedsAttentionCard items={childProgressData.needsAttention} />
              <ClassPerformanceCard
                childRank={childProgressData.childRank}
                classAverage={childProgressData.classAverage}
                rankAboveAvgPercent={childProgressData.rankAboveAvgPercent}
                topPerformers={childProgressData.topPerformers} />
              
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>);

};