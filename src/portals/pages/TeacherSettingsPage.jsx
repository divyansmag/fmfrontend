import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ProfileSummaryCard } from '../components/ProfileSummaryCard';
import { PersonalInformation } from '../components/PersonalInformation';
import { AppearanceSettings } from '../components/AppearanceSettings';
import { Footer } from '../components/Footer';

export const TeacherSettingsPage = () => {
  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Header */}
        <DashboardHeader />

        {/* Settings Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Main Page Title Header */}

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
    </div>);

};