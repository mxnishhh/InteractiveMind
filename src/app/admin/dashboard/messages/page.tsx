'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { ContactMessage, MessageStatus } from '@/types';
import { Search, Filter, Eye, Mail, Phone, Calendar, User, CheckCircle2, Archive, MessageSquare } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openDetails = (msg: ContactMessage) => {
    setSelectedMsg(msg);
  };

  const handleUpdateStatus = async (status: MessageStatus) => {
    if (!selectedMsg) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/messages/${selectedMsg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update message status');
      }

      setToastMsg({ type: 'success', message: `Message status updated to ${status}` });
      setSelectedMsg(null);
      fetchMessages();
    } catch (err: any) {
      setToastMsg({ type: 'error', message: err.message || 'Error updating status' });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.phone.includes(searchTerm) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => m.status === 'NEW').length;

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
        title="Contact Messages Inbox"
        description="Review general enquiries, consultation requests, and parent feedback."
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 font-bold text-xs">
                {unreadCount} Unread
              </span>
            )}
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200/80 shadow-soft text-xs font-bold text-brand-950">
              {messages.length} Total Messages
            </div>
          </div>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sender, email, phone, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/60 text-xs font-medium text-stone-700 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="text-[11px] font-bold text-stone-600 uppercase">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter contact messages by status"
              className="bg-transparent text-xs font-bold text-brand-950 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({messages.length})</option>
              <option value="NEW">NEW ({messages.filter(m => m.status === 'NEW').length})</option>
              <option value="READ">READ ({messages.filter(m => m.status === 'READ').length})</option>
              <option value="RESPONDED">RESPONDED ({messages.filter(m => m.status === 'RESPONDED').length})</option>
              <option value="ARCHIVED">ARCHIVED ({messages.filter(m => m.status === 'ARCHIVED').length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-600 uppercase tracking-wider font-bold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Sender</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Subject &amp; Excerpt</th>
                <th className="py-3.5 px-4">Received Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-600 animate-pulse">
                    Loading inbox messages...
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <AdminEmptyState
                      icon={MessageSquare}
                      title="No Messages Found"
                      description={
                        searchTerm || statusFilter !== 'ALL'
                          ? 'Try adjusting your search query or status filter.'
                          : 'No contact enquiries have been submitted yet.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      msg.status === 'NEW' ? 'bg-amber-50/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        {msg.status === 'NEW' && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread" />
                        )}
                        <span className="font-bold text-brand-950 text-xs">{msg.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-stone-900">{msg.email}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">{msg.phone}</div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      {msg.subject && (
                        <span className="block font-bold text-brand-950 truncate">{msg.subject}</span>
                      )}
                      <span className="block text-stone-600 truncate text-[11px] font-medium mt-0.5">
                        {msg.message}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-stone-600 text-[11px]">
                      {msg.created_at ? msg.created_at.substring(0, 10) : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={msg.status} />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => openDetails(msg)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-850 hover:bg-brand-100 hover:text-brand-950 font-bold transition-all text-xs border border-brand-200/70 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message View Modal */}
      {selectedMsg && (
        <Modal
          isOpen={!!selectedMsg}
          onClose={() => setSelectedMsg(null)}
          title={`Enquiry from ${selectedMsg.name}`}
          description={`Received on ${selectedMsg.created_at ? selectedMsg.created_at.substring(0, 10) : 'recent date'}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-stone-800">
            {/* Sender Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <User className="w-3 h-3" />
                  <span>Sender Full Name</span>
                </span>
                <span className="block font-bold text-brand-950 text-sm">{selectedMsg.name}</span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Mail className="w-3 h-3" />
                  <span>Email Address</span>
                </span>
                <a
                  href={`mailto:${selectedMsg.email}`}
                  className="block font-semibold text-brand-850 hover:underline"
                >
                  {selectedMsg.email}
                </a>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Phone className="w-3 h-3" />
                  <span>Phone Number</span>
                </span>
                {selectedMsg.phone ? (
                  <a href={`tel:${selectedMsg.phone}`} className="block font-semibold text-stone-900 hover:text-brand-850">
                    {selectedMsg.phone}
                  </a>
                ) : (
                  <span className="block text-stone-400 font-medium text-xs">Not provided</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <MessageSquare className="w-3 h-3" />
                  <span>Preferred Contact</span>
                </span>
                <span className="block font-semibold text-brand-950 capitalize">
                  {selectedMsg.preferred_contact_method || 'Email'}
                </span>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="flex items-center gap-1.5 text-stone-600 font-bold uppercase text-[10px]">
                  <Calendar className="w-3 h-3" />
                  <span>Current Status</span>
                </span>
                <Badge status={selectedMsg.status} />
              </div>
            </div>

            {/* Subject */}
            {selectedMsg.subject && (
              <div className="space-y-1">
                <span className="block text-stone-600 font-bold uppercase text-[10px]">Subject</span>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 font-bold text-brand-950 text-sm">
                  {selectedMsg.subject}
                </div>
              </div>
            )}

            {/* Full Message Body */}
            <div className="space-y-1">
              <span className="block text-stone-600 font-bold uppercase text-[10px]">Message Content</span>
              <div className="p-4 sm:p-5 rounded-2xl bg-[#faf9f7] border border-stone-200/80 leading-relaxed text-stone-800 text-xs sm:text-sm font-medium whitespace-pre-wrap">
                {selectedMsg.message}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('READ')}
                >
                  Mark as Read
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('RESPONDED')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Mark Responded
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('ARCHIVED')}
                >
                  <Archive className="w-3.5 h-3.5 mr-1" />
                  Archive
                </Button>
              </div>

              <a
                href={`mailto:${selectedMsg.email}?subject=Re: Interactive Minds Enquiry${
                  selectedMsg.subject ? ` - ${selectedMsg.subject}` : ''
                }`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-850 hover:bg-brand-900 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
