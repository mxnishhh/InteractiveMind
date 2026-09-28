import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/80 shadow-soft p-6 sm:p-7 ${
        hover ? 'hover:shadow-card hover:border-stone-300 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
