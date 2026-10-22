import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/hooks.js';
import { fetchAIInsights, fetchRecommendations, fetchBudgets, fetchGoals } from '../../features/ai/aiThunks.js';
import { useNavigate } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications.js';
import {
  Bell,
  AlertTriangle,
  Sparkles,
  Target,
  PieChart,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Trash2,
} from 'lucide-react';

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead, toggleRead, isRead } = useNotifications();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'budget' | 'ai' | 'goals'

  useEffect(() => {
    dispatch(fetchAIInsights());
    dispatch(fetchRecommendations());
    dispatch(fetchBudgets());
    dispatch(fetchGoals());
  }, [dispatch]);

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-[22px] border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-[#0B1D33] tracking-tight">
              Notifications &amp; Financial Alerts
            </h1>
            <span className="w-5 h-5 rounded-full bg-coral-500 text-white text-[11px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time triggers based on your actual budget status, unusual spending, and goal milestones.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#FAF6EE] text-[#0C2B35] border border-gray-200 hover:bg-gray-100 transition-colors self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'all', label: 'All Alerts', icon: <Bell className="w-3.5 h-3.5" /> },
          { id: 'budget', label: 'Budget Thresholds', icon: <PieChart className="w-3.5 h-3.5" /> },
          { id: 'ai', label: 'AI Action Engine', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'goals', label: 'Savings Goals', icon: <Target className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              filterType === tab.id
                ? 'bg-[#0C2B35] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:text-[#0C2B35] hover:bg-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-8 rounded-[22px] border border-gray-200/80 text-center text-xs text-gray-400">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const read = isRead(n.id);
            const severityBg =
              n.severity === 'danger'
                ? 'bg-red-50 text-red-700 border-red-200'
                : n.severity === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : n.severity === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-blue-50 text-blue-800 border-blue-200';

            return (
              <div
                key={n.id}
                className={`p-4 sm:p-5 rounded-[20px] bg-white border transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  read ? 'border-gray-200/60 opacity-70' : 'border-[#FFE5D4] bg-[#FFFDFC]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${severityBg}`}>
                    {n.type === 'budget' && <PieChart className="w-4 h-4" />}
                    {n.type === 'ai' && <Sparkles className="w-4 h-4" />}
                    {n.type === 'goals' && <Target className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs sm:text-sm font-bold text-[#0B1D33]">{n.title}</h2>
                      {!read && (
                        <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-gray-400 block pt-0.5">
                      {n.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => navigate(n.actionUrl)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0C2B35] text-white hover:bg-[#154352] transition-colors"
                  >
                    <span>{n.actionLabel || 'View Details'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => toggleRead(n.id)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                    title={read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
