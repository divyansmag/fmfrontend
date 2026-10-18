import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ClassSelector } from '../components/ClassSelector';
import { Footer } from '../components/Footer';
import {
  Megaphone,
  Send,
  Users,
  Bell,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Search,
  Filter,
  Clock,
  Pin,
  MessageSquare,
  Award,
  BookOpen,
} from 'lucide-react';

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Reminder: Neural Networks Unit 1 Project Due Soon',
    message: 'Dear students, please submit your Jupyter Notebooks or Python code before Friday 11:59 PM. Late submissions will lose 10% daily XP.',
    author: 'Teacher Anaya Sharma',
    targetClass: 'Grade 8 - Section A',
    category: 'assignment',
    pinned: true,
    timestamp: 'Today at 10:30 AM',
    timeAgo: '2h ago',
    readCount: 38,
    totalStudents: 42,
  },
  {
    id: 'ann-2',
    title: 'Special Live Q&A Session on Computer Vision',
    message: 'Join us tomorrow at 4:00 PM IST for a live walkthrough of Sobel edge filters and image convolutions. Bring your questions!',
    author: 'Teacher Anaya Sharma',
    targetClass: 'All Classes',
    category: 'event',
    pinned: false,
    timestamp: 'Yesterday at 3:15 PM',
    timeAgo: '1d ago',
    readCount: 41,
    totalStudents: 42,
  },
  {
    id: 'ann-3',
    title: 'Congratulations on 100% Quiz Completion Rate!',
    message: 'Kudos to Grade 8 students for achieving full completion on the Machine Learning basics diagnostic test. Keep up the high energy!',
    author: 'Teacher Anaya Sharma',
    targetClass: 'Grade 8 - Section A',
    category: 'celebration',
    pinned: false,
    timestamp: 'Oct 12 at 11:00 AM',
    timeAgo: '2d ago',
    readCount: 42,
    totalStudents: 42,
  },
];

