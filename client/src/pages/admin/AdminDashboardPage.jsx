import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import authService from '../../services/authService.js';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
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
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overviewRes, healthRes] = await Promise.all([
        authService.getAdminOverview(),
        authService.checkHealth(),
      ]);

      if (overviewRes?.success) {
        setAdminData(overviewRes.data);
      }
      if (healthRes?.success) {
        setHealthData(healthRes);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin overview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
              Administrative Control Console
            </h1>
            <Badge variant="primary" size="sm" className="bg-forest-800 text-white border-forest-900">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Admin Verified
            </Badge>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Logged in as <span className="font-semibold text-charcoal-700">{user?.email}</span> &bull; Role-Based Access Control verified via server allowlist.
          </p>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Metrics
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Failed to load admin data" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Real Server-Provided Admin Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={isLoading ? '...' : adminData?.metrics?.totalUsers ?? '0'}
          subtext="Persisted in MongoDB"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Client Accounts"
          value={isLoading ? '...' : adminData?.metrics?.clientCount ?? '0'}
          subtext="Standard RBAC users"
          icon={<UserCheck className="w-5 h-5 text-emerald-700" />}
        />
        <StatCard
          title="Admin Accounts"
          value={isLoading ? '...' : adminData?.metrics?.adminCount ?? '0'}
          subtext="Configured in ADMIN_EMAILS"
          icon={<ShieldCheck className="w-5 h-5 text-forest-800" />}
        />
        <StatCard
          title="MongoDB Atlas Status"
          value={healthData?.database?.connected ? 'Connected' : 'Disconnected'}
          subtext={healthData?.database?.state ? `State: ${healthData.database.state}` : 'Checking...'}
          trend={healthData?.database?.connected ? 'Online & Persistent' : 'Unavailable'}
          trendPositive={healthData?.database?.connected}
          icon={<Database className="w-5 h-5 text-forest-800" />}
        />
      </div>

      {/* System Status & Architecture Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Diagnostics Card */}
        <Card
          className="lg:col-span-1"
          header={<h2 className="text-sm font-bold text-charcoal-900">System Diagnostics</h2>}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-charcoal-600">Backend Server</span>
              <Badge variant="success" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Active (Port 5000)
              </Badge>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-charcoal-600">MongoDB Persistence</span>
              <Badge
                variant={healthData?.database?.connected ? 'success' : 'danger'}
                size="sm"
              >
                {healthData?.database?.connected ? 'Atlas Ready' : 'Disconnected'}
              </Badge>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-charcoal-600">Google OAuth Identity</span>
              <Badge
                variant={healthData?.services?.googleAuth ? 'success' : 'warning'}
                size="sm"
              >
                {healthData?.services?.googleAuth ? 'Configured' : 'Needs Client ID'}
              </Badge>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-charcoal-600">Server Environment</span>
              <span className="font-mono text-charcoal-800 font-semibold uppercase text-[11px]">
                {healthData?.environment || 'development'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-charcoal-600">Server Uptime</span>
              <span className="font-mono text-charcoal-800 font-semibold text-[11px]">
                {healthData?.uptimeSeconds ? `${healthData.uptimeSeconds} seconds` : '...'}
              </span>
            </div>
          </div>
        </Card>

        {/* Live User Registry from Repository */}
        <Card
          className="lg:col-span-2"
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-charcoal-900">User Registry &amp; RBAC Directory</h2>
              <span className="text-xs text-charcoal-400">Server Verified</span>
            </div>
          }
        >
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner label="Querying user repository..." />
            </div>
          ) : !adminData?.recentUsers || adminData.recentUsers.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-500">
              No registered users in the database yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-charcoal-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Assigned Role</th>
                    <th className="py-2.5 px-3 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminData.recentUsers.map((regUser) => (
                    <tr key={regUser.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-charcoal-900">
                        <div className="flex items-center gap-2">
                          {regUser.picture ? (
                            <img
                              src={regUser.picture}
                              alt=""
                              className="w-6 h-6 rounded-full border border-gray-200"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-forest-800 text-white text-[10px] flex items-center justify-center font-bold">
                              {regUser.name.charAt(0)}
                            </div>
                          )}
                          <span>{regUser.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-charcoal-600 font-mono text-[11px]">
                        {regUser.email}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={regUser.role === 'admin' ? 'primary' : 'default'}
                          size="sm"
                          className="capitalize"
                        >
                          {regUser.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right text-charcoal-400 text-[11px]">
                        {new Date(regUser.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* RBAC Security Policy Notice */}
      <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-100 text-xs text-forest-900 flex items-start gap-3">
        <KeyRound className="w-4 h-4 text-forest-800 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold">Strict Server-Enforced RBAC:</span> Admin access is validated against the server-side <code className="bg-white px-1.5 py-0.5 rounded border border-forest-200 font-mono text-[11px]">ADMIN_EMAILS</code> environment variable. Ordinary users cannot self-promote, and if an admin email is removed from the allowlist, their privileges are immediately revoked on the next request.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
