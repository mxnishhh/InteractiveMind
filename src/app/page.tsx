import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/public/Hero';
import { ServiceCard } from '@/components/public/ServiceCard';
import { ConditionCard } from '@/components/public/ConditionCard';
import { CTASection } from '@/components/public/CTASection';
import { Accordion } from '@/components/ui/Accordion';
import { getServicesDB, getConditionsDB, getFaqsDB, getTeamMembersDB } from '@/lib/db';
import { Heart, UserCheck, Shield, Sparkles, Calendar, ArrowRight, Award } from 'lucide-react';

export default async function HomePage() {
  const [services, conditions, faqs, teamMembers] = await Promise.all([
    getServicesDB(),
    getConditionsDB(),
    getFaqsDB(),
    getTeamMembersDB(),
  ]);

  return (
    <div className="space-y-0">
      
      {/* 1 & 2. Hero Section */}
      <Hero />

      {/* 3. Introduction / About Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-tealbrand-50 text-tealbrand-700 text-xs font-bold uppercase tracking-wider">
                About Interactive Minds
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                A Place Where Every Child Can Grow
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become more independent.
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                We understand that every child is unique. Our team focuses on individual strengths, needs, and developmental goals to create a supportive and engaging experience for children and their families.
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                From communication and social skills to learning, sensory processing, and everyday activities, we work alongside parents to support each child’s developmental journey.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider"
                >
                  <span>Read Full Story & Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-brand-50/60 p-6 rounded-3xl border border-brand-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className="font-bold text-slate-900 text-base">Understand</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluating individual strengths, sensory needs, and developmental profiles.
                </p>
              </div>
              
              <div className="bg-tealbrand-50/60 p-6 rounded-3xl border border-tealbrand-100 space-y-3 mt-6">
                <div className="w-10 h-10 rounded-xl bg-tealbrand-600 text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className="font-bold text-slate-900 text-base">Develop</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tailored therapy programs fostering communication, motor skills, and learning.
                </p>
              </div>

              <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-100 space-y-3 col-span-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className="font-bold text-slate-900 text-base">Empower</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Building everyday independence and partner coaching for families.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Therapies Section */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Specialized Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Therapies & Developmental Programs
            </h2>
            <p className="text-slate-600 text-base">
              A comprehensive range of child development services tailored to nurture communication, motor coordination, cognitive growth, and social interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Conditions Supported Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-tealbrand-50 text-tealbrand-700 text-xs font-bold uppercase tracking-wider">
              Individualized Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Conditions We Support
            </h2>
            <p className="text-slate-600 text-base">
              Gentle, neurodiversity-affirming developmental support for children facing diverse learning and motor variations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((condition) => (
              <ConditionCard key={condition.id} condition={condition} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
              Our Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Choose Interactive Minds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Child-Centred Approach</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Respecting each child’s unique personality, pace, and interests to make therapy engaging and encouraging.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-tealbrand-600 text-white flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Individualized Programs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Customized intervention plans built around baseline assessments and clear developmental milestones.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Experienced Professionals</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A compassionate team of specialists dedicated to high-quality therapy and continuous progress monitoring.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Parent Partnership</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Working hand-in-hand with parents to share guidance, home strategies, and routine adaptations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Team Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Multidisciplinary Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Specialized Specialists
            </h2>
            <p className="text-slate-600 text-base">
              Working together to support every aspect of your child’s growth and well-being.
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

      {/* 8. FAQ Section */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Common Questions from Parents
            </h2>
          </div>

          <Accordion items={faqs} />

        </div>
      </section>

      {/* 9 & 10. Final CTA Section */}
      <CTASection />

    </div>
  );
}
