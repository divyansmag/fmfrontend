import { useState, useMemo, useEffect } from 'react';
import {
  X,
  ClipboardList,
  Search,
  Filter,
  Clock,
  Sparkles,
  Upload,
  CheckCircle2,
  FileText,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Send,
} from 'lucide-react';

export default function AllAssignmentsModal({
  isOpen,
  onClose,
  assignments = [],
  onOpenSubmission,
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'submitted'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2; // Show only 2 assignments at a time

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTab, searchQuery]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.module.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterTab === 'pending') return item.status !== 'submitted';
      if (filterTab === 'submitted') return item.status === 'submitted';
      return true;
    });
  }, [assignments, filterTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / pageSize));
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssignments.slice(start, start + pageSize);
  }, [filteredAssignments, currentPage, pageSize]);

  const counts = useMemo(() => {
    const total = assignments.length;
    const submitted = assignments.filter((a) => a.status === 'submitted').length;
    const pending = total - submitted;
    return { total, submitted, pending };
  }, [assignments]);

  if (!isOpen) return null;

  return (
    <div
      id="all-assignments-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop overflow-y-auto"
      onClick={(e) => {
        if (e.target.id === 'all-assignments-modal-backdrop') onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between relative bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/40 dark:from-slate-800/90 dark:to-slate-900/90 flex-shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0 mt-0.5">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Curriculum Coursework
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white/70 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700">
                  {counts.submitted}/{counts.total} Done
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display leading-tight mt-0.5">
                All Course Assignments
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your notebooks, code archives, or reports to turn in your work and earn XP.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Search + Filter Tabs */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterTab === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('submitted')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterTab === 'submitted'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Submitted ({counts.submitted})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Assignments List - 2 at a time */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-3">
          {paginatedAssignments.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ClipboardList className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto stroke-1" />
              <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                No assignments found
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {searchQuery
                  ? `No matches for "${searchQuery}". Try a different keyword.`
                  : 'No assignments under this filter.'}
              </p>
            </div>
          ) : (
            paginatedAssignments.map((item) => {
              const isSubmitted = item.status === 'submitted';
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSubmitted
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : item.dueUrgent
                        ? 'border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 shadow-xs hover:border-blue-300'
                        : 'border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                          Submitted • Under Review
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.dueUrgent
                              ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {item.dueStatus}: {item.dueDate}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                        <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                        +{item.xp || 100} XP
                      </span>

                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.module}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl line-clamp-2">
                      {item.description}
                    </p>

                    {isSubmitted && item.submission?.fileName && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 pt-0.5">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Attached file: <span className="font-bold">{item.submission.fileName}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSubmission(item);
                      }}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                        isSubmitted
                          ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-[1.02] active:scale-100'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isSubmitted ? 'Resubmit / Edit' : 'Upload & Submit'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with 2-at-a-time Pagination */}
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <span>
              Showing {filteredAssignments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, filteredAssignments.length)} of {filteredAssignments.length}
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Previous 2 assignments"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold px-1.5">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Next 2 assignments"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
