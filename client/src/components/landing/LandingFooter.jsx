import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-gray-200/80 bg-[#F7F3EB] text-[#0B1D33] text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 items-start">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/assets/logo.png"
                alt="RupeeWise AI Logo"
                className="w-9 h-9 object-contain rounded-full shadow-subtle"
              />
              <span className="font-extrabold text-xl tracking-tight text-[#073746]">
                RupeeWise <span className="text-[#073746] font-bold">AI</span>
              </span>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-sm text-xs">
              Intelligent personal finance platform engineered to help young professionals and students track cashflow, optimize expenses, simulate future wealth, and achieve financial clarity.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-3 py-1.5 rounded-xl max-w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Bank-grade 256-bit AES Encryption &amp; Private Data Isolation</span>
            </div>
          </div>

          {/* Col 3: Product Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#073746]">
              Platform
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('product')}
                  className="hover:text-[#073746] transition-colors"
                >
                  Product Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-[#073746] transition-colors"
                >
                  Features &amp; Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-[#073746] transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-[#073746] transition-colors"
                >
                  Plans &amp; Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Intelligent Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#073746]">
              Features
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li>
                <Link to="/ai-coach?tab=coach" className="hover:text-[#073746] transition-colors">
                  AI Money Coach
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="hover:text-[#073746] transition-colors">
                  Transaction Ledger
                </Link>
              </li>
              <li>
                <Link to="/ai-coach?tab=simulator" className="hover:text-[#073746] transition-colors">
                  What-If Simulator
                </Link>
              </li>
              <li>
                <Link to="/ai-coach?tab=budgets" className="hover:text-[#073746] transition-colors">
                  Smart Budgets &amp; Radar
                </Link>
              </li>
              <li>
                <Link to="/ai-coach?tab=goals" className="hover:text-[#073746] transition-colors">
                  Savings Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#073746]">
              Trust &amp; Security
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li>
                <Link to="/privacy" className="hover:text-[#073746] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#073746] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[#073746] transition-colors">
                  Help &amp; Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#073746] transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#073746] transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-12 pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>
            RupeeWise AI &copy; {currentYear}. All financial computations performed server-side with strict user data isolation.
          </p>

          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1 text-[#073746] font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 Verified</span>
            </span>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-gray-700">Privacy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
