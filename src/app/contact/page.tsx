import React from 'react';
import { ContactForm } from '@/components/public/ContactForm';
import { MapPin, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { getSiteSettingsDB } from '@/lib/db';

export default async function ContactPage() {
  const settings = await getSiteSettingsDB();

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Connect With Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact Interactive Minds
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Our team provides gentle guidance. Expect a direct connection with our intake coordinator within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Center Information</h3>
              
              <div className="space-y-5 text-slate-600 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">Physical Address</span>
                    <span className="block font-semibold text-slate-900 mt-0.5 leading-snug">
                      {settings.site_address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-tealbrand-50 text-tealbrand-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">Email Address</span>
                    <a href={`mailto:${settings.site_email}`} className="block font-semibold text-slate-900 hover:text-brand-600 transition-colors mt-0.5">
                      {settings.site_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">Phone Support</span>
                    <a href={`tel:${settings.site_phone}`} className="block font-semibold text-slate-900 hover:text-brand-600 transition-colors mt-0.5">
                      {settings.site_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">Working Hours</span>
                    <span className="block font-semibold text-slate-900 mt-0.5">
                      {settings.working_hours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
