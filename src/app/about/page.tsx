import React from 'react';
import Link from 'next/link';
import { getTeamMembersDB } from '@/lib/db';
import { CTASection } from '@/components/public/CTASection';
import { Heart, Sparkles, UserCheck, CheckCircle2, Award } from 'lucide-react';

export default async function AboutPage() {
  const teamMembers = await getTeamMembersDB();

  return (
    <div className="space-y-0">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-16 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            About Interactive Minds
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
            Understanding Every Child, <br />
            <span className="bg-gradient-to-r from-brand-600 to-tealbrand-600 bg-clip-text text-transparent">
              Supporting Every Journey
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Interactive Minds is a child development and therapy centre dedicated to supporting children with different developmental needs and their families.
          </p>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Our Child-Centred Philosophy
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                We believe that every child has unique strengths, abilities, and potential. We understand that every child develops at their own pace. That’s why our programs are designed around the individual child rather than rigid formulas.
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                Our multidisciplinary team works closely with children and their families to create a supportive environment where children feel understood, valued, and encouraged to learn.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealbrand-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Individualized Goal Setting</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealbrand-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Evidence-Based Approaches</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealbrand-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Family-Centered Care</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tealbrand-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Continuous Skill Tracking</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-brand-600 to-tealbrand-600 text-white rounded-3xl p-8 shadow-xl space-y-6">
                <h3 className="text-2xl font-bold">Our Three Mission Pillars</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                    <span className="block font-bold text-base text-brand-100">UNDERSTAND</span>
                    <span className="text-slate-100">Recognizing each child’s unique communication style, sensory needs, and strengths.</span>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                    <span className="block font-bold text-base text-brand-100">DEVELOP</span>
                    <span className="text-slate-100">Nurturing motor coordination, speech clarity, executive functioning, and social skills.</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                    <span className="block font-bold text-base text-brand-100">EMPOWER</span>
                    <span className="text-slate-100">Building lifelong independence and supporting parents with home guidance strategies.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Core Principles
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              What Makes Interactive Minds Different?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <Heart className="w-8 h-8 text-brand-600" />
              <h3 className="text-xl font-bold text-slate-900">Compassion</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Creating a safe, warm environment where children feel secure, respected, and valued.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <Sparkles className="w-8 h-8 text-tealbrand-600" />
              <h3 className="text-xl font-bold text-slate-900">Personalization</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Adapting every therapy strategy to fit the child’s unique developmental profile.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <UserCheck className="w-8 h-8 text-amber-600" />
              <h3 className="text-xl font-bold text-slate-900">Family Partnership</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Involving parents in therapy goals, coaching, and regular progress reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900">Our Multidisciplinary Team</h2>
            <p className="text-slate-600 text-base">
              Dedicated specialists bringing expertise across child development, behavior analysis, occupational therapy, and speech development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 font-extrabold text-xl flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

    </div>
  );
}
