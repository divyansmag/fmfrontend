import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const AddAssignmentCard: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() && !dueDate) {
      setError('Please enter assignment title and select due date.');
      return;
    }
    if (!title.trim()) {
      setError('Assignment title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    // Success action
    setSuccess(`"${title}" assigned successfully!`);
    setTitle('');
    setDueDate('');

    // Clear success message after 4 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 4000);
  };

  return (
    <div className="bg-[#f2fbf6] dark:bg-[#122219] rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/40 shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        {/* Header with Green Icon */}
        <div className="flex items-start space-x-3 mb-2">
          <div className="p-2 rounded-xl bg-[#e6f7ee] dark:bg-[#183928] text-[#16b364] flex-shrink-0 mt-0.5">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
              Add Assignment
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa] font-medium mt-0.5">
              Create and assign new tasks to your students.
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-[#16b364] dark:text-emerald-400 text-xs font-medium flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
              Assignment Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182a20] border border-gray-200 dark:border-emerald-900/50 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Select due date"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182a20] border border-gray-200 dark:border-emerald-900/50 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] transition-all cursor-pointer"
              />
              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-3 top-3 pointer-events-none stroke-[2]" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-[#16b364] hover:bg-[#139c56] active:bg-[#108549] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>Create Assignment</span>
          </button>
        </form>
      </div>

      {/* View All Assignments Link */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => navigate('/teacher/student-progress')}
          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-[#16b364] hover:text-[#139c56] transition-colors cursor-pointer"
        >
          <span>View All Assignments</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
