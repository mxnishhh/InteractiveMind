'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/admin/StatsCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Clock,
  UserCheck,
  Image as ImageIcon,
} from 'lucide-react';
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <AdminPageHeader
        eyebrow="Clinical Operations"
        title="Dashboard Overview"
        description="Real-time clinic metrics, appointment schedules, and recent family enquiries."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard/appointments"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-850 hover:bg-brand-900 text-white shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Review Bookings</span>
            </Link>
          </div>
        }
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Appointments"
          value={totalAppointments}
          icon={Calendar}
          description="All-time appointment bookings"
          trendColor="brand"
        />
        <StatsCard
          title="Pending Review"
          value={pendingAppointments}
          icon={Clock}
          description="Awaiting clinic confirmation"
          trendColor="amber"
        />
        <StatsCard
          title="Confirmed Sessions"
          value={confirmedAppointments}
          icon={UserCheck}
          description="Active scheduled visits"
          trendColor="emerald"
        />
        <StatsCard
          title="New Enquiries"
          value={newMessages}
          icon={MessageSquare}
          description="Unread family messages"
          trendColor="rose"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/admin/dashboard/appointments"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-soft hover:shadow-md hover:border-brand-300 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-850 group-hover:bg-brand-850 group-hover:text-white transition-colors shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-950 truncate">Appointments</span>
            <span className="block text-[11px] text-stone-600 truncate">Manage schedule</span>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/messages"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-soft hover:shadow-md hover:border-brand-300 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-950 truncate">Contact Inbox</span>
            <span className="block text-[11px] text-stone-600 truncate">Respond to queries</span>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/blog"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-soft hover:shadow-md hover:border-brand-300 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-950 truncate">Blog & Insights</span>
            <span className="block text-[11px] text-stone-600 truncate">Articles & videos</span>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/media"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-soft hover:shadow-md hover:border-brand-300 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 group-hover:bg-rose-700 group-hover:text-white transition-colors shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-950 truncate">Media Gallery</span>
            <span className="block text-[11px] text-stone-600 truncate">Photos & assets</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-brand-950">
                Recent Appointment Requests
              </h3>
              <p className="text-xs text-stone-600 font-medium mt-0.5">Latest bookings received from parents</p>
            </div>
            <Link
              href="/admin/dashboard/appointments"
              className="text-xs font-bold text-brand-850 hover:text-brand-950 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-stone-600 font-medium animate-pulse">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <AdminEmptyState
              icon={Calendar}
              title="No Appointments Yet"
              description="New appointment requests from the public website will appear here in real-time."
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {appointments.slice(0, 5).map((appt) => (
                <div
                  key={appt.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/60 px-2.5 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-brand-850 px-2 py-0.5 rounded-md bg-brand-50 border border-brand-100">
                        {appt.appointment_reference}
                      </span>
                      <span className="text-xs font-bold text-stone-900 truncate">
                        Parent: {appt.parent_name}
                      </span>
                    </div>
                    <span className="block text-[11px] text-stone-600 font-medium mt-1">
                      Child: <strong className="text-stone-700">{appt.child_name}</strong> ({appt.child_age}) • Preferred: {appt.preferred_date} ({appt.preferred_time})
                    </span>
                  </div>
                  <div className="shrink-0">
                    <Badge status={appt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-brand-950">
                Contact Enquiries
              </h3>
              <p className="text-xs text-stone-600 font-medium mt-0.5">Family queries from contact form</p>
            </div>
            <Link
              href="/admin/dashboard/messages"
              className="text-xs font-bold text-brand-850 hover:text-brand-950 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-colors"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-stone-600 font-medium animate-pulse">
              Loading enquiries...
            </div>
          ) : messages.length === 0 ? (
            <AdminEmptyState
              icon={MessageSquare}
              title="No Messages Yet"
              description="Contact messages submitted by parents will appear here for review."
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {messages.slice(0, 5).map((msg) => (
                <div
                  key={msg.id}
                  className="py-3.5 flex items-start justify-between gap-3 hover:bg-stone-50/60 px-2.5 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-950 truncate">{msg.name}</span>
                      {msg.status === 'NEW' && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread message" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                      {msg.message}
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <Badge status={msg.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
