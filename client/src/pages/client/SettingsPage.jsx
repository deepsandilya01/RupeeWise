import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Download,
  LogOut,
  CheckCircle2,
  Sliders,
  DollarSign,
  Smartphone,
  Save,
  KeyRound,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, role, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Local preferences state
  const [currency, setCurrency] = useState('INR (₹)');
  const [savingsTargetPercent, setSavingsTargetPercent] = useState('25');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('UPI');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);
  const [recommendationAlerts, setRecommendationAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportCsv = () => {
    window.location.href = '/transactions';
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1D33] tracking-tight">
            Account &amp; System Preferences
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal profile, security sessions, and financial tracking parameters.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">Preferences saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-100">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#0C2B35] text-white text-2xl font-bold flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-base font-extrabold text-[#0B1D33]">{user?.name}</h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{user?.email}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isAdmin
                ? 'bg-[#0C2B35] text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {role || 'client'} Account
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 text-gray-600">
              <span>Account ID</span>
              <span className="font-mono text-[11px] text-gray-400 truncate max-w-[140px]">
                {user?.id || 'mongodb-synced'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-gray-600">
              <span>Auth Provider</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Google Identity (GIS)
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-gray-600">
              <span>Session Policy</span>
              <span className="font-mono text-[11px] text-gray-500">HttpOnly Cookie</span>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Security Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Parameters */}
          <form onSubmit={handleSavePreferences} className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-5">
            <h2 className="text-base font-extrabold text-[#0B1D33] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Sliders className="w-4 h-4 text-[#0C2B35]" />
              <span>Financial Configuration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Primary Ledger Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs bg-[#FAF6EE] border border-gray-200 rounded-xl px-3 py-2 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C2B35]/20 font-semibold"
                >
                  <option value="INR (₹)">Indian Rupee — INR (₹)</option>
                  <option value="USD ($)" disabled>US Dollar — USD ($) [INR Recommended]</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">All analytics adhere to INR currency rules.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Target Monthly Savings Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="80"
                    value={savingsTargetPercent}
                    onChange={(e) => setSavingsTargetPercent(e.target.value)}
                    className="w-full text-xs bg-[#FAF6EE] border border-gray-200 rounded-xl px-3 py-2 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C2B35]/20 font-semibold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Used for Financial Wellness Score calibration.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Default Payment Method
                </label>
                <select
                  value={defaultPaymentMethod}
                  onChange={(e) => setDefaultPaymentMethod(e.target.value)}
                  className="w-full text-xs bg-[#FAF6EE] border border-gray-200 rounded-xl px-3 py-2 text-[#0B1D33] focus:outline-none focus:ring-2 focus:ring-[#0C2B35]/20 font-semibold"
                >
                  <option value="UPI">UPI (Unified Payments Interface)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Notification & Intelligence Toggles */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Intelligence &amp; Alerts
              </h3>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-bold text-[#0B1D33]">Category Budget Alerts</p>
                  <p className="text-[11px] text-gray-400">Warn when category spend reaches 80% or exceeds budget limit.</p>
                </div>
                <input
                  type="checkbox"
                  checked={budgetAlerts}
                  onChange={(e) => setBudgetAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0C2B35] accent-[#0C2B35] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-bold text-[#0B1D33]">Unusual Spending &amp; Duplicate Flags</p>
                  <p className="text-[11px] text-gray-400">Highlight expenses 2.5x higher than average and same-day duplicates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={anomalyAlerts}
                  onChange={(e) => setAnomalyAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0C2B35] accent-[#0C2B35] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-bold text-[#0B1D33]">Money Action Engine Recommendations</p>
                  <p className="text-[11px] text-gray-400">Receive proactive, data-grounded monthly savings opportunities.</p>
                </div>
                <input
                  type="checkbox"
                  checked={recommendationAlerts}
                  onChange={(e) => setRecommendationAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0C2B35] accent-[#0C2B35] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C2B35] text-white text-xs font-bold hover:bg-[#154352] transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>

          {/* Security & Data Portability Card */}
          <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-[#0B1D33] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-coral-500" />
              <span>Data Protection &amp; Security Assurance</span>
            </h2>

            <p className="text-xs text-gray-600 leading-relaxed">
              Your financial records are strictly isolated under <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">userId</code> constraints in MongoDB Atlas. RupeeWise never transmits raw transaction details to third parties or stores credentials in unencrypted browser storage.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#FAF6EE] text-[#0C2B35] border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                <span>View &amp; Export Transactions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
