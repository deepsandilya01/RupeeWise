import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const RoleRoute = ({ requiredRole = 'admin' }) => {
  const { user, role, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-card text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-charcoal-900 mb-2">Restricted Access</h2>
          <p className="text-sm text-charcoal-600 mb-6">
            Your current account role is <span className="font-semibold text-charcoal-800 uppercase px-2 py-0.5 bg-gray-100 rounded text-xs">{role}</span>.
            Access to this area requires <span className="font-semibold text-forest-800 uppercase px-2 py-0.5 bg-forest-50 rounded text-xs">{requiredRole}</span> privileges.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-forest-800 text-white rounded-xl font-medium text-sm hover:bg-forest-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Client Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleRoute;
