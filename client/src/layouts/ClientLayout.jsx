import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Sidebar from '../components/navigation/Sidebar.jsx';

export const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar isAdminView={false} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isAdminView={false} className="hidden md:flex" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
