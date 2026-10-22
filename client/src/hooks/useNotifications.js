import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector } from '../app/hooks.js';
import useAuth from './useAuth.js';

export const useNotifications = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id || 'guest';
  const storageKey = `rupeewise_read_notifications_${userId}`;

  const { insights, recommendations, budgets, goals } = useAppSelector((state) => state.ai);

  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Keep localStorage updated when readIds change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(readIds)));
    } catch {
      // safe fallback
    }
  }, [readIds, storageKey]);

  // Generate grounded notifications
  const notifications = useMemo(() => {
    const list = [];

    // 1. Budget Alerts
    (budgets || []).forEach((b, index) => {
      if (b.status === 'exceeded') {
        list.push({
          id: `budget-exceeded-${b.id || index}`,
          type: 'budget',
          severity: 'danger',
          title: `Budget Exceeded: ${b.category}`,
          message: `Spent ₹${Number(b.actualSpend || 0).toLocaleString('en-IN')} of ₹${Number(b.limit || 0).toLocaleString('en-IN')} (${b.percentConsumed}%).`,
          time: 'Active this month',
          actionUrl: '/ai-coach?tab=budgets',
        });
      } else if (b.status === 'warning') {
        list.push({
          id: `budget-warning-${b.id || index}`,
          type: 'budget',
          severity: 'warning',
          title: `Budget Alert: ${b.category}`,
          message: `${b.percentConsumed}% consumed of ₹${Number(b.limit || 0).toLocaleString('en-IN')} limit.`,
          time: 'Active this month',
          actionUrl: '/ai-coach?tab=budgets',
        });
      }
    });

    // 2. Spending Anomaly & MoM Spike Alerts
    (insights?.momComparisons || []).forEach((m, index) => {
      if (m.isIncrease && m.percentageChange >= 15) {
        list.push({
          id: `mom-spike-${m.category}-${index}`,
          type: 'ai',
          severity: 'warning',
          title: `Spending Surge: ${m.category} (+${m.percentageChange}%)`,
          message: `Outflows rose by ₹${Number(m.difference || 0).toLocaleString('en-IN')} compared with last month.`,
          time: 'Current period',
          actionUrl: '/ai-coach?tab=coach',
        });
      }
    });

    // 3. Action Recommendations
    (recommendations || []).forEach((rec, index) => {
      if (rec.status === 'active') {
        list.push({
          id: `rec-${rec.id || index}`,
          type: 'ai',
          severity: 'info',
          title: `AI Recommendation: ${rec.title}`,
          message: `${rec.suggestedAction} (Savings: ₹${Number(rec.monthlySavings || 0).toLocaleString('en-IN')}/mo).`,
          time: 'Pending review',
          actionUrl: '/ai-coach?tab=actions',
        });
      }
    });

    // 4. Goals Milestones
    (goals || []).forEach((g, index) => {
      list.push({
        id: `goal-${g.id || index}`,
        type: 'goals',
        severity: 'success',
        title: `Goal Progress: ${g.name}`,
        message: `${g.progressPercentage}% completed (₹${Number(g.currentAmount || 0).toLocaleString('en-IN')} saved).`,
        time: 'Ongoing tracking',
        actionUrl: '/ai-coach?tab=goals',
      });
    });

    // Default welcome alert if brand new user has no records yet
    if (list.length === 0) {
      list.push({
        id: 'welcome-system',
        type: 'ai',
        severity: 'info',
        title: 'Welcome to RupeeWise AI!',
        message: 'Record your first transaction to unlock automated budget warnings and AI spending alerts.',
        time: 'Just now',
        actionUrl: '/transactions',
      });
    }

    return list;
  }, [budgets, insights, recommendations, goals]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.has(n.id)).length;
  }, [notifications, readIds]);

  const toggleRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }, [notifications]);

  const isRead = useCallback((id) => readIds.has(id), [readIds]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    toggleRead,
    isRead,
  };
};

export default useNotifications;
