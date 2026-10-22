import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Bot,
  PieChart,
  Target,
  Activity,
  Compass,
  Bell,
  Settings,
  HelpCircle,
  ArrowRight,
  X,
} from 'lucide-react';

export const DashboardSidebar = ({ mobileOpen, setMobileOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNav = [
    { id: 'dashboard', path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', path: '/transactions', name: 'Transactions', icon: <Receipt className="w-4 h-4" /> },
    { id: 'ai-coach', path: '/dashboard', name: 'AI Coach', icon: <Bot className="w-4 h-4" /> },
    { id: 'budget', path: '/dashboard', name: 'Budget', icon: <PieChart className="w-4 h-4" /> },
    { id: 'goals', path: '/dashboard', name: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'simulator', path: '/dashboard', name: 'Simulator', icon: <Activity className="w-4 h-4" /> },
    { id: 'insights', path: '/dashboard', name: 'Insights', icon: <Compass className="w-4 h-4" /> },
  ];

  const secondaryNav = [
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: 3,
    },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'help', name: 'Help & Support', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (item) => {
    if (setActiveTab) setActiveTab(item.id);
    if (item.path && location.pathname !== item.path) {
      navigate(item.path);
    }
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
          {/* Logo & Close Button for Mobile */}
          <div className="flex items-center justify-between px-2 pt-2 pb-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <img
                src="/assets/logo.png"
                alt="RupeeWise Logo"
                className="w-8 h-8 rounded-full object-contain"
              />
              <span className="font-extrabold text-lg tracking-tight text-white">
                RupeeWise <span className="text-[#3D8569] font-bold">AI</span>
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1 text-xs font-semibold">
            {mainNav.map((item) => {
              const isRouteActive = item.id === 'transactions'
                ? location.pathname === '/transactions'
                : item.id === 'dashboard'
                ? location.pathname === '/dashboard'
                : activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all ${
                    isRouteActive
                      ? 'bg-[#FDF9F0] text-[#0C2B35] font-bold shadow-sm'
                      : 'text-white/75 hover:bg-white/5 hover:text-white font-medium'
                  }`}
                >
                  <span className={isRouteActive ? 'text-[#0C2B35]' : 'text-white/60'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-5 border-t border-white/10" />

          {/* Secondary Navigation */}
          <nav className="space-y-1 text-xs font-medium text-white/70">
            {secondaryNav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-white/5 transition-colors ${
                  activeTab === item.id ? 'bg-white/10 text-white font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/60">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="w-4 h-4 rounded-full bg-coral-500 text-white font-bold text-[9px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Sidebar Card: "Small Changes. Big Futures." */}
        <div className="relative mt-4 rounded-2xl bg-gradient-to-br from-[#103744] via-[#0E2F3A] to-[#251F23] p-4 border border-white/10 overflow-hidden shadow-lg">
          {/* Decorative Coral & Dark Glow */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-coral-500/30 blur-xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="text-sm font-bold text-white leading-tight">
              Small <br />
              Changes. <br />
              Big Futures.
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="w-8 h-8 rounded-full bg-[#FFE5D4] text-[#0C2B35] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Explore simulator"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
