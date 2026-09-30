import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminProfileSummaryCard } from '../../components/admin/AdminProfileSummaryCard';
import { AdminPersonalInformationCard } from '../../components/admin/AdminPersonalInformationCard';
import { AdminAppearanceCard } from '../../components/admin/AdminAppearanceCard';
import { AdminCommunicationPreferencesCard } from '../../components/admin/AdminCommunicationPreferencesCard';
import { Footer } from '../../components/Footer';

import { useAuth } from '../../context/AuthContext';
import {
  adminSettingsData,
  defaultAdminCommunicationPrefs,
  type AdminSettingsInfo,
  type AdminCommunicationPref,
} from '../../data/adminSettingsData';

export const AdminSettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [info] = useState<AdminSettingsInfo>(adminSettingsData);
  const [preferences, setPreferences] = useState<AdminCommunicationPref[]>(
    defaultAdminCommunicationPrefs
  );

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleTogglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-amber-100 dark:selection:bg-amber-900/40 transition-colors">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader />

        {/* Settings Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Page Heading */}
          <div className="mb-6">
            <span className="text-[11px] font-bold text-[#ff8a00] dark:text-[#f97316] tracking-wider uppercase block mb-1">
              ACCOUNT
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              Manage your account, profile, preferences, and notifications.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Summary Card */}
            <AdminProfileSummaryCard
              info={info}
              onSignOut={handleSignOut}
            />

            {/* Personal Information Card — Full Width */}
            <AdminPersonalInformationCard info={info} />

            {/* Appearance & Accessibility Card — Full Width */}
            <AdminAppearanceCard />

            {/* Communication Preferences Card — Full Width */}
            <AdminCommunicationPreferencesCard
              preferences={preferences}
              onToggle={handleTogglePreference}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
