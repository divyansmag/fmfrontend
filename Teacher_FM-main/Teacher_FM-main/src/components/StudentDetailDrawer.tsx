import React, { useEffect } from 'react';
import { X, ThumbsUp, XCircle, Flag, Star, Check, Clock, AlertTriangle } from 'lucide-react';
import type { StudentDetail } from '../data/studentsData';
import defaultStudentAvatar from '../assets/avatars/default_student.png';

interface StudentDetailDrawerProps {
  student: StudentDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const renderStatusBadge = () => {
    switch (student.status) {
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100/80 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
            <Flag className="w-3 h-3 fill-red-600 stroke-red-600" />
            <span>Needs Attention</span>
          </span>
        );
      case 'Excellent':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <Star className="w-3 h-3 fill-emerald-600 stroke-emerald-600" />
            <span>Excellent</span>
          </span>
        );
      case 'On Track':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>On Track</span>
          </span>
        );
      case 'Needs Support':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100/80 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
            <Clock className="w-3 h-3 stroke-[2]" />
            <span>Needs Support</span>
          </span>
        );
    }
  };

  const getOverallColor = () => {
    if (student.status === 'Needs Attention') return 'text-[#b91c1c] dark:text-red-400';
    if (student.status === 'Needs Support') return 'text-pink-600 dark:text-pink-400';
    if (student.status === 'On Track') return 'text-[#2563eb] dark:text-blue-400';
    return 'text-[#15ab5d] dark:text-emerald-400';
  };

  return (
    <div className="relative z-50">
      {/* Background Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-[1px] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Slide-over Right Panel */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[450px] bg-[#faf8fc] dark:bg-[#1a1a21] border-l border-gray-200 dark:border-[#27272f] shadow-2xl z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 transform translate-x-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-detail-title"
      >
        {/* Scrollable Content Container */}
        <div className="p-6 flex-1 space-y-6">
          {/* Drawer Top Header with Close X Button */}
          <div className="flex justify-between items-start">
            <div />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Student Profile Identity Section */}
          <div className="flex flex-col items-center text-center -mt-4">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-100 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800 flex items-center justify-center">
                <img
                  src={student.avatarUrl || defaultStudentAvatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {student.status === 'Needs Attention' && (
                <div className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full border-2 border-white dark:border-[#1a1a21] shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <h2 id="student-detail-title" className="text-xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
              {student.name}
            </h2>
            <p className="text-xs text-gray-400 dark:text-[#a1a1aa] font-medium mt-0.5 mb-2.5">
              {student.grade}
            </p>

            <div>{renderStatusBadge()}</div>
          </div>

          {/* 2-Column Summary Cards Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Overall */}
            <div className="bg-white dark:bg-[#0d0d12] rounded-2xl p-4 border border-purple-50/80 dark:border-[#27272f] shadow-2xs">
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 block mb-1">
                Overall
              </span>
              <span className={`text-2xl font-extrabold tracking-tight ${getOverallColor()}`}>
                {student.overallProgress}%
              </span>
            </div>

            {/* Modules */}
            <div className="bg-white dark:bg-[#0d0d12] rounded-2xl p-4 border border-purple-50/80 dark:border-[#27272f] shadow-2xs">
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 block mb-1">
                Modules
              </span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
                {student.modules.split('/')[0]}
                <span className="text-xs text-gray-400 font-normal">/{student.modules.split('/')[1]}</span>
              </div>
            </div>

            {/* Avg Quiz */}
            <div className="bg-white dark:bg-[#0d0d12] rounded-2xl p-4 border border-purple-50/80 dark:border-[#27272f] shadow-2xs">
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 block mb-1">
                Avg Quiz
              </span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
                {student.avgQuiz}
              </span>
            </div>

            {/* Streak */}
            <div className="bg-white dark:bg-[#0d0d12] rounded-2xl p-4 border border-purple-50/80 dark:border-[#27272f] shadow-2xs">
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 block mb-1">
                Streak
              </span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
                {student.streak}
              </span>
            </div>
          </div>

          {/* Progress Over Time Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
                Progress Over Time
              </h3>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                Last 30 days
              </span>
            </div>

            {/* Custom Bar & Trend Chart Box matching reference */}
            <div className="bg-white dark:bg-[#0d0d12] rounded-2xl p-4 border border-purple-50/80 dark:border-[#27272f] shadow-2xs relative">
              {/* Drop Tag Badge if performance dropped */}
              {student.progressHistory.some((h) => h.isDrop) && (
                <div className="absolute top-8 right-16 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800">
                  Drop
                </div>
              )}

              {/* Weekly Vertical Progress Bars Visualizer */}
              <div className="h-28 flex items-end justify-between space-x-2 pt-6 pb-2 px-1">
                {student.progressHistory.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        pt.isDrop
                          ? 'bg-red-200 dark:bg-red-900/50'
                          : 'bg-emerald-100 dark:bg-emerald-950/50'
                      }`}
                      style={{ height: `${pt.value}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths Card */}
          <div className="bg-[#eaf8f1] dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-4 text-left">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm mb-1.5">
              <ThumbsUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
              <span>Strengths</span>
            </div>
            <p className="text-xs text-emerald-900/80 dark:text-emerald-200/90 leading-relaxed font-medium">
              {student.strengths}
            </p>
          </div>

          {/* Areas to Improve Card */}
          <div className="bg-[#fef1f0] dark:bg-red-950/30 border border-red-200/80 dark:border-red-800/40 rounded-2xl p-4 text-left">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-300 font-bold text-xs sm:text-sm mb-1.5">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 stroke-[2.2]" />
              <span>Areas to Improve</span>
            </div>
            <p className="text-xs text-red-900/80 dark:text-red-200/90 leading-relaxed font-medium">
              {student.areasToImprove}
            </p>
          </div>

          {/* Recent Modules List */}
          {student.recentModules && student.recentModules.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
                Recent Modules
              </h3>
              <div className="space-y-2">
                {student.recentModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white dark:bg-[#0d0d12] border border-gray-200/80 dark:border-[#27272f] rounded-xl p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {mod.date} • {mod.status}
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#15ab5d]">
                      {mod.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 px-6 border-t border-gray-200/80 dark:border-[#27272f] bg-white/90 dark:bg-[#1a1a21]/90 backdrop-blur-md flex items-center space-x-3">
          <button
            onClick={() => alert(`Messaging ${student.name}...`)}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-[#0d0d12] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-gray-200/60 dark:border-[#27272f]"
          >
            Message
          </button>

          <button
            onClick={() => alert(`Creating lesson plan for ${student.name}...`)}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#b91c1c] hover:bg-[#991b1b] text-white shadow-xs transition-colors cursor-pointer"
          >
            Create Plan
          </button>
        </div>
      </aside>
    </div>
  );
};
