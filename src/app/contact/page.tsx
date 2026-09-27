import React from 'react';
import { ContactForm } from '@/components/public/ContactForm';
import { MapPin, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { getSiteSettingsDB } from '@/lib/db';
import { CONTACT_PAGE, SITE } from '@/constants';

export default async function ContactPage() {
  const settings = await getSiteSettingsDB();

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
            {CONTACT_PAGE.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {CONTACT_PAGE.heading}
          </h1>
          <p className="text-slate-600 text-base max-w-2xl leading-relaxed">
            {CONTACT_PAGE.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">{CONTACT_PAGE.cardTitle}</h3>
              
              <div className="space-y-4 text-slate-600 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">{CONTACT_PAGE.addressLabel}</span>
                    <span className="block font-semibold text-slate-900 leading-relaxed mt-0.5">
                      {settings.site_address || SITE.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">{CONTACT_PAGE.emailLabel}</span>
                    <a href={`mailto:${settings.site_email || SITE.email}`} className="block font-semibold text-slate-900 hover:text-tealbrand-700 transition-colors mt-0.5">
                      {settings.site_email || SITE.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">{CONTACT_PAGE.phoneLabel}</span>
                    <a href={`tel:${SITE.phoneRaw}`} className="block font-semibold text-slate-900 hover:text-tealbrand-700 transition-colors mt-0.5">
                      {settings.site_phone || SITE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">{CONTACT_PAGE.hoursLabel}</span>
                    <span className="block font-semibold text-slate-900 mt-0.5">
                      {settings.working_hours || SITE.workingHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-tealbrand-700 hover:bg-tealbrand-800 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{CONTACT_PAGE.whatsappButtonText}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">{CONTACT_PAGE.formTitle}</h3>
              <ContactForm />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
