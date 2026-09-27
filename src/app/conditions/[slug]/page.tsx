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
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-3">
          <span className="text-xs font-bold text-tealbrand-700 uppercase tracking-wider">
            Condition Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {condition.name}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            {condition.short_description}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Understanding {condition.name}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {condition.description}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Recommended Therapy Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.slice(0, 4).map((service) => (
                  <Link
                    key={service.id}
                    href={`/therapies/${service.slug}`}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-slate-800 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-bold text-slate-800 text-sm group-hover:text-slate-900">{service.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-8 shadow-sm space-y-4">
              <ShieldCheck className="w-8 h-8 text-tealbrand-100" />
              <h3 className="text-xl font-bold">Book an Assessment</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schedule an evaluation session with our specialists to discuss personalized support for your child.
              </p>
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm"
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
