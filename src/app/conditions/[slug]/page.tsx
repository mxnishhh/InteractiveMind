import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getConditionBySlugDB, getServicesDB } from '@/lib/db';
import { CTASection } from '@/components/public/CTASection';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function ConditionDetailPage({ params }: { params: { slug: string } }) {
  const [condition, services] = await Promise.all([
    getConditionBySlugDB(params.slug),
    getServicesDB(),
  ]);

  if (!condition) {
    notFound();
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-tealbrand-50 text-tealbrand-700 font-bold text-xs uppercase tracking-wider">
            Condition Overview
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {condition.name}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            {condition.short_description}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Understanding {condition.name}</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {condition.description}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Recommended Therapy Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.slice(0, 4).map((service) => (
                  <Link
                    key={service.id}
                    href={`/therapies/${service.slug}`}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-300 hover:bg-brand-50/40 transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-slate-800 text-sm group-hover:text-brand-600">{service.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-brand-600 to-tealbrand-600 text-white rounded-3xl p-8 shadow-xl space-y-6">
              <ShieldCheck className="w-10 h-10 text-brand-200" />
              <h3 className="text-2xl font-bold">Book an Assessment</h3>
              <p className="text-sm text-brand-100 leading-relaxed">
                Schedule a evaluation session with our specialists to discuss personalized support for your child.
              </p>
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white text-brand-700 font-bold text-sm shadow-md hover:bg-brand-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Assessment</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
