import React from 'react';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { getServicesDB } from '@/lib/db';
import { ShieldCheck, HeartHandshake } from 'lucide-react';
import { APPOINTMENT_PAGE, SITE } from '@/constants';
import { FadeUp, FadeIn } from '@/components/ui/motion';

export default async function AppointmentPage() {
  const services = await getServicesDB();

  return (
    <div className="bg-[#faf9f7] min-h-screen py-16 lg:py-24 text-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Banner */}
        <FadeUp className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
            {APPOINTMENT_PAGE.eyebrow}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight">
            {APPOINTMENT_PAGE.heading}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {APPOINTMENT_PAGE.description}
          </p>
        </FadeUp>

        {/* Form Container */}
        <FadeIn delay={0.15} className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-card">
          <div className="mb-8 pb-6 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">Clinical Intake</span>
            <h2 className="font-serif-heading text-2xl font-bold text-brand-950">Appointment Intake Request</h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">Please provide child developmental details to help us prepare for your consultation.</p>
          </div>
          <AppointmentForm services={services} />
        </FadeIn>

        {/* Trust Badges Row */}
        <FadeUp delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft flex items-start gap-4 text-xs">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center shrink-0 border border-brand-100">
              <ShieldCheck className="w-5 h-5 text-brand-750" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-brand-950 text-sm">{APPOINTMENT_PAGE.confidentialTitle}</h3>
              <p className="text-stone-600 leading-relaxed mt-1">{APPOINTMENT_PAGE.confidentialDesc}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft flex items-start gap-4 text-xs">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center shrink-0 border border-brand-100">
              <HeartHandshake className="w-5 h-5 text-brand-750" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-brand-950 text-sm">{APPOINTMENT_PAGE.guaranteeTitle}</h3>
              <p className="text-stone-600 leading-relaxed mt-1">{APPOINTMENT_PAGE.guaranteeDesc}</p>
            </div>
          </div>
        </FadeUp>

        {/* Quick Phone Support Assistance */}
        <FadeIn delay={0.25} className="text-center pt-2">
          <p className="text-xs text-stone-500">
            Need immediate guidance? Call our clinical intake line directly at{' '}
            <a href={`tel:${SITE.phoneRaw}`} className="font-bold text-brand-850 hover:underline">
              {SITE.phone}
            </a>
          </p>
        </FadeIn>

      </div>
    </div>
  );
}
