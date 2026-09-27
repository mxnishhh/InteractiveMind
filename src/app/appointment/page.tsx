import React from 'react';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { getServicesDB } from '@/lib/db';
import { ShieldCheck, HeartHandshake } from 'lucide-react';
import { APPOINTMENT_PAGE } from '@/constants';

export default async function AppointmentPage() {
  const services = await getServicesDB();

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
            {APPOINTMENT_PAGE.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {APPOINTMENT_PAGE.heading}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            {APPOINTMENT_PAGE.description}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200/80 shadow-sm">
          <AppointmentForm services={services} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">{APPOINTMENT_PAGE.confidentialTitle}</h4>
              <p className="text-slate-500 leading-relaxed mt-0.5">{APPOINTMENT_PAGE.confidentialDesc}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-3 text-xs">
            <HeartHandshake className="w-5 h-5 text-tealbrand-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">{APPOINTMENT_PAGE.guaranteeTitle}</h4>
              <p className="text-slate-500 leading-relaxed mt-0.5">{APPOINTMENT_PAGE.guaranteeDesc}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
