import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '', dot = true }) => {
  const getBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'PENDING':
      case 'NEW':
        return {
          container: 'bg-amber-50 text-amber-850 border-amber-200/90',
          dot: 'bg-amber-500',
        };
      case 'CONFIRMED':
      case 'READ':
        return {
          container: 'bg-brand-50 text-brand-900 border-brand-200/90',
          dot: 'bg-brand-700',
        };
      case 'COMPLETED':
      case 'RESPONDED':
      case 'ACTIVE':
        return {
          container: 'bg-emerald-50 text-emerald-850 border-emerald-200/90',
          dot: 'bg-emerald-600',
        };
      case 'CANCELLED':
      case 'ARCHIVED':
      case 'INACTIVE':
        return {
          container: 'bg-stone-100 text-stone-600 border-stone-200/80',
          dot: 'bg-stone-400',
        };
      case 'FEATURED':
        return {
          container: 'bg-amber-50 text-amber-900 border-amber-200/90',
          dot: 'bg-amber-500',
        };
      default:
        return {
          container: 'bg-stone-50 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
        };
    }
  };

  const style = getBadgeStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.container} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />}
      <span>{status}</span>
    </span>
  );
};
