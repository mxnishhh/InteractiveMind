import React from 'react';
import Link from 'next/link';
import { Calendar, Phone, MessageSquare } from 'lucide-react';
import { CTA_SECTION, SITE, HERO } from '@/constants';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          {CTA_SECTION.heading}
        </h2>
        
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {CTA_SECTION.description}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={HERO.primaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-slate-700" />
            <span>{CTA_SECTION.bookButtonLabel}</span>
          </Link>

          <Link
            href={`tel:${SITE.phoneRaw}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Phone className="w-4 h-4 text-slate-400" />
            <span>Call {SITE.phone}</span>
          </Link>

          <Link
            href={`https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-tealbrand-700 text-white font-semibold text-sm hover:bg-tealbrand-800 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{CTA_SECTION.whatsappButtonLabel}</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
