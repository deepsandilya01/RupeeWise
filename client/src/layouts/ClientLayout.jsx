import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar.jsx';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';

export const ClientLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#0B1D33] font-sans antialiased">
      {/* Dark Teal Sidebar (Fixed Left on Desktop, Drawer on Mobile) */}
      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        {/* Sticky/Fixed Dashboard Header */}
        <DashboardHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Route Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1540px] w-full mx-auto">
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
