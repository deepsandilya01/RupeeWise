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
          <span className="font-extrabold text-xl tracking-tight text-forest-800">
            PaisaPilot <span className="text-forest-600 font-semibold text-sm">AI</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center my-8">
        <Outlet />
      </main>

      <footer className="max-w-7xl mx-auto w-full text-center py-4 border-t border-gray-200/60">
        <p className="text-xs text-charcoal-400">
          PaisaPilot AI &copy; {new Date().getFullYear()} &mdash; Privacy-conscious AI Financial Intelligence. Safe, Encrypted &amp; Non-custodial.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
