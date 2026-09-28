'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Heart, Sparkles } from 'lucide-react';
import { HERO } from '@/constants';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative pt-8 pb-16 lg:pt-16 lg:pb-28 overflow-hidden subtle-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Eyebrow Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-850 bg-brand-100/70 border border-brand-200">
            <span className="w-2 h-2 rounded-full bg-brand-700 animate-pulse"></span>
            Autism Care &amp; Child Development Centre • Patna
          </span>
          <span className="hidden md:inline-block text-xs font-medium text-stone-500">
            Evidence-Informed Pediatric Developmental Therapies
          </span>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Typography & Intent (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-brand-950 leading-[1.12]">
              Nurturing every child’s voice, confidence, and potential.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl">
              Every child develops on their own unique timeline. At Interactive Minds, we partner closely with families to understand your child&apos;s innate strengths, celebrate their individuality, and nurture meaningful growth through gentle, evidence-informed developmental care.
            </p>

            {/* Dual Primary / Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#appointment"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-brand-850 hover:bg-brand-900 rounded-full shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <span>{HERO.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="#therapies"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-brand-850 bg-white hover:bg-stone-50 border border-stone-300/80 rounded-full shadow-sm hover:border-brand-700 transition-all duration-200"
              >
                Explore Our 9 Therapies
              </Link>
            </div>

            {/* Trust & Clinical Highlights Strip */}
            <div className="pt-8 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-brand-700 shrink-0" strokeWidth={2.5} />
                  <span className="font-serif-heading text-base font-bold text-brand-900 leading-tight">Child-Centred Care</span>
                </div>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">Recognizing distinct emotional &amp; sensory needs</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-brand-700 shrink-0" strokeWidth={2.5} />
                  <span className="font-serif-heading text-base font-bold text-brand-900 leading-tight">Individualized Pathways</span>
                </div>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">Tailored goals co-designed for home &amp; school</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-brand-700 shrink-0" strokeWidth={2.5} />
                  <span className="font-serif-heading text-base font-bold text-brand-900 leading-tight">Parent Partnership</span>
                </div>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">Collaborative guidance &amp; active home strategies</p>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Editorial Parent+Child Image (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-stone-100 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full">
              <img
                src="/images/homepage/hero-parent-child.jpg"
                alt="Caregiver and child gently engaged in a calm creative developmental activity together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent"></div>

              {/* Inset Badge on Image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                    <Heart className="w-4 h-4 fill-brand-100" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-700 block">FAMILY-CENTERED CARE</span>
                    <span className="text-xs font-semibold text-stone-800">Partnering with parents every step of the journey</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              </div>
            </div>

            {/* Floating Child-Centred Badge */}
            <div className="hidden sm:flex absolute -top-5 -left-6 bg-white rounded-2xl p-4 shadow-card border border-stone-200/90 items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-tight">Neurodiversity-Affirming</p>
                <p className="text-[11px] text-stone-500">Strengths-Based Approach</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
