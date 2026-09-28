'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/admin/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MessageSquare, Activity, ShieldAlert, ArrowRight } from 'lucide-react';
import { Appointment, ContactMessage } from '@/types';

export default function AdminDashboardOverview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appRes, msgRes] = await Promise.all([
          fetch('/api/admin/appointments'),
          fetch('/api/admin/messages'),
        ]);

        if (appRes.ok) {
          const appData = await appRes.json();
          setAppointments(appData.data || []);
        }

        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.data || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard metrics', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const newMessages = messages.filter((m) => m.status === 'NEW').length;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Real-time metrics & recent enquiries</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Appointments"
          value={totalAppointments}
          icon={Calendar}
          description="All time requests"
          trendColor="brand"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingAppointments}
          icon={Calendar}
          description="Awaiting review"
          trendColor="amber"
        />
        <StatsCard
          title="Confirmed Sessions"
          value={confirmedAppointments}
          icon={Activity}
          description="Scheduled sessions"
          trendColor="teal"
        />
        <StatsCard
          title="New Messages"
          value={newMessages}
          icon={MessageSquare}
          description="Unread enquiries"
          trendColor="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Appointments */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Appointment Requests</h3>
            <Link
              href="/admin/dashboard/appointments"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 py-4">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No appointment requests submitted yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.slice(0, 5).map((appt) => (
                <div key={appt.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      Ref: {appt.appointment_reference} — Parent: {appt.parent_name}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Child: {appt.child_name} ({appt.child_age}) • Preferred: {appt.preferred_date} ({appt.preferred_time})
                    </span>
                  </div>
                  <Badge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Contact Enquiries</h3>
            <Link
              href="/admin/dashboard/messages"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 py-4">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No contact messages received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.slice(0, 5).map((msg) => (
                <div key={msg.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 truncate">{msg.name}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{msg.message}</span>
                  </div>
                  <Badge status={msg.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
