import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getConditionBySlugDB, getServicesDB } from '@/lib/db';
import { CTASection } from '@/components/public/CTASection';
import { Calendar, ArrowRight, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { SITE, HERO } from '@/constants';
import { FadeUp, FadeIn } from '@/components/ui/motion';

export default async function ConditionDetailPage({ params }: { params: { slug: string } }) {
  const [condition, services] = await Promise.all([
    getConditionBySlugDB(params.slug),
    getServicesDB(),
  ]);

  if (!condition) {
    notFound();
  }

  return (
    <div className="bg-[#faf9f7] min-h-screen text-stone-800">

      {/* Hero Header */}
      <section className="py-12 lg:py-20 border-b border-stone-200/80 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <FadeUp className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/conditions" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brand-800 transition-colors">
                Conditions
              </Link>
              <span className="text-stone-300">/</span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Condition Overview
              </span>
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight">
                {condition.name}
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                {condition.short_description}
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Main Column */}
            <div className="lg:col-span-8 space-y-8">

              <FadeUp className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-soft space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                  Clinical Overview
                </span>
                <h2 className="font-serif-heading text-2xl font-bold text-brand-950">
                  Understanding {condition.name}
                </h2>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {condition.description}
                </p>
              </FadeUp>

              <FadeUp delay={0.1} className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-soft space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
                    Multidisciplinary Care
                  </span>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950">
                    Recommended Therapy Programs
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Evidence-based therapy services tailored to support children with {condition.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.slice(0, 4).map((service) => (
                    <Link
                      key={service.id}
                      href={`/therapies/${service.slug}`}
                      className="p-5 rounded-2xl bg-[#faf9f7] border border-stone-200/80 hover:border-brand-300 hover:shadow-soft transition-all duration-200 flex items-center justify-between group"
                    >
                      <span className="font-serif-heading font-bold text-brand-950 text-sm group-hover:text-brand-850 transition-colors">
                        {service.name}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-800 flex items-center justify-center shrink-0 border border-brand-100 group-hover:bg-brand-100 group-hover:translate-x-0.5 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </FadeUp>

            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6 sticky top-28">

              <FadeIn delay={0.15} className="bg-[#062622] text-white rounded-3xl p-8 border border-brand-900/80 shadow-card space-y-5">
                <div className="w-10 h-10 rounded-2xl bg-brand-900 text-brand-300 flex items-center justify-center border border-brand-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold leading-snug">
                  Book a Comprehensive Evaluation
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Schedule an initial intake consultation with our pediatric specialists in Patna to discuss personalized support for your child.
                </p>

                <div className="pt-2 space-y-3">
                  <Link
                    href="/appointment"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-100 hover:bg-white text-brand-950 font-semibold text-xs tracking-wide shadow-sm transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 text-brand-850" />
                    <span>Book Assessment</span>
                  </Link>

                  <a
                    href={`tel:${SITE.phoneRaw}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-900/80 hover:bg-brand-850 text-white font-semibold text-xs tracking-wide border border-brand-700/80 transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 text-brand-300" />
                    <span>Call {SITE.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Guidance</span>
                  </a>
                </div>
              </FadeIn>

            </div>

          </div>
        </div>
      </section>

      <CTASection />

    </div>
  );
}
