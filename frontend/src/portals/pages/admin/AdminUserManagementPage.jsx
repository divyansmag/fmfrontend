import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import {
  GraduationCap,
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Mail,
  KeyRound,
  ShieldAlert,
  Download,
  Users,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';

const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@futureminds.demo',
    role: 'student',
    grade: 'Grade 8',
    department: 'Computer Science & AI',
    status: 'Active',
    joinedDate: '2026-08-14',
    assignedClass: '8-B'
  },
  {
    id: 'usr-2',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@futureminds.demo',
    role: 'teacher',
    grade: 'Grade 8, Grade 9',
    department: 'Mathematics & STEM',
    status: 'Active',
    joinedDate: '2026-08-10',
    assignedClass: 'Lead Faculty'
  },
  {
    id: 'usr-3',
    name: 'Anaya Sharma',
    email: 'anaya.sharma@futureminds.demo',
    role: 'student',
    grade: 'Grade 6',
    department: 'AI & Robotics',
    status: 'Active',
    joinedDate: '2026-08-18',
    assignedClass: '6-A'
  },
  {
    id: 'usr-4',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@futureminds.demo',
    role: 'teacher',
    grade: 'Grade 6, Grade 7',
    department: 'AI & Robotics',
    status: 'Active',
    joinedDate: '2026-08-05',
    assignedClass: 'Robotics Lab'
  },
  {
    id: 'usr-5',
    name: 'Kabir Patel',
    email: 'kabir.patel@futureminds.demo',
    role: 'student',
    grade: 'Grade 9',
    department: 'Science & Lab',
    status: 'Pending',
    joinedDate: '2026-08-22',
    assignedClass: '9-C'
  }
];

export const AdminUserManagementPage = () => {
  const { showToast } = useApp();

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('futureminds_admin_users_list');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'student' | 'teacher'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    grade: 'Grade 6',
    department: 'AI & Robotics',
    assignedClass: '6-A',
    temporaryPassword: 'Password@2026'
  });

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('futureminds_admin_users_list', JSON.stringify(users));
    } catch {
      // quota or private mode
    }
  }, [users]);

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const matchesTab = activeTab === 'all' || u.role === activeTab;
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesRole && matchesSearch;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Validation Error', 'Please fill in the full name and email.', 'info');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      grade: formData.role === 'student' ? formData.grade : formData.grade,
      department: formData.department,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedClass: formData.assignedClass || (formData.role === 'teacher' ? 'Faculty' : 'General')
    };

    setUsers([newUser, ...users]);
    setIsModalOpen(false);
    showToast(
      `${formData.role === 'student' ? 'Student' : 'Teacher'} Added!`,
      `${formData.name} can now sign in using ${formData.email}`,
      'success'
    );

    // Reset modal form
    setFormData({
      name: '',
      email: '',
      role: 'student',
      grade: 'Grade 6',
      department: 'AI & Robotics',
      assignedClass: '6-A',
      temporaryPassword: 'Password@2026'
    });
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the platform?`)) {
      setUsers(users.filter((u) => u.id !== id));
      showToast('Account Removed', `${name} has been removed.`, 'info');
    }
  };

  const studentCount = users.filter((u) => u.role === 'student').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200/70 dark:border-slate-700/80 shadow-xs">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight">
                User Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                Provision new student and teacher accounts, configure classrooms, and issue access credentials
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff8a00] hover:bg-[#e67a00] text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Add User Account</span>
            </button>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div
              onClick={() => setActiveTab('all')}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'border-[#ff8a00] shadow-sm'
                  : 'border-gray-200/70 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Managed Users
                </span>
                <Users className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-3xl font-extrabold font-display text-gray-900 dark:text-white mt-2">
                {users.length}
              </div>
              <span className="text-[11px] font-semibold text-emerald-500 mt-1 inline-block">
                All authorized accounts
              </span>
            </div>

            <div
              onClick={() => setActiveTab('student')}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'border-[#ff8a00] shadow-sm'
                  : 'border-gray-200/70 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Active Students
                </span>
                <GraduationCap className="w-5 h-5 text-[#ff8a00]" />
              </div>
              <div className="text-3xl font-extrabold font-display text-gray-900 dark:text-white mt-2">
                {studentCount}
              </div>
              <span className="text-[11px] font-semibold text-[#ff8a00] mt-1 inline-block">
                Enrolled in grades 6-9
              </span>
            </div>

            <div
              onClick={() => setActiveTab('teacher')}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border transition-all cursor-pointer ${
                activeTab === 'teacher'
                  ? 'border-[#ff8a00] shadow-sm'
                  : 'border-gray-200/70 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Active Faculty & Teachers
                </span>
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold font-display text-gray-900 dark:text-white mt-2">
                {teacherCount}
              </div>
              <span className="text-[11px] font-semibold text-blue-500 mt-1 inline-block">
                Instructors & educators
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200/70 dark:border-slate-700/80 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, department, or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40 text-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#ff8a00] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('student')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-[#ff8a00] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Students ({studentCount})
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'teacher'
                    ? 'bg-[#ff8a00] text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Teachers ({teacherCount})
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/70 dark:border-slate-700/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200/80 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-900/40 text-[11px] uppercase tracking-wider text-gray-400 font-extrabold">
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Grade / Department</th>
                    <th className="py-3.5 px-4">Assigned Section</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date Added</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                u.role === 'student'
                                  ? 'bg-amber-100 dark:bg-amber-950/70 text-[#ff8a00]'
                                  : 'bg-blue-100 dark:bg-blue-950/70 text-blue-600'
                              }`}
                            >
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white leading-tight">
                                {u.name}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" />
                                <span>{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              u.role === 'student'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-[#ff8a00] border border-amber-200/60 dark:border-amber-900/40'
                                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40'
                            }`}
                          >
                            {u.role === 'student' ? (
                              <GraduationCap className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                            <span className="capitalize">{u.role}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {u.grade}
                          </div>
                          <div className="text-xs text-gray-400">{u.department}</div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-gray-600 dark:text-gray-300">
                          {u.assignedClass}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {u.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-gray-400">
                          {u.joinedDate}
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Remove User"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200/80 dark:border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-slate-700/80 pb-4">
              <div>
                <h3 className="text-xl font-extrabold font-display text-gray-900 dark:text-white">
                  Add Platform User
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Create new student or teacher credentials for platform access
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Role Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Account Role *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student', assignedClass: '6-A' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                      formData.role === 'student'
                        ? 'border-[#ff8a00] bg-amber-50/60 dark:bg-amber-950/40 text-[#ff8a00]'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'teacher', assignedClass: 'Lead Faculty' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                      formData.role === 'teacher'
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Teacher</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={formData.role === 'student' ? 'e.g. Diya Patel' : 'e.g. Dr. Robert Vance'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff8a00]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@futureminds.demo"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff8a00]"
                />
              </div>

              {/* Grade & Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {formData.role === 'student' ? 'Grade Level' : 'Teaching Level'}
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff8a00]"
                  >
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 6 - Grade 9">All Grades (Faculty)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff8a00]"
                  >
                    <option value="AI & Robotics">AI & Robotics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science & Lab">Science & Lab</option>
                    <option value="Design & Arts">Design & Arts</option>
                  </select>
                </div>
              </div>

              {/* Assigned Section & Initial Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Classroom / Section
                  </label>
                  <input
                    type="text"
                    value={formData.assignedClass}
                    onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })}
                    placeholder="e.g. 8-A or Lab 2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff8a00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Temporary Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.temporaryPassword}
                      readOnly
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Submission buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ff8a00] hover:bg-[#e67a00] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Confirm & Provision Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
