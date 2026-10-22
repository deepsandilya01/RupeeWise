import React from 'react';

export const Card = ({
  children,
  className = '',
  padding = 'p-6',
  header,
  footer,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/90 shadow-card transition-shadow hover:shadow-elevated ${className}`}
      {...props}
    >
      {header && <div className="px-6 py-4 border-b border-gray-100">{header}</div>}
      <div className={padding}>{children}</div>
      {footer && <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">{footer}</div>}
    </div>
  );
};

export default Card;
