import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './app/hooks.js';
import { initializeAuth } from './features/auth/authThunks.js';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ClientLayout from './layouts/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import DashboardPage from './pages/client/DashboardPage.jsx';
import TransactionsPage from './pages/client/TransactionsPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AICoachPage from './pages/client/AICoachPage.jsx';
import SettingsPage from './pages/client/SettingsPage.jsx';
import HelpSupportPage from './pages/client/HelpSupportPage.jsx';
import NotificationsPage from './pages/client/NotificationsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import PrivacyPage from './pages/public/PrivacyPage.jsx';
import TermsPage from './pages/public/TermsPage.jsx';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Attempt session restoration via HttpOnly cookie upon initial mount
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Landing Page & Legal */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Public Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
      </Route>

      {/* Protected Client Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ClientLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/ai-coach" element={<AICoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          {/* Functional Navigation Aliases */}
          <Route path="/budgets" element={<Navigate to="/ai-coach?tab=budgets" replace />} />
          <Route path="/goals" element={<Navigate to="/ai-coach?tab=goals" replace />} />
          <Route path="/simulator" element={<Navigate to="/ai-coach?tab=simulator" replace />} />
          <Route path="/insights" element={<Navigate to="/ai-coach?tab=actions" replace />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<RoleRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
