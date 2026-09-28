import React from 'react';
import { getServicesDB } from '@/lib/db';
import { ServiceCard } from '@/components/public/ServiceCard';
import { CTASection } from '@/components/public/CTASection';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion';

export default async function TherapiesPage() {
  const services = await getServicesDB();

  return (
    <div className="space-y-0 text-stone-800">

      {/* Hero Banner */}
      <section className="bg-[#faf9f7] py-16 lg:py-24 border-b border-stone-200/80 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              Therapies &amp; Services
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight max-w-4xl">
              Specialized Child Development Therapies
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
              Discover our full spectrum of evidence-based, neurodiversity-affirming therapy programs designed around your child’s unique strengths and developmental needs.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
