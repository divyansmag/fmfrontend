import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    setError('');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-[#27272f] shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#27272f] pb-4">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-[#ff8a00]" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Change Admin Password
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Password Updated!</h4>
            <p className="text-xs text-gray-500">Your system admin password has been changed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
              />
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
                className="py-2 px-5 rounded-xl text-white font-semibold text-xs bg-[#ff8a00] hover:bg-[#e07900] shadow-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
