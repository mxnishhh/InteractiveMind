'use client';

import React, { useEffect, useState } from 'react';
import { Badge, Modal, Button, Toast } from '@/components/ui';
import { AdminPageHeader, AdminEmptyState } from '@/components/admin';
import { Appointment, AppointmentStatus } from '@/types';
import { Search, Filter, Eye, Calendar, User, Phone, Mail, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('PENDING');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openDetails = (appt: Appointment) => {
    setSelectedAppt(appt);
    setNewStatus(appt.status);
    setAdminNotes(appt.admin_notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppt) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/appointments/${selectedAppt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }

      setToastMsg({ type: 'success', message: `Appointment ${selectedAppt.appointment_reference} updated successfully.` });
      setSelectedAppt(null);
      fetchAppointments();
    } catch (err: any) {
      setToastMsg({ type: 'error', message: err.message || 'Error updating appointment' });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.appointment_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toastMsg && (
        <Toast
          type={toastMsg.type}
          message={toastMsg.message}
          onClose={() => setToastMsg(null)}
        />
      )}

      <AdminPageHeader
        eyebrow="Clinical Operations"
        title="Appointment Management"
        description="Review intake requests, track parent bookings, and update appointment progress."
        actions={
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200/80 shadow-soft text-xs font-bold text-brand-950">
            {appointments.length} Total Bookings
          </div>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search parent, child name, phone, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/60 text-xs font-medium text-stone-700 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="text-[11px] font-bold text-stone-600 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter appointments by status"
              className="bg-transparent text-xs font-bold text-brand-950 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({appointments.length})</option>
              <option value="PENDING">PENDING ({appointments.filter(a => a.status === 'PENDING').length})</option>
              <option value="CONFIRMED">CONFIRMED ({appointments.filter(a => a.status === 'CONFIRMED').length})</option>
              <option value="COMPLETED">COMPLETED ({appointments.filter(a => a.status === 'COMPLETED').length})</option>
              <option value="CANCELLED">CANCELLED ({appointments.filter(a => a.status === 'CANCELLED').length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-600 uppercase tracking-wider font-bold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Booking Ref</th>
                <th className="py-3.5 px-4">Parent & Child</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Requested Schedule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-600 animate-pulse">
                    Loading appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <AdminEmptyState
                      icon={Calendar}
                      title="No Appointments Found"
                      description={
                        searchTerm || statusFilter !== 'ALL'
                          ? 'Try adjusting your search query or status filter.'
                          : 'No appointment requests have been received yet.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <span className="font-mono text-xs font-bold text-brand-850 bg-brand-50 border border-brand-200/80 px-2.5 py-1 rounded-lg">
                        {appt.appointment_reference}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-brand-950 text-xs">{appt.parent_name}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5 font-medium">
                        Child: <span className="font-semibold text-stone-800">{appt.child_name}</span> ({appt.child_age})
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-stone-900">{appt.phone}</div>
                      <div className="text-[11px] text-stone-600">{appt.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-brand-950">{appt.preferred_date}</div>
                      <div className="text-[11px] text-stone-600 font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{appt.preferred_time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={appt.status} />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => openDetails(appt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-850 hover:bg-brand-100 hover:text-brand-950 font-bold transition-all text-xs border border-brand-200/70 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Edit Status Modal */}
      {selectedAppt && (
        <Modal
          isOpen={!!selectedAppt}
          onClose={() => setSelectedAppt(null)}
          title={`Appointment: ${selectedAppt.appointment_reference}`}
          description="Review patient request details and update clinic scheduling status."
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-stone-800">
            {/* Patient & Booking Details Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <User className="w-3 h-3" />
                  <span>Parent / Guardian</span>
                </span>
                <span className="block font-bold text-brand-950 text-sm">{selectedAppt.parent_name}</span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <User className="w-3 h-3" />
                  <span>Child Patient & Age</span>
                </span>
                <span className="block font-bold text-brand-950 text-sm">
                  {selectedAppt.child_name} <span className="font-normal text-stone-600">({selectedAppt.child_age})</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Mail className="w-3 h-3" />
                  <span>Email Address</span>
                </span>
                <span className="block font-semibold text-stone-800">{selectedAppt.email}</span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Phone className="w-3 h-3" />
                  <span>Phone Number</span>
                </span>
                <span className="block font-semibold text-stone-800">{selectedAppt.phone}</span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Calendar className="w-3 h-3" />
                  <span>Preferred Date</span>
                </span>
                <span className="block font-bold text-brand-950">{selectedAppt.preferred_date}</span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Clock className="w-3 h-3" />
                  <span>Preferred Time Slot</span>
                </span>
                <span className="block font-bold text-brand-950">{selectedAppt.preferred_time}</span>
              </div>
            </div>

            {/* Parent Message / Concern */}
            {selectedAppt.message && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <span className="flex items-center gap-1.5 text-amber-900 font-bold uppercase text-[10px]">
                  <FileText className="w-3 h-3 text-amber-700" />
                  <span>Parent Message / Specific Concerns</span>
                </span>
                <p className="text-stone-800 leading-relaxed italic text-xs font-medium">
                  &ldquo;{selectedAppt.message}&rdquo;
                </p>
              </div>
            )}

            {/* Status Update Form */}
            <div className="pt-4 border-t border-stone-200/80 space-y-4">
              <div>
                <label className="block font-bold text-[11px] uppercase tracking-wider text-stone-700 mb-1.5">
                  Update Appointment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
                  aria-label="Update Appointment Status"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-brand-950 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="PENDING">PENDING (Awaiting confirmation)</option>
                  <option value="CONFIRMED">CONFIRMED (Session booked on calendar)</option>
                  <option value="COMPLETED">COMPLETED (Assessment / Therapy conducted)</option>
                  <option value="CANCELLED">CANCELLED (Patient / Clinic cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[11px] uppercase tracking-wider text-stone-700 mb-1.5">
                  Internal Clinic Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record intake notes, assigned therapist, call summary, or rescheduling details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs min-h-[90px] focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200/80">
                <Button variant="ghost" size="sm" onClick={() => setSelectedAppt(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" isLoading={isUpdating} onClick={handleUpdateStatus}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Save Status &amp; Notes</span>
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
