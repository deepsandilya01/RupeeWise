import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const location = useLocation();

  if (!isInitialized || (isLoading && !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shadow-subtle">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-forest-800">
            PaisaPilot <span className="text-forest-600 font-semibold text-lg">AI</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 text-charcoal-600 text-sm">
          <div className="w-4 h-4 border-2 border-forest-800 border-t-transparent rounded-full animate-spin" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
