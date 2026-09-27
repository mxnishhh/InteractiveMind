import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${
        hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
