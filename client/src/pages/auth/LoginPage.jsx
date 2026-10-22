import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import authService from '../../services/authService.js';
import { ShieldCheck, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { isAuthenticated, role, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    let isMounted = true;
    authService
      .checkHealth()
      .then((data) => {
        if (isMounted) setHealthStatus(data);
      })
      .catch(() => {
        if (isMounted) setHealthStatus({ success: false, database: { connected: false } });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isInitialized && isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-8 sm:p-10 border border-gray-200/80 shadow-card">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-800 text-white font-bold text-2xl shadow-subtle mb-4">
            ₹
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-forest-800">
            PaisaPilot <span className="text-forest-600 font-semibold text-xl">AI</span>
          </h1>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Track smarter. Spend better. Save faster.
          </p>
          <p className="mt-3 text-xs text-charcoal-600 leading-relaxed max-w-xs mx-auto">
            Your intelligent personal finance co-pilot powered by AI budgeting and automated cashflow insights.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mb-6 bg-forest-50/70 border border-forest-100 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-forest-900 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
            <span>AI Automated Spending Insights</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-forest-900 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
            <span>Bank-Grade HttpOnly Cookie Sessions</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-forest-900 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
            <span>Role-Based Access Control (Client &amp; Admin)</span>
          </div>
        </div>

        {/* Sign In Action */}
        <div className="space-y-4">
          <div className="text-center text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
            Sign in to continue
          </div>

          <GoogleSignInButton
            onSuccess={(user) => {
              if (user.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/dashboard');
              }
            }}
          />
        </div>

        {/* Privacy & Security Note */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-charcoal-500">
            <Lock className="w-3.5 h-3.5 text-forest-700" />
            <span>Protected by Google Identity Services &amp; HttpOnly Cookies</span>
          </div>
          <p className="text-[10px] text-charcoal-400 leading-tight">
            No authentication tokens are stored in browser localStorage or JavaScript state.
          </p>

          {/* System status pill */}
          <div className="pt-2 flex justify-center">
            {healthStatus?.database?.connected ? (
              <Badge variant="success" size="sm" className="text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                MongoDB Atlas Ready
              </Badge>
            ) : healthStatus ? (
              <Badge variant="warning" size="sm" className="text-[10px]">
                MongoDB Not Connected (Configuration Required)
              </Badge>
            ) : (
              <Badge variant="default" size="sm" className="text-[10px]">
                Checking backend status...
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
