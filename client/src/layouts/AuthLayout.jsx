import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Decorative peach ambient glows matching RupeeWise theme */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FFE5D4]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#FFE5D4]/40 blur-3xl pointer-events-none" />

      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-3 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/logo.png"
            alt="RupeeWise AI Logo"
            className="w-9 h-9 object-contain rounded-full shadow-subtle group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-xl tracking-tight text-[#073746]">
            RupeeWise <span className="text-[#073746] font-bold">AI</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-[#0B1D33]/70 hover:text-[#073746] transition-colors"
        >
          &larr; Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center my-6 relative z-10 w-full">
        <Outlet />
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-gray-200/50 relative z-10">
        <p className="text-xs text-[#0B1D33]/60">
          RupeeWise AI &copy; {new Date().getFullYear()} &mdash; Smart Wealth &amp; Expense Tracking. Encrypted &amp; Secure.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
