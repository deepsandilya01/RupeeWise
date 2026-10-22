import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleAuthNavigation = () => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleGetStartedNavigation = () => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF6EE]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/logo.png"
            alt="PaisaPilot AI Logo"
            className="w-9 h-9 object-contain rounded-full shadow-subtle group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-xl tracking-tight text-[#073746] group-hover:opacity-90 transition-opacity">
            RupeeWise <span className="text-[#073746] font-bold">AI</span>
          </span>
        </Link>


        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#0B1D33]/80">
          <button
            onClick={() => scrollToSection('product')}
            className="hover:text-[#073746] transition-colors"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-[#073746] transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#073746] transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-[#073746] transition-colors"
          >
            Pricing
          </button>

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="flex items-center gap-1 hover:text-[#073746] transition-colors"
            >
              <span>Resources</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  resourcesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {resourcesOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-52 bg-[#FFFCF8] rounded-2xl shadow-elevated border border-gray-200/60 p-2 z-50 text-xs text-[#0B1D33]"
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <Link
                  to="/blog"
                  onClick={() => setResourcesOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-peach-100/60 transition-colors font-medium text-[#073746]"
                >
                  Financial Literacy Blog
                </Link>
                <Link
                  to="/calculators"
                  onClick={() => setResourcesOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-peach-100/60 transition-colors font-medium text-[#073746]"
                >
                  SIP &amp; Budget Calculators
                </Link>
                <Link
                  to="/community"
                  onClick={() => setResourcesOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-peach-100/60 transition-colors font-medium text-[#073746]"
                >
                  Student Money Community
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={handleAuthNavigation}
            className="text-[14px] font-semibold text-[#0B1D33] px-4 py-2 hover:text-[#073746] transition-colors"
          >
            {isAuthenticated ? 'Dashboard' : 'Sign In'}
          </button>

          <button
            onClick={handleGetStartedNavigation}
            className="inline-flex items-center gap-2 bg-[#073746] hover:bg-[#0C2B35] text-white text-[14px] font-semibold px-5 py-2.5 rounded-full shadow-subtle hover:shadow-card transition-all active:translate-y-px"
          >
            <span>{isAuthenticated ? 'Open App' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#073746] hover:bg-peach-100/50 rounded-xl"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6EE] border-b border-gray-200 px-6 py-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#0B1D33]">
            <button
              onClick={() => scrollToSection('product')}
              className="text-left py-2 hover:text-[#073746]"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2 hover:text-[#073746]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 hover:text-[#073746]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left py-2 hover:text-[#073746]"
            >
              Pricing
            </button>
            <div className="pt-2 border-t border-gray-200/60 flex flex-col space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 py-1">Resources</span>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-1 text-[#073746] font-medium"
              >
                Financial Literacy Blog
              </Link>
              <Link
                to="/calculators"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-1 text-[#073746] font-medium"
              >
                SIP &amp; Budget Calculators
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-1 text-[#073746] font-medium"
              >
                Student Money Community
              </Link>
            </div>
          </nav>

          <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
            <button
              onClick={handleAuthNavigation}
              className="w-full text-center py-2.5 rounded-full border border-gray-300 font-semibold text-sm text-[#0B1D33]"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
            </button>
            <button
              onClick={handleGetStartedNavigation}
              className="w-full flex items-center justify-center gap-2 bg-[#073746] text-white py-2.5 rounded-full font-semibold text-sm shadow-sm"
            >
              <span>{isAuthenticated ? 'Open App' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
