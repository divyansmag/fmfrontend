import { useState, useRef, useEffect } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  FileCode,
  Archive,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  AlertCircle,
  Paperclip,
  ClipboardList,
  Check,
  FileCheck,
} from 'lucide-react';

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
    return <FileCode className="w-5 h-5 text-indigo-500" />;
  }
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) {
    return <Archive className="w-5 h-5 text-amber-500" />;
  }
  return <FileText className="w-5 h-5 text-blue-500" />;
}

export default function AssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSubmitAssignment,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [comments, setComments] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (assignment?.submission?.fileName) {
        setSelectedFile({
          name: assignment.submission.fileName,
          size: assignment.submission.fileSize || 1024 * 340,
        });
        setComments(assignment.submission.comments || '');
      } else {
        setSelectedFile(null);
        setComments('');
      }
      setErrorMsg('');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, assignment]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !assignment) return null;

  const isAlreadySubmitted = assignment.status === 'submitted';

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 25MB limit. Please choose a smaller file.');
      return;
    }
    setErrorMsg('');
    setSelectedFile(file);
  };

  const handleAttachDemoFile = (e) => {
    e.stopPropagation();
    setSelectedFile({
      name: `${assignment.title.toLowerCase().replace(/\s+/g, '_')}_solution.ipynb`,
      size: 1024 * 450, // 450 KB
    });
    setErrorMsg('');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please upload or attach an assignment file before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSubmitAssignment) {
        onSubmitAssignment(assignment.id, {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          comments,
        });
      }
    }, 600);
  };

  return (
    <div
      id="assignment-submission-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop overflow-y-auto"
      onClick={(e) => {
        if (e.target.id === 'assignment-submission-modal') onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[92vh] sm:max-h-[86vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header - Fixed */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between relative bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/40 dark:from-slate-800/90 dark:to-slate-900/90 flex-shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0 mt-0.5">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Student Assignment Submission
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
                {assignment.title}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {assignment.module}
              </div>
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

        {/* Modal Body */}
        {isSuccess ? (
          /* Submission Success State */
          <div className="overflow-y-auto p-6 sm:p-8 text-center space-y-4 flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Assignment Submitted! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                Great work! Your submission for <span className="font-bold text-slate-900 dark:text-white">&quot;{assignment.title}&quot;</span> has been recorded.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold mx-auto">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>+{assignment.xp || 100} XP Awarded</span>
            </div>

            {selectedFile && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 text-left max-w-sm mx-auto w-full">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                  {getFileIcon(selectedFile.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatFileSize(selectedFile.size)} • Submitted Just Now
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
              {/* Meta Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{assignment.dueDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reward</div>
                    <div className="font-semibold text-amber-600 dark:text-amber-400">+{assignment.xp || 100} XP</div>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Paperclip className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</div>
                    <div className={`font-semibold ${isAlreadySubmitted ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {isAlreadySubmitted ? 'Submitted (Can Resubmit)' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Task Brief
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-blue-50/40 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-100/60 dark:border-blue-900/30">
                  {assignment.description || 'Complete the assignment task according to lesson guidelines and attach your work below for evaluation.'}
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Attachment Upload Zone */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  <span>Upload Attachment</span>
                  <span className="text-[10px] lowercase text-slate-400 font-normal">
                    max 25MB • .pdf, .ipynb, .zip, .py
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.ipynb,.py,.zip,.docx,.doc,.txt,.png,.jpg"
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Drag and drop your file here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Accepts Python scripts (.py), Jupyter notebooks (.ipynb), PDFs or ZIPs
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleAttachDemoFile}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>Use Demo File ({assignment.title.toLowerCase().replace(/\s+/g, '_')}_solution.ipynb)</span>
                    </button>
                  </div>
                ) : (
                  /* Selected File Card */
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600">
                        {getFileIcon(selectedFile.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {selectedFile.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatFileSize(selectedFile.size)} • Ready for submission
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      title="Remove file"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Field */}
              <div>
                <label htmlFor="submission-comments" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Note for Teacher (Optional)
                </label>
                <textarea
                  id="submission-comments"
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Mention any assumptions, libraries used, or notes for review..."
                  className="w-full px-3.5 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none transition-all"
                />
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-submit-assignment-modal"
                type="submit"
                disabled={isSubmitting || (!selectedFile && !isAlreadySubmitted)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all ${
                  isSubmitting || (!selectedFile && !isAlreadySubmitted)
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-[1.02] active:scale-100'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAlreadySubmitted ? 'Resubmit Assignment' : 'Submit Assignment'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
