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
  defaultAdminCommunicationPrefs } from


'../../data/adminSettingsData';

export const AdminSettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [info] = useState(adminSettingsData);
  const [preferences, setPreferences] = useState(
    defaultAdminCommunicationPrefs
  );

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleTogglePreference = (id) => {
    setPreferences((prev) =>
    prev.map((item) =>
    item.id === id ? { ...item, enabled: !item.enabled } : item
    )
    );
  };

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Header */}
        <AdminHeader />

        {/* Settings Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Page Heading */}

          <div className="space-y-6">
            {/* Profile Summary Card */}
            <AdminProfileSummaryCard
              info={info}
              onSignOut={handleSignOut} />
            

            {/* Personal Information Card — Full Width */}
            <AdminPersonalInformationCard info={info} />

            {/* Appearance & Accessibility Card — Full Width */}
            <AdminAppearanceCard />

            {/* Communication Preferences Card — Full Width */}
            <AdminCommunicationPreferencesCard
              preferences={preferences}
              onToggle={handleTogglePreference} />
            
          </div>
        </main>

        <Footer />
      </div>
    </div>);

};