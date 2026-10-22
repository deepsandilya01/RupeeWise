import React from 'react';
import { ArrowRight, Plus, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks.js';

export const YourGoalsCard = () => {
  const navigate = useNavigate();
  const { goals } = useAppSelector((state) => state.ai);

  // If user has real goals in database, render them. Otherwise show default starter goals
  const displayGoals =
    goals && goals.length > 0
      ? goals.slice(0, 2).map((g) => ({
          id: g.id,
          title: g.name,
          current: '₹' + Number(g.currentAmount).toLocaleString('en-IN'),
          target: '₹' + Number(g.targetAmount).toLocaleString('en-IN'),
          percent: g.progressPercentage,
          color: g.category === 'Technology' ? '#0C3846' : '#F35C48',
          image: g.imageUrl || (g.category === 'Technology' ? '/assets/macbook.jpg' : '/assets/europe_trip.jpg'),
        }))
      : [
          {
            id: 'g-1',
            title: 'Europe Trip',
            current: '₹45,000',
            target: '₹2,00,000',
            percent: 23,
            color: '#F35C48',
            image: '/assets/europe_trip.jpg',
          },
          {
            id: 'g-2',
            title: 'MacBook Air M5',
            current: '₹76,000',
            target: '₹1,15,000',
            percent: 66,
            color: '#0C3846',
            image: '/assets/macbook.jpg',
          },
        ];

  return (
    <div className="bg-white rounded-[22px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between text-left select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#0B1D33]">Your Goals</h3>
        <Link
          to="/ai-coach"
          className="flex items-center gap-1 text-[11px] font-bold text-[#0C3846] hover:text-coral-500 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 2 Goal Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {displayGoals.map((g) => (
          <div
            key={g.id}
            onClick={() => navigate('/ai-coach')}
            className="flex flex-col justify-between bg-gray-50/70 rounded-2xl p-2.5 border border-gray-200/60 hover:border-gray-300 transition-colors cursor-pointer group"
          >
            {/* Image Thumbnail */}
            <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 bg-gray-200 relative">
              <img
                src={g.image}
                alt={g.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/laptop_showcase.jpg';
                }}
              />
            </div>

            {/* Goal Info */}
            <div>
              <div className="text-xs font-bold text-[#0B1D33] truncate">{g.title}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                {g.current} <span className="text-gray-400">/</span> {g.target}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${g.percent}%`,
                    backgroundColor: g.color,
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500 min-w-[24px] text-right">
                {g.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourGoalsCard;
