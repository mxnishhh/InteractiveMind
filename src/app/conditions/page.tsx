import React from 'react';
import { getConditionsDB } from '@/lib/db';
import { ConditionCard } from '@/components/public/ConditionCard';
import { CTASection } from '@/components/public/CTASection';

export default async function ConditionsPage() {
  const conditions = await getConditionsDB();

  return (
    <div className="space-y-0">
      <section className="bg-white py-16 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
            Conditions We Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Developmental Support
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            We provide individualized, compassionate, and evidence-informed care for children with diverse neurodevelopmental profiles.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
