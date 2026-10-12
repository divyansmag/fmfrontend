import React, { useState } from 'react';
import { Search, ChevronDown, Star, Check, Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { studentsData } from '../data/studentsData';

import { useApp } from '../../context/AppContext.jsx';
import defaultStudentAvatar from '../assets/avatars/default_student.png';





export const StudentTable = ({ onSelectStudent }) => {
  const { courseData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Students');
  const [selectedModule, setSelectedModule] = useState('All Modules');
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.strengths.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.recentModules.some((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = activeFilter === 'All Students' || student.status === activeFilter;

    const matchesModule =
    selectedModule === 'All Modules' ||
    student.recentModules.some((m) => m.title === selectedModule);

    return matchesSearch && matchesStatus && matchesModule;
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Excellent':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <Star className="w-3 h-3 fill-emerald-500 stroke-emerald-500" />
            <span>Excellent</span>
          </span>);

      case 'On Track':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>On Track</span>
          </span>);

      case 'Needs Support':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border border-pink-300 dark:border-pink-800">
            <Clock className="w-3 h-3 stroke-[2]" />
            <span>Needs Support</span>
          </span>);

      case 'Needs Attention':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-2xs">
            <AlertTriangle className="w-3 h-3 stroke-[2]" />
            <span>Needs Attention</span>
          </span>);

    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-md dark:shadow-none shadow-purple-900/5 mt-6 transition-colors overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-5 border-b border-gray-200/70 dark:border-slate-700/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-gray-800 dark:text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#15ab5d]/40 transition-all placeholder:text-gray-400" />
          
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {[
          { label: 'All Students', activeClass: 'bg-[#15ab5d] text-white' },
          { label: 'Excellent', activeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200' },
          { label: 'On Track', activeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200' },
          { label: 'Needs Support', activeClass: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200' },
          { label: 'Needs Attention', activeClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200' }].
          map((chip) => {
            const isActive = activeFilter === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => setActiveFilter(chip.label)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                isActive ?
                `${chip.activeClass} border-transparent` :
                'bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700/80 hover:bg-gray-100 dark:hover:bg-[#252530]'}`
                }>
                
                {chip.label}
              </button>);

          })}

          {/* Module Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700/80 flex items-center space-x-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202028] transition-colors">
              
              <span>{selectedModule === 'All Modules' ? 'Module' : selectedModule}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isModuleDropdownOpen &&
            <div className="absolute right-0 mt-2 w-64 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700/80 py-1.5 z-30">
                <button
                onClick={() => {
                  setSelectedModule('All Modules');
                  setIsModuleDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800/60 cursor-pointer">
                
                  All Modules
                </button>
                {courseData.chapters.filter(ch => ch.grade === '6').map((chapter) =>
              <div key={chapter.id} className="border-t border-gray-100 dark:border-slate-700/80 pt-1">
                    <span className="block px-4 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                      {chapter.title}
                    </span>
                    {chapter.units.flatMap(unit => unit.subtopics || []).map((sub) =>
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedModule(sub.title);
                    setIsModuleDropdownOpen(false);
                  }}
                  className="w-full text-left px-5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800/60 cursor-pointer">
                  
                        {sub.title}
                      </button>
                )}
                  </div>
              )}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-900/50/50 text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] tracking-wider uppercase">
              <th className="py-3.5 px-6">STUDENT</th>
              <th className="py-3.5 px-6">OVERALL PROGRESS</th>
              <th className="py-3.5 px-6">MODULES</th>
              <th className="py-3.5 px-6">AVG QUIZ</th>
              <th className="py-3.5 px-6">LAST ACTIVE</th>
              <th className="py-3.5 px-6">STATUS</th>
              <th className="py-3.5 px-6 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#27272f] text-xs sm:text-sm">
            {filteredStudents.map((student) =>
            <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                {/* Student Avatar + Name */}
                <td className="py-4 px-6 font-semibold text-gray-900 dark:text-[#f5f5f5]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <img
                      src={student.avatarUrl || defaultStudentAvatar}
                      alt={student.name}
                      className="w-full h-full object-cover" />
                    
                    </div>
                    <span className={student.nameColor || 'text-gray-900 dark:text-[#f5f5f5]'}>
                      {student.name}
                    </span>
                  </div>
                </td>

                {/* Overall Progress with Bar */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3 max-w-[160px]">
                    <span className="font-bold text-gray-900 dark:text-[#f5f5f5] text-xs w-8">
                      {student.overallProgress}%
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                      className={`h-full ${student.progressColor} rounded-full transition-all duration-300`}
                      style={{ width: `${student.overallProgress}%` }} />
                    
                    </div>
                  </div>
                </td>

                {/* Modules */}
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">
                  {student.modules}
                </td>

                {/* Avg Quiz */}
                <td className={`py-4 px-6 ${student.quizColor || 'text-gray-800 dark:text-gray-200 font-semibold'}`}>
                  {student.avgQuiz}
                </td>

                {/* Last Active */}
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                  {student.lastActive}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  {renderStatusBadge(student.status)}
                </td>

                {/* Action Button */}
                <td className="py-4 px-6 text-right">
                  <button
                  onClick={() => onSelectStudent(student)}
                  className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  student.status === 'Needs Attention' ?
                  'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' :
                  'border-[#15ab5d] text-[#15ab5d] hover:bg-[#15ab5d] hover:text-white'}`
                  }>
                  
                    View
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 px-6 border-t border-gray-200/70 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div>
          Showing {filteredStudents.length} of 42 students
        </div>

        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer">
            
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer ${
            currentPage === 1 ?
            'bg-[#15ab5d] text-white' :
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`
            }>
            
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer ${
            currentPage === 2 ?
            'bg-[#15ab5d] text-white' :
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`
            }>
            
            2
          </button>

          <span className="px-1 text-gray-400">...</span>

          <button
            onClick={() => setCurrentPage(9)}
            className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer ${
            currentPage === 9 ?
            'bg-[#15ab5d] text-white' :
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`
            }>
            
            9
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(9, p + 1))}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>);

};