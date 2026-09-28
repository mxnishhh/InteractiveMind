'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/types';
import { ServiceCard } from './ServiceCard';
import { TherapyDetailModal } from './TherapyDetailModal';

interface TherapiesSectionProps {
  featuredService: Service | null;
  otherServices: Service[];
  allServices: Service[];
}

export const TherapiesSection: React.FC<TherapiesSectionProps> = ({
  featuredService,
  otherServices,
  allServices,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleBookingScroll = () => {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section id="therapies" className="py-20 lg:py-28 bg-[#faf9f7] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Title Header */}
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">
              Specialized Programs
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
              Our 9 Developmental Therapies
            </h2>
            <p className="text-stone-600 text-base mt-3">
              Every discipline is led by qualified pediatric clinicians, structured to nurture communication, motor coordination, cognitive progress, and self-confidence.
            </p>
          </div>

          {/* FEATURED SPOTLIGHT CARD: Occupational Therapy / Selected */}
          {featuredService && (
            <div
              onClick={() => setSelectedService(featuredService)}
              className="mb-12 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-brand-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden cursor-pointer group text-left"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedService(featuredService);
                }
              }}
              aria-label={`View clinical details for ${featuredService.name}`}
            >
              <div className="absolute top-0 right-0 bg-brand-100 text-brand-850 px-4 py-1.5 rounded-bl-2xl text-xs font-bold uppercase tracking-wider z-10">
                Featured Program
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

                {/* Image Column (5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 shadow-md border-2 border-stone-100 group-hover:border-brand-700 transition-colors">
                    <img
                      src={featuredService.image_url || "/images/homepage/therapy-occupational.jpg"}
                      alt={featuredService.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-brand-850 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow">
                    Sensory &amp; Motor Mastery
                  </div>
                </div>

                {/* Content Column (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Early Motor &amp; Daily Living</span>
                  </div>
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950 group-hover:text-brand-850 transition-colors">
                    {featuredService.name}
                  </h3>
                  <p className="text-base text-stone-700 leading-relaxed">
                    {featuredService.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                      <span className="text-brand-700">✓</span>
                      <span>Fine &amp; Gross Motor Coordination</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                      <span className="text-brand-700">✓</span>
                      <span>Sensory Modulation &amp; Calming</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                      <span className="text-brand-700">✓</span>
                      <span>Handwriting &amp; Grasp Readiness</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                      <span className="text-brand-700">✓</span>
                      <span>Self-Care &amp; Daily Autonomy</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-brand-850 hover:bg-brand-900 text-white font-semibold text-xs transition-colors shadow-sm">
                      <span>Explore Therapy Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Remaining Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={setSelectedService}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Therapy Detail Modal - Managed at Section Level */}
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
