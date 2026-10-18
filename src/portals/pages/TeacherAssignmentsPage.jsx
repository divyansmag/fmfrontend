import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ClassSelector } from '../components/ClassSelector';
import { Footer } from '../components/Footer';
import {
  ClipboardList,
  UploadCloud,
  Plus,
  Calendar,
  Sparkles,
  FileText,
  FileCode,
  Archive,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  Search,
  Filter,
  Eye,
  FileCheck,
  Users,
} from 'lucide-react';

const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'Neural Networks Project',
    module: 'Unit 1 Capstone',
    xp: 100,
    dueDate: '2026-10-16',
    formattedDate: 'Fri 11:59 PM',
    dueStatus: 'Due Soon',
    dueUrgent: true,
    targetClass: 'Grade 8 - Section A',
    description: 'Build and train a 2-layer perceptron neural network model on synthetic datasets. Submit your Python script (.py) or Jupyter notebook (.ipynb) along with accuracy evaluation curves.',
    attachmentName: 'neural_networks_guide_and_data.zip',
    attachmentSize: '2.4 MB',
    submissionsCount: 28,
    totalStudents: 42,
    status: 'active',
  },
  {
    id: 'asg-2',
    title: 'Computer Vision Challenge',
    module: 'Module 02 • In 2 days',
    xp: 80,
    dueDate: '2026-10-21',
    formattedDate: 'Wednesday',
    dueStatus: 'Upcoming',
    dueUrgent: false,
    targetClass: 'Grade 8 - Section A',
    description: 'Implement Sobel and Laplacian edge detection filters and test on sample high-resolution images. Upload your code files and output comparisons in a ZIP or notebook.',
    attachmentName: 'cv_sample_images_spec.pdf',
    attachmentSize: '1.8 MB',
    submissionsCount: 14,
    totalStudents: 42,
    status: 'active',
  },
  {
    id: 'asg-3',
    title: 'Prompt Engineering Capstone',
    module: 'Unit 2 Capstone • Next Week',
    xp: 90,
    dueDate: '2026-10-26',
    formattedDate: 'Next Monday',
    dueStatus: 'Upcoming',
    dueUrgent: false,
    targetClass: 'Grade 8 - Section A',
    description: 'Design few-shot and chain-of-thought prompts to solve multi-step reasoning puzzles. Submit your prompt logs, outputs, and reflection report.',
    attachmentName: 'prompt_engineering_rubric.pdf',
    attachmentSize: '650 KB',
    submissionsCount: 4,
    totalStudents: 42,
    status: 'active',
  },
  {
    id: 'asg-4',
    title: 'NLP Sentiment Classifier',
    module: 'Module 03 • Advanced',
    xp: 120,
    dueDate: '2026-11-02',
    formattedDate: 'In 2 weeks',
    dueStatus: 'Upcoming',
    dueUrgent: false,
    targetClass: 'Grade 8 - Section A',
    description: 'Train a Naive Bayes or Transformer classifier to detect sentiment in student course reviews with >=85% accuracy.',
    attachmentName: 'sentiment_dataset_v1.csv',
    attachmentSize: '3.1 MB',
    submissionsCount: 0,
    totalStudents: 42,
    status: 'active',
  },
];

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function getFileIcon(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  if (['py', 'ipynb', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json'].includes(ext)) {
    return <FileCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  }
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) {
    return <Archive className="w-5 h-5 text-amber-500" />;
  }
  return <FileText className="w-5 h-5 text-blue-500" />;
}

