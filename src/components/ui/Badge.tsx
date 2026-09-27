import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'PENDING':
      case 'NEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMED':
      case 'READ':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED':
      case 'RESPONDED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
      case 'ARCHIVED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};
