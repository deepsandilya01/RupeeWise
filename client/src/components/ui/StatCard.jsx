import React from 'react';
import Card from './Card.jsx';
import Badge from './Badge.jsx';

export const StatCard = ({
  title,
  value,
  subtext,
  icon,
  trend,
  trendPositive = true,
  isDemo = false,
  className = '',
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              {title}
            </span>
            {isDemo && <Badge variant="demo" size="sm">Demo Data</Badge>}
          </div>
          <div className="text-2xl font-bold tracking-tight text-charcoal-900 mt-1">
            {value}
          </div>
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {trend}
            </span>
          )}
          {subtext && <span className="text-charcoal-500 ml-auto">{subtext}</span>}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
