import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200/80 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-tealbrand-700">
              Autism Care & Child Development Centre
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Helping Every Child Learn, Grow & Shine
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Interactive Minds creates a safe, supportive, and encouraging environment where children develop meaningful communication, motor abilities, cognitive learning, and everyday independence.
            </p>

            {/* Restrained CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Assessment</span>
              </Link>

              <Link
                href="/therapies"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-tealbrand-700 transition-colors py-2"
              >
                <span>Explore Our Therapies</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Authentic Photography */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200"
                alt="Therapist engaged in developmental activities with a child at Interactive Minds"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover"
              />
              <div className="p-4 bg-slate-900 text-white text-xs">
                <span className="font-semibold block">Interactive Minds Centre Environment</span>
                <span className="text-slate-300 text-[11px]">Individualized, child-focused developmental therapy sessions.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
