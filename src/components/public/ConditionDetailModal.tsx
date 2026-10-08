'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  ArrowRight,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import { Condition } from '@/types';
import { SITE } from '@/constants';

const CONDITION_IMAGE_MAP: Record<string, string> = {
  'autism': '/images/conditions/autism.webp',
  'autism-spectrum-disorder': '/images/conditions/autism.webp',
  'adhd': '/images/conditions/adhd.webp',
  'down-syndrome': '/images/conditions/down.webp',
  'cerebral-palsy': '/images/conditions/celebral.webp',
};

interface ConditionDetailModalProps {
  isOpen: boolean;
  condition: Condition | null;
  allConditions?: Condition[];
  onClose: () => void;
  onSelectCondition?: (condition: Condition) => void;
  onBookAssessment?: () => void;
}

export const ConditionDetailModal: React.FC<ConditionDetailModalProps> = ({
  isOpen,
  condition,
  allConditions = [],
  onClose,
  onSelectCondition,
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

  // Reset internal scroll position to top whenever active condition changes
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
  }, [condition?.id, condition?.slug]);

  if (!isOpen || !condition) return null;

  const currentIndex = allConditions.findIndex((c) => c.id === condition.id);
  const displayIndex = currentIndex !== -1 ? currentIndex + 1 : 1;
  const totalConditions = allConditions.length;

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
    `Hello Interactive Minds team, I would like to learn more about support and assessment for ${condition.name}.`
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
          aria-labelledby="modal-condition-title"
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

          {/* 1. TOP HEADER & CONDITION SWITCHER */}
          <header className="bg-white border-b border-stone-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-stone-700 text-[11px] sm:text-xs">
                  Pediatric Clinical Profile • Condition Details {totalConditions > 0 ? `(${displayIndex} of ${totalConditions})` : ''}
                </span>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={onClose}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold active:scale-95 transition-all"
                aria-label="Close condition modal"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scrollable Pill Switcher for Conditions */}
            {allConditions.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar max-w-full">
                {allConditions.map((c) => {
                  const isActive = c.id === condition.id;
                  return (
                    <button
                      key={c.id}
                      ref={isActive ? activeTabRef : null}
                      type="button"
                      onClick={() => onSelectCondition?.(c)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                        isActive
                          ? 'bg-brand-850 text-white shadow-sm border border-brand-850'
                          : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/70'
                      }`}
                      aria-pressed={isActive}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}

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
              key={condition.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
            >
              {/* LEFT COLUMN (7 COLS): Condition Content */}
              <div className="lg:col-span-7 space-y-8">
                {/* Header, Badges & Title */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-brand-100 text-brand-850 border border-brand-200">
                      {condition.slug === 'autism-spectrum-disorder' || condition.slug === 'autism'
                        ? 'NEURODEVELOPMENTAL CONDITION'
                        : condition.slug === 'down-syndrome'
                        ? 'GENETIC & DEVELOPMENTAL CONDITION'
                        : condition.slug === 'cerebral-palsy'
                        ? 'MOTOR & NEUROLOGICAL CONDITION'
                        : condition.slug === 'adhd'
                        ? 'NEURODEVELOPMENTAL CONDITION'
                        : 'Pediatric Developmental Profile'}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Individualized Care Pathway
                    </span>
                  </div>

                  <h2
                    id="modal-condition-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif-heading font-bold text-brand-950 tracking-tight leading-tight"
                  >
                    {condition.slug === 'adhd'
                      ? 'Attention-Deficit/Hyperactivity Disorder (ADHD)'
                      : condition.slug === 'autism-spectrum-disorder'
                      ? 'Autism Spectrum Disorder'
                      : condition.name}
                  </h2>
                </div>

                {/* Condition Image */}
                {CONDITION_IMAGE_MAP[condition.slug] && (
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50">
                    <Image
                      src={CONDITION_IMAGE_MAP[condition.slug]}
                      alt={`${condition.name} — clinical support`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 700px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* CONDITION 1: AUTISM SPECTRUM DISORDER */}
                {(condition.slug === 'autism-spectrum-disorder' || condition.slug === 'autism') && (
                  <>
                    {/* Overview Box */}
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Autism is a neurodevelopmental condition that affects a person&apos;s ability to communicate and interact with others, often involving challenges with starting and maintaining conversations, intense focus on special interests, and repetitive language or behaviors. It&apos;s called a spectrum because individuals with autism can present with a range of strengths and challenges: some may benefit from support in building social awareness, while others may require continual and comprehensive care.
                      </p>
                    </div>

                    {/* Signs and Symptoms Section */}
                    <div className="space-y-4">
                      <div className="border-b border-stone-200/80 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
                          Clinical Characteristics
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif-heading font-bold text-stone-900">
                          What are the signs and symptoms of autism?
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        Autism presents in each person differently, but there are some common characteristics, including:
                      </p>

                      <div className="space-y-3">
                        {[
                          'Difficulty making eye contact or incorporating nonverbal communication (such as gestures, pointing, facial expressions) with speech',
                          'Repetitive or "scripted" speech (using dialogue from movies or TV in real-life conversations)',
                          'Challenges with social-emotional reciprocity, like taking turns or understanding subtle cues around personal space or conversational expectations',
                          'Repetitive movements like pacing or hand flapping',
                          'Intense interest in special topics and difficulty moving to new topics or activities',
                          'Trouble coping with changes in routines or schedules and a need for things to be highly predictable.',
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-3.5"
                          >
                            <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-850 font-bold text-xs flex items-center justify-center shrink-0 border border-brand-200 mt-0.5">
                              {idx + 1}
                            </div>
                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* CONDITION 2: DOWN SYNDROME */}
                {condition.slug === 'down-syndrome' && (
                  <>
                    {/* Overview Box */}
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-3.5">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Down syndrome is a condition in which a person has an extra copy of chromosome 21. Chromosomes are small &ldquo;packages&rdquo; of genes in the body&apos;s cells, which determine how the body forms and functions.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        When babies are growing, the extra chromosome changes how their body and brain develop. This can cause both physical and mental challenges.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        People with Down syndrome often have developmental challenges, such as being slower to learn to speak than other children.
                      </p>
                    </div>

                    {/* Distinct Physical Signs */}
                    <div className="space-y-4">
                      <div className="border-b border-stone-200/80 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
                          Physical Characteristics
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif-heading font-bold text-stone-900">
                          Distinct Physical Signs
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        Distinct physical signs of Down syndrome are usually present at birth and become more apparent as the baby grows.
                      </p>

                      {/* Facial Features */}
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-3">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-900">
                          They can include facial features, such as:
                        </h4>
                        <div className="space-y-2.5">
                          {[
                            'A flattened face, especially the bridge of the nose',
                            'Almond-shaped eyes that slant up',
                            'A tongue that tends to stick out of the mouth',
                          ].map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Other Physical Signs */}
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-3">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-900">
                          Other physical signs can include:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'A short neck',
                            'Small ears, hands, and feet',
                            'A single line across the palm of the hand (palmar crease)',
                            'Small pinky fingers',
                            'Poor muscle tone or loose joints',
                            'Shorter-than-average height',
                          ].map((sign, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span>{sign}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Common Health Problems */}
                    <div className="space-y-4">
                      <div className="border-b border-stone-200/80 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
                          Associated Medical Considerations
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif-heading font-bold text-stone-900">
                          Common Health Problems
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        Some people with Down syndrome have other medical problems as well. Common health problems include:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          'Congenital heart defects',
                          'Hearing loss',
                          'Obstructive sleep apnea',
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-brand-700 shrink-0 mt-1.5" />
                            <span className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* CONDITION 3: CEREBRAL PALSY */}
                {condition.slug === 'cerebral-palsy' && (
                  <>
                    {/* Overview Box */}
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-3.5">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Cerebral palsy is a group of conditions that affect movement, balance and posture. It&apos;s caused by damage that occurs to a baby&apos;s brain, most often before birth.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Symptoms appear during infancy or preschool years. Children may have exaggerated reflexes, or their arms, legs and trunk may appear floppy. Cerebral palsy can cause stiff muscles, known as spasticity. Symptoms also can include changes in posture and movements, such as not having a steady walk. Cerebral palsy can make it hard to swallow or focus the eyes. Some children have a combination of these symptoms.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        The effects on function can vary. Some people with cerebral palsy can walk, while others need assistance. Some have intellectual disabilities, but others do not. Some may have epilepsy, blindness or deafness. There is no cure, but treatments can help improve function. The condition generally stays the same over time.
                      </p>
                    </div>

                    {/* Symptoms Section */}
                    <div className="space-y-6">
                      <div className="border-b border-stone-200/80 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-1">
                          Clinical Presentation
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif-heading font-bold text-stone-900">
                          Symptoms
                        </h3>
                      </div>

                      {/* Subsection A: Movement and coordination */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-950 font-serif-heading flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-700" />
                          Movement and coordination
                        </h4>
                        <div className="space-y-2.5">
                          {[
                            'Stiff muscles and exaggerated reflexes, known as spasticity. This is the most common movement condition related to cerebral palsy.',
                            'Changes in muscle tone, such as being either too stiff or too floppy.',
                            'Stiff muscles, known as rigidity.',
                            'Lack of balance and muscle coordination, known as ataxia.',
                            'Jerky movements that can\'t be controlled, known as tremors.',
                            'Slow, writhing movements.',
                            'Favoring one side of the body, such as only reaching with one hand or dragging a leg while crawling.',
                            'Trouble walking. People with cerebral palsy may walk on their toes or crouch down when they walk. They also may have a scissorslike walk with their knees crossing. Or they may walk with their legs wide or not be steady.',
                            'Trouble with fine motor skills, such as buttoning clothes or picking up utensils.',
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subsection B: Speech and eating */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-950 font-serif-heading flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-700" />
                          Speech and eating
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'Delays in speech development.',
                            'Trouble speaking.',
                            'Trouble with sucking, chewing or eating.',
                            'Drooling or trouble with swallowing.',
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-stone-700 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subsection C: Development */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-950 font-serif-heading flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-700" />
                          Development
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'Delays in reaching motor skills milestones, such as sitting up or crawling.',
                            'Learning disabilities.',
                            'Intellectual disabilities.',
                            'Delayed growth, resulting in smaller size for the child\'s age.',
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-stone-700 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subsection D: Other symptoms */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-950 font-serif-heading flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-700" />
                          Other symptoms
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'Seizures, which are symptoms of epilepsy. Some children with cerebral palsy are diagnosed with epilepsy.',
                            'Trouble hearing.',
                            'Trouble with vision and changes in eye movements.',
                            'Pain or trouble feeling sensations such as touch.',
                            'Bladder and bowel issues, including constipation and urinary incontinence.',
                            'Mental health conditions, such as emotional conditions and behavior issues.',
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-stone-200/80 shadow-soft flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-stone-700 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progression & Course Box */}
                    <div className="p-5 sm:p-6 bg-brand-50/70 rounded-2xl border border-brand-200/80 shadow-soft space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">
                        Clinical Progression &amp; Long-Term Course
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        The brain condition causing cerebral palsy doesn&apos;t change with time. Symptoms usually don&apos;t worsen with age. However, as the child gets older, some symptoms may become easier to notice. Muscle shortening and muscle rigidity can worsen if not treated aggressively.
                      </p>
                    </div>
                  </>
                )}

                {/* CONDITION 4: ADHD */}
                {condition.slug === 'adhd' && (
                  <>
                    {/* Overview Box */}
                    <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-3.5">
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental condition characterized by symptoms including difficulty paying attention and staying on task, hyperactivity and restlessness, trouble keeping organized, impulsivity, and impatience. Nearly everyone experiences these symptoms from time to time, but with ADHD, they tend to occur persistently, and often to a degree that interferes with daily life.
                      </p>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        Symptoms of ADHD are grouped into two categories: inattention symptoms and hyperactivity/impulsivity symptoms.
                      </p>
                    </div>

                    {/* Two Symptom Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Category 1: Inattention Symptoms */}
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                        <div className="border-b border-stone-200/80 pb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-0.5">
                            Category 1
                          </span>
                          <h3 className="text-base font-serif-heading font-bold text-stone-900">
                            Inattention Symptoms
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            'Having difficulty staying focused on activities',
                            'Getting easily distracted',
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Category 2: Hyperactivity/Impulsivity Symptoms */}
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                        <div className="border-b border-stone-200/80 pb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-0.5">
                            Category 2
                          </span>
                          <h3 className="text-base font-serif-heading font-bold text-stone-900">
                            Hyperactivity / Impulsivity Symptoms
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            'Fidgeting',
                            'Restlessness.',
                            'Having trouble playing or doing other tasks quietly',
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* CONDITION 5 / FALLBACK (e.g. DYSLEXIA - 100% UNTOUCHED) */}
                {!['autism-spectrum-disorder', 'autism', 'down-syndrome', 'cerebral-palsy', 'adhd'].includes(condition.slug) && (
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-brand-700 block">
                      Clinical Overview
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif-heading font-bold text-stone-900">
                      About {condition.name}
                    </h3>
                    {condition.short_description && (
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                        {condition.short_description}
                      </p>
                    )}
                    {condition.description && (
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                        {condition.description}
                      </p>
                    )}
                  </div>
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
              </div>
            </motion.div>
          </div>

          {/* 3. MODAL FIXED BOTTOM ACTION BAR */}
          <footer className="bg-white border-t border-stone-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="font-semibold text-stone-800">{condition.name}</span>
              <span className="text-stone-400">•</span>
              <span>Interactive Minds Centre</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors text-center"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={handleBookingClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2 bg-brand-850 hover:bg-brand-900 text-white text-xs font-semibold rounded-full shadow-sm transition-colors text-center"
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
