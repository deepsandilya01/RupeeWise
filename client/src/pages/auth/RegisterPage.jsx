import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Database,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import authService from '../../services/authService.js';

export const RegisterPage = () => {
  const { isAuthenticated, role, isInitialized, register, isLoading, error, clearError } =
    useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [clientError, setClientError] = useState(null);
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

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setClientError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setClientError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setClientError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setClientError('Passwords do not match. Please verify your confirmation password.');
      return;
    }
    if (!agreeTerms) {
      setClientError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    const result = await register({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    if (result.success) {
      toast.success(`Account created successfully! Welcome to RupeeWise, ${result.user?.name || trimmedName}!`);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.error || 'Registration failed. Please try again.');
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
            Create your account
          </h1>
          <p className="text-sm text-[#0B1D33]/70 font-medium">
            Build better money habits, one step at a time.
          </p>
        </div>

        {/* Global Error Notice */}
        {activeError && (
          <div className="flex items-start gap-3 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl text-red-800 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-semibold block mb-0.5">Registration notice</span>
              {activeError}
            </div>
          </div>
        )}

        {/* Sign-Up Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-[#0B1D33]/80"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Deep Sandilya"
                required
                autoComplete="name"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#D9D1C2] focus:border-[#073746] focus:ring-2 focus:ring-[#073746]/10 rounded-xl text-sm text-[#0B1D33] placeholder-gray-400 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Password & Confirm Password in responsive 2-column or stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B1D33]/80"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#D9D1C2] focus:border-[#073746] focus:ring-2 focus:ring-[#073746]/10 rounded-xl text-sm text-[#0B1D33] placeholder-gray-400 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#073746] focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B1D33]/80"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#D9D1C2] focus:border-[#073746] focus:ring-2 focus:ring-[#073746]/10 rounded-xl text-sm text-[#0B1D33] placeholder-gray-400 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#073746] focus:outline-none transition-colors"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Inline password match hint */}
          {confirmPassword.length > 0 && (
            <div className="text-left text-xs">
              {password === confirmPassword ? (
                <span className="text-[#3D8569] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              )}
            </div>
          )}

          {/* Terms checkbox */}
          <div className="text-left pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#0B1D33]/80 leading-relaxed">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#073746] focus:ring-[#073746] border-gray-300 flex-shrink-0"
              />
              <span>
                I agree to the RupeeWise{' '}
                <span className="font-semibold text-[#073746]">Terms of Service</span> and{' '}
                <span className="font-semibold text-[#073746]">Privacy Policy</span>.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#073746] hover:bg-[#0C2B35] text-white font-semibold rounded-xl text-sm shadow-subtle hover:shadow-card transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#E5DEC9]" />
          <span className="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-charcoal-400 bg-[#FFFCF8] px-2 text-[#0B1D33]/60">
            OR REGISTER WITH
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

        {/* Link to Login */}
        <div className="pt-2 text-center text-xs text-[#0B1D33]/70">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-[#073746] hover:text-[#FA6955] underline underline-offset-2 transition-colors ml-1"
          >
            Sign in
          </Link>
        </div>

        {/* Security badges */}
        <div className="pt-3 border-t border-[#EBE4D8] flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#3D8569]" />
            <span>Encrypted Credentials</span>
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

export default RegisterPage;
