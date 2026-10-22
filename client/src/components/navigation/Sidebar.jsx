import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Bot,
  Shield,
  Users,
  Activity,
  Layers,
} from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export const Sidebar = ({ isAdminView = false, className = '' }) => {
  const clientNav = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: true,
    },
    {
      name: 'Transactions',
      path: '#transactions',
      icon: <Receipt className="w-4 h-4" />,
      upcoming: 'Phase 2',
    },
    {
      name: 'Smart Budgets',
      path: '#budgets',
      icon: <PieChart className="w-4 h-4" />,
      upcoming: 'Phase 2',
    },
    {
      name: 'AI Money Coach',
      path: '#ai-coach',
      icon: <Bot className="w-4 h-4 text-forest-600" />,
      upcoming: 'Phase 2',
    },
  ];

  const adminNav = [
    {
      name: 'Admin Dashboard',
      path: '/admin',
      icon: <Shield className="w-4 h-4" />,
      active: true,
    },
    {
      name: 'User Management',
      path: '#users',
      icon: <Users className="w-4 h-4" />,
      upcoming: 'Phase 2',
    },
    {
      name: 'System Diagnostics',
      path: '#diagnostics',
      icon: <Activity className="w-4 h-4" />,
      upcoming: 'Phase 2',
    },
  ];

  const navItems = isAdminView ? adminNav : clientNav;

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between p-4 flex-shrink-0 ${className}`}
    >
      <div className="space-y-6">
        <div className="px-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
            {isAdminView ? 'Administration' : 'Finance Dashboard'}
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isClickable = !item.upcoming;
            if (!isClickable) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-400 cursor-not-allowed select-none opacity-75"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.upcoming && (
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5">
                      {item.upcoming}
                    </Badge>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-800 text-white font-semibold shadow-xs'
                      : 'text-charcoal-700 hover:bg-forest-50 hover:text-forest-800'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-canvas rounded-xl border border-gray-200/70 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-forest-800 mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Phase 1 Architecture</span>
        </div>
        <p className="text-[11px] text-charcoal-500 leading-relaxed">
          MERN + Google OAuth + RBAC foundation initialized and ready.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
