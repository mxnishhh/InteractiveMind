import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Condition } from '@/types';

interface ConditionCardProps {
  condition: Condition;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">
          {condition.name}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {condition.short_description}
        </p>
      </div>

      <div className="pt-5 mt-4 border-t border-slate-100">
        <Link
          href={`/conditions/${condition.slug}`}
          className="text-xs font-bold uppercase tracking-wider text-tealbrand-700 hover:text-tealbrand-800 inline-flex items-center gap-1.5 transition-colors"
        >
          <span>Learn More</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
};
