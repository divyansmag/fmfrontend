import React, { useState } from 'react';
import { ParentSidebar } from '../../components/parent/ParentSidebar';
import { ParentHeader } from '../../components/parent/ParentHeader';
import { ParentProfileSummaryCard } from '../../components/parent/ParentProfileSummaryCard';
import { ParentPersonalInformationCard } from '../../components/parent/ParentPersonalInformationCard';
import { ParentAppearanceCard } from '../../components/parent/ParentAppearanceCard';
import { ParentIdModal } from '../../components/parent/ParentIdModal';
import { Footer } from '../../components/Footer';

import { parentSettingsData, type ParentSettingsInfo } from '../../data/parentSettingsData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ParentSettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [info] = useState<ParentSettingsInfo>(parentSettingsData);
  const [isParentIdModalOpen, setIsParentIdModalOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#101014] flex flex-col md:flex-row antialiased selection:bg-blue-100 dark:selection:bg-blue-900/40 transition-colors">
      {/* Left Navigation Sidebar */}
      <ParentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <ParentHeader />

        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Main Page Header */}
          <div className="mb-6">
            <span className="text-[11px] font-bold text-[#0d52ce] dark:text-[#3b82f6] tracking-wider uppercase block mb-1">
              ◉ ACCOUNT
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              Manage your profile, appearance, and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Summary Card */}
            <ParentProfileSummaryCard
              name={info.name}
              status={info.status}
              organization={info.organization}
              onSignOut={handleSignOut}
            />

            {/* Personal Information Card — Full Width */}
            <ParentPersonalInformationCard info={info} />

            {/* Appearance & Accessibility Card — Full Width */}
            <ParentAppearanceCard />
          </div>
        </main>

        <Footer />
      </div>

      {/* Modals */}
      <ParentIdModal
        isOpen={isParentIdModalOpen}
        onClose={() => setIsParentIdModalOpen(false)}
        parentId={info.parentId}
      />
    </div>
  );
};
