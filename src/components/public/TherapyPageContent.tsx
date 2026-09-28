import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { Calendar, Check, Phone, MessageSquare } from 'lucide-react';
import { HERO, SITE } from '@/constants';
import { CTASection } from '@/components/public/CTASection';
import {
  FadeUp,
  FadeIn,
  ImageReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/motion';

interface TherapyPageContentProps {
  service: Service;
}

const THERAPY_IMAGE_MAP: Record<string, string> = {
  'aba-therapy': '/images/homepage/therapy-aba.jpg',
  'occupational-therapy': '/images/homepage/therapy-occupational.jpg',
  'speech-therapy': '/images/homepage/therapy-speech.jpg',
  'special-education': '/images/homepage/therapy-special-education.jpg',
  'sensory-integration': '/images/homepage/therapy-sensory.jpg',
  'clinical-psychology': '/images/homepage/therapy-psychology.jpg',
  'school-readiness': '/images/homepage/therapy-school-readiness.jpg',
  'physiotherapy': '/images/homepage/therapy-physiotherapy.jpg',
  'parent-guidance': '/images/homepage/therapy-parent-guidance.jpg',
};

export const TherapyPageContent: React.FC<TherapyPageContentProps> = ({ service }) => {
  const imageUrl = THERAPY_IMAGE_MAP[service.slug] || service.image_url;

  return (
    <div className="bg-[#faf9f7] min-h-screen text-stone-800">

      {/* Hero Header */}
      <section className="py-12 lg:py-20 border-b border-stone-200/80 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <FadeUp className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <Link href="/therapies" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brand-800 transition-colors">
                  Therapies
                </Link>
                <span className="text-stone-300">/</span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Program Overview
                </span>
              </div>

              <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight">
                {service.name}
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                {service.short_description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={HERO.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-850 hover:bg-brand-900 text-white font-semibold text-xs tracking-wide shadow-card hover:shadow-card-hover transition-all duration-200"
                >
                  <Calendar className="w-4 h-4 text-brand-200" />
                  <span>{HERO.primaryCta.label}</span>
                </Link>

                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-900 font-semibold text-xs tracking-wide border border-brand-200/80 transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-brand-700" />
                  <span>Call {SITE.phone}</span>
                </a>
              </div>
            </FadeUp>

            <div className="lg:col-span-5">
              {imageUrl && (
                <ImageReveal delay={0.15}>
                  <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-stone-100 border border-stone-200/90 shadow-soft">
                    <img
                      src={imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ImageReveal>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">

              <FadeUp className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-soft space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                  Clinical Overview
                </span>
                <h2 className="font-serif-heading text-2xl font-bold text-brand-950">
                  What is {service.name}?
                </h2>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>
              </FadeUp>

              {service.who_it_helps && (
                <FadeUp delay={0.08} className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-soft space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                    Target Developmental Areas
                  </span>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950">
                    Who Benefits from {service.name}?
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                    {service.who_it_helps}
                  </p>
                </FadeUp>
              )}

              {service.benefits && (
                <FadeUp delay={0.12} className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-soft space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                    Therapeutic Outcomes
                  </span>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950">
                    Key Developmental Benefits
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                    {service.benefits}
                  </p>
                </FadeUp>
              )}

              {service.process_steps && service.process_steps.length > 0 && (
                <FadeUp delay={0.16} className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-soft space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
                      Structured Framework
                    </span>
                    <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950">
                      The Therapy Process
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {service.process_steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf9f7] border border-stone-200/80 text-xs sm:text-sm text-stone-700"
                      >
                        <span className="w-7 h-7 rounded-xl bg-brand-50 text-brand-850 font-bold flex items-center justify-center shrink-0 border border-brand-100 text-xs">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed font-medium text-brand-950">{step}</span>
                      </div>
                    ))}
                  </div>
                </FadeUp>
              )}

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6 sticky top-28">

              {service.skills_supported && service.skills_supported.length > 0 && (
                <FadeIn delay={0.15} className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-soft space-y-4">
                  <h4 className="font-serif-heading text-lg font-bold text-brand-950">Skills We Build</h4>
                  <div className="space-y-2.5 text-xs font-medium text-stone-700">
                    {service.skills_supported.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#faf9f7] border border-stone-100">
                        <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-850 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-brand-750" strokeWidth={3} />
                        </div>
                        <span className="text-stone-800">{skill}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              )}

              {/* Consultation Card */}
              <FadeIn delay={0.2} className="bg-[#062622] text-white rounded-3xl p-8 border border-brand-900/80 shadow-card space-y-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 block">
                  Interactive Minds Guidance
                </span>
                <h4 className="font-serif-heading text-xl font-bold leading-snug">
                  Have Questions About {service.name}?
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Speak directly with our child development team in Patna to understand how this therapy can support your child.
                </p>

                <div className="pt-2 space-y-3">
                  <Link
                    href="/appointment"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-100 hover:bg-white text-brand-950 font-semibold text-xs tracking-wide shadow-sm transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 text-brand-850" />
                    <span>Book an Assessment</span>
                  </Link>

                  <a
                    href={`https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Enquiry</span>
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
};
