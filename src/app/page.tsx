import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/public/Hero';
import { TherapiesSection } from '@/components/public/TherapiesSection';
import { ConditionsSection } from '@/components/public/ConditionsSection';
import { Accordion } from '@/components/ui/Accordion';
import { AppointmentForm } from '@/components/public/AppointmentForm';
import { getServicesDB, getConditionsDB, getFaqsDB, getTeamMembersDB } from '@/lib/db';
import { ArrowRight, Check, MapPin, Phone, Clock, Sparkles, Heart, Users, Calendar } from 'lucide-react';
import { SITE, ABOUT_PAGE } from '@/constants';
import {
  FadeUp,
  ImageReveal,
  ScaleReveal,
  StaggerContainer,
  StaggerItem,
  MotionCard,
} from '@/components/ui/motion';

export default async function HomePage() {
  const [services, conditions, faqs, teamMembers] = await Promise.all([
    getServicesDB(),
    getConditionsDB(),
    getFaqsDB(),
    getTeamMembersDB(),
  ]);

  // Featured service is Occupational Therapy or the first service
  const featuredService = services.find((s) => s.slug === 'occupational-therapy') || services[0];
  const otherServices = services.filter((s) => s.id !== featuredService?.id);

  // Featured condition is Autism Spectrum Disorder or the first condition
  const featuredCondition = conditions.find((c) => c.slug === 'autism-spectrum-disorder' || c.slug === 'autism') || conditions[0];
  const otherConditions = conditions.filter((c) => c.id !== featuredCondition?.id);

  return (
    <div className="space-y-0 text-stone-800">

      {/* 1 & 2. Hero Section */}
      <Hero />

      {/* 3. About & Philosophy: Luminous Sensory Gym Photography */}
      <section id="about" className="py-20 lg:py-28 bg-white border-y border-stone-200/70 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <FadeUp className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">
              Who We Are
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight">
              A dedicated centre where clinical excellence meets genuine compassion.
            </h2>
          </FadeUp>

          {/* Photographic Architectural Feature + Narrative Asymmetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">

            {/* Left 6 Cols: Architectural Sensory Environment Photo with Floating Badge */}
            <div className="lg:col-span-6 relative">
              <ImageReveal scaleFrom={0.98} className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-[#faf9f7] bg-stone-100 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] group">
                <img
                  src="/images/homepage/sensory-gym.jpg"
                  alt="Luminous pediatric sensory gym with natural wood beams, calming acoustic panels, and gentle sensory swings"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent"></div>

                {/* Floating Editorial Caption Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 shadow-card flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-850 shrink-0">
                    <Sparkles className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block">Sensory Integration Architecture</span>
                    <span className="text-xs font-semibold text-stone-800">Designed for Sensory Comfort &amp; Exploration</span>
                  </div>
                </div>
              </ImageReveal>
            </div>

            {/* Right 6 Cols: Core Narrative & Mission */}
            <FadeUp delay={0.1} className="lg:col-span-6 space-y-6">
              <p className="text-lg text-stone-700 leading-relaxed font-normal">
                <strong className="font-semibold text-stone-900">Interactive Minds</strong> is an Autism Care &amp; Child Development Centre established to guide children through their developmental milestones. Every child is born with individual strengths, unique sensory profiles, and boundless potential.
              </p>
              <p className="text-base text-stone-600 leading-relaxed">
                Rather than forcing conformity, our team creates an evidence-informed, positive learning environment where children feel secure to explore, express themselves, and build the life skills necessary for classroom and social success.
              </p>
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center gap-3.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse shrink-0"></div>
                <p className="text-xs text-brand-900 font-medium leading-relaxed">
                  Every room in our Sadikpur centre is acoustically buffered and lit to minimize sensory overload while fostering active developmental engagement.
                </p>
              </div>
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-850 hover:text-brand-700 transition-colors"
                >
                  <span>Learn more about our philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeUp>

          </div>

          {/* Lower Grid: 4 Clinical Highlights + 3 Guiding Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left: 4 Clinical Highlights (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <FadeUp distance={16}>
                <h3 className="font-serif-heading text-xl font-bold text-brand-950 mb-2">Our Clinical Highlights</h3>
              </FadeUp>
              <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-alabaster-100 border border-stone-200/70 hover:border-brand-200 hover:shadow-soft transition-all duration-200">
                    <div className="mt-0.5 text-brand-700">
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Child-Centred Care</h4>
                      <p className="text-xs text-stone-600 mt-1">Interventions tailored specifically to each child&apos;s sensory, communication, and motor profile.</p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-alabaster-100 border border-stone-200/70 hover:border-brand-200 hover:shadow-soft transition-all duration-200">
                    <div className="mt-0.5 text-brand-700">
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Individualized Programs</h4>
                      <p className="text-xs text-stone-600 mt-1">Customized plans (IEP) set with actionable, realistic milestones for home and school.</p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-alabaster-100 border border-stone-200/70 hover:border-brand-200 hover:shadow-soft transition-all duration-200">
                    <div className="mt-0.5 text-brand-700">
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Experienced Professionals</h4>
                      <p className="text-xs text-stone-600 mt-1">Pediatric specialists across developmental assessments, therapies, and special education.</p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-alabaster-100 border border-stone-200/70 hover:border-brand-200 hover:shadow-soft transition-all duration-200">
                    <div className="mt-0.5 text-brand-700">
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Parent Partnership</h4>
                      <p className="text-xs text-stone-600 mt-1">Active parent coaching to ensure therapeutic strategies naturally translate into the home routine.</p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Right: 3 Guiding Pillars (5 cols) */}
            <FadeUp delay={0.15} className="lg:col-span-5 bg-stone-100/70 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-850 block mb-1">Our Guiding Pillars</span>
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-stone-900">How We Care</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-soft">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-850 font-bold text-xs">01</span>
                    <h4 className="font-bold text-stone-900 text-sm">Understand</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-9">
                    Comprehensive evaluation of sensory profiles, communication style, motor coordination, and emotional regulation triggers.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-soft">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-850 font-bold text-xs">02</span>
                    <h4 className="font-bold text-stone-900 text-sm">Develop</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-9">
                    Engaging, structured, play-based therapy sessions targeting daily autonomy, articulation, executive focus, and peer play.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-soft">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-850 font-bold text-xs">03</span>
                    <h4 className="font-bold text-stone-900 text-sm">Empower</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-9">
                    Co-designing home strategies with parents and teachers so progress extends into every room of the child&apos;s life.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="#appointment"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-850 hover:bg-brand-900 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
                >
                  Schedule an Initial Consultation
                </Link>
              </div>
            </FadeUp>

          </div>

        </div>
      </section>

      {/* 4. Therapies & Developmental Programs - Interactive Modal Section */}
      <TherapiesSection
        featuredService={featuredService}
        otherServices={otherServices}
        allServices={services}
      />

      {/* 5. Conditions We Support - Interactive Modal Section */}
      <ConditionsSection
        featuredCondition={featuredCondition}
        otherConditions={otherConditions}
        allConditions={conditions}
      />

      {/* 6. Clinical Care Approach: Deep Teal + Therapy Photo */}
      <section id="approach" className="py-20 lg:py-28 bg-brand-950 text-white relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <FadeUp distance={20} className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block mb-2">Our Clinical Principles</span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              Grounded in evidence, guided by respect.
            </h2>
            <p className="text-stone-300 text-base mt-4 leading-relaxed">
              We operate on 4 foundational principles that guide every clinician, diagnostic evaluation, and therapy session at Interactive Minds.
            </p>
          </FadeUp>

          {/* Elevated Grid: Cinematic Photo + 4 Principles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left 5 Cols: Warm Editorial Therapy Photograph */}
            <div className="lg:col-span-5 relative">
              <ImageReveal scaleFrom={0.98} className="relative rounded-3xl overflow-hidden shadow-elevated border-2 border-brand-800 bg-brand-900 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] group">
                <img
                  src="/images/homepage/clinical-approach.jpg"
                  alt="Pediatric developmental therapist warmly engaged at eye level with a young child in a calm sensory room"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 bg-brand-900/90 backdrop-blur-md p-4 rounded-2xl border border-brand-700/60 shadow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-200 block">Compassionate Connection</span>
                  <p className="text-xs text-stone-200 font-medium mt-0.5">Meeting every child at eye level with patience, trust, and dignity.</p>
                </div>
              </ImageReveal>
            </div>

            {/* Right 7 Cols: The 4 Principles in a 2x2 Grid */}
            <StaggerContainer staggerDelay={0.08} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

              <StaggerItem distance={16}>
                <div className="bg-brand-900/60 p-6 rounded-2xl border border-brand-800/90 hover:border-brand-700/90 hover:bg-brand-900/80 transition-all duration-300 backdrop-blur-sm shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brand-800 text-brand-200 flex items-center justify-center font-bold text-sm mb-4 border border-brand-700/60 shadow-xs">01</div>
                  <h3 className="font-serif-heading text-lg font-bold text-white mb-2">Child-Centred Care</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Every child is recognized as a complete individual with distinct emotional needs, sensory thresholds, and expressive abilities.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem distance={16}>
                <div className="bg-brand-900/60 p-6 rounded-2xl border border-brand-800/90 hover:border-brand-700/90 hover:bg-brand-900/80 transition-all duration-300 backdrop-blur-sm shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brand-800 text-brand-200 flex items-center justify-center font-bold text-sm mb-4 border border-brand-700/60 shadow-xs">02</div>
                  <h3 className="font-serif-heading text-lg font-bold text-white mb-2">Individualized Programs</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    No cookie-cutter routines. Plans are designed specifically around the child&apos;s developmental profile and updated continuously.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem distance={16}>
                <div className="bg-brand-900/60 p-6 rounded-2xl border border-brand-800/90 hover:border-brand-700/90 hover:bg-brand-900/80 transition-all duration-300 backdrop-blur-sm shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brand-800 text-brand-200 flex items-center justify-center font-bold text-sm mb-4 border border-brand-700/60 shadow-xs">03</div>
                  <h3 className="font-serif-heading text-lg font-bold text-white mb-2">Experienced Specialists</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Care administered by committed clinical professionals utilizing recognized pediatric therapeutic frameworks.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem distance={16}>
                <div className="bg-brand-900/60 p-6 rounded-2xl border border-brand-800/90 hover:border-brand-700/90 hover:bg-brand-900/80 transition-all duration-300 backdrop-blur-sm shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brand-800 text-brand-200 flex items-center justify-center font-bold text-sm mb-4 border border-brand-700/60 shadow-xs">04</div>
                  <h3 className="font-serif-heading text-lg font-bold text-white mb-2">Parent Partnership</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Parents are essential co-therapists. We share transparent insights, visual schedules, and home strategies every week.
                  </p>
                </div>
              </StaggerItem>

            </StaggerContainer>

          </div>

        </div>
      </section>

      {/* 7. The 4-Step Therapy Journey */}
      <section id="journey" className="py-20 lg:py-28 bg-[#faf9f7] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <FadeUp className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">Structured Progression</span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
              The 4-Step Therapy Journey
            </h2>
            <p className="text-stone-600 text-base mt-3">
              A clear, reassuring roadmap designed so parents always know where their child is and what milestone comes next.
            </p>
          </FadeUp>

          {/* 4 Connected Steps - Staggered Storytelling */}
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

            <StaggerItem distance={20}>
              <MotionCard className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center font-bold text-lg mb-6 shadow-sm border border-brand-100 group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
                    01
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Step One</span>
                  <h3 className="font-serif-heading text-xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Initial Assessment</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Comprehensive evaluation by our multidisciplinary team to assess sensory profile, communication, motor skills, and behavior patterns.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-stone-100 text-[11px] font-semibold text-stone-500">
                  Diagnostic &amp; Baseline Mapping
                </div>
              </MotionCard>
            </StaggerItem>

            <StaggerItem distance={20}>
              <MotionCard className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center font-bold text-lg mb-6 shadow-sm border border-brand-100 group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
                    02
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Step Two</span>
                  <h3 className="font-serif-heading text-xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Custom Care Plan</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Collaborative formulation of an Individualized Education &amp; Therapy Plan (IEP) with transparent, measurable developmental milestones.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-stone-100 text-[11px] font-semibold text-stone-500">
                  Milestones &amp; Goal Calibration
                </div>
              </MotionCard>
            </StaggerItem>

            <StaggerItem distance={20}>
              <MotionCard className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center font-bold text-lg mb-6 shadow-sm border border-brand-100 group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
                    03
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Step Three</span>
                  <h3 className="font-serif-heading text-xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Therapy Sessions</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Engaging, 1-on-1 and small group therapy sessions conducted in structured, sensory-friendly therapeutic environments.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-stone-100 text-[11px] font-semibold text-stone-500">
                  Play &amp; Functional Skill Building
                </div>
              </MotionCard>
            </StaggerItem>

            <StaggerItem distance={20}>
              <MotionCard className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center font-bold text-lg mb-6 shadow-sm border border-brand-100 group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
                    04
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Step Four</span>
                  <h3 className="font-serif-heading text-xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Progress &amp; Home Link</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Regular progress reviews, objective data tracking, and active parent coaching to reinforce therapeutic gains at home and school.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-stone-100 text-[11px] font-semibold text-stone-500">
                  Continuous Review &amp; Generalization
                </div>
              </MotionCard>
            </StaggerItem>

          </StaggerContainer>

        </div>
      </section>

      {/* 8. Team: Editorial Collaboration Feature */}
      <section id="team" className="py-20 lg:py-28 bg-white border-t border-stone-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <FadeUp className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">Interdisciplinary Excellence</span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
              Multidisciplinary Team Roles
            </h2>
            <p className="text-stone-600 text-base mt-3">
              Our center functions as an integrated clinical ecosystem. Rather than isolated appointments, specialists collaborate across disciplines for every child.
            </p>
          </FadeUp>

          {/* Editorial Collaboration Visual Feature */}
          <FadeUp delay={0.1} className="mb-14 bg-stone-50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200/90 shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Image Column (6 cols) */}
              <div className="lg:col-span-6 relative">
                <ImageReveal scaleFrom={0.98} className="rounded-2xl overflow-hidden shadow-card border-2 border-white aspect-[4/3] bg-stone-100">
                  <img
                    src="/images/homepage/team-collaboration.jpg"
                    alt="Child development professionals collaboratively reviewing an individualized child progress chart and learning materials at an oak table"
                    className="w-full h-full object-cover"
                  />
                </ImageReveal>
                <div className="absolute -bottom-3 -right-2 bg-brand-850 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-xl shadow-md">
                  Case Review &amp; IEP Alignment
                </div>
              </div>

              {/* Description Column (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Team Case Conferencing</span>
                <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950">
                  Collaborative Clinical Reviews
                </h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Every child&apos;s development is assessed holistically. Speech pathologists, occupational therapists, and special educators meet weekly around the table to calibrate interventions, review objective progress data, and coordinate seamless home strategies.
                </p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    <span>Cross-Disciplinary IEP Goals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    <span>Objective Data Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    <span>Weekly Clinical Calibration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                    <span>Co-Designed Home Tools</span>
                  </div>
                </div>
              </div>

            </div>
          </FadeUp>

          {/* 3 Discipline Team Cards */}
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <StaggerItem distance={20} scale={0.98}>
              <MotionCard className="bg-alabaster-100 rounded-3xl p-8 border border-stone-200/90 flex flex-col justify-between shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-850 flex items-center justify-center mb-6 group-hover:bg-brand-200/80 transition-colors">
                    <Users className="w-6 h-6 text-brand-700" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Assessment &amp; Screening</span>
                  <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Child Development Team</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-6">
                    Specialists leading pediatric intake screenings, standardized developmental evaluations, and formulating baseline clinical recommendations for early intervention.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <span className="text-xs font-semibold text-stone-800">Pediatric Assessment &amp; Early Intervention</span>
                </div>
              </MotionCard>
            </StaggerItem>

            <StaggerItem distance={20} scale={0.98}>
              <MotionCard className="bg-alabaster-100 rounded-3xl p-8 border border-stone-200/90 flex flex-col justify-between shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-850 flex items-center justify-center mb-6 group-hover:bg-brand-200/80 transition-colors">
                    <Sparkles className="w-6 h-6 text-brand-700" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Clinical Intervention</span>
                  <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Therapy Specialist Team</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-6">
                    Licensed pediatric clinicians delivering focused 1-on-1 sessions across Occupational Therapy, Speech &amp; Language Therapy, and Sensory Gym integration.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <span className="text-xs font-semibold text-stone-800">Occupational, Speech &amp; Physical Therapy</span>
                </div>
              </MotionCard>
            </StaggerItem>

            <StaggerItem distance={20} scale={0.98}>
              <MotionCard className="bg-alabaster-100 rounded-3xl p-8 border border-stone-200/90 flex flex-col justify-between shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 group h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-850 flex items-center justify-center mb-6 group-hover:bg-brand-200/80 transition-colors">
                    <Heart className="w-6 h-6 text-brand-700" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">Academic &amp; Cognitive</span>
                  <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mb-2 group-hover:text-brand-900 transition-colors">Special Education Team</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-6">
                    Educators designing customized Individualized Education Plans (IEP), pre-academic task breakdown, and school readiness transition coaching.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <span className="text-xs font-semibold text-stone-800">Individualized Learning &amp; School Readiness</span>
                </div>
              </MotionCard>
            </StaggerItem>

          </StaggerContainer>

        </div>
      </section>

      {/* 9. Frequently Asked Questions (Accordion) */}
      <section id="faq" className="py-20 lg:py-28 bg-[#faf9f7] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">Clarity For Parents</span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-stone-600 text-base max-w-xl mx-auto mt-3">
              Answers to the most common questions families ask when beginning developmental therapy in Patna.
            </p>
          </FadeUp>

          {/* Accordion Component with DB FAQs & Staggered Reveal */}
          <Accordion items={faqs} />

        </div>
      </section>

      {/* 10. Assessment Request: Reassuring Family Entrance Photography */}
      <section id="appointment" className="py-20 lg:py-28 bg-brand-950 text-white relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Column: Trust, Family Entrance Photo, Center Coordinates (5 cols) */}
            <FadeUp className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block">Take the First Step</span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Schedule an Assessment for Your Child
              </h2>
              <p className="text-stone-300 text-base leading-relaxed">
                Our clinical intake coordinator will review your request confidentially and reach out within 24 hours to guide you through scheduling an evaluation.
              </p>

              {/* Reassuring Family Entrance Photograph */}
              <ImageReveal scaleFrom={0.98} className="relative rounded-2xl overflow-hidden shadow-elevated border-2 border-brand-800 bg-brand-900 aspect-[16/10] group">
                <img
                  src="/images/homepage/family-entrance.jpg"
                  alt="Indian parents walking happily with their child toward the sunlit entrance of the centre"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 bg-brand-950/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-brand-800/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-200">A Safe, Warm Welcome</span>
                  <p className="text-[11px] text-stone-300">Interactive Minds Pediatric Centre, Sadikpur</p>
                </div>
              </ImageReveal>

              {/* Center Info Sidebar */}
              <div className="pt-2 space-y-4 border-t border-brand-850">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-brand-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Centre Location</p>
                    <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                      {SITE.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-brand-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Phone Inquiries</p>
                    <p className="text-xs text-stone-300 mt-0.5">{SITE.phone} &nbsp;|&nbsp; {SITE.phoneRaw}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-brand-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Operating Hours</p>
                    <p className="text-xs text-stone-300 mt-0.5">{SITE.workingHours}</p>
                  </div>
                </div>
              </div>

              {/* Trust & Confidentiality Notice */}
              <div className="p-4 rounded-2xl bg-brand-900/80 border border-brand-800 text-xs text-stone-300 leading-relaxed">
                <strong className="text-white block mb-1">Confidential &amp; Procedural Notice:</strong>
                Submitting this request connects you directly with our clinical intake team. All child and family information is kept strictly confidential.
              </div>
            </FadeUp>

            {/* Right Column: Live Interactive AppointmentForm (7 cols) */}
            <ScaleReveal scale={0.985} delay={0.1} className="lg:col-span-7 bg-white text-stone-900 rounded-3xl p-6 sm:p-10 shadow-elevated border border-stone-200">
              <h3 className="font-serif-heading text-2xl font-bold text-brand-950 mb-1">Appointment Intake Request</h3>
              <p className="text-xs text-stone-500 mb-6">Complete this form and our intake coordinator will contact you to confirm available slots.</p>

              <AppointmentForm services={services} />
            </ScaleReveal>

          </div>

        </div>
      </section>

    </div>
  );
}
