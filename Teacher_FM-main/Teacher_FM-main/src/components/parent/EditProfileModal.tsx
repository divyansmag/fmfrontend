import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { ParentSettingsInfo } from '../../data/parentSettingsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  info: ParentSettingsInfo;
  onSave: (updated: Partial<ParentSettingsInfo>) => void;
}

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, info, onSave }) => {
  const [name, setName] = useState(info.name);
  const [email, setEmail] = useState(info.email);
  const [phone, setPhone] = useState(info.phone);
  const [school, setSchool] = useState(info.school);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, phone, school });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-[#27272f] shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#27272f] pb-3 mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit Parent Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0d52ce]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0d52ce]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0d52ce]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              School
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0d52ce]/40"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0d52ce] hover:bg-[#0b43aa] transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
