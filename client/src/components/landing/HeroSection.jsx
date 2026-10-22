import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardMockup from './DashboardMockup.jsx';
import PhoneMockup from './PhoneMockup.jsx';

export const HeroSection = ({ onWatchDemo }) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Background Decorative Organic Shapes (matching screenshot top-right) */}
      <div className="absolute top-0 right-0 -z-10 w-[550px] h-[550px] pointer-events-none opacity-85">
        <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
          {/* Deep Navy / Dark Teal curved organic arc */}
          <path
            d="M250,50 C380,20 480,120 490,260 C500,400 370,480 260,490 C150,500 40,430 20,310 C0,190 120,80 250,50 Z"
            fill="#073746"
            opacity="0.12"
          />
          {/* Vibrant Coral & Peach Blob */}
          <circle cx="360" cy="180" r="140" fill="#FF624F" opacity="0.65" />
          <path
            d="M320,80 C420,60 480,140 460,240 C440,340 340,400 240,380 C140,360 120,260 160,160 C200,60 220,100 320,80 Z"
            fill="#FFE5D4"
            opacity="0.75"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEADB]/80 border border-[#F8CCA8] text-xs font-semibold text-[#073746]">
              <Sparkles className="w-3.5 h-3.5 text-coral-500 flex-shrink-0" />
              <span>AI-Powered Personal Finance Coach</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0B1D33] leading-[1.12]">
              Smarter <br />
              Money Decisions <br />
              <span className="text-[#FF624F]">for a Brighter You.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-md">
              Track. Plan. Save. Grow. Your AI-powered companion for better spending habits and financial freedom.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2.5 bg-[#073746] hover:bg-[#0C2B35] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-full shadow-card hover:shadow-elevated transition-all active:translate-y-px"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWatchDemo}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0B1D33] border border-gray-300 text-sm sm:text-base font-bold px-6 py-3.5 rounded-full shadow-subtle hover:border-gray-400 transition-all active:translate-y-px"
              >
                <div className="w-5 h-5 rounded-full bg-[#073746] text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Statement & Brand Logos */}
            <div className="pt-8 border-t border-gray-200/60 space-y-3">
              <p className="text-xs font-medium text-gray-500">
                Trusted by students and young professionals
              </p>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 opacity-70 grayscale contrast-125">
                <span className="text-sm font-extrabold tracking-wider font-sans text-gray-800">
                  Razorpay
                </span>
                <span className="text-sm font-bold tracking-tight text-gray-800">
                  Google
                </span>
                <span className="text-sm font-bold lowercase tracking-tight text-gray-800">
                  amazon
                </span>
                <span className="text-sm font-bold tracking-tight text-gray-800">
                  Spotify
                </span>
                <span className="text-sm font-black italic lowercase tracking-tight text-gray-800">
                  zomato
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Perspective Dashboard + Floating Phone Mockup */}
          <div className="lg:col-span-7 relative">
            {/* Handwritten annotation 1: Plan Save Grow */}
            <div className="hidden xl:block absolute -top-8 left-20 z-20 text-center pointer-events-none select-none">
              <div className="font-handwriting text-2xl text-[#073746]/85 font-bold leading-none rotate-[-4deg]">
                Plan <br />
                Save <br />
                Grow
              </div>
              {/* Hand-drawn curved arrow pointing to dashboard */}
              <svg className="w-12 h-10 mt-1 ml-4 text-[#073746]/70 stroke-current" viewBox="0 0 50 40" fill="none">
                <path
                  d="M10,5 C25,12 35,22 40,32"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M32,28 L40,32 L42,22"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Tilted Dashboard Mockup */}
            <div className="relative transform lg:rotate-[-3.5deg] lg:skew-y-[1.5deg] transition-transform duration-500 hover:rotate-[-1.5deg]">
              <DashboardMockup />

              {/* Floating Phone Mockup overlapping bottom-right */}
              <div className="absolute -bottom-10 -right-2 sm:-right-6 md:-right-8 z-30 transform rotate-[3deg] transition-transform duration-500 hover:rotate-[1deg] hover:scale-105">
                <PhoneMockup />
              </div>
            </div>

            {/* Handwritten annotation 2: Small Changes Big Futures. */}
            <div className="hidden xl:block absolute -bottom-14 right-48 z-20 pointer-events-none select-none text-left">
              <div className="flex items-center gap-2">
                <svg className="w-10 h-10 text-[#073746]/70 stroke-current transform rotate-[-20deg]" viewBox="0 0 50 40" fill="none">
                  <path
                    d="M10,32 C20,20 30,12 38,8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28,8 L38,8 L38,18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="font-handwriting text-2xl text-[#073746]/85 font-bold leading-tight rotate-[6deg]">
                  Small <br />
                  Changes <br />
                  Big Futures.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
