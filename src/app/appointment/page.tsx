import React from 'react';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { getServicesDB } from '@/lib/db';
import { Calendar, ShieldCheck, HeartHandshake } from 'lucide-react';

export default async function AppointmentPage() {
  const services = await getServicesDB();

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Child Development Assessment
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Book an Initial Assessment
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Please fill out the form below to request a developmental evaluation. Our intake coordinator will review your request and contact you to finalize the schedule.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm">
          <AppointmentForm services={services} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Confidential & Supportive</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Your family privacy is paramount. All information submitted remains strictly confidential.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <HeartHandshake className="w-8 h-8 text-tealbrand-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">No Guaranteed Booking</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                This is an appointment request. Submission confirms request receipt; slot confirmation follows intake contact.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
