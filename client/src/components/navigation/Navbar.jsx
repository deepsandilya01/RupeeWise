import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu.jsx';
import authService from '../../services/authService.js';
import { Activity, ShieldCheck } from 'lucide-react';

export const Navbar = ({ isAdminView = false }) => {
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      try {
        const data = await authService.checkHealth();
        if (isMounted) setSystemHealth(data);
      } catch (err) {
        if (isMounted) setSystemHealth({ success: false, database: { connected: false } });
      }
    };
    fetchHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  const isDbConnected = systemHealth?.database?.connected;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link to={isAdminView ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-lg shadow-subtle group-hover:bg-forest-900 transition-colors">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-forest-800">
                  PaisaPilot
                </span>
                <span className="bg-forest-50 text-forest-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-forest-200">
                  AI
                </span>
                {isAdminView && (
                  <span className="bg-charcoal-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Admin
                  </span>
                )}
              </div>
              <span className="hidden md:block text-[11px] text-charcoal-500 font-medium tracking-tight">
                Track smarter. Spend better. Save faster.
              </span>
            </div>
          </Link>
        </div>

        {/* Right side controls & User */}
        <div className="flex items-center gap-4">
          {/* Live System Indicator */}
          <div
            title={
              isDbConnected
                ? 'Backend API and MongoDB are fully connected'
                : 'Connecting or MongoDB unavailable'
            }
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 border border-gray-200"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-charcoal-600">
              {isDbConnected ? 'System Online' : 'Checking status...'}
            </span>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
