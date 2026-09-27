import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { CTASection } from './CTASection';

interface TherapyPageContentProps {
  service: Service;
}

export const TherapyPageContent: React.FC<TherapyPageContentProps> = ({ service }) => {
  return (
    <div className="bg-slate-50/50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 font-bold text-xs uppercase tracking-wider">
              Specialized Therapy Service
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              {service.name}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              {service.short_description}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Therapy Assessment</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4">
            {service.image_url && (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-64 lg:h-80 object-cover rounded-2xl border border-slate-100 shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">What is {service.name}?</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {service.description}
              </p>
            </div>

            {service.who_it_helps && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Who Benefits from {service.name}?</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{service.who_it_helps}</p>
              </div>
            )}

            {service.benefits && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Key Benefits</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{service.benefits}</p>
              </div>
            )}

            {service.process_steps && service.process_steps.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">The Therapy Journey</h3>
                <div className="space-y-4">
                  {service.process_steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 leading-snug pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {service.skills_supported && service.skills_supported.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Skills We Build</h4>
                <div className="space-y-2.5">
                  {service.skills_supported.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-brand-600 to-tealbrand-600 text-white rounded-3xl p-6 shadow-md space-y-4">
              <h4 className="text-lg font-bold">Have Questions?</h4>
              <p className="text-xs text-brand-100 leading-relaxed">
                Contact our child development specialists to discuss how {service.name} can benefit your child.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-white text-brand-700 font-bold text-xs uppercase tracking-wider hover:bg-brand-50 transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
