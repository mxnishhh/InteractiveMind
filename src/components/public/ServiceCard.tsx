'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Service } from '@/types';
import { UI_TEXT } from '@/constants';
import { SMOOTH_EASE } from '@/components/ui/motion';

interface ServiceCardProps {
  service: Service;
  onSelect?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-500 flex flex-col justify-between group h-full text-left relative overflow-hidden">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
            <Sparkles className="w-5 h-5 text-brand-700 group-hover:text-brand-850 transition-colors" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-100/60 border border-brand-200/60 px-2.5 py-1 rounded-full">
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
              <span key={i} className="text-[11px] text-stone-600 bg-stone-100/80 border border-stone-200/60 px-2 py-0.5 rounded-md">
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
            href="/#therapies"
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
      <motion.button
        type="button"
        whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.25, ease: SMOOTH_EASE } }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.99, transition: { duration: 0.1 } }}
        onClick={() => onSelect(service)}
        className="w-full text-left h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-3xl"
        aria-label={`View clinical details for ${service.name}`}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.25, ease: SMOOTH_EASE } }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  );
};
