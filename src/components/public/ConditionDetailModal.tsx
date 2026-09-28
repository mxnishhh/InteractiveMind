'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { Condition } from '@/types';
import { SITE } from '@/constants';

interface ConditionDetailModalProps {
  isOpen: boolean;
  condition: Condition | null;
  onClose: () => void;
  onBookAssessment?: () => void;
}

export const ConditionDetailModal: React.FC<ConditionDetailModalProps> = ({
  isOpen,
  condition,
  onClose,
  onBookAssessment,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [condition?.id]);

  if (!isOpen || !condition) return null;

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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-condition-title"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-full sm:max-w-2xl lg:max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-[#faf9f7] rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col z-10 mx-0 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Sheet Drag Indicator */}
          <div className="sm:hidden flex justify-center pt-2 pb-1 bg-white">
            <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
          </div>

          {/* 1. Header */}
          <header className="bg-white border-b border-stone-200/90 px-5 sm:px-7 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-stone-700 text-xs">
                Clinical Condition Overview • Individualized Support
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close condition modal"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* 2. Scrollable Body Content */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6 custom-scrollbar"
          >
            {/* Title & Short Description */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-brand-100 text-brand-850 border border-brand-200">
                  Pediatric Developmental Profile
                </span>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Patna Centre
                </span>
              </div>

              <h2
                id="modal-condition-title"
                className="text-2xl sm:text-3xl font-serif-heading font-bold text-brand-950 tracking-tight leading-tight"
              >
                {condition.name}
              </h2>

              {condition.short_description && (
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  {condition.short_description}
                </p>
              )}
            </div>

            {/* Neurodiversity-Affirming Note */}
            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <p className="text-xs text-brand-900 leading-relaxed font-medium">
                At Interactive Minds, we approach every developmental diagnosis as a unique profile of strengths and needs. Interventions are co-designed to build everyday autonomy and self-confidence.
              </p>
            </div>

            {/* Clinical Overview / Description */}
            {condition.description && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-2.5">
                <span className="text-xs uppercase tracking-wider font-bold text-brand-700 block">
                  Understanding The Condition
                </span>
                <h3 className="text-lg sm:text-xl font-serif-heading font-bold text-stone-900">
                  Clinical Overview
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {condition.description}
                </p>
              </div>
            )}

            {/* Assessment & Care Pathway */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-serif-heading font-bold text-base">
                <HeartHandshake className="w-5 h-5 text-brand-700" />
                <span>Our Multidisciplinary Assessment Pathway</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span>Comprehensive functional baseline evaluation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span>Sensory profile &amp; motor coordination screening</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span>Speech, language &amp; social communication baseline</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span>Individualized Care Plan (IEP) co-designed with parents</span>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-stone-100/80 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-3">
              <h4 className="font-serif-heading text-base sm:text-lg font-bold text-brand-950">
                Schedule a Consultation for {condition.name}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect with our pediatric clinical team in Sadikpur, Patna to schedule a personalized developmental assessment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-850 hover:bg-brand-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Assessment</span>
                </button>
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-700" />
                  <span>Call {SITE.phone}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3. Footer */}
          <footer className="bg-white border-t border-stone-200/90 px-5 sm:px-7 py-3 flex items-center justify-between text-xs text-stone-500 shrink-0">
            <span>{condition.name} • Neurodiversity-Affirming Assessment</span>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-700 hover:text-stone-900 font-semibold px-3 py-1 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Close
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
