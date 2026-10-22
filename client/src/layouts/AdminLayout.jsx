import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import useAuth from '../hooks/useAuth.js';
import { Menu, LogOut, ShieldCheck } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#0B1D33] font-sans antialiased">
      {/* Dark Teal Fixed Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Admin Content Container */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="w-full bg-[#FAF6EE] pt-4 pb-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-gray-200/50 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-[#0C2B35] hover:bg-gray-50"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#0C2B35] uppercase tracking-wider">
                System Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-white border border-gray-200/80 px-3 py-1.5 rounded-full shadow-2xs">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user?.name || 'Admin'}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#0C2B35] text-white font-bold text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#0B1D33] leading-none">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-coral-600 font-semibold mt-0.5">
                  Super Admin
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1540px] w-full mx-auto">
          <Outlet context={{ activeSection, setActiveSection }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
