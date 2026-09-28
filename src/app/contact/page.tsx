import React from 'react';
import { ContactForm } from '@/components/public/ContactForm';
import { MapPin, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { getSiteSettingsDB } from '@/lib/db';
import { CONTACT_PAGE, SITE } from '@/constants';
import { FadeUp, FadeIn } from '@/components/ui/motion';

export default async function ContactPage() {
  const settings = await getSiteSettingsDB();

  return (
    <div className="bg-[#faf9f7] min-h-screen py-16 lg:py-24 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Banner */}
        <FadeUp className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
            {CONTACT_PAGE.eyebrow}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight">
            {CONTACT_PAGE.heading}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {CONTACT_PAGE.description}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Contact Details Card */}
          <FadeUp delay={0.1} className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">Direct Contact</span>
                <h2 className="font-serif-heading text-2xl font-bold text-brand-950">{CONTACT_PAGE.cardTitle}</h2>
              </div>

              <div className="space-y-5 text-stone-600 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center shrink-0 border border-brand-100">
                    <MapPin className="w-5 h-5 text-brand-750" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{CONTACT_PAGE.addressLabel}</span>
                    <span className="block font-semibold text-brand-950 leading-relaxed mt-0.5 text-xs sm:text-sm">
                      {settings.site_address || SITE.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center shrink-0 border border-brand-100">
                    <Mail className="w-5 h-5 text-brand-750" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{CONTACT_PAGE.emailLabel}</span>
                    <a
                      href={`mailto:${settings.site_email || SITE.email}`}
                      className="block font-semibold text-brand-950 hover:text-brand-700 transition-colors mt-0.5 text-xs sm:text-sm"
                    >
                      {settings.site_email || SITE.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center shrink-0 border border-brand-100">
                    <Phone className="w-5 h-5 text-brand-750" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{CONTACT_PAGE.phoneLabel}</span>
                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className="block font-semibold text-brand-950 hover:text-brand-700 transition-colors mt-0.5 text-xs sm:text-sm"
                    >
                      {settings.site_phone || SITE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center shrink-0 border border-brand-100">
                    <Clock className="w-5 h-5 text-brand-750" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{CONTACT_PAGE.hoursLabel}</span>
                    <span className="block font-semibold text-brand-950 mt-0.5 text-xs sm:text-sm">
                      {settings.working_hours || SITE.workingHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <a
                  href={`https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{CONTACT_PAGE.whatsappButtonText}</span>
                </a>

                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200/80 font-semibold text-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-700" />
                  <span>Call Centre: {SITE.phone}</span>
                </a>
              </div>
            </div>
          </FadeUp>

          {/* Interactive Form Card */}
          <FadeIn delay={0.2} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">Direct Message</span>
                <h2 className="font-serif-heading text-2xl font-bold text-brand-950">{CONTACT_PAGE.formTitle}</h2>
              </div>
              <ContactForm />
            </div>
          </FadeIn>

        </div>

      </div>
    </div>
  );
}
