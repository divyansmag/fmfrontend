import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { AdminSettingsInfo } from '../../data/adminSettingsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  info: AdminSettingsInfo;
  onSave: (updated: Partial<AdminSettingsInfo>) => void;
}

export const AdminEditProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  info,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: info.name,
    email: info.email,
    phone: info.phone,
    organization: info.organization,
    role: info.role,
    department: info.department,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      organizationTitle: `${formData.role} • ${formData.organization}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-[#27272f] shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#27272f] pb-4">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Edit Admin Profile
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Role Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-[#27272f]">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl text-white font-semibold text-xs bg-[#ff8a00] hover:bg-[#e07900] shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
