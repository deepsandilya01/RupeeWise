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
import DashboardPage from './pages/client/DashboardPage.jsx';
import TransactionsPage from './pages/client/TransactionsPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Attempt session restoration via HttpOnly cookie upon initial mount
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />


      {/* Public Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Client Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ClientLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
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
