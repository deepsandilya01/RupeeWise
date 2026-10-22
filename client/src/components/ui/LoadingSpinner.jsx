import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '', label = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`${sizes[size] || sizes.md} border-forest-800 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label={label}
      />
      {label && <span className="text-xs text-charcoal-500 font-medium">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
