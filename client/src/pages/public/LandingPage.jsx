import React, { useState } from 'react';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import HeroSection from '../../components/landing/HeroSection.jsx';
import FeatureStrip from '../../components/landing/FeatureStrip.jsx';
import ProductShowcase from '../../components/landing/ProductShowcase.jsx';
import StatisticsStrip from '../../components/landing/StatisticsStrip.jsx';
import DemoModal from '../../components/landing/DemoModal.jsx';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#0B1D33] font-sans antialiased relative selection:bg-coral-100 selection:text-coral-600 overflow-x-hidden">
      {/* Background Organic Ambient Blobs */}
      {/* Bottom-Left Soft Peach/Navy Gradient Blob */}
      <div className="absolute -bottom-20 -left-20 -z-10 w-[500px] h-[500px] pointer-events-none opacity-70">
        <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
          <circle cx="160" cy="380" r="180" fill="#FFE5D4" opacity="0.6" />
          <path
            d="M60,260 C120,180 240,200 300,280 C360,360 300,460 200,480 C100,500 0,440 20,340 Z"
            fill="#073746"
            opacity="0.08"
          />
        </svg>
      </div>

      {/* Navigation */}
      <LandingNavbar />

      {/* Main Landing Page Sections in exact order */}
      <main>
        {/* 1. Hero Section with Tilted Dashboard + Smartphone + Annotations */}
        <HeroSection onWatchDemo={() => setDemoOpen(true)} />

        {/* 2. Feature Strip with 4 peach circular icons */}
        <FeatureStrip />

        {/* 3. Product Showcase (Laptop on desk visual + Benefit Grid + Explore Features) */}
        <ProductShowcase />

        {/* 4. Statistics Strip (10K+ Users, ₹2Cr+ Tracked, 4.8/5, 25% Increase) */}
        <StatisticsStrip />
      </main>

      {/* Minimal Warm Footer */}
      <footer className="py-12 border-t border-gray-200/60 bg-[#FAF6EE] text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#073746] font-medium">
            <a href="#product" className="hover:text-coral-500 transition-colors">Product</a>
            <a href="#features" className="hover:text-coral-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-coral-500 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-coral-500 transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-coral-500 transition-colors">Client Sign In</Link>
          </div>
          <p className="text-[11px] text-gray-400">
            RupeeWise AI &copy; {new Date().getFullYear()} &mdash; Intelligent Wealth &amp; Expense Tracking Platform. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Interactive Walkthrough Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default LandingPage;
