import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/public/Hero';
import { ServiceCard } from '@/components/public/ServiceCard';
import { ConditionCard } from '@/components/public/ConditionCard';
import { CTASection } from '@/components/public/CTASection';
import { Accordion } from '@/components/ui/Accordion';
import { getServicesDB, getConditionsDB, getFaqsDB, getTeamMembersDB } from '@/lib/db';
import { ArrowRight } from 'lucide-react';
import { ABOUT_PAGE, CORE_PRINCIPLES, THERAPY_JOURNEY, UI_TEXT } from '@/constants';

export default async function HomePage() {
  const [services, conditions, faqs, teamMembers] = await Promise.all([
    getServicesDB(),
    getConditionsDB(),
    getFaqsDB(),
    getTeamMembersDB(),
  ]);

  const featuredService = services.find((s) => s.slug === 'occupational-therapy') || services[0];
  const otherServices = services.filter((s) => s.id !== featuredService?.id);

  return (
    <div className="space-y-0">
      
      {/* 1 & 2. Hero Section */}
      <Hero />

      {/* 3. Short Editorial Introduction */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
                {ABOUT_PAGE.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {ABOUT_PAGE.philosophyTitle}
              </h2>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-tealbrand-700 transition-colors"
                >
                  <span>{UI_TEXT.readStory}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>{ABOUT_PAGE.subheading}</p>
              <p>{ABOUT_PAGE.philosophyText1}</p>
              <p>{ABOUT_PAGE.philosophyText2}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Therapies Section */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
                Specialized Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Therapies & Developmental Programs
              </h2>
            </div>
            <Link
              href="/therapies"
              className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-tealbrand-700 inline-flex items-center gap-1"
            >
              <span>{UI_TEXT.viewAll} 9 Therapies</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Featured Service Spotlight */}
          {featuredService && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded bg-tealbrand-50 text-tealbrand-800 inline-block">
                  Featured Program
                </span>
                <h3 className="text-2xl font-bold text-slate-900">{featuredService.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{featuredService.description}</p>
                <div className="pt-2">
                  <Link
                    href={`/therapies/${featuredService.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                  >
                    <span>{UI_TEXT.readDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <img
                  src={featuredService.image_url}
                  alt={featuredService.name}
                  className="w-full h-64 object-cover rounded-lg border border-slate-200/80"
                />
              </div>
            </div>
          )}

          {/* Remaining Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Conditions Supported Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
                Individualized Support
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Conditions We Support
              </h2>
            </div>
            <Link
              href="/conditions"
              className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-tealbrand-700 inline-flex items-center gap-1"
            >
              <span>{UI_TEXT.viewAll} Conditions</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition) => (
              <ConditionCard key={condition.id} condition={condition} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. Editorial Philosophy / Pillars */}
      <section className="py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-100">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Parents Choose Interactive Minds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-slate-800">
            {CORE_PRINCIPLES.map((pillar, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Therapy Journey */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
              Structured Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Therapy Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {THERAPY_JOURNEY.map((step) => (
              <div key={step.step} className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase">{step.step}</span>
                <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Multidisciplinary Team */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
              {ABOUT_PAGE.teamEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {ABOUT_PAGE.teamHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                <span className="block text-xs font-bold text-tealbrand-700 uppercase tracking-wider">{member.role}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-3 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Common Questions from Parents
            </h2>
          </div>

          <Accordion items={faqs} />

        </div>
      </section>

      {/* 10. Final CTA */}
      <CTASection />

    </div>
  );
}
