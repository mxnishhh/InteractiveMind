'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Condition } from '@/types';
import { ConditionDetailModal } from './ConditionDetailModal';
import Image from 'next/image';
import { FadeUp, FadeIn } from '@/components/ui/motion';
import { motion } from 'framer-motion';

interface ConditionsSectionProps {
  allConditions: Condition[];
}

const CONDITION_IMAGE_MAP: Record<string, string> = {
  'autism': '/images/conditions/autism.jpg',
  'adhd': '/images/conditions/adhd.jpg',
  'down-syndrome': '/images/conditions/down-syndrome.jpg',
  'cerebral-palsy': '/images/conditions/cerebral-palsy.jpg',
};

const CONDITION_ALT_MAP: Record<string, string> = {
  'autism': 'Child engaged in a structured developmental activity with a caregiver',
  'adhd': 'Child participating in an activity with a caregiver in a developmental setting',
  'down-syndrome': 'Child participating in a developmental activity with a caregiver',
  'cerebral-palsy': 'Child participating in an activity with a caregiver using adaptive seating',
};

interface ConditionCardItemProps {
  condition: Condition;
  isExpanded: boolean;
  onSelect: () => void;
  onPointerEnter: () => void;
  onFocus: () => void;
  isDesktop: boolean;
}

const ConditionCardItem: React.FC<ConditionCardItemProps> = ({
  condition,
  isExpanded,
  onSelect,
  onPointerEnter,
  onFocus,
  isDesktop,
}) => {
  const flexRatio = isExpanded ? 3.4 : 1;

  return (
    <motion.div
      className="w-full min-h-0 md:basis-0 md:shrink-1"
      style={
        isDesktop
          ? {
              flexGrow: flexRatio,
              flexBasis: '0%',
              flexShrink: 1,
              minHeight: 0,
            }
          : undefined
      }
      animate={
        isDesktop
          ? {
              flexGrow: flexRatio,
            }
          : undefined
      }
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        onPointerEnter={onPointerEnter}
        onFocus={onFocus}
        className={`w-full h-full text-left rounded-3xl p-6 sm:p-7 lg:p-8 border transition-all duration-400 ease-out flex flex-col relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 cursor-pointer min-h-0 ${
          isExpanded
            ? 'shadow-card'
            : 'shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-card hover:border-brand-200/80'
        } ${
          isExpanded || !isDesktop
            ? 'justify-between'
            : 'justify-center items-center text-center'
        }`}
        style={{
          backgroundColor: isExpanded ? '#EAF7F3' : '#F7F8F5',
          borderColor: isExpanded
            ? 'rgba(7, 107, 95, 0.28)'
            : 'rgba(215, 219, 210, 0.75)',
        }}
        aria-label={`View clinical details for ${condition.name}`}
      >
        {isExpanded || !isDesktop ? (
          <div className="w-full h-full flex flex-col justify-between min-h-0">
            {/* Expanded State: Balanced two-column composition (TEXT LEFT ~58% + FULL UNCLIPPED IMAGE RIGHT ~42%) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.35fr_1fr] lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-center flex-1 min-h-0 overflow-hidden py-1">
              {/* Text Column */}
              <div className="flex flex-col justify-center min-w-0 pr-0 sm:pr-2">
                <h3 className="font-serif-heading text-2xl sm:text-3xl lg:text-[1.85rem] font-bold text-brand-950 group-hover:text-brand-850 transition-colors leading-snug">
                  {condition.name}
                </h3>
                <p className="text-xs sm:text-sm lg:text-[0.925rem] text-stone-600 leading-relaxed mt-3 sm:mt-4 line-clamp-5 sm:line-clamp-6">
                  {condition.short_description || condition.description}
                </p>
              </div>

              {/* Uncropped Full Image Frame */}
              <div className="flex justify-center sm:justify-end items-center w-full">
                <div className="relative w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px] aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-white/90 border border-brand-200/60 shadow-sm shrink-0 flex items-center justify-center p-2.5">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={
                        CONDITION_IMAGE_MAP[condition.slug] ||
                        CONDITION_IMAGE_MAP['autism']
                      }
                      alt={
                        CONDITION_ALT_MAP[condition.slug] ||
                        'Developmental support activity'
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 35vw, 320px"
                      className="object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reserved Footer CTA */}
            <div className="pt-4 mt-auto border-t border-brand-200/70 flex items-center justify-between shrink-0 w-full min-w-0">
              <span className="text-xs sm:text-sm font-bold text-brand-850 group-hover:text-brand-700 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-all">
                <span>Explore Clinical Profile</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ) : (
          /* Collapsed State: Large, Dominant Editorial Typographic Label (Centered horizontally & vertically on warm alabaster) */
          <div className="w-full h-full flex items-center justify-center p-4">
            <h3 className="font-serif-heading text-4xl sm:text-5xl lg:text-[2.85rem] xl:text-[3.15rem] font-bold text-brand-950 group-hover:text-brand-850 transition-colors text-center tracking-tight leading-tight px-4">
              {condition.name}
            </h3>
          </div>
        )}
      </button>
    </motion.div>
  );
};

interface ConditionColumnPairProps {
  topCondition: Condition;
  bottomCondition: Condition;
  onSelectCondition: (condition: Condition) => void;
  isDesktop: boolean;
}

const ConditionColumnPair: React.FC<ConditionColumnPairProps> = ({
  topCondition,
  bottomCondition,
  onSelectCondition,
  isDesktop,
}) => {
  // Independent hover state for this vertical column pair: 'top' | 'bottom' | null
  const [hovered, setHovered] = useState<'top' | 'bottom' | null>(null);

  return (
    <div
      className="flex flex-col gap-6 w-full md:h-[640px] min-w-0"
      onPointerLeave={() => setHovered(null)}
    >
      {/* Top Condition Card */}
      <ConditionCardItem
        condition={topCondition}
        isExpanded={hovered === 'top'}
        onSelect={() => onSelectCondition(topCondition)}
        onPointerEnter={() => setHovered('top')}
        onFocus={() => setHovered('top')}
        isDesktop={isDesktop}
      />

      {/* Bottom Condition Card */}
      <ConditionCardItem
        condition={bottomCondition}
        isExpanded={hovered === 'bottom'}
        onSelect={() => onSelectCondition(bottomCondition)}
        onPointerEnter={() => setHovered('bottom')}
        onFocus={() => setHovered('bottom')}
        isDesktop={isDesktop}
      />
    </div>
  );
};

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({
  allConditions,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBookingScroll = () => {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Group into two vertical pairs:
  // Column 1: Autism (Top) ↕ Down Syndrome (Bottom)
  // Column 2: ADHD (Top) ↕ Cerebral Palsy (Bottom)
  const autism =
    allConditions.find(
      (c) =>
        (c.slug === 'autism' || c.slug === 'autism-spectrum-disorder') &&
        c.active
    ) || allConditions[0];

  const downSyndrome =
    allConditions.find((c) => c.slug === 'down-syndrome' && c.active) ||
    allConditions[2] ||
    allConditions[0];

  const adhd =
    allConditions.find((c) => c.slug === 'adhd' && c.active) ||
    allConditions[1] ||
    allConditions[0];

  const cerebralPalsy =
    allConditions.find((c) => c.slug === 'cerebral-palsy' && c.active) ||
    allConditions[3] ||
    allConditions[0];

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

          {/* Affirming Care Pathway Banner */}
          <FadeIn delay={0.1} className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-brand-50 via-alabaster-100 to-amber-50/50 border border-brand-100 flex items-center gap-3">
            <span className="shrink-0 w-3 h-3 rounded-full bg-brand-600"></span>
            <p className="text-xs sm:text-sm text-brand-950 font-medium">
              <strong className="font-bold">Affirming Care Pathway:</strong> We do not define children by labels; our clinical assessments identify functional baselines and personal strengths.
            </p>
          </FadeIn>

          {/* 2 Vertical Flex Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Column 1: Autism ↕ Down Syndrome */}
            {autism && downSyndrome && (
              <ConditionColumnPair
                topCondition={autism}
                bottomCondition={downSyndrome}
                onSelectCondition={setSelectedCondition}
                isDesktop={isDesktop}
              />
            )}

            {/* Column 2: ADHD ↕ Cerebral Palsy */}
            {adhd && cerebralPalsy && (
              <ConditionColumnPair
                topCondition={adhd}
                bottomCondition={cerebralPalsy}
                onSelectCondition={setSelectedCondition}
                isDesktop={isDesktop}
              />
            )}
          </div>
        </div>
      </section>

      {/* Condition Detail Modal - Managed at Section Level */}
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
