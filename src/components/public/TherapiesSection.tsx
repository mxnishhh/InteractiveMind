'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Target,
  Activity,
  MessageSquare,
  GraduationCap,
  Users,
  Heart,
} from 'lucide-react';
import { Service } from '@/types';
import { ORDERED_THERAPY_SLUGS } from '@/constants';
import dynamic from 'next/dynamic';
import { FadeUp } from '@/components/ui/motion';

const TherapyDetailModal = dynamic(
  () => import('./TherapyDetailModal').then((mod) => mod.TherapyDetailModal),
  { ssr: false }
);

interface TherapiesSectionProps {
  allServices: Service[];
}

const THERAPY_ICON_MAP: Record<string, React.ElementType> = {
  'aba-therapy': Target,
  'occupational-therapy': Activity,
  'speech-therapy': MessageSquare,
  'special-education': GraduationCap,
  'physiotherapy': Heart,
  'parent-guidance': Users,
};

// Approved content-derived tags/chips for each of the 6 active therapies
const THERAPY_TAGS: Record<string, string[]> = {
  'aba-therapy': [
    'Social Interaction',
    'Everyday Activities',
    'Self-worth',
    'Self-reliance',
  ],
  'occupational-therapy': [
    'Play',
    'Self-care',
    'Fine Motor Skills',
    'Social Participation',
  ],
  'speech-therapy': [
    'Verbal Communication',
    'Nonverbal Communication',
    'Speech',
    'Communication',
  ],
  'special-education': [
    'Individualized Educational Programme',
    'Parent Involvement',
    'Multisensory Learning',
    'Inclusive Activities',
  ],
  'physiotherapy': [
    'Pre-therapy Assessment',
    'Goal Setting',
    'Parent Counselling',
    'Home-based Management',
  ],
  'parent-guidance': [
    'Parent Empowerment',
    'Communication Guidance',
    'Social Participation',
    'Independent Living Skills',
  ],
};

interface TherapyCardItemProps {
  service: Service;
  onSelect: (service: Service) => void;
}

const TherapyCardItem: React.FC<TherapyCardItemProps> = ({
  service,
  onSelect,
}) => {
  const Icon = THERAPY_ICON_MAP[service.slug] || Sparkles;
  const tags = THERAPY_TAGS[service.slug] || [];

  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className="w-full h-full min-h-[260px] sm:min-h-[275px] text-left rounded-3xl p-6 sm:p-7 border border-[rgba(13,110,99,0.10)] bg-[#FFFEFB] hover:bg-[#F0F8F5] hover:border-[rgba(13,110,99,0.22)] shadow-[0_2px_10px_rgba(12,74,69,0.03)] hover:shadow-[0_6px_20px_-4px_rgba(12,74,69,0.08)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 cursor-pointer min-w-0"
      aria-label={`View clinical details for ${service.name}`}
    >
      <div className="w-full min-w-0 flex flex-col flex-1">
        {/* Icon Container: Pale mint surface (#EFFAF7) -> Soft mint (#DDF5EF) on hover */}
        <div className="w-10 h-10 rounded-2xl bg-[#EFFAF7] text-brand-850 group-hover:bg-[#DDF5EF] group-hover:text-brand-950 flex items-center justify-center transition-colors duration-300 shrink-0 mb-3.5">
          <Icon className="w-5 h-5 text-brand-850 group-hover:text-brand-950 transition-colors" />
        </div>

        {/* Title: Deep forest typography */}
        <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950 group-hover:text-brand-900 transition-colors leading-snug w-full min-w-0 line-clamp-2 min-h-[3.25rem] flex items-start">
          {service.name}
        </h3>

        {/* Content-Derived Tags/Chips */}
        <div className="flex flex-wrap gap-2 pt-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-xs font-semibold text-brand-850 bg-[#EFFAF7] border border-[rgba(13,110,99,0.14)] px-3 py-1.5 rounded-full leading-none transition-colors group-hover:bg-[#e4f5ef]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Flexible spacer */}
      <div className="flex-1 min-h-4" />

      {/* Footer CTA */}
      <div className="pt-4 mt-auto border-t border-[rgba(13,110,99,0.08)] group-hover:border-[rgba(13,110,99,0.15)] transition-colors duration-300 flex items-center justify-between w-full min-w-0 shrink-0">
        <span className="text-xs font-bold text-brand-850 group-hover:text-brand-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
          <span>Explore Clinical Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};

export const TherapiesSection: React.FC<TherapiesSectionProps> = ({
  allServices,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleBookingScroll = () => {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get active services in the exact 6 prescribed order:
  // 1. Occupational Therapy
  // 2. Speech & Language Therapy
  // 3. Special Education
  // 4. ABA Therapy
  // 5. Physiotherapy
  // 6. Parent Counselling & Training Programme (PCTP)
  const activeServicesList = ORDERED_THERAPY_SLUGS.map((slug) =>
    allServices.find((s) => s.slug === slug && s.active)
  ).filter(Boolean) as Service[];

  const activeServices =
    activeServicesList.length === 6
      ? activeServicesList
      : allServices.filter((s) => s.active).slice(0, 6);

  return (
    <>
      <section id="therapies" className="py-20 lg:py-28 bg-[#F7F6F2] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title Header */}
          <FadeUp className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">
              Specialized Programs
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
              Our Developmental Therapies
            </h2>
            <p className="text-stone-600 text-base mt-3">
              Every discipline is led by qualified pediatric clinicians, structured to nurture communication, motor coordination, cognitive progress, and self-confidence.
            </p>
          </FadeUp>

          {/* Equal-width 2-column x 3-row static clinical grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeServices.map((service) => (
              <TherapyCardItem
                key={service.slug}
                service={service}
                onSelect={setSelectedService}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Therapy Detail Modal - Managed at Section Level (Receives full service data) */}
      <TherapyDetailModal
        isOpen={selectedService !== null}
        service={selectedService}
        allServices={allServices}
        onClose={() => setSelectedService(null)}
        onSelectService={setSelectedService}
        onBookAssessment={handleBookingScroll}
      />
    </>
  );
};
