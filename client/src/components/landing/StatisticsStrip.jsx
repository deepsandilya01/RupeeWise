import React from 'react';
import { Users, Clock, Star, TrendingUp } from 'lucide-react';

export const StatisticsStrip = () => {
  const stats = [
    {
      id: 'users',
      value: '10K+',
      label: 'Active Users',
      icon: <Users className="w-5 h-5 text-coral-500" />,
    },
    {
      id: 'tracked',
      value: '₹2Cr+',
      label: 'Expenses Tracked',
      icon: <Clock className="w-5 h-5 text-coral-500" />,
    },
    {
      id: 'rating',
      value: '4.8/5',
      label: 'User Satisfaction',
      icon: <Star className="w-5 h-5 text-coral-500 fill-coral-500/20" />,
    },
    {
      id: 'savings',
      value: '25%',
      label: 'Average Savings Increase',
      icon: <TrendingUp className="w-5 h-5 text-coral-500" />,
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFCF8] rounded-[24px] sm:rounded-[32px] border border-[#EBE3D5] shadow-[0_10px_35px_-10px_rgba(7,55,70,0.06)] p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/60">
            {stats.map((stat, idx) => (
              <div
                key={stat.id}
                className={`flex items-center gap-4 ${
                  idx === 0
                    ? 'lg:pr-8'
                    : idx === stats.length - 1
                    ? 'pt-4 lg:pt-0 lg:pl-8'
                    : 'pt-4 lg:pt-0 lg:px-8'
                } text-left`}
              >
                <div className="w-12 h-12 rounded-full bg-[#FFE5D4]/70 border border-[#FED4BD] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1D33] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsStrip;
