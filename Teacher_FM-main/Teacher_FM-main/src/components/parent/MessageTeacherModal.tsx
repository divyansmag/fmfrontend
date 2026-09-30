import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import teacherAvatar from '../../assets/avatars/teacher_login.png';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageTeacherModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('Question about Ananya\'s progress in Artificial Intelligence');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
      alert('Your message has been sent to Teacher Anaya Sharma!');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-[#27272f] shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#27272f] pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
              <img src={teacherAvatar} alt="Anaya Sharma" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Message Teacher</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Anaya Sharma • Class Teacher (Grade 8)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d52ce]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d52ce]/40 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSent || !message.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0d52ce] hover:bg-[#0b43aa] disabled:opacity-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{isSent ? 'Sending...' : 'Send Message'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
