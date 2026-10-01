'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE } from '@/constants';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = SITE.whatsappNumber || '+919031041990';
  const defaultMessage = encodeURIComponent('Hello Interactive Minds team, I would like to inquire about child development therapies and assessments.');
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${defaultMessage}`;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-xl hover:bg-emerald-600 transition-colors duration-200 group"
      aria-label="Contact us on WhatsApp"
    >
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-.981z"/>
      </svg>
      <span className="hidden sm:inline">WhatsApp Us</span>
    </motion.a>
  );
};
