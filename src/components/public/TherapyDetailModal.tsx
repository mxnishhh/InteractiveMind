'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Check,
  ArrowRight,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';
import { Service } from '@/types';
import { SITE, ORDERED_THERAPY_SLUGS } from '@/constants';

interface TherapyDetailModalProps {
  isOpen: boolean;
  service: Service | null;
  allServices: Service[];
  onClose: () => void;
  onSelectService: (service: Service) => void;
  onBookAssessment?: () => void;
}

const THERAPY_IMAGE_MAP: Record<string, string> = {
  'aba-therapy': '/images/therapies/ABA.png',
  'occupational-therapy': '/images/therapies/Occupational.png',
  'speech-therapy': '/images/therapies/Speech.png',
  'special-education': '/images/therapies/Special.png',
  'sensory-integration': '/images/homepage/therapy-sensory.jpg',
  'clinical-psychology': '/images/homepage/therapy-psychology.jpg',
  'school-readiness': '/images/homepage/therapy-school-readiness.jpg',
  'physiotherapy': '/images/therapies/Physio.png',
  'parent-guidance': '/images/therapies/Parent.png',
};

export const TherapyDetailModal: React.FC<TherapyDetailModalProps> = ({
  isOpen,
  service,
  allServices = [],
  onClose,
  onSelectService,
  onBookAssessment,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Reset internal scroll position to top whenever active service changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    // Auto scroll active tab into view in the horizontal scroller
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [service?.id, service?.slug]);

  if (!isOpen || !service) return null;

  // Single source of truth: 6 active therapies in required sequence
  const orderedServices = ORDERED_THERAPY_SLUGS.map((slug) =>
    allServices.find((s) => s.slug === slug && s.active)
  ).filter(Boolean) as Service[];

  const navServices =
    orderedServices.length > 0
      ? orderedServices
      : allServices.filter((s) => s.active);

  // Other complementary services (excluding current)
  const complementaryServices = allServices
    .filter((s) => s.id !== service.id)
    .slice(0, 3);

  const handleBookingClick = () => {
    onClose();
    // Allow modal exit animation to finish before initiating smooth scroll
    setTimeout(() => {
      if (onBookAssessment) {
        onBookAssessment();
      } else {
        const element = document.getElementById('appointment');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 280);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Interactive Minds team, I would like to learn more about the ${service.name} program and schedule an initial consultation.`
  );
  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-therapy-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[94vh] sm:max-h-[90vh] bg-[#faf9f7] rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col z-10 mx-0 sm:mx-4 lg:mx-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Sheet Drag Indicator */}
          <div className="sm:hidden flex justify-center pt-2 pb-1 bg-white">
            <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
          </div>

          {/* 1. TOP HEADER & DISCIPLINE SWITCHER */}
          <header className="bg-white border-b border-stone-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-stone-700 text-[11px] sm:text-xs">
                  Specialized Pediatric Care • Discipline Preview
                </span>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={onClose}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold active:scale-95 transition-all"
                aria-label="Close therapy modal"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scrollable Pill Switcher for all therapies in exact client-requested order */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar max-w-full">
              {navServices.map((s) => {
                const isActive = s.id === service.id || s.slug === service.slug;
                return (
                  <button
                    key={s.id || s.slug}
                    ref={isActive ? activeTabRef : null}
                    type="button"
                    onClick={() => onSelectService(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-850 text-white shadow-sm border border-brand-850'
                        : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/70'
                    }`}
                    aria-pressed={isActive}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>

            {/* Close Button Desktop */}
            <button
              type="button"
              onClick={onClose}
              className="hidden md:flex p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* 2. SCROLLABLE BODY CONTENT (7 COLS / 5 COLS GRID) */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 custom-scrollbar"
          >
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
            >
              {/* LEFT COLUMN (7 COLS): Clinical Content */}
              <div className="lg:col-span-7 space-y-8">
                {/* Header, Badges & Title */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-brand-100 text-brand-850 border border-brand-200">
                      {service.slug === 'aba-therapy'
                        ? 'APPLIED BEHAVIOUR ANALYSIS'
                        : service.slug === 'speech-therapy'
                        ? 'SPEECH & LANGUAGE THERAPY'
                        : service.slug === 'parent-guidance'
                        ? 'PARENT COUNSELLING & TRAINING PROGRAMME'
                        : 'Specialized Pediatric Program'}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Individualized Therapy
                    </span>
                  </div>

                  <h2
                    id="modal-therapy-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif-heading font-bold text-brand-950 tracking-tight leading-tight"
                  >
                    {service.slug === 'aba-therapy'
                      ? 'Applied Behaviour Analysis (ABA)'
                      : service.slug === 'speech-therapy'
                      ? 'Speech & Language Therapy'
                      : service.slug === 'parent-guidance'
                      ? 'Parent Counselling and Training Programme (PCTP)'
                      : service.name}
                  </h2>
                </div>

                {/* Hero Image Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-md bg-stone-100 group aspect-[16/10] sm:aspect-[16/9]">
                  <img
                    src={THERAPY_IMAGE_MAP[service.slug] || service.image_url || '/images/therapies/Occupational.png'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 bg-brand-950/75 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs flex items-center justify-between border border-white/10 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold tracking-wide">Interactive Minds • Patna City Centre</span>
                    </div>
                    <span className="text-[10px] text-brand-200 uppercase tracking-wider font-semibold">1-on-1 Sessions</span>
                  </div>
                </div>

                {/* SPECIFIC CLEAN REBUILD FOR OCCUPATIONAL THERAPY (ONE CONTINUOUS DESCRIPTION BLOCK) */}
                {service.slug === 'occupational-therapy' ? (
                  <div className="space-y-3">
                    <div className="border-b border-stone-200/80 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Description
                      </h3>
                    </div>
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-5">
                      {/* Paragraph 1 */}
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Occupational therapy for children aims to enhance their active participation in meaningful and essential activities in their lives. This therapy promotes children&apos;s development, health, and overall well-being, encompassing activities such as school tasks, play, and self-care. Interventions are customized based on the child&apos;s unique needs, considering both disability-related challenges and typical developmental milestones. At Rainbow Children&apos;s Hospital, our team of specialists is dedicated to optimizing children&apos;s engagement in everyday activities.
                      </p>

                      {/* Paragraph 2 */}
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Occupational therapy empowers children to acquire the skills necessary for participating in activities like play, self-care, and social interactions. This includes improving their coordination, fine motor skills, visual and cognitive-perceptual abilities, peer interactions, and handwriting, among others.
                      </p>

                      {/* Conditions Supported Sub-section */}
                      <div className="pt-2 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Conditions Supported
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                          This holistic approach aids in addressing conditions such as:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {[
                            'Attention-Deficit Hyperactivity Disorder (ADHD)',
                            'Autism Spectrum Disorders',
                            'Cerebral Palsy',
                            'Developmental coordination disorder',
                            'Developmental delay',
                            'Sensory integration dysfunction',
                          ].map((condition, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0" />
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Services & Support Sub-section */}
                      <div className="pt-2 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Services &amp; Support
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {[
                            'Evaluation and training in self-care',
                            'Evaluation and training in movement',
                            'Enhancing social participation',
                            'Providing education for patients and caregivers',
                            'Assessing and intervening in bedside feeding challenges',
                            'Testing and treating developmental issues',
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                              <span className="font-mono text-xs font-bold text-brand-850 shrink-0 mt-0.5">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="leading-snug font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Closing Paragraph / Quote */}
                      <div className="pt-2 border-t border-stone-100">
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          &ldquo;Through our occupational therapy services, we assist children in overcoming barriers and acquiring the necessary skills to actively engage in the activities that are meaningful to them.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ) : service.slug === 'special-education' ? (
                  /* SPECIFIC CLEAN REBUILD FOR SPECIAL EDUCATION (ONE CONTINUOUS DESCRIPTION BLOCK) */
                  <div className="space-y-3">
                    <div className="border-b border-stone-200/80 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Description
                      </h3>
                    </div>
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-5">
                      {/* Opening Paragraph */}
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Children with special needs are assessed using a functional approach, with an emphasis on understanding their individual abilities, needs, and areas of development. An individualized educational programme is designed for children receiving special education services, with periodic evaluation to monitor their progress and ensure that the educational approach continues to meet their needs.
                      </p>

                      {/* Parent Involvement */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Parent Involvement
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          The role of parents is emphasized throughout the training programme, recognizing their involvement as an important part of the child&apos;s learning and development. Parents are supported in participating in the educational process and reinforcing learning beyond the structured sessions.
                        </p>
                      </div>

                      {/* Multisensory Learning */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Multisensory Learning
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          Multisensory and low-cost teaching-learning materials are designed to increase the effectiveness of the teaching and learning process. These materials are used to make learning more accessible and engaging for children with different learning needs.
                        </p>
                      </div>

                      {/* Inclusion */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Inclusion
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          Curricular and co-curricular activities are also taught with a special emphasis on inclusion. The programme focuses on enabling children to participate in educational and related activities in an inclusive manner.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : service.slug === 'physiotherapy' ? (
                  /* SPECIFIC CLEAN REBUILD FOR PHYSIOTHERAPY (ONE CONTINUOUS DESCRIPTION BLOCK) */
                  <div className="space-y-3">
                    <div className="border-b border-stone-200/80 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Description
                      </h3>
                    </div>
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-5">
                      {/* Opening Paragraph */}
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        A detailed pre-therapy assessment forms the foundation of the physiotherapy process at Interactive Minds. Goals are established in consultation with parents, followed by appropriate therapy interventions and regular reviews. After three months, goals are reassessed and reset as needed to keep the programme aligned with the child&apos;s needs.
                      </p>

                      {/* Parental Counselling */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Parental Counselling
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          Parental counselling is an important part of the process, supporting parents throughout the therapy journey.
                        </p>
                      </div>

                      {/* Home-Based Management */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Home-Based Management
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          Physiotherapists also provide home-based management programmes, extending the support beyond the therapy setting and helping children and families continue their management programme at home.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : service.slug === 'aba-therapy' ? (
                  /* SPECIFIC CLEAN REBUILD FOR APPLIED BEHAVIOUR ANALYSIS (ABA) (ONE CONTINUOUS DESCRIPTION BLOCK) */
                  <div className="space-y-3">
                    <div className="border-b border-stone-200/80 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Description
                      </h3>
                    </div>
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        ABA therapy at Interactive Minds in Patna supports autistic children who may experience difficulties with social interaction and everyday activities. The therapy focuses on breaking down individual goals into smaller, achievable steps, making the learning process more structured and manageable for each child.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Every child shines in their own way. ABA therapy focuses on nurturing a child&apos;s self-worth and self-reliance while respecting and preserving their individual uniqueness and creativity.
                      </p>
                    </div>
                  </div>
                ) : service.slug === 'speech-therapy' ? (
                  /* SPECIFIC CLEAN REBUILD FOR SPEECH & LANGUAGE THERAPY (ONE CONTINUOUS DESCRIPTION BLOCK) */
                  <div className="space-y-3">
                    <div className="border-b border-stone-200/80 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Description
                      </h3>
                    </div>
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Pediatric speech and language therapy focuses on enhancing children&apos;s communication skills, including both verbal and nonverbal communication. It is important to recognize that speech and language difficulties can sometimes occur alongside mental or behavioral conditions, such as anxiety or attention-deficit/hyperactivity disorder (ADHD). Children facing developmental challenges, such as autism spectrum disorder, may also experience difficulties in expressing themselves verbally.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        At Interactive Minds, we specialize in providing specifically designed care and therapeutic interventions for children experiencing speech and communication difficulties. Our personalized treatment plans are designed to help unlock each child&apos;s potential, supporting them in communicating effectively and engaging with the world around them.
                      </p>
                    </div>
                  </div>
                ) : service.slug === 'parent-guidance' ? (
                  /* SPECIFIC CLEAN REBUILD FOR PARENT COUNSELLING AND TRAINING PROGRAMME (PCTP) (ONE CONTINUOUS DESCRIPTION BLOCK) */
                  <div className="space-y-3">
                    <div className="border-b border-stone-200/80 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Description
                      </h3>
                    </div>
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-5">
                      {/* Opening Paragraphs */}
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Interactive Minds: Autism Care and Child Development Center provides a Parent Counselling and Training Programme (PCTP) designed to empower parents with a better understanding of their child and practical ways to support their development and communication.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        During the PCTP, parents are provided with information on appropriate ways of communicating with their child and methods that can help the child communicate more effectively and appropriately.
                      </p>

                      {/* Group Work & Social Participation */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Group Work &amp; Social Participation
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          The group work focuses on developing joint attention, waiting, turn-taking, following instructions from different people, and the ability to participate and comply within a group setting.
                        </p>
                      </div>

                      {/* Building Predictability & Independent Living */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Building Predictability &amp; Independent Living
                        </h4>
                        <div className="space-y-2.5">
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            Parents are guided on how predictability can be developed in a child&apos;s life, with the aim of helping reduce anxiety levels.
                          </p>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            Cognitive skills are also introduced while keeping functionality in mind. Inputs are provided on developing independent living skills in the child.
                          </p>
                        </div>
                      </div>

                      {/* Feedback & Discussion */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Feedback &amp; Discussion
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          A variety of other relevant topics are addressed through daily feedback and discussion sessions. Parents receive extensive feedback and participate in discussion groups where they can share perspectives and build connections with other parents experiencing similar difficulties.
                        </p>
                      </div>

                      {/* Parent Empowerment */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Parent Empowerment
                        </h4>
                        <div className="space-y-2.5">
                          <p className="text-xs sm:text-sm font-semibold text-brand-900 leading-snug">
                            The main goal of the PCTP is parent empowerment.
                          </p>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            The programme strives to help parents understand their child, their child&apos;s autism, the unique learning styles of children with autism, and the reasons behind how a child may behave or react in different situations.
                          </p>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            This understanding empowers parents to manage challenging situations and work more effectively with their child from a place of acceptance and understanding.
                          </p>
                        </div>
                      </div>

                      {/* Extending Support */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Extending Support
                        </h4>
                        <div className="space-y-2.5">
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            Given the acute shortage of educators trained specifically to work with children with autism, the PCTP also aims to help address this gap in service provision for families with children with ASD.
                          </p>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                            Parents who complete the training can connect with other parents in their native areas and become a source of information and support, helping extend the impact of the programme through a ripple effect.
                          </p>
                        </div>
                      </div>

                      {/* Who Can Participate? */}
                      <div className="pt-2 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif-heading">
                          Who Can Participate?
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          The PCTP is also available for family members and others who may be the child&apos;s primary caregivers or who interact with the child on a regular basis.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STANDARD LAYOUT FOR OTHER THERAPY DISCIPLINES */
                  <>
                    {/* 1. About This Therapy / Description */}
                    {service.description && (
                      <div className="space-y-3">
                        <div className="border-b border-stone-200/80 pb-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                            Description
                          </h3>
                        </div>
                        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                          {service.description.split('\n\n').filter(Boolean).map((para, idx) => (
                            <p key={idx} className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                              {para.trim()}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Who It Helps */}
                    {service.who_it_helps && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                          <h3 className="text-sm uppercase tracking-wider font-bold text-stone-800">
                            Who It Helps
                          </h3>
                          <span className="text-xs font-semibold text-brand-850">
                            Key Developmental Indicators
                          </span>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-3.5">
                          <div className="p-2 rounded-xl bg-brand-50 text-brand-850 shrink-0 border border-brand-100">
                            <Check className="w-4 h-4 text-brand-700" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                              Target Beneficiaries &amp; Indications
                            </h4>
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                              {service.who_it_helps}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Key Benefits */}
                    {service.benefits && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                          <h3 className="text-sm uppercase tracking-wider font-bold text-stone-800">
                            Key Therapeutic Benefits
                          </h3>
                          <span className="text-xs font-semibold text-brand-850">
                            Milestones &amp; Outcomes
                          </span>
                        </div>
                        <div className="bg-white border border-stone-200/90 p-5 sm:p-6 rounded-2xl shadow-soft space-y-2">
                          <div className="text-brand-900 font-serif-heading font-bold text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-700" />
                            Developmental Gains &amp; Everyday Autonomy
                          </div>
                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                            {service.benefits}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 4. Our Clinical Approach */}
                    {service.approach && (
                      <div className="bg-brand-50/70 p-6 rounded-2xl border border-brand-100 shadow-soft space-y-3">
                        <span className="text-xs uppercase tracking-wider font-bold text-brand-800 block">
                          Methodology
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif-heading font-bold text-brand-950">
                          Our Clinical Approach
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                          {service.approach}
                        </p>
                      </div>
                    )}

                    {/* 5. Step-by-Step Therapy Process */}
                    {service.process_steps && service.process_steps.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                          <h3 className="text-sm uppercase tracking-wider font-bold text-stone-800">
                            Step-by-Step Therapy Process
                          </h3>
                          <span className="text-xs font-semibold text-brand-850">
                            Structured Roadmap
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {service.process_steps.map((step, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-soft space-y-1.5"
                            >
                              <span className="text-xs font-mono font-bold text-brand-850 block">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. Skills We Build / Supported Competencies */}
                    {service.skills_supported && service.skills_supported.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                          Skills We Build / Supported Competencies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.skills_supported.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3.5 py-1.5 bg-white border border-stone-200/90 rounded-full text-xs font-medium text-stone-800 shadow-soft flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 text-brand-700" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. Clinical Mission / Closing Statement */}
                    {service.closing_text && (
                      <div className="p-5 sm:p-6 bg-brand-50/60 rounded-2xl border border-brand-200/80 shadow-soft">
                        <p className="font-serif-heading italic text-xs sm:text-sm text-brand-950 font-medium leading-relaxed">
                          &ldquo;{service.closing_text}&rdquo;
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* RIGHT COLUMN (5 COLS): Sticky Intake & Campus Details */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
                {/* Intake Booking Box */}
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft p-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                      Take The First Step
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif-heading font-bold text-brand-950">
                      Begin Your Child&apos;s Journey
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Our multidisciplinary clinical team in Patna is here to support your child&apos;s distinct developmental path with warmth and clinical expertise.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleBookingClick}
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand-850 hover:bg-brand-900 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors"
                    >
                      <span>Schedule Initial Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-4 rounded-xl border border-stone-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-700" />
                      <span>Call Directly: {SITE.phone}</span>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  {/* Centre Info Summary */}
                  <div className="space-y-3 pt-4 text-xs text-stone-600 border-t border-stone-100">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        <strong>Centre Location:</strong> {SITE.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-brand-700 shrink-0" />
                      <span>
                        <strong>Clinic Hours:</strong> {SITE.workingHours}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Complementary Disciplines Switcher (Shown for non-customized therapies) */}
                {!['occupational-therapy', 'special-education', 'physiotherapy', 'aba-therapy', 'speech-therapy', 'parent-guidance'].includes(service.slug) && complementaryServices.length > 0 && (
                  <div className="bg-stone-100/80 border border-stone-200/90 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-700" />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        Complementary Programs
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Children enrolled in <strong>{service.name}</strong> often experience accelerated progress when paired with our other co-located therapy modalities in Patna:
                    </p>
                    <div className="flex flex-col gap-2 pt-1 text-xs text-brand-850 font-semibold">
                      {complementaryServices.map((comp) => (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => onSelectService(comp)}
                          className="text-left hover:text-brand-700 hover:underline flex items-center gap-1.5 transition-colors"
                        >
                          <span>→ Explore {comp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 3. MODAL FIXED BOTTOM ACTION BAR */}
          <footer className="bg-white border-t border-stone-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="font-semibold text-stone-800">{service.name}</span>
              <span className="text-stone-400">•</span>
              <span>Interactive Minds Centre</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={handleBookingClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-850 hover:bg-brand-900 shadow-sm transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Assessment</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
