import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';

export const PlaceholderSettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-purple-100 dark:selection:bg-purple-900/40 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#a1a1aa] mb-6">
            Configure your teacher profile, notification preferences, and portal settings.
          </p>

          <div className="bg-white dark:bg-[#1a1a21] rounded-2xl p-8 border border-gray-200/80 dark:border-[#27272f] text-center text-gray-500 dark:text-gray-400">
            Settings configuration portal coming soon.
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
