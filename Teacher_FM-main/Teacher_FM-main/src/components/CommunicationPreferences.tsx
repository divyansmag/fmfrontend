import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export const CommunicationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    emailDigest: true,
    streakReminders: true,
    teacherUpdates: true,
    achievementAlerts: true,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-[#1a1a21] rounded-2xl p-6 border border-gray-200/80 dark:border-[#27272f] shadow-md dark:shadow-none shadow-purple-900/5 transition-colors mt-6">
      {/* Card Header */}
      <div className="flex items-center space-x-2 pb-4 border-b border-gray-200/70 dark:border-[#27272f] mb-6">
        <Bell className="w-4.5 h-4.5 text-[#15ab5d]" />
        <h3 className="text-base font-bold text-gray-900 dark:text-[#f5f5f5]">
          Communication Preferences
        </h3>
      </div>

      {/* 2x2 Grid of Toggle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {[
          {
            key: 'emailDigest' as const,
            title: 'Email Digest',
            desc: 'Weekly summary of student progress',
          },
          {
            key: 'streakReminders' as const,
            title: 'Streak Reminders',
            desc: 'Daily nudge at 6:00 PM to maintain your goals',
          },
          {
            key: 'teacherUpdates' as const,
            title: 'Teacher Updates',
            desc: 'Instant alerts for feedback and assignments',
          },
          {
            key: 'achievementAlerts' as const,
            title: 'Achievement Alerts',
            desc: 'Badges and certificates notifications',
          },
        ].map((item) => {
          const isEnabled = preferences[item.key];
          return (
            <div
              key={item.key}
              className="bg-purple-50/40 dark:bg-[#0d0d12] border border-gray-200/80 dark:border-[#27272f] rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-[#f5f5f5]">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-[#a1a1aa] mt-0.5">
                  {item.desc}
                </p>
              </div>

              {/* Green Toggle Switch */}
              <button
                type="button"
                onClick={() => togglePreference(item.key)}
                className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex-shrink-0 ${
                  isEnabled ? 'bg-[#15ab5d]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label={`Toggle ${item.title}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform transform ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
