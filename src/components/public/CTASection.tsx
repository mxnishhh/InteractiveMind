import React from 'react';
import Link from 'next/link';
import { Calendar, Phone, MessageSquare } from 'lucide-react';
import { CTA_SECTION, SITE, HERO } from '@/constants';
import { FadeUp } from '@/components/ui/motion';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#062622] text-white relative overflow-hidden border-t border-brand-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">

        <FadeUp>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300 block mb-3">
            Clinical Guidance &amp; Intake
          </span>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            {CTA_SECTION.heading}
          </h2>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed mt-4">
            {CTA_SECTION.description}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href={HERO.primaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-100 hover:bg-white text-brand-950 font-semibold text-xs tracking-wide shadow-sm hover:shadow-card transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-brand-850" />
              <span>{CTA_SECTION.bookButtonLabel}</span>
            </Link>

            <a
              href={`tel:${SITE.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-900/80 hover:bg-brand-850 text-white font-semibold text-xs tracking-wide border border-brand-700/80 transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-brand-300" />
              <span>Call {SITE.phone}</span>
            </a>

            <a
              href={`https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{CTA_SECTION.whatsappButtonLabel}</span>
            </a>
          </div>
        </FadeUp>

      </div>
    </section>
  );
};
