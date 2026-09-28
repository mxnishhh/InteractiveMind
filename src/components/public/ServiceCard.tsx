import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Service } from '@/types';
import { UI_TEXT } from '@/constants';

interface ServiceCardProps {
  service: Service;
  onSelect?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const cardContent = (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full text-left">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-850 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
            <Sparkles className="w-5 h-5 text-brand-700" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
            Clinical Care
          </span>
        </div>

        <h3 className="font-serif-heading text-xl font-bold text-brand-950 group-hover:text-brand-850 transition-colors">
          {service.name}
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
          {service.short_description || service.description}
        </p>

        {service.skills_supported && service.skills_supported.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.skills_supported.slice(0, 2).map((skill, i) => (
              <span key={i} className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-5 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-stone-500">1-on-1 &amp; Group</span>
        {onSelect ? (
          <span className="text-xs font-bold text-brand-850 group-hover:text-brand-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
            <span>{UI_TEXT.learnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <Link
            href={`/therapies/${service.slug}`}
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
        onClick={() => onSelect(service)}
        className="w-full text-left h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-3xl"
        aria-label={`View clinical details for ${service.name}`}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
};
