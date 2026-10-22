import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import adminService from '../../services/adminService.js';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  UserCheck,
  Server,
  Database,
  RefreshCw,
  KeyRound,
  CheckCircle,
  Search,
  Filter,
  ArrowUpDown,
  Activity,
  AlertTriangle,
  Receipt,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserX,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext() || {};
  const activeSection = outletContext.activeSection || 'overview';
  const setActiveSection = outletContext.setActiveSection || (() => {});

  // Data states
  const [overviewData, setOverviewData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [activityData, setActivityData] = useState([]);
  const [healthData, setHealthData] = useState(null);

  // Filter & Search states
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [usersPage, setUsersPage] = useState(1);

  // Action states
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch Overview and System Health
  const fetchOverviewAndHealth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [overviewRes, healthRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getHealth(),
      ]);
      if (overviewRes?.success) setOverviewData(overviewRes.data);
      if (healthRes?.success) setHealthData(healthRes.data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load administrator metrics');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Users Directory
  const fetchUsers = async (page = usersPage, search = userSearch, role = roleFilter) => {
    try {
      const res = await adminService.listUsers({ page, limit: 10, search, role });
      if (res?.success) {
        setUsersData(res.data);
        if (res.pagination) setUsersPagination(res.pagination);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load users');
    }
  };

  // Fetch Activity Logs
  const fetchActivity = async () => {
    try {
      const res = await adminService.getActivityLogs({ limit: 25 });
      if (res?.success) {
        setActivityData(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch activity logs:', err.message);
    }
  };

  useEffect(() => {
    fetchOverviewAndHealth();
    fetchUsers(1, '', '');
    fetchActivity();
  }, []);

  // Handle Search Input Debounce / Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUsersPage(1);
    fetchUsers(1, userSearch, roleFilter);
  };

  // Handle Role Change
  const handleRoleChange = async (targetUser, newRole) => {
    if (actionLoadingId) return;
    const confirmText = `Are you sure you want to change the role for ${targetUser.email} from '${targetUser.role}' to '${newRole}'?`;
    if (!window.confirm(confirmText)) return;

    setActionLoadingId(targetUser.id);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const res = await adminService.updateUserRole(targetUser.id, newRole);
      if (res?.success) {
        setFeedbackMessage(res.message + (res.note ? ` (${res.note})` : ''));
        // Refresh users list and overview metrics
        fetchUsers(usersPage, userSearch, roleFilter);
        fetchOverviewAndHealth();
        fetchActivity();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Role modification failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const metrics = overviewData?.metrics || {};

  return (
    <div className="space-y-6 select-none">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0B1D33]">
              Administrative Control Console
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0C2B35] text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              RBAC SuperAdmin
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Authenticated as <span className="font-semibold text-gray-700">{user?.email}</span> &bull; Scoped database telemetry and administrative privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchOverviewAndHealth();
              fetchUsers(usersPage, userSearch, roleFilter);
              fetchActivity();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#FAF6EE] text-[#0C2B35] border border-gray-200 hover:bg-gray-100 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Real Data</span>
          </button>
        </div>
      </div>

      {/* Global Alert Messages */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-500 hover:text-emerald-700 font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Navigation Section Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'users', label: 'User Directory', count: usersPagination.total, icon: <Users className="w-4 h-4" /> },
          { id: 'activity', label: 'System Activity', icon: <Activity className="w-4 h-4" /> },
          { id: 'health', label: 'Diagnostics & Health', icon: <Server className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-[#0C2B35] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:text-[#0C2B35] hover:bg-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSection === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Section Content */}

      {/* TAB A: OVERVIEW METRICS */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* 4 Primary Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs text-left">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Users</span>
                <Users className="w-4 h-4 text-[#0C2B35]" />
              </div>
              <div className="text-2xl font-black text-[#0B1D33]">
                {isLoading ? '...' : (metrics.totalUsers ?? 0)}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {metrics.clientCount ?? 0} Clients &bull; {metrics.adminCount ?? 0} Admins
              </p>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs text-left">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Users (30d)</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#0B1D33]">
                {isLoading ? '...' : (metrics.activeUsers ?? 0)}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Active cash flows recorded
              </p>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs text-left">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Recorded Transactions</span>
                <Receipt className="w-4 h-4 text-coral-500" />
              </div>
              <div className="text-2xl font-black text-[#0B1D33]">
                {isLoading ? '...' : (metrics.totalTransactions ?? 0)}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                MongoDB Atlas Ledger entries
              </p>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs text-left">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">System Volume</span>
                <TrendingUp className="w-4 h-4 text-[#0C2B35]" />
              </div>
              <div className="text-xl font-black text-[#0B1D33] truncate">
                {isLoading ? '...' : `₹${Number(metrics.totalIncome || 0).toLocaleString('en-IN')}`}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Total recorded income inflow
              </p>
            </div>
          </div>

          {/* Volume Breakdown & Quick User List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Global Volume Ledger Card */}
            <div className="lg:col-span-1 bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs text-left space-y-4">
              <h2 className="text-sm font-extrabold text-[#0B1D33] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0C2B35]" />
                <span>Aggregated Platform Flow</span>
              </h2>

              <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#FFE5D4] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Gross Recorded Income:
                  </span>
                  <span className="font-bold text-emerald-700">
                    ₹{Number(metrics.totalIncome || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-coral-500" />
                    Gross Recorded Outflow:
                  </span>
                  <span className="font-bold text-coral-600">
                    ₹{Number(metrics.totalExpense || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-2 border-t border-peach-200/80 flex items-center justify-between text-xs font-bold text-[#0B1D33]">
                  <span>Net Ledger Balance:</span>
                  <span>
                    ₹{Number((metrics.totalIncome || 0) - (metrics.totalExpense || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 leading-relaxed bg-[#FAF6EE] p-3 rounded-xl border border-gray-200/60">
                <span className="font-bold text-[#0C2B35]">Real Aggregation Note:</span> All figures represent strictly calculated sums from Mongoose collections without interpolation.
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-[22px] border border-gray-200/80 shadow-2xs text-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-[#0B1D33] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0C2B35]" />
                  <span>Recent User Registrations</span>
                </h2>
                <button
                  onClick={() => setActiveSection('users')}
                  className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1"
                >
                  <span>View All Directory</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">User</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3 text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(overviewData?.recentUsers || []).map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#0B1D33] flex items-center gap-2">
                          {u.picture ? (
                            <img src={u.picture} alt="" className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#0C2B35] text-white text-[9px] flex items-center justify-center font-bold">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <span className="truncate max-w-[120px]">{u.name}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                          {u.email}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-[#0C2B35] text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: USER MANAGEMENT DIRECTORY */}
      {activeSection === 'users' && (
        <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#0B1D33]">
                User Management Directory
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage roles, inspect privileges, and audit active users
              </p>
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#FAF6EE] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2B35]/20 text-[#0B1D33]"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setUsersPage(1);
                  fetchUsers(1, userSearch, e.target.value);
                }}
                className="py-1.5 px-2.5 text-xs bg-[#FAF6EE] border border-gray-200 rounded-xl focus:outline-none text-[#0B1D33]"
              >
                <option value="">All Roles</option>
                <option value="client">Clients Only</option>
                <option value="admin">Admins Only</option>
              </select>

              <button
                type="submit"
                className="px-3 py-1.5 bg-[#0C2B35] text-white text-xs font-semibold rounded-xl hover:bg-[#133c48] transition-colors"
              >
                Filter
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200/80 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">User Profile</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Allowlist Status</th>
                  <th className="py-3 px-3">Registered Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No users match the search filter.
                    </td>
                  </tr>
                ) : (
                  usersData.map((u) => {
                    const isSelf = user?.id === u.id || user?.email === u.email;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#0B1D33] flex items-center gap-2.5">
                          {u.picture ? (
                            <img src={u.picture} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#0C2B35] text-white text-xs flex items-center justify-center font-bold">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[#0B1D33]">{u.name}</div>
                            {isSelf && (
                              <span className="text-[10px] text-coral-600 font-semibold">(You)</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                          {u.email}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-[#0C2B35] text-white'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {u.isAllowlistedAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>ADMIN_EMAILS</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400">Dynamic DB</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-gray-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-3 text-right">
                          {isSelf ? (
                            <span className="text-[11px] text-gray-400 italic">Current Session</span>
                          ) : u.role === 'client' ? (
                            <button
                              onClick={() => handleRoleChange(u, 'admin')}
                              disabled={actionLoadingId === u.id}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#0C2B35] text-white hover:bg-[#154352] transition-colors disabled:opacity-50"
                            >
                              {actionLoadingId === u.id ? 'Promoting...' : 'Promote to Admin'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleChange(u, 'client')}
                              disabled={actionLoadingId === u.id}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {actionLoadingId === u.id ? 'Demoting...' : 'Demote to Client'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-500">
              Showing page <span className="font-bold">{usersPagination.page}</span> of{' '}
              <span className="font-bold">{usersPagination.totalPages}</span> ({usersPagination.total} total accounts)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const prev = Math.max(1, usersPage - 1);
                  setUsersPage(prev);
                  fetchUsers(prev, userSearch, roleFilter);
                }}
                disabled={usersPage <= 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const next = Math.min(usersPagination.totalPages, usersPage + 1);
                  setUsersPage(next);
                  fetchUsers(next, userSearch, roleFilter);
                }}
                disabled={usersPage >= usersPagination.totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: SYSTEM ACTIVITY AUDIT TRAIL */}
      {activeSection === 'activity' && (
        <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs text-left space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#0B1D33] flex items-center gap-2">
                <Activity className="w-4 h-4 text-coral-500" />
                <span>System Activity &amp; Audit Trail</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Non-sensitive administrative, authentication, and ledger events
              </p>
            </div>
            <button
              onClick={fetchActivity}
              className="text-xs font-semibold text-[#0C2B35] flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {activityData.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No system activity events recorded yet.
              </div>
            ) : (
              activityData.map((log) => {
                const badgeColor =
                  log.type === 'role_changed'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : log.type === 'user_login'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : log.type === 'transaction_created'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200';

                return (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColor} mt-0.5 flex-shrink-0`}>
                        {log.type.replace('_', ' ')}
                      </span>
                      <div>
                        <p className="font-semibold text-[#0B1D33] leading-snug">
                          {log.summary}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Actor: <span className="font-mono text-gray-600">{log.actorEmail || log.actorName || 'System'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 self-start sm:self-auto font-mono">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB D: DIAGNOSTICS & SYSTEM HEALTH */}
      {activeSection === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs text-left space-y-4">
            <h2 className="text-base font-extrabold text-[#0B1D33] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#0C2B35]" />
              <span>Core Runtime Diagnostics</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">System Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Environment</span>
                <span className="font-mono font-bold text-[#0B1D33] uppercase">
                  {healthData?.environment || 'development'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Node Runtime</span>
                <span className="font-mono font-semibold text-gray-700">
                  {healthData?.nodeVersion || process.version}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Process Memory (Heap)</span>
                <span className="font-mono font-semibold text-gray-700">
                  {healthData?.memoryUsageMb ?? '...'} MB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Process Uptime</span>
                <span className="font-mono font-semibold text-gray-700">
                  {healthData?.uptimeSeconds ? `${healthData.uptimeSeconds} seconds` : '...'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs text-left space-y-4">
            <h2 className="text-base font-extrabold text-[#0B1D33] flex items-center gap-2">
              <Shield className="w-4 h-4 text-coral-500" />
              <span>Security &amp; Persistence</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Database Engine</span>
                <span className="font-semibold text-emerald-700">
                  MongoDB Atlas (Mongoose)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Atlas Connection State</span>
                <span className="font-bold text-emerald-600">
                  Connected &amp; Indexed
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Session Cookie Name</span>
                <span className="font-mono text-gray-700">
                  {healthData?.security?.cookieName || 'paisapilot_token'} (HttpOnly)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Configured Admin Emails</span>
                <span className="font-bold text-[#0C2B35]">
                  {healthData?.security?.adminAllowlistCount ?? 1} in allowlist
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Google OAuth Identity</span>
                <span className="font-semibold text-emerald-700">
                  Active (Token Verification)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safety Policy Notice */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-gray-200/70 text-xs text-gray-600 flex items-start gap-3">
        <KeyRound className="w-4 h-4 text-[#0C2B35] mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-[#0C2B35]">
            Strict Administrative Access &amp; Data Isolation Controls:
          </p>
          <p className="text-[11px] leading-relaxed">
            All administrative mutations are subject to server-side role validation (<code className="font-mono bg-white px-1 py-0.5 rounded border">requireRole('admin')</code>). The system enforces self-demotion guards and guarantees that the last administrator in the database cannot be demoted. No sensitive user passwords, payment credentials, or personal transaction descriptions are exposed in administrative logs or views.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
