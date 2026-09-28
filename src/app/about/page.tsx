import React from 'react';
import { getTeamMembersDB } from '@/lib/db';
import { CTASection } from '@/components/public/CTASection';
import { Check, Heart } from 'lucide-react';
import { ABOUT_PAGE, APPROACH_PILLARS } from '@/constants';
import {
  FadeUp,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  MotionCard,
} from '@/components/ui/motion';

export default async function AboutPage() {
  const teamMembers = await getTeamMembersDB();

  return (
    <div className="space-y-0 text-stone-800">

      {/* Hero Banner */}
      <section className="bg-[#faf9f7] py-16 lg:py-24 border-b border-stone-200/80 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              {ABOUT_PAGE.eyebrow}
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight max-w-4xl">
              {ABOUT_PAGE.heading}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
              {ABOUT_PAGE.subheading}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="py-20 lg:py-28 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <FadeUp className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                Foundational Principles
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950">
                {ABOUT_PAGE.philosophyTitle}
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                {ABOUT_PAGE.philosophyText1}
              </p>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                {ABOUT_PAGE.philosophyText2}
              </p>

              <StaggerContainer className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ABOUT_PAGE.highlights.map((item, idx) => (
                  <StaggerItem
                    key={idx}
                    className="p-4 rounded-2xl bg-[#faf9f7] border border-stone-200/80 flex items-center gap-3 text-xs font-semibold text-brand-950 hover:border-brand-300/80 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-850 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-brand-750" strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeUp>

            {/* Editorial Mission Pillars */}
            <FadeIn delay={0.15} className="lg:col-span-5 bg-[#faf9f7] p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-soft space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200/80">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-850 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-brand-700" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-brand-950">
                  {ABOUT_PAGE.missionTitle}
                </h3>
              </div>

              <div className="space-y-5 text-xs text-stone-600">
                {APPROACH_PILLARS.map((pillar, idx) => (
                  <div key={pillar.title} className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-brand-100 text-brand-850 font-bold text-[10px]">
                        0{idx + 1}
                      </span>
                      <span className="font-serif-heading font-bold text-sm text-brand-950">{pillar.title}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed pl-7">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28 bg-[#faf9f7] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeUp className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              {ABOUT_PAGE.teamEyebrow}
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-semibold text-brand-950 tracking-tight">
              {ABOUT_PAGE.teamHeading}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-2">
              Our clinicians and educators work as a unified multidisciplinary team to support each child&apos;s developmental milestones.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <StaggerItem key={member.id} className="h-full">
                <MotionCard
                  hoverLift={true}
                  className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-850 font-bold text-base flex items-center justify-center border border-brand-100 group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
                        {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-100/60 border border-brand-200/60 px-2.5 py-1 rounded-full">
                        Specialist
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif-heading font-bold text-brand-950 text-lg group-hover:text-brand-850 transition-colors">
                        {member.name}
                      </h3>
                      <span className="block text-xs font-bold uppercase tracking-wider text-brand-700 mt-1">
                        {member.role}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                    <span>Interactive Minds Centre</span>
                    <span className="text-brand-700">Patna</span>
                  </div>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection />

    </div>
  );
}
