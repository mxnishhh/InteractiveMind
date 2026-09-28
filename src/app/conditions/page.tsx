import React from 'react';
import { getConditionsDB } from '@/lib/db';
import { ConditionCard } from '@/components/public/ConditionCard';
import { CTASection } from '@/components/public/CTASection';

export default async function ConditionsPage() {
  const conditions = await getConditionsDB();

  return (
    <div className="space-y-0 text-stone-800">

      {/* Hero Banner */}
      <section className="bg-[#faf9f7] py-16 lg:py-24 border-b border-stone-200/80 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
            Conditions We Support
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight max-w-4xl">
            Comprehensive Developmental Support
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            We provide individualized, compassionate, and evidence-informed care for children with diverse neurodevelopmental profiles.
          </p>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-20 lg:py-28 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
