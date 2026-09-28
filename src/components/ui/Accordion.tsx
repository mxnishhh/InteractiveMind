'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EDITORIAL_EASE, StaggerContainer, StaggerItem } from '@/components/ui/motion';

interface AccordionItem {
  id: number | string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<number | string | null>(items[0]?.id || null);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (id: number | string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <StaggerContainer staggerDelay={0.06} className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <StaggerItem key={item.id}>
            <div
              className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-brand-200 shadow-card'
                  : 'bg-white/80 border-stone-200/90 hover:border-stone-300'
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full text-left flex items-center justify-between gap-4 p-5 sm:p-6 font-semibold text-brand-950 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="font-serif-heading text-base sm:text-lg font-bold pr-2">
                  {item.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isOpen ? 'bg-brand-100 text-brand-850 rotate-180' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100/80">
                      <p>{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
};