const CATEGORY_META = {
  general: { label: 'General Announcement', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', icon: Megaphone },
  assignment: { label: 'Assignment Alert', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400', icon: BookOpen },
  event: { label: 'Event / Class', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400', icon: Calendar },
  celebration: { label: 'Achievement / Kudos', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#16b364] dark:text-emerald-400', icon: Award },
};

export const TeacherAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('futureminds_announcements_v1');
      if (saved) return JSON.parse(saved);
      return INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Form inputs
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetClass, setTargetClass] = useState('Grade 8 - Section A');
  const [category, setCategory] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Push updates to localStorage and broadcast storage event for open student tabs
  useEffect(() => {
    try {
      localStorage.setItem('futureminds_announcements_v1', JSON.stringify(announcements));
    } catch {}
  }, [announcements]);

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Please provide an announcement title.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter the announcement message content.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newAnnouncement = {
        id: `ann-${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        author: 'Teacher Anaya Sharma',
        targetClass,
        category,
        pinned: isPinned,
        timestamp: timeStr,
        timeAgo: 'Just now',
        readCount: 0,
        totalStudents: 42,
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);

      // Broadcast a custom storage event so student dashboard notifications update immediately
      window.dispatchEvent(
        new CustomEvent('futureminds_new_announcement', {
          detail: newAnnouncement,
        })
      );

      setIsSubmitting(false);
      setSuccess(`Announcement "${title}" sent! It has been dispatched to students' notification inboxes.`);

      // Reset form
      setTitle('');
      setMessage('');
      setIsPinned(false);

      setTimeout(() => setSuccess(null), 4500);
    }, 500);
  };

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Delete this announcement? It will also be removed from student feeds.')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleTogglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
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

        {/* Announcements Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Top Title Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#16b364] dark:text-[#16b364]">
                  Teacher Portal • Broadcast System
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {announcements.length} Published
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
                Announcements & Student Alerts
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Publish class announcements, reminders, or messages that instantly reach the Student Dashboard notifications.
              </p>
            </div>
            <ClassSelector />
          </div>

          {/* Grid Layout: Create Announcement Form (5 cols) & Broadcast Feed (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Compose Form */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-700/70">
                <div className="w-10 h-10 rounded-2xl bg-[#e6f7ee] dark:bg-[#183928] text-[#16b364] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Megaphone className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Broadcast Announcement
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Messages appear in students&apos; notification bells.
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

              {/* Compose Form */}
              <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Announcement Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Unit 1 Project Submission Deadline Today"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Target Audience
                    </label>
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] cursor-pointer"
                    >
                      <option value="Grade 8 - Section A">Grade 8 - Section A</option>
                      <option value="Grade 8 - Section B">Grade 8 - Section B</option>
                      <option value="Grade 7 - Section A">Grade 7 - Section A</option>
                      <option value="All Classes">All Students (All Classes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Category Type
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] cursor-pointer"
                    >
                      <option value="general">📢 General Announcement</option>
                      <option value="assignment">📝 Assignment Alert</option>
                      <option value="event">📅 Class / Event</option>
                      <option value="celebration">🎉 Kudos / Celebration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Announcement Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type the message that will be delivered to students' notifications..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16b364]/40 focus:border-[#16b364] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <Pin className={`w-4 h-4 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Pin Announcement to Top
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-[#16b364] focus:ring-[#16b364] accent-[#16b364] cursor-pointer"
                  />
                </div>

                {/* Quick Templates */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Templates:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('Reminder: Assignment Due Friday Night');
                        setMessage('Don’t forget to upload your solution notebooks before the deadline at 11:59 PM.');
                        setCategory('assignment');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      + Assignment Due
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('Class AI Quiz Starting in 30 Minutes');
                        setMessage('Please open your laptops and navigate to the Quiz tab for the chapter checkpoint.');
                        setCategory('event');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      + Quiz Starting
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle('Great Progress on Neural Networks!');
                        setMessage('Outstanding performance by everyone who completed the activation functions exercise today.');
                        setCategory('celebration');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      + Class Kudos
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-[#16b364] hover:bg-[#139c56] active:bg-[#108549] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Broadcast...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.2]" />
                      <span>Send to Student Notifications</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Published Feed */}
            <div className="lg:col-span-7 space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 sm:px-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search announcements..."
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
                    <option value="all">All Audiences</option>
                    <option value="Grade 8 - Section A">Grade 8 - Section A</option>
                    <option value="Grade 8 - Section B">Grade 8 - Section B</option>
                    <option value="All Classes">All Classes</option>
                  </select>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-3.5">
                {filteredAnnouncements.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700/80">
                    <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto stroke-1 mb-2" />
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No announcements found
                    </div>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                      Post an announcement on the left to send notifications directly to student accounts.
                    </p>
                  </div>
                ) : (
                  filteredAnnouncements.map((item) => {
                    const meta = CATEGORY_META[item.category] || CATEGORY_META.general;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border transition-all space-y-3 ${
                          item.pinned
                            ? 'border-amber-300/80 dark:border-amber-600/50 shadow-sm ring-1 ring-amber-200/60 dark:ring-amber-500/30'
                            : 'border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${meta.bg}`}>
                              <Icon className="w-3 h-3" />
                              {meta.label}
                            </span>

                            {item.pinned && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                                <Pin className="w-3 h-3 fill-amber-500" />
                                Pinned
                              </span>
                            )}

                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {item.targetClass}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleTogglePin(item.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                item.pinned ? 'text-amber-500 hover:text-amber-600' : 'hover:text-slate-600 dark:hover:text-slate-300'
                              }`}
                              title={item.pinned ? 'Unpin' : 'Pin to top'}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnnouncement(item.id)}
                              className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Announcement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                            {item.message}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span>{item.author}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.timestamp}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Bell className="w-3 h-3" />
                            <span>Delivered to Notifications</span>
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
