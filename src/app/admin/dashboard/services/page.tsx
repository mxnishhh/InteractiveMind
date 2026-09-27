'use client';

import React, { useEffect, useState } from 'react';
import { getServicesDB } from '@/lib/db';
import { Service } from '@/types';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data.data || []);
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
        <h1 className="text-2xl font-bold text-slate-900">Therapies & Services Management</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Overview of registered therapy programs</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Short Description</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-slate-400">Loading services...</td></tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/60">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-600" />
                    <span>{service.name}</span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{service.slug}</td>
                  <td className="p-4 text-slate-600 max-w-sm truncate">{service.short_description}</td>
                  <td className="p-4">
                    {service.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
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
