import React from 'react';
import { UserCheck, Wallet, Target, Activity } from 'lucide-react';

export const FeatureStrip = () => {
  const features = [
    {
      id: 'ai-coach',
      title: 'AI Financial Coach',
      subtitle: 'Personalized advice',
      icon: <UserCheck className="w-5 h-5 text-coral-500" />,
    },
    {
      id: 'smart-budgeting',
      title: 'Smart Budgeting',
      subtitle: 'Control your spending',
      icon: <Wallet className="w-5 h-5 text-[#073746]" />,
    },
    {
      id: 'goal-tracking',
      title: 'Goal Tracking',
      subtitle: 'Stay motivated',
      icon: <Target className="w-5 h-5 text-coral-500" />,
    },
    {
      id: 'what-if',
      title: 'What-If Simulator',
      subtitle: 'Plan your future',
      icon: <Activity className="w-5 h-5 text-[#073746]" />,
    },
  ];

  return (
    <section id="features" className="py-10 border-y border-gray-200/50 bg-[#FAF6EE]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          {features.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3.5 group text-left cursor-default p-2 rounded-2xl hover:bg-white/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFE5D4]/80 border border-[#FED2B8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0B1D33] tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
