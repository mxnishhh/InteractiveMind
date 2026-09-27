import React from 'react';
import { getServicesDB } from '@/lib/db';
import { ServiceCard } from '@/components/public/ServiceCard';
import { CTASection } from '@/components/public/CTASection';

export default async function TherapiesPage() {
  const services = await getServicesDB();

  return (
    <div className="space-y-0">
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-16 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Therapies & Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Specialized Child Development Therapies
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover our full spectrum of evidence-based, neurodiversity-affirming therapy programs designed around your child’s unique strengths and developmental needs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
