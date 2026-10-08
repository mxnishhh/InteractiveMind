import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/public/Hero';
import { TherapiesSection } from '@/components/public/TherapiesSection';
import { ConditionsSection } from '@/components/public/ConditionsSection';
import { BlogSection } from '@/components/public/BlogSection';
import { Accordion } from '@/components/ui/Accordion';
import { AppointmentInquiryCard } from '@/components/public/AppointmentInquiryCard';
import { GallerySection } from '@/components/public/GallerySection';
import { AboutImageSlideshow } from '@/components/public/AboutImageSlideshow';
import { getServicesDB, getConditionsDB, getFaqsDB, getTeamMembersDB, getPublishedBlogPostsDB, getMediaDB } from '@/lib/db';
import {
  ArrowRight,
  Check,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Heart,
  Users,
  Calendar,
  Eye,
  Target,
  MessageSquare,
  Shirt,
  Utensils,
  Bath,
  ShieldCheck,
  Activity,
  Shield,
} from 'lucide-react';
import { SITE, ABOUT_PAGE } from '@/constants';
import {
  FadeUp,
  ImageReveal,
  ScaleReveal,
  StaggerContainer,
  StaggerItem,
  MotionCard,
} from '@/components/ui/motion';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [services, conditions, faqs, teamMembers, blogPosts, galleryMedia] = await Promise.all([
    getServicesDB(),
    getConditionsDB(),
    getFaqsDB(),
    getTeamMembersDB(),
    getPublishedBlogPostsDB(),
    getMediaDB(),
  ]);

  const adlItems = [
    { id: '01', name: 'Communication', icon: MessageSquare },
    { id: '02', name: 'Self-care', icon: Sparkles },
    { id: '03', name: 'Dressing', icon: Shirt },
    { id: '04', name: 'Feeding', icon: Utensils },
    { id: '05', name: 'Toileting', icon: Bath },
    { id: '06', name: 'Personal hygiene', icon: ShieldCheck },
    { id: '07', name: 'Mobility', icon: Activity },
    { id: '08', name: 'Safety', icon: Shield },
    { id: '09', name: 'Participation in home, school, and community activities', icon: Users },
  ];

  return (
    <div className="space-y-0 text-stone-800">

      {/* 1 & 2. Hero Section */}
      <Hero />

      {/* 3. About & Philosophy: Hand-Drawn Sketch Layout Implementation */}
      <section id="about" className="py-20 lg:py-28 bg-[#faf9f7] border-y border-stone-200/70 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">

          {/* =======================================================================
              1. SECTION INTRO: Eyebrow > Primary Statement (No Secondary Heading)
              ======================================================================= */}
          <FadeUp className="mb-14 sm:mb-20 space-y-4">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
                {ABOUT_PAGE.eyebrow}
              </span>
            </div>

            {/* Primary Display Statement: Four-Word Hero Typographic Signature (One Single Line on Desktop) */}
            <h2 className="sr-only">Accept. Understand. Include. Empower.</h2>
            <StaggerContainer
              staggerDelay={0.14}
              className="flex flex-wrap lg:flex-nowrap items-baseline gap-x-2.5 sm:gap-x-4 lg:gap-x-3.5 xl:gap-x-5 gap-y-2 max-w-full pt-1"
              aria-hidden="true"
            >
              {[
                'Accept.',
                'Understand.',
                'Include.',
                'Empower.',
              ].map((word) => (
                <StaggerItem key={word} distance={14} duration={0.6} className="shrink-0 lg:shrink">
                  <span
                    className="font-serif-heading italic font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[56px] 2xl:text-[64px] tracking-tight leading-[1.1] text-brand-850 inline-block whitespace-nowrap"
                  >
                    {word}
                  </span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeUp>

          {/* =======================================================================
              2. IMAGE + NARRATIVE: Two-Column Layout (Balanced Visual Height)
              ======================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left 6 Cols: Authentic Centre Environment Photo */}
            <div className="lg:col-span-6 relative">
              <ImageReveal scaleFrom={0.98} className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-stone-100 aspect-[4/3] group">
                <AboutImageSlideshow />
              </ImageReveal>
            </div>

            {/* Right 6 Cols: Client-Approved Narrative Paragraphs (Balanced Visual Weight & Height) */}
            <FadeUp delay={0.1} className="lg:col-span-6 flex flex-col justify-center space-y-7 sm:space-y-8 lg:space-y-9 lg:py-4">
              <p className="text-lg sm:text-xl md:text-[22px] lg:text-[23px] xl:text-[25px] font-medium text-brand-950/90 leading-relaxed sm:leading-[1.7] lg:leading-[1.65]">
                {ABOUT_PAGE.introParagraph1}
              </p>
              <p className="text-base sm:text-lg md:text-[20px] lg:text-[20px] xl:text-[21px] font-normal text-brand-900/85 leading-relaxed sm:leading-[1.75] lg:leading-[1.7]">
                {ABOUT_PAGE.introParagraph2}
              </p>
            </FadeUp>

          </div>

          {/* =======================================================================
              3. OUR VISION & OUR MISSION: 2-Column Balanced Editorial Layout
              ======================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-4">
            {/* Our Vision */}
            <FadeUp className="h-full space-y-5 p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-900 bg-brand-50 border border-brand-200/70">
                  <Eye className="w-3.5 h-3.5 text-brand-750" />
                  <span>{ABOUT_PAGE.visionLabel}</span>
                </div>
                <p className="font-serif-heading text-xl sm:text-2xl text-brand-950 font-semibold leading-relaxed">
                  &ldquo;{ABOUT_PAGE.visionText}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                <span>Inclusive Society &amp; Equal Opportunity</span>
                <span className="w-2 h-2 rounded-full bg-brand-600" />
              </div>
            </FadeUp>

            {/* Our Mission */}
            <FadeUp delay={0.08} className="h-full space-y-5 p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-900 bg-brand-50 border border-brand-200/70">
                  <Target className="w-3.5 h-3.5 text-brand-750" />
                  <span>{ABOUT_PAGE.missionLabel}</span>
                </div>
                <p className="font-serif-heading text-xl sm:text-2xl text-brand-950 font-semibold leading-relaxed">
                  &ldquo;{ABOUT_PAGE.missionText}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                <span>Empowerment &amp; Daily Autonomy</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </FadeUp>
          </div>

          {/* =======================================================================
              4. ACTIVITIES OF DAILY LIVING (ADLS): Visual Taxonomy Matrix
              ======================================================================= */}
          <div className="space-y-10 pt-4">
            {/* Introductory paragraph */}
            <FadeUp className="max-w-4xl space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
                  {ABOUT_PAGE.adlLabel}
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-[19px] text-stone-700 leading-relaxed font-normal">
                {ABOUT_PAGE.adlIntro}
              </p>
            </FadeUp>

            {/* Visual taxonomy grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-stone-200/90 rounded-3xl overflow-hidden bg-white shadow-soft">
              {adlItems.map((item, index) => {
                const IconComponent = item.icon;
                const isLastAndOdd = index === adlItems.length - 1 && adlItems.length % 3 !== 0;
                return (
                  <StaggerItem key={item.id}>
                    <div
                      className={[
                        'p-6 flex items-center gap-4 transition-colors duration-150 group h-full hover:bg-brand-50/40',
                        // lg: right border except column 3
                        index % 3 !== 2 && index !== adlItems.length - 1 ? 'lg:border-r border-stone-200/80' : '',
                        // lg: bottom border except row 3
                        index < 6 ? 'lg:border-b border-stone-200/80' : '',
                        // sm: right border on left column of 2-col layout
                        index % 2 === 0 && index !== adlItems.length - 1 ? 'sm:border-r border-stone-200/80' : '',
                        // sm: bottom border all except last row
                        index < adlItems.length - (adlItems.length % 2 === 0 ? 2 : 1) ? 'sm:border-b border-stone-200/80' : '',
                        // mobile: bottom border all except last item
                        index < adlItems.length - 1 ? 'border-b sm:border-b-0 border-stone-200/80' : '',
                        isLastAndOdd ? 'sm:col-span-2 lg:col-span-1' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100/80 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors duration-150">
                        <IconComponent className="w-5 h-5 text-brand-700" />
                      </div>
                      <div className="flex items-baseline gap-3 min-w-0 flex-1">
                        <span className="text-[11px] font-mono font-semibold text-brand-700/60 shrink-0">
                          {item.id}
                        </span>
                        <span className="font-serif-heading text-[15px] sm:text-base font-semibold text-brand-950 leading-snug group-hover:text-brand-900 transition-colors duration-150">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* =======================================================================
              5. OUR PURPOSE: Emotional Focal Point / Independence
              ======================================================================= */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-950 via-[#051c1a] to-brand-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-elevated">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <FadeUp className="space-y-6">
                <div className="inline-flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-white/20 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
                    {ABOUT_PAGE.purposeLabel}
                  </span>
                  <span className="h-px w-8 bg-white/20 shrink-0" aria-hidden="true" />
                </div>

                <h3 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-white max-w-3xl mx-auto">
                  Our ultimate goal is not just therapy—it is{' '}
                  <span className="italic text-brand-400 font-medium">independence.</span>
                </h3>

                <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto font-normal">
                  We work towards helping every child become as{' '}
                  <strong className="font-semibold text-white">independent</strong>,{' '}
                  <strong className="font-semibold text-white">confident</strong>, and{' '}
                  <strong className="font-semibold text-white">self-reliant</strong> as possible, according to their individual abilities and potential.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* =======================================================================
              6. PHILOSOPHY: Closing Progression Statement
              ======================================================================= */}
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp className="space-y-6">
              <div className="inline-flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-brand-200 shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  Interactive Minds Philosophy
                </span>
                <span className="h-px w-8 bg-brand-200 shrink-0" aria-hidden="true" />
              </div>

              <p className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-brand-950 leading-relaxed sm:leading-[1.4] max-w-3xl mx-auto">
                Because inclusion begins with{' '}
                <span className="italic text-brand-700 font-semibold">acceptance</span>,{' '}
                progress begins with{' '}
                <span className="italic text-brand-700 font-semibold">understanding</span>,{' '}
                and independence begins with{' '}
                <span className="italic text-brand-700 font-semibold">opportunity</span>.
              </p>
            </FadeUp>
          </div>

        </div>
      </section>

      {/* 4. Therapies & Developmental Programs - Interactive Modal Section */}
      <TherapiesSection
        allServices={services}
      />

      {/* 5. Conditions We Support - Interactive Modal Section */}
      <ConditionsSection
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
                <Image
                  src="/images/approach.png"
                  alt="Interactive Minds developmental clinicians and therapists working with children in a supportive clinical environment"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute bottom-4 left-4 right-4 bg-brand-900/75 backdrop-blur-md p-4 rounded-2xl border border-brand-700/60 shadow">
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

      {/* 7.5 Gallery Section */}
      <GallerySection media={galleryMedia} />

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
                <ImageReveal scaleFrom={0.98} className="relative rounded-2xl overflow-hidden shadow-card border-2 border-white aspect-[4/3] bg-stone-100">
                  <Image
                    src="/images/consult.png"
                    alt="Interactive Minds developmental clinician conducting a clinical consultation with client"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                    className="object-cover"
                  />
                </ImageReveal>
                <div className="absolute -bottom-3 -right-2 bg-brand-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-xl shadow-md border border-brand-700/50">
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

      {/* 8. Blog Corner: Insights & Resources */}
      <BlogSection posts={blogPosts} />

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

      {/* 10. Assessment Request & Direct Clinical Inquiries */}
      <section id="appointment" className="py-20 lg:py-28 bg-brand-950 text-white relative scroll-mt-20">
        <div id="contact" className="absolute -top-20" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Column: Trust, Center Coordinates (5 cols) */}
            <FadeUp className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500 block">Take the First Step</span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Schedule an Assessment or Get in Touch
              </h2>
              <p className="text-stone-300 text-base leading-relaxed">
                Whether you are ready to book a clinical intake evaluation or simply have questions about our developmental therapies, our team is here to guide and support your family.
              </p>

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
                    <p className="text-xs text-stone-300 mt-0.5">
                      <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white transition-colors">{SITE.phone} (Primary)</a>
                      {SITE.phoneSecondary && (
                        <span> &nbsp;|&nbsp; <a href={`tel:${SITE.phoneRawSecondary}`} className="hover:text-white transition-colors">{SITE.phoneSecondary} (Secondary)</a></span>
                      )}
                    </p>
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
                All submissions connect directly with our clinical intake and coordinator team. Family and child information is kept strictly confidential.
              </div>
            </FadeUp>

            {/* Right Column: Live Interactive Dual Card (Assessment & Inquiry) (7 cols) */}
            <ScaleReveal scale={0.985} delay={0.1} className="lg:col-span-7 bg-white text-stone-900 rounded-3xl p-6 sm:p-10 shadow-elevated border border-stone-200">
              <AppointmentInquiryCard services={services} />
            </ScaleReveal>

          </div>

        </div>
      </section>

    </div>
  );
}
