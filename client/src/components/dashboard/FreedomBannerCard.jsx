import React from 'react';
import { ArrowRight } from 'lucide-react';

export const FreedomBannerCard = () => {
  return (
    <div className="relative overflow-hidden bg-[#0C2B35] rounded-[22px] p-6 shadow-[0_6px_20px_rgba(12,43,53,0.25)] flex flex-col justify-between text-left select-none min-h-[140px] group cursor-pointer">
      {/* Background Organic Art Waves */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-full w-[65%] object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          viewBox="0 0 300 160"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Wave Layer 1 (Coral) */}
          <path
            d="M80,0 C120,40 180,20 220,70 C250,110 270,140 300,160 L300,0 Z"
            fill="#F35C48"
            opacity="0.85"
          />
          {/* Wave Layer 2 (Peach) */}
          <path
            d="M130,0 C170,30 200,60 250,90 C280,110 290,130 300,140 L300,0 Z"
            fill="#FDBA74"
            opacity="0.7"
          />
          {/* Wave Layer 3 (Deep Teal Accent) */}
          <path
            d="M190,0 C220,20 250,40 280,60 L300,30 L300,0 Z"
            fill="#06181E"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[70%]">
        <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight leading-snug">
          Turn Today's Choices Into Tomorrow's Freedom.
        </h3>
      </div>

      {/* Bottom Action Icon */}
      <div className="relative z-10 flex justify-end mt-4">
        <div className="w-10 h-10 rounded-full bg-white text-[#0C2B35] flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default FreedomBannerCard;
