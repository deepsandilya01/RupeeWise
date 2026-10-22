import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-base shadow-subtle">
            ₹
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0C2B35]">
            RupeeWise <span className="text-[#3D8569] font-semibold text-sm">AI</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center my-8">
        <Outlet />
      </main>

      <footer className="max-w-7xl mx-auto w-full text-center py-4 border-t border-gray-200/60">
        <p className="text-xs text-charcoal-400">
          RupeeWise AI &copy; {new Date().getFullYear()} &mdash; Smart Wealth &amp; Expense Tracking. Encrypted &amp; Secure.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
