'use client';

import React, { useEffect, useState } from 'react';
import { Condition } from '@/types';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export default function AdminConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/conditions');
        if (res.ok) {
          const data = await res.json();
          setConditions(data.data || []);
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
        <h1 className="text-2xl font-bold text-slate-900">Conditions Supported</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Overview of supported neurodevelopmental conditions</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Condition Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-slate-400">Loading conditions...</td></tr>
            ) : (
              conditions.map((cond) => (
                <tr key={cond.id} className="hover:bg-slate-50/60">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-tealbrand-600" />
                    <span>{cond.name}</span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{cond.slug}</td>
                  <td className="p-4 text-slate-600 max-w-sm truncate">{cond.short_description}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
