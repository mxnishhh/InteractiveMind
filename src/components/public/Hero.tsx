import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50/40 to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-tealbrand-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Autism Care & Child Development Centre</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Helping Every Child <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 to-tealbrand-600 bg-clip-text text-transparent">
                Learn, Grow & Shine
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              At Interactive Minds, we create a safe, supportive, and encouraging environment where every child can develop meaningful communication, motor skills, learning, and independence.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                <span>Child-Centred Care</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                <span>Individualized Plans</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                <span>Family Partnership</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Assessment</span>
              </Link>
              <Link
                href="/therapies"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all"
              >
                <span>Explore Our Therapies</span>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-600 to-tealbrand-500 rounded-3xl blur opacity-30"></div>
              
              <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-2">
                  <Heart className="w-8 h-8 fill-brand-100 text-brand-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  A Place Where Every Child Can Grow
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become more independent.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">Experienced Multidisciplinary Team</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Sparkles className="w-5 h-5 text-tealbrand-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">Neurodiversity-Affirming Support</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/about"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    Learn More About Our Philosophy →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
