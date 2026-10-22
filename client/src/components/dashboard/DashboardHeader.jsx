import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Shield,
  Menu,
  Settings,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Target,
  PieChart,
  Check,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useNotifications from '../../hooks/useNotifications.js';
import useToast from '../../hooks/useToast.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks.js';
import { fetchTransactionSummary } from '../../features/transactions/transactionThunks.js';

export const DashboardHeader = ({ onOpenMobileSidebar }) => {
  const { user, role, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isRead } = useNotifications();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [searchTerm, setSearchTerm] = useState('');
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setDateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    toast.info('You have been signed out.');
    navigate('/login');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleMonthSelect = (m) => {
    setSelectedMonth(m);
    setDateMenuOpen(false);
    const monthMap = {
      'October 2026': { month: 10, year: 2026 },
      'September 2026': { month: 9, year: 2026 },
      'August 2026': { month: 8, year: 2026 },
    };
    const params = monthMap[m] || { month: 10, year: 2026 };
    dispatch(fetchTransactionSummary(params));
  };

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    setNotificationsOpen(false);
    if (item.actionUrl) {
      navigate(item.actionUrl);
    }
  };

  const displayName = user?.name || 'Deep Sandilya';

  return (
    <header className="w-full bg-[#FAF6EE] pt-4 pb-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 select-none">
      {/* Mobile Menu & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-gray-200 text-[#0C2B35] hover:bg-gray-50"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search transactions, press Enter to view..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFFCF8] border border-gray-200/90 rounded-full focus:outline-none focus:ring-2 focus:ring-[#073746]/30 text-[#0B1D33] placeholder-gray-400 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell & Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full bg-white border border-gray-200/80 hover:bg-gray-50 cursor-pointer shadow-2xs transition-colors"
            title="View Notifications & Alerts"
            aria-expanded={notificationsOpen}
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell className="w-4 h-4 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-coral-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/90 py-0 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden text-xs">
              <div className="p-3.5 bg-peach-50/70 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#073746] text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-coral-500 text-white text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] text-teal-800 hover:text-teal-950 font-medium hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-gray-600">All caught up!</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">No active alerts or warnings</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((item) => {
                    const read = isRead(item.id);
                    let badgeColor = 'bg-blue-100 text-blue-700';
                    let IconComponent = Sparkles;
                    if (item.severity === 'danger') {
                      badgeColor = 'bg-red-100 text-red-700';
                      IconComponent = AlertTriangle;
                    } else if (item.severity === 'warning') {
                      badgeColor = 'bg-amber-100 text-amber-700';
                      IconComponent = PieChart;
                    } else if (item.type === 'goals') {
                      badgeColor = 'bg-emerald-100 text-emerald-700';
                      IconComponent = Target;
                    }

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 hover:bg-peach-50/50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !read ? 'bg-peach-50/20' : 'opacity-75'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${badgeColor}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className={`font-bold truncate ${!read ? 'text-[#073746]' : 'text-gray-600'}`}>
                              {item.title}
                            </p>
                            {!read && (
                              <span className="w-2 h-2 rounded-full bg-coral-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-gray-500 line-clamp-2 text-[11px] leading-relaxed">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2.5 bg-gray-50/80 border-t border-gray-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#073746] hover:text-coral-500 transition-colors"
                >
                  View all notifications &amp; alerts
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-white border border-gray-200/90 hover:border-gray-300 transition-colors shadow-2xs"
            aria-expanded={profileOpen}
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border border-emerald-100"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-300">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-bold text-[#0B1D33] leading-tight truncate max-w-[120px]">
                {displayName}
              </div>
              <div className="text-[10px] text-gray-400 leading-none mt-0.5">
                {user?.role === 'admin' ? 'Admin Plan' : 'Free Plan'}
              </div>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="font-bold text-gray-900 truncate">{displayName}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-peach-100 text-coral-600 font-bold text-[10px] uppercase">
                  {role || 'client'}
                </span>
              </div>

              {isAdmin && (
                <div className="py-1">
                  <Link
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-peach-50 hover:text-[#073746]"
                  >
                    <Shield className="w-4 h-4 text-coral-500" />
                    <span>Admin Console</span>
                  </Link>
                </div>
              )}

              <div className="py-1 border-t border-gray-100">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-peach-50 hover:text-[#073746]"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  to="/help"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-peach-50 hover:text-[#073746]"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>Help &amp; FAQ</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Month Selector Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setDateMenuOpen(!dateMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-semibold text-[#0B1D33] shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {dateMenuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 p-1 z-50 text-xs">
              {['October 2026', 'September 2026', 'August 2026'].map((m) => (
                <button
                  key={m}
                  onClick={() => handleMonthSelect(m)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg ${
                    selectedMonth === m ? 'bg-peach-100 text-[#073746] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
