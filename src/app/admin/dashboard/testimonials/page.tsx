'use client';

import React from 'react';
import { HeartHandshake } from 'lucide-react';

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Parent Testimonials</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Manage parent reviews and experience feedback</p>
      </div>

      <div className="bg-white rounded-2xl p-10 text-center max-w-md mx-auto border border-slate-100 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Testimonials Submitted Yet</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The site strictly prohibits fabricated reviews. As parents provide written consent for experience testimonials, they can be added here.
        </p>
      </div>
    </div>
  );
}
