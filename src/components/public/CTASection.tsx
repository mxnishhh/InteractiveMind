import React from 'react';
import Link from 'next/link';
import { Calendar, Phone, MessageSquare } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-700 via-brand-600 to-tealbrand-600 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          Every Child Has Their Own Way to Shine
        </h2>
        
        <p className="text-lg text-brand-100 max-w-2xl mx-auto mb-10 font-normal">
          Take the first step towards understanding your child’s developmental needs. Contact our team to schedule a supportive assessment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/appointment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base shadow-lg hover:bg-brand-50 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>Book an Assessment</span>
          </Link>
          
          <Link
            href="tel:+919876543210"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-brand-800/60 hover:bg-brand-800 text-white font-bold text-base border border-white/20 backdrop-blur transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Call Now</span>
          </Link>

          <Link
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span>WhatsApp Us</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
