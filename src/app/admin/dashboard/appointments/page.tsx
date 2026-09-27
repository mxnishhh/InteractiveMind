'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Button } from '@/ui/Button';
import { Toast } from '@/ui/Toast';
import { Appointment, AppointmentStatus } from '@/types';
import { Search, Filter, Eye, Edit } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('PENDING');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

      setToastMsg('Appointment status updated successfully.');
      setSelectedAppt(null);
      fetchAppointments();
    } catch (err: any) {
      setToastMsg(err.message || 'Error updating appointment');
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
    <div className="space-y-6">
      {toastMsg && <Toast type="info" message={toastMsg} onClose={() => setToastMsg(null)} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Review, track, and update appointment requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search parent, child, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Reference</th>
              <th className="p-4">Parent / Child</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Loading appointments...</td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No appointments found matching your criteria.</td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-extrabold text-brand-600">{appt.appointment_reference}</td>
                  <td className="p-4">
                    <span className="block font-bold text-slate-900">{appt.parent_name}</span>
                    <span className="block text-[11px] text-slate-500">Child: {appt.child_name} ({appt.child_age})</span>
                  </td>
                  <td className="p-4">
                    <span className="block text-slate-900 font-medium">{appt.phone}</span>
                    <span className="block text-[11px] text-slate-400">{appt.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="block font-semibold text-slate-900">{appt.preferred_date}</span>
                    <span className="block text-[11px] text-slate-500">{appt.preferred_time}</span>
                  </td>
                  <td className="p-4">
                    <Badge status={appt.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openDetails(appt)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors text-xs"
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

      {/* Detail & Edit Status Modal */}
      {selectedAppt && (
        <Modal isOpen={!!selectedAppt} onClose={() => setSelectedAppt(null)} title={`Appointment Reference: ${selectedAppt.appointment_reference}`}>
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Parent Name</span>
                <span className="block font-bold text-slate-900 text-sm">{selectedAppt.parent_name}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Child Name & Age</span>
                <span className="block font-bold text-slate-900 text-sm">{selectedAppt.child_name} ({selectedAppt.child_age})</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Email</span>
                <span className="block font-medium">{selectedAppt.email}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Phone</span>
                <span className="block font-medium">{selectedAppt.phone}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Preferred Date</span>
                <span className="block font-medium">{selectedAppt.preferred_date}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Preferred Time</span>
                <span className="block font-medium">{selectedAppt.preferred_time}</span>
              </div>
            </div>

            {selectedAppt.message && (
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Parent Message / Concern</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic">{selectedAppt.message}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block font-bold text-slate-900 mb-1.5">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1.5">Internal Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about intake calls, therapist assignment, etc."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs min-h-[80px] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setSelectedAppt(null)}>Cancel</Button>
                <Button variant="primary" isLoading={isUpdating} onClick={handleUpdateStatus}>Save Changes</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
