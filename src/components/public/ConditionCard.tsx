'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Condition } from '@/types';
import { UI_TEXT } from '@/constants';
import { SMOOTH_EASE } from '@/components/ui/motion';

interface ConditionCardProps {
  condition: Condition;
  onSelect?: (condition: Condition) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition, onSelect }) => {
  const shouldReduceMotion = useReducedMotion();

  const imageMap: Record<string, string> = {
    'autism': '/images/conditions/autism.png',
    'adhd': '/images/conditions/adhd.png',
    'down-syndrome': '/images/conditions/down',
    'cerebral-palsy': '/images/conditions/celebral.png',
  };

  const altMap: Record<string, string> = {
    'autism': 'Child engaged in a structured developmental activity with a caregiver',
    'adhd': 'Child participating in an activity with a caregiver in a developmental setting',
    'down-syndrome': 'Child participating in a developmental activity with a caregiver',
    'cerebral-palsy': 'Child participating in a developmental activity with a caregiver using adaptive seating',
  };

  const cardContent = (
    <div className="bg-alabaster-100 rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full text-left">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-850 bg-brand-100/70 border border-brand-200/70 px-3 py-1 rounded-full inline-block mb-3.5">
          Support Program
        </span>

        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 mb-3.5 group-hover:border-brand-200 transition-colors">
          <Image
            src={imageMap[condition.slug] || imageMap['autism']}
            alt={altMap[condition.slug] || 'Developmental support activity'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

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
          <span className="text-xs font-bold text-brand-850 group-hover:text-brand-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
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
      <motion.button
        type="button"
        whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.25, ease: SMOOTH_EASE } }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.99, transition: { duration: 0.1 } }}
        onClick={() => onSelect(condition)}
        className="w-full text-left h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-3xl"
        aria-label={`View clinical details for ${condition.name}`}
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
