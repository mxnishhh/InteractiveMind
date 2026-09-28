import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Condition } from '@/types';
import { UI_TEXT } from '@/constants';

interface ConditionCardProps {
  condition: Condition;
  onSelect?: (condition: Condition) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition, onSelect }) => {
  const cardContent = (
    <div className="bg-alabaster-100 rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full text-left">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-850 bg-brand-100/70 px-3 py-1 rounded-full inline-block mb-3.5">
          Support Program
        </span>

        <h3 className="font-serif-heading text-xl font-bold text-brand-950 mb-2.5 group-hover:text-brand-850 transition-colors">
          {condition.name}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
          {condition.short_description || condition.description}
        </p>
      </div>

      <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500">Individualized Care</span>
        {onSelect ? (
          <span className="text-xs font-bold text-brand-850 hover:text-brand-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
            <span>{UI_TEXT.learnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <Link
            href={`/conditions/${condition.slug}`}
            className="text-xs font-bold text-brand-850 hover:text-brand-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
          >
            <span>{UI_TEXT.learnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(condition)}
        className="w-full text-left h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-3xl"
        aria-label={`View clinical details for ${condition.name}`}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
};
