import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { HERO } from '@/constants';

export const Hero: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200/80 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-tealbrand-700">
              {HERO.eyebrow}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {HERO.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {HERO.description}
            </p>

            {/* Restrained CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>{HERO.primaryCta.label}</span>
              </Link>

              <Link
                href={HERO.secondaryCta.href}
                className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-tealbrand-700 transition-colors py-2"
              >
                <span>{HERO.secondaryCta.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-100">
              <img
                src={HERO.heroImage}
                alt={HERO.imageAlt}
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover"
              />
              <div className="p-4 bg-slate-900 text-white text-xs">
                <span className="font-semibold block">{HERO.imageCaptionTitle}</span>
                <span className="text-slate-300 text-[11px]">{HERO.imageCaptionSub}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
