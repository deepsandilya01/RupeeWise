import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Database,
  Radio,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import authService from '../../services/authService.js';

export const LoginPage = () => {
  const { isAuthenticated, role, isInitialized, login, loginDemo, isLoading, error, clearError } =
    useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [clientError, setClientError] = useState(null);
  const [demoLoadingRole, setDemoLoadingRole] = useState(null);
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
      clearError();
    };
  }, [clearError]);

  // Redirect if already authenticated
  if (isInitialized && isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setClientError(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setClientError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setClientError('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setClientError('Please enter your password.');
      return;
    }

    const result = await login({ email: trimmedEmail, password });
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleDemoAccess = async (targetRole) => {
    setClientError(null);
    clearError();
    setDemoLoadingRole(targetRole);

    try {
      const result = await loginDemo(targetRole);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } finally {
      setDemoLoadingRole(null);
    }
  };

  const activeError = clientError || error;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4">
      <Card className="bg-[#FFFCF8] p-7 sm:p-10 border border-[#EBE4D8] rounded-3xl shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#FAF6EE] border border-[#E7DFD0] mb-1 shadow-xs">
            <img
              src="/assets/logo.png"
              alt="RupeeWise"
              className="w-11 h-11 object-contain rounded-full"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#073746]">
            Welcome back
          </h1>
          <p className="text-sm text-[#0B1D33]/70 font-medium">
            Your smarter financial journey continues here.
          </p>
        </div>

        {/* Global Error Banner */}
        {activeError && (
          <div className="flex items-start gap-3 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl text-red-800 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-semibold block mb-0.5">Authentication notice</span>
              {activeError}
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B1D33]/80"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#D9D1C2] focus:border-[#073746] focus:ring-2 focus:ring-[#073746]/10 rounded-xl text-sm text-[#0B1D33] placeholder-gray-400 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B1D33]/80"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-white border border-[#D9D1C2] focus:border-[#073746] focus:ring-2 focus:ring-[#073746]/10 rounded-xl text-sm text-[#0B1D33] placeholder-gray-400 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#073746] focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Security session */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#0B1D33]/80 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#073746] focus:ring-[#073746] border-gray-300"
              />
              <span>Remember this session for 7 days</span>
            </label>
            <span className="text-[11px] text-gray-400 italic">HttpOnly Encrypted</span>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || Boolean(demoLoadingRole)}
            className="w-full py-3.5 px-4 bg-[#073746] hover:bg-[#0C2B35] text-white font-semibold rounded-xl text-sm shadow-subtle hover:shadow-card transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 active:scale-[0.99]"
          >
            {isLoading && !demoLoadingRole ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#E5DEC9]" />
          <span className="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-charcoal-400 bg-[#FFFCF8] px-2 text-[#0B1D33]/60">
            OR CONTINUE WITH
          </span>
          <div className="flex-grow border-t border-[#E5DEC9]" />
        </div>

        {/* Google Authentication */}
        <div>
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

        {/* Demo Access Panel */}
        <div className="bg-gradient-to-br from-[#FFF5ED] to-[#FFEFE6] border border-[#FFD9C6] rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A03525]">
              <Sparkles className="w-4 h-4 text-[#FF624F]" />
              <span>Explore Demo Environments</span>
            </div>
            <span className="text-[10px] font-semibold bg-[#FF624F]/10 text-[#FF624F] px-2.5 py-0.5 rounded-full">
              Instant Access
            </span>
          </div>

          <p className="text-xs text-[#0B1D33]/70 leading-relaxed text-left">
            Experience RupeeWise instantly with pre-seeded sample data without entering any personal credentials.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Demo Client Access */}
            <button
              type="button"
              onClick={() => handleDemoAccess('client')}
              disabled={isLoading || Boolean(demoLoadingRole)}
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#073746] border border-[#E3D7C5] font-semibold text-xs shadow-xs hover:shadow-subtle transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {demoLoadingRole === 'client' ? (
                <span className="w-3.5 h-3.5 border-2 border-[#073746] border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-[#073746]" />
              )}
              <span>Explore User Demo</span>
            </button>

            {/* Demo Admin Access */}
            <button
              type="button"
              onClick={() => handleDemoAccess('admin')}
              disabled={isLoading || Boolean(demoLoadingRole)}
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#073746] border border-[#E3D7C5] font-semibold text-xs shadow-xs hover:shadow-subtle transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {demoLoadingRole === 'admin' ? (
                <span className="w-3.5 h-3.5 border-2 border-[#073746] border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-[#073746]" />
              )}
              <span>Explore Admin Demo</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#0B1D33]/60 pt-1 justify-center">
            <Lock className="w-3 h-3 text-[#FF624F]" />
            <span>Server-authorized sandbox sessions with isolated demonstration records.</span>
          </div>
        </div>

        {/* Link to Register */}
        <div className="pt-2 text-center text-xs text-[#0B1D33]/70">
          <span>Don&apos;t have an account yet? </span>
          <Link
            to="/register"
            className="font-bold text-[#073746] hover:text-[#FA6955] underline underline-offset-2 transition-colors ml-1"
          >
            Create an account
          </Link>
        </div>

        {/* Security & System Readiness Status */}
        <div className="pt-3 border-t border-[#EBE4D8] flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#3D8569]" />
            <span>Bank-Grade Encryption</span>
          </div>

          <div className="flex items-center gap-1.5">
            {healthStatus?.database?.connected ? (
              <Badge variant="success" size="sm" className="text-[10px] font-normal py-0.5">
                <Database className="w-2.5 h-2.5 inline mr-1" /> System Ready
              </Badge>
            ) : (
              <Badge variant="warning" size="sm" className="text-[10px] font-normal py-0.5">
                Connecting Database...
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
