'use client';

import React from 'react';
import { INITIAL_TEAM_MEMBERS } from '@/lib/site-data';
import { Award } from 'lucide-react';

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Multidisciplinary Team</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Verified specialist team roles from live site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_TEAM_MEMBERS.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
            <span className="block text-xs font-semibold text-brand-600 uppercase">{member.role}</span>
            <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
