'use client';

import React, { useState, useEffect } from 'react';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { ContactInquiryForm } from '@/components/public/ContactInquiryForm';
import { Service } from '@/types';
import { Calendar, MessageSquare, Sparkles } from 'lucide-react';

interface AppointmentInquiryCardProps {
  services?: Service[];
  defaultTab?: 'appointment' | 'inquiry';
}

export const AppointmentInquiryCard: React.FC<AppointmentInquiryCardProps> = ({
  services = [],
  defaultTab = 'appointment',
}) => {
  const [activeTab, setActiveTab] = useState<'appointment' | 'inquiry'>(defaultTab);

  // Sync active tab with URL hash if user navigated to #contact or #inquiry
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#inquiry' || hash === '#contact' || hash === '#message') {
        setActiveTab('inquiry');
      } else if (hash === '#appointment' || hash === '#booking') {
        setActiveTab('appointment');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      {/* Top Segmented Tab Switcher */}
      <div className="flex p-1.5 bg-stone-100/90 rounded-2xl mb-6 sm:mb-8 border border-stone-200/90 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('appointment')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            activeTab === 'appointment'
              ? 'bg-white text-brand-950 shadow-soft border border-stone-200/80 ring-1 ring-black/5'
              : 'text-stone-600 hover:text-brand-900 hover:bg-white/50'
          }`}
          aria-selected={activeTab === 'appointment'}
          role="tab"
        >
          <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'appointment' ? 'text-brand-700' : 'text-stone-500'}`} />
          <span className="whitespace-nowrap">Book Assessment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiry')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            activeTab === 'inquiry'
              ? 'bg-white text-brand-950 shadow-soft border border-stone-200/80 ring-1 ring-black/5'
              : 'text-stone-600 hover:text-brand-900 hover:bg-white/50'
          }`}
          aria-selected={activeTab === 'inquiry'}
          role="tab"
        >
          <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'inquiry' ? 'text-brand-700' : 'text-stone-500'}`} />
          <span className="whitespace-nowrap">Have a Question?</span>
        </button>
      </div>

      {/* Tab 1: Appointment Booking */}
      {activeTab === 'appointment' && (
        <div className="animate-fade-in space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clinical Intake Request</span>
            </div>
            <h3 className="font-serif-heading text-2xl font-bold text-brand-950">
              Schedule an Assessment
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
              Complete this intake request and our coordinator will reach out to confirm clinical evaluation dates and answer intake questions.
            </p>
          </div>

          <AppointmentForm services={services} />
        </div>
      )}

      {/* Tab 2: General Inquiry / Contact Message */}
      {activeTab === 'inquiry' && (
        <div className="animate-fade-in space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>General Enquiry &amp; Guidance</span>
            </div>
            <h3 className="font-serif-heading text-2xl font-bold text-brand-950">
              Send an Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
              Have a question about our developmental therapies, timings, or approach? Leave a message and our team will get back to you within 24 hours.
            </p>
          </div>

          <ContactInquiryForm />
        </div>
      )}
    </div>
  );
};
