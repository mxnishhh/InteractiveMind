import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trendColor?: 'brand' | 'teal' | 'amber' | 'rose';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trendColor = 'brand',
}) => {
  const iconBg = {
    brand: 'bg-brand-50 text-brand-600',
    teal: 'bg-tealbrand-50 text-tealbrand-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="text-2xl font-extrabold text-slate-900">{value}</div>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg[trendColor]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
