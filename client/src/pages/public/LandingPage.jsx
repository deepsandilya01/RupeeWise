import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingNavbar from '../../components/landing/LandingNavbar.jsx';
import HeroSection from '../../components/landing/HeroSection.jsx';
import FeatureStrip from '../../components/landing/FeatureStrip.jsx';
import ProductShowcase from '../../components/landing/ProductShowcase.jsx';
import HowItWorksSection from '../../components/landing/HowItWorksSection.jsx';
import PricingSection from '../../components/landing/PricingSection.jsx';
import StatisticsStrip from '../../components/landing/StatisticsStrip.jsx';
import DemoModal from '../../components/landing/DemoModal.jsx';
import LandingFooter from '../../components/landing/LandingFooter.jsx';

export const LandingPage = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#0B1D33] font-sans antialiased relative selection:bg-coral-100 selection:text-coral-600">
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

        {/* 4. How It Works - 4-step Action Flow */}
        <HowItWorksSection />

        {/* 5. Pricing Plans with Student & Pro tiers */}
        <PricingSection />

        {/* 6. Statistics Strip (10K+ Users, ₹2Cr+ Tracked, 4.8/5, 25% Increase) */}
        <StatisticsStrip />
      </main>

      {/* Comprehensive Professional Footer */}
      <LandingFooter />

      {/* Interactive Walkthrough Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default LandingPage;

