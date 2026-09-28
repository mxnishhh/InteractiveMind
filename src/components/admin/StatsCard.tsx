import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trendColor?: 'brand' | 'teal' | 'amber' | 'rose' | 'emerald';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trendColor = 'brand',
}) => {
  const iconBg = {
    brand: 'bg-brand-50 text-brand-850 border-brand-200/80',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-soft flex items-center justify-between transition-all hover:shadow-md">
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
          {title}
        </span>
        <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950 tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-xs text-stone-600 font-medium leading-relaxed">{description}</p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${iconBg[trendColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
