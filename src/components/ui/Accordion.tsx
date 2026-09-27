'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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

  const toggle = (id: number | string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="py-4">
            <button
              onClick={() => toggle(item.id)}
              className="w-full text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-slate-700 focus:outline-none py-1"
            >
              <span className="text-base font-semibold">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="pt-3 text-slate-600 text-sm leading-relaxed pr-6">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
