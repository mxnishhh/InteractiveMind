import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { UI_TEXT, HERO } from '@/constants';

interface TherapyPageContentProps {
  service: Service;
}

export const TherapyPageContent: React.FC<TherapyPageContentProps> = ({ service }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Banner */}
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block text-xs font-bold text-tealbrand-700 uppercase tracking-wider">
              Specialized Therapy Program
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {service.name}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
              {service.short_description}
            </p>
            <div className="pt-2">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{HERO.primaryCta.label}</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4">
            {service.image_url && (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-64 object-cover rounded-lg border border-slate-200/80"
              />
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-slate-900">What is {service.name}?</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>

            {service.who_it_helps && (
              <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Who Benefits from {service.name}?</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{service.who_it_helps}</p>
              </div>
            )}

            {service.benefits && (
              <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Key Benefits</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{service.benefits}</p>
              </div>
            )}

            {service.process_steps && service.process_steps.length > 0 && (
              <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">The Therapy Process</h3>
                <div className="space-y-3">
                  {service.process_steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-800">
                      <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {service.skills_supported && service.skills_supported.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <h4 className="text-base font-bold text-slate-900">Skills We Build</h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {service.skills_supported.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-tealbrand-700 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-base font-bold">Have Questions?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Contact our child development specialists to discuss how {service.name} can benefit your child.
              </p>
              <Link
                href="/contact"
                className="inline-block text-center w-full py-2.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                {UI_TEXT.contactTeam}
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
