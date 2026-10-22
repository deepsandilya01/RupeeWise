import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Activity,
  Server,
  ArrowLeft,
  X,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminSidebar = ({ mobileOpen, setMobileOpen, activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'overview', name: 'Admin Overview', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'users', name: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'activity', name: 'System Activity', icon: <Activity className="w-4 h-4" /> },
    { id: 'health', name: 'System Diagnostics', icon: <Server className="w-4 h-4" /> },
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#0C2B35] text-white p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } select-none`}
      >
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between px-2 pt-2 pb-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <img
                src="/assets/logo.png"
                alt="RupeeWise Logo"
                className="w-8 h-8 rounded-full object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white leading-tight">
                  RupeeWise
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-coral-400">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
            Control Center
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#FDF9F0] text-[#0C2B35] font-bold shadow-sm'
                      : 'text-white/75 hover:bg-white/5 hover:text-white font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-[#0C2B35]' : 'text-white/60'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="my-5 border-t border-white/10" />

          {/* Quick Client Switch */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-white/70 hover:bg-white/5 hover:text-white text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ArrowLeft className="w-4 h-4 text-white/50" />
              <span>Back to Client View</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>

        {/* Security Badge Card */}
        <div className="relative mt-4 rounded-2xl bg-gradient-to-br from-[#103744] via-[#0E2F3A] to-[#1C1820] p-3.5 border border-white/10 overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Shield className="w-4 h-4 text-coral-400" />
            <span>Strict RBAC Active</span>
          </div>
          <p className="text-[10px] text-white/60 mt-1 leading-relaxed">
            Role validation verified by server environment allowlist.
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
