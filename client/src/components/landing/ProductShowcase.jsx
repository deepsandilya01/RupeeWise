import React from 'react';
import { ArrowRight, BarChart3, Sparkles, Compass, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductShowcase = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      id: 'insights',
      title: 'Personalized Insights',
      desc: 'Understand your spending with AI',
      icon: <BarChart3 className="w-5 h-5 text-coral-400" />,
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      desc: 'Get actionable money tips',
      icon: <Sparkles className="w-5 h-5 text-emerald-300" />,
    },
    {
      id: 'goals',
      title: 'Savings Goals',
      desc: 'Set targets and stay on track',
      icon: <Compass className="w-5 h-5 text-peach-300" />,
    },
    {
      id: 'simulations',
      title: 'Future Simulations',
      desc: 'See how small changes make a big impact',
      icon: <Layers className="w-5 h-5 text-blue-300" />,
    },
  ];

  return (
    <section id="product" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Dark Product Showcase Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0C2731] shadow-[0_25px_60px_-15px_rgba(7,55,70,0.25)] border border-[#163B48]">
              <img
                src="/assets/laptop_showcase.jpg"
                alt="PaisaPilot AI Dashboard displayed on laptop on desk with plant"
                className="w-full h-full object-cover aspect-[4/3] transform hover:scale-102 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2731]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Copy & Benefit Grid */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFEADB] text-[11px] font-bold uppercase tracking-wider text-[#073746]">
              WHY RUPEEWISE AI
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0B1D33] leading-tight">
              Your Personal Finance <br />
              Coach, <span className="text-[#FF624F]">Always With You.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-xl">
              Get AI-powered insights, track your expenses, set goals and make smarter money decisions &mdash; all in one place.
            </p>

            {/* 2x2 Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {benefits.map((item) => (
                <div key={item.id} className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#073746] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1D33]">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Explore Features Button */}
            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2.5 bg-[#073746] hover:bg-[#0C2B35] text-white text-sm font-bold px-7 py-3.5 rounded-full shadow-card hover:shadow-elevated transition-all active:translate-y-px"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
