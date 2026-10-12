import React, { useState } from 'react';
import { ParentSidebar } from '../../components/parent/ParentSidebar';
import { ParentHeader } from '../../components/parent/ParentHeader';
import { ParentProfileSummaryCard } from '../../components/parent/ParentProfileSummaryCard';
import { ParentPersonalInformationCard } from '../../components/parent/ParentPersonalInformationCard';
import { ParentAppearanceCard } from '../../components/parent/ParentAppearanceCard';
import { ParentIdModal } from '../../components/parent/ParentIdModal';
import { Footer } from '../../components/Footer';

import { parentSettingsData } from '../../data/parentSettingsData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ParentSettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [info] = useState(parentSettingsData);
  const [isParentIdModalOpen, setIsParentIdModalOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div id="app-shell" className="min-h-screen flex flex-col md:flex-row">
      {/* Left Navigation Sidebar */}
      <ParentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FD] dark:bg-[#0F172A]">
        {/* Top Header */}
        <ParentHeader />

        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Main Page Header */}

          <div className="space-y-6">
            {/* Profile Summary Card */}
            <ParentProfileSummaryCard
              name={info.name}
              status={info.status}
              organization={info.organization}
              onSignOut={handleSignOut} />
            

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
        parentId={info.parentId} />
      
    </div>);

};