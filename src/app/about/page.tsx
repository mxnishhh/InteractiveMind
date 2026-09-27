import React from 'react';
import { getTeamMembersDB } from '@/lib/db';
import { CTASection } from '@/components/public/CTASection';
import { CheckCircle2 } from 'lucide-react';
import { ABOUT_PAGE, APPROACH_PILLARS } from '@/constants';

export default async function AboutPage() {
  const teamMembers = await getTeamMembersDB();

  return (
    <div className="space-y-0">
      
      {/* Hero Banner */}
      <section className="bg-white py-16 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
            {ABOUT_PAGE.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {ABOUT_PAGE.heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {ABOUT_PAGE.subheading}
          </p>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {ABOUT_PAGE.philosophyTitle}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {ABOUT_PAGE.philosophyText1}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                {ABOUT_PAGE.philosophyText2}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ABOUT_PAGE.highlights.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-3 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-tealbrand-700 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Mission Pillars */}
            <div className="lg:col-span-5 bg-white p-8 rounded-xl border border-slate-200/80 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{ABOUT_PAGE.missionTitle}</h3>
              
              <div className="space-y-6 text-xs text-slate-600">
                {APPROACH_PILLARS.map((pillar) => (
                  <div key={pillar.title} className="space-y-1">
                    <span className="block font-bold text-sm text-slate-900">{pillar.title}</span>
                    <p className="leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">{ABOUT_PAGE.teamEyebrow}</span>
            <h2 className="text-2xl font-extrabold text-slate-900">{ABOUT_PAGE.teamHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                <span className="block text-xs font-bold uppercase tracking-wider text-tealbrand-700">{member.role}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

    </div>
  );
}
