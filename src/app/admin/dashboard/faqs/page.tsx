'use client';

import React, { useEffect, useState } from 'react';
import { FAQ } from '@/types';
import { HelpCircle } from 'lucide-react';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">FAQ Management</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Manage public frequently asked questions</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-xs text-slate-400">Loading FAQs...</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{faq.question}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.answer}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