export const TeacherAssignmentsPage = () => {
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('futureminds_teacher_assignments_v1');
      if (saved) return JSON.parse(saved);
      const studentSaved = localStorage.getItem('futureminds_assignments_v1');
      if (studentSaved) {
        const parsed = JSON.parse(studentSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((a, i) => ({
            ...a,
            formattedDate: a.dueDate || 'Soon',
            targetClass: 'Grade 8 - Section A',
            submissionsCount: i === 0 ? 28 : i === 1 ? 14 : 0,
            totalStudents: 42,
            attachmentName: a.attachmentName || `${a.title.toLowerCase().replace(/\s+/g, '_')}_guide.pdf`,
            attachmentSize: '1.5 MB',
          }));
        }
      }
      return INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  // Form states for creating & uploading assignment
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('Unit 1 Capstone');
  const [targetClass, setTargetClass] = useState('Grade 8 - Section A');
  const [dueDate, setDueDate] = useState('');
  const [xp, setXp] = useState('100');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('futureminds_teacher_assignments_v1', JSON.stringify(assignments));
      // Also update student assignments so student dashboard sees teacher uploads!
      localStorage.setItem('futureminds_assignments_v1', JSON.stringify(assignments));
    } catch {}
  }, [assignments]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit.');
      return;
    }
    setError(null);
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUseDemoTemplate = () => {
    setUploadedFile({
      name: `${(title || 'lesson_assignment').toLowerCase().replace(/\s+/g, '_')}_starter_pack.zip`,
      size: 1024 * 1024 * 1.8,
    });
    setError(null);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }
    if (!dueDate) {
      setError('Please select a due date for the students.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newAsg = {
        id: `asg-${Date.now()}`,
        title: title.trim(),
        module: module.trim() || 'Unit Assignment',
        xp: parseInt(xp, 10) || 100,
        dueDate: dueDate,
        formattedDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
        dueStatus: 'Due Soon',
        dueUrgent: true,
        targetClass,
        description: description.trim() || 'Complete the assignment task as per the instructions and submit your work before the deadline.',
        attachmentName: uploadedFile ? uploadedFile.name : 'assignment_instructions.pdf',
        attachmentSize: uploadedFile ? formatFileSize(uploadedFile.size) : '1.2 MB',
        submissionsCount: 0,
        totalStudents: 42,
        status: 'active',
      };

      setAssignments((prev) => [newAsg, ...prev]);
      setIsSubmitting(false);
      setSuccess(`Assignment "${title}" and attachment uploaded successfully!`);

      // Reset form
      setTitle('');
      setDueDate('');
      setDescription('');
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setSuccess(null), 4000);
    }, 600);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || item.targetClass === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Header */}
        <DashboardHeader />

        {/* Assignments Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Top Bar: Title & Class Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#16b364] dark:text-[#16b364]">
                  Teacher Portal • Task Management
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {assignments.length} Total Assignments
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
                Assignments & Task Upload
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Create new assignments, upload starter packs or question sheets, and track student submissions.
              </p>
            </div>
            <ClassSelector />
          </div>

          {/* Grid Layout: Create / Upload Form (Left) & Active Assignments List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Create & Upload Assignment Card (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-700/70">
                <div className="w-10 h-10 rounded-2xl bg-[#e6f7ee] dark:bg-[#183928] text-[#16b364] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Upload & Post Assignment
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Attach worksheets, datasets, or guides for students.
                  </p>
                </div>
              </div>

              {/* Status Alerts */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-[#16b364] dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Upload Form */}
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Assignment Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep Learning Project - Unit 2"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Module / Tag
                    </label>
                    <input
                      type="text"
                      value={module}
                      onChange={(e) => setModule(e.target.value)}
                      placeholder="e.g. Unit 2 Capstone"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      XP Reward
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="10"
                        max="500"
                        value={xp}
                        onChange={(e) => setXp(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364]"
                      />
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Due Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Assign to Class
                    </label>
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] cursor-pointer"
                    >
                      <option value="Grade 8 - Section A">Grade 8 - Section A</option>
                      <option value="Grade 8 - Section B">Grade 8 - Section B</option>
                      <option value="Grade 7 - Section A">Grade 7 - Section A</option>
                      <option value="All Classes">All Classes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Instructions & Guidelines
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details on submission guidelines, expected deliverables, and evaluation criteria..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] resize-none"
                  />
                </div>

                {/* File Attachment Upload Zone */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    <span>Upload Attachment / Materials</span>
                    <span className="text-[10px] font-normal text-slate-400">PDF, ZIP, IPYNB (Max 50MB)</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                    accept=".pdf,.zip,.ipynb,.py,.docx,.doc,.csv"
                  />

                  {!uploadedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#16b364] bg-emerald-50/60 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-[#16b364] hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[#e6f7ee] dark:bg-[#183928] text-[#16b364] flex items-center justify-center mx-auto mb-2 shadow-xs">
                        <UploadCloud className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Drop assignment file here, or <span className="text-[#16b364] underline">browse</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Upload problem sheet, starter dataset, or project instructions
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseDemoTemplate();
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-[#16b364]" />
                        <span>Attach Starter Materials (.zip)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-emerald-100 dark:border-emerald-900/40">
                          {getFileIcon(uploadedFile.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {uploadedFile.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatFileSize(uploadedFile.size)} • Ready for class distribution
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        title="Remove file"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-[#16b364] hover:bg-[#139c56] active:bg-[#108549] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Posting Assignment...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Publish Assignment to Students</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Published Assignments Overview (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 sm:px-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search published assignments..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Classes</option>
                    <option value="Grade 8 - Section A">Grade 8 - Section A</option>
                    <option value="Grade 8 - Section B">Grade 8 - Section B</option>
                  </select>
                </div>
              </div>

              {/* Assignments Cards List */}
              <div className="space-y-3.5">
                {filteredAssignments.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700/80">
                    <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto stroke-1 mb-2" />
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No assignments found
                    </div>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                      Try searching for a different title or create a new assignment using the form.
                    </p>
                  </div>
                ) : (
                  filteredAssignments.map((asg) => {
                    const submissionPct = Math.round((asg.submissionsCount / asg.totalStudents) * 100);
                    return (
                      <div
                        key={asg.id}
                        className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f7ee] dark:bg-[#183928] text-[#16b364]">
                                <Clock className="w-3 h-3" />
                                Due {asg.formattedDate || asg.dueDate}
                              </span>

                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                                <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                                +{asg.xp} XP
                              </span>

                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {asg.targetClass}
                              </span>
                            </div>

                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                              {asg.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                              {asg.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDeleteAssignment(asg.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Assignment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Submission Progress Bar & Attached Materials */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Attached Material Pill */}
                          {asg.attachmentName && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                              {getFileIcon(asg.attachmentName)}
                              <span className="font-semibold truncate max-w-xs">{asg.attachmentName}</span>
                              <span className="text-[10px] text-slate-400">({asg.attachmentSize || '1.5 MB'})</span>
                            </div>
                          )}

                          {/* Student Submissions Progress */}
                          <div className="flex items-center gap-3 ml-auto sm:ml-0">
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {asg.submissionsCount} / {asg.totalStudents} Turned In
                              </div>
                              <div className="text-[10px] text-slate-400">{submissionPct}% completion</div>
                            </div>
                            <div className="w-20 sm:w-28 bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
                              <div
                                className="bg-[#16b364] h-full rounded-full transition-all duration-500"
                                style={{ width: `${submissionPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
