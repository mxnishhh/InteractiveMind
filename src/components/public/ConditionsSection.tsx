'use client';

import React, { useState } from 'react';
import { Condition } from '@/types';
import { ConditionCard } from './ConditionCard';
import { ConditionDetailModal } from './ConditionDetailModal';
import { ArrowRight } from 'lucide-react';
import {
  FadeUp,
  FadeIn,
  ScaleReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/motion';
import { motion, useReducedMotion } from 'framer-motion';
import { EDITORIAL_EASE, SMOOTH_EASE } from '@/components/ui/motion';

interface ConditionsSectionProps {
  featuredCondition: Condition | null;
  otherConditions: Condition[];
  allConditions: Condition[];
}

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({
  featuredCondition,
  otherConditions,
  allConditions,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleBookingScroll = () => {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section id="conditions" className="py-20 lg:py-28 bg-white border-t border-stone-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <FadeUp className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">
              Individualized Understanding
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
              Conditions We Support
            </h2>
            <p className="text-stone-600 text-base mt-3">
              Every diagnosis is approached with clinical precision, dignity, and a commitment to helping each child navigate everyday life with comfort and self-expression.
            </p>
          </FadeUp>

          {/* Neurodiversity Ambient Banner */}
          <FadeIn delay={0.1} className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-brand-50 via-alabaster-100 to-amber-50/50 border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-3 h-3 rounded-full bg-brand-600"></span>
              <p className="text-xs sm:text-sm text-brand-950 font-medium">
                <strong className="font-bold">Affirming Care Pathway:</strong> We do not define children by labels; our clinical assessments identify functional baselines and personal strengths.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand-800 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-stone-200 self-start sm:self-auto">
              5 Primary Clinical Focuses
            </span>
          </FadeIn>

          {/* 5 Conditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Featured ASD 2-Col Card with interactive modal trigger */}
            {featuredCondition && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.25, ease: SMOOTH_EASE } }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99, transition: { duration: 0.1 } }}
                onClick={() => setSelectedCondition(featuredCondition)}
                className="lg:col-span-2 bg-[#f4f7f6] rounded-3xl p-8 border border-brand-100/90 flex flex-col justify-between shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer group text-left"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCondition(featuredCondition);
                  }
                }}
                aria-label={`View clinical details for ${featuredCondition.name}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-850 bg-brand-100 px-3 py-1 rounded-full">
                      Neurodevelopmental Focus
                    </span>
                    <span className="text-xs text-stone-500 font-medium">Core Specialty</span>
                  </div>
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950 mb-3 group-hover:text-brand-850 transition-colors">
                    {featuredCondition.name}
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed mb-6">
                    {featuredCondition.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-white text-brand-900 px-3 py-1 rounded-md border border-brand-100 font-medium">
                      Recommended: ABA Therapy
                    </span>
                    <span className="text-xs bg-white text-brand-900 px-3 py-1 rounded-md border border-brand-100 font-medium">
                      Speech &amp; Language
                    </span>
                    <span className="text-xs bg-white text-brand-900 px-3 py-1 rounded-md border border-brand-100 font-medium">
                      Sensory Integration
                    </span>
                    <span className="text-xs bg-white text-brand-900 px-3 py-1 rounded-md border border-brand-100 font-medium">
                      Parent Counselling & Training Programme (PCTP)
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-brand-200/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-850">
                    Individualized Assessment Protocol
                  </span>
                  <span className="text-xs font-bold text-brand-900 group-hover:text-brand-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                    <span>Explore Clinical Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            )}

            {/* Remaining Condition Cards */}
            {otherConditions.map((condition) => (
              <ConditionCard
                key={condition.id}
                condition={condition}
                onSelect={setSelectedCondition}
              />
            ))}

          </div>

        </div>
      </section>

      {/* Reusable Condition Detail Modal */}
      <ConditionDetailModal
        isOpen={selectedCondition !== null}
        condition={selectedCondition}
        allConditions={allConditions}
        onClose={() => setSelectedCondition(null)}
        onSelectCondition={setSelectedCondition}
        onBookAssessment={handleBookingScroll}
      />
    </>
  );
};
