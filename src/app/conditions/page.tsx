import React from 'react';
import { getConditionsDB } from '@/lib/db';
import { ConditionCard } from '@/components/public/ConditionCard';
import { CTASection } from '@/components/public/CTASection';

export default async function ConditionsPage() {
  const conditions = await getConditionsDB();

  return (
    <div className="space-y-0">
      <section className="bg-gradient-to-b from-tealbrand-50/70 to-white py-16 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-tealbrand-100 text-tealbrand-800 text-xs font-bold uppercase tracking-wider">
            Conditions We Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Developmental Support
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We provide individualized, compassionate, and evidence-informed care for children with diverse neurodevelopmental profiles.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((condition) => (
              <ConditionCard key={condition.id} condition={condition} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
