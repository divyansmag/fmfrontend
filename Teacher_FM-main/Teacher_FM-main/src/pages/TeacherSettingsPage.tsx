import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ProfileSummaryCard } from '../components/ProfileSummaryCard';
import { PersonalInformation } from '../components/PersonalInformation';
import { AppearanceSettings } from '../components/AppearanceSettings';
import { Footer } from '../components/Footer';

export const TeacherSettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-purple-100 dark:selection:bg-purple-900/40 transition-colors">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader />

        {/* Settings Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Main Page Title Header */}
          <div className="mb-8">
            <span className="text-[11px] font-bold text-[#15ab5d] tracking-wider uppercase block mb-1">
              ◉ ACCOUNT
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-[#f5f5f5] tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#a1a1aa] font-medium mt-1">
              Manage your profile, appearance, and notifications.
            </p>
          </div>

          {/* Main Preferences Content */}
          <div className="w-full space-y-6">
            {/* Profile Summary Card */}
            <ProfileSummaryCard />

            {/* Personal Information (Full Width) */}
            <PersonalInformation />

            {/* Appearance & Accessibility (Full Width) */}
            <AppearanceSettings />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
