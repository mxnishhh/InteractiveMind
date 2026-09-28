'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { ContactMessage, MessageStatus } from '@/types';
import { Search, Filter, Eye, Mail } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

      setToastMsg(`Message status updated to ${status}`);
      setSelectedMsg(null);
      fetchMessages();
    } catch (err: any) {
      setToastMsg(err.message || 'Error updating status');
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

  return (
    <div className="space-y-6">
      {toastMsg && <Toast type="info" message={toastMsg} onClose={() => setToastMsg(null)} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Messages Inbox</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Review public contact enquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search sender, email, message..."
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
            <option value="NEW">NEW</option>
            <option value="READ">READ</option>
            <option value="RESPONDED">RESPONDED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Sender</th>
              <th className="p-4">Contact Details</th>
              <th className="p-4">Subject & Excerpt</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Loading inbox messages...</td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No contact messages match your search.</td>
              </tr>
            ) : (
              filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{msg.name}</td>
                  <td className="p-4">
                    <span className="block font-medium text-slate-800">{msg.email}</span>
                    <span className="block text-[11px] text-slate-400">{msg.phone}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    {msg.subject && <span className="block font-semibold text-slate-900 truncate">{msg.subject}</span>}
                    <span className="block text-slate-500 truncate">{msg.message}</span>
                  </td>
                  <td className="p-4 text-slate-500">{msg.created_at.substring(0, 10)}</td>
                  <td className="p-4">
                    <Badge status={msg.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openDetails(msg)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors text-xs"
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

      {/* Message View Modal */}
      {selectedMsg && (
        <Modal isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title={`Message from ${selectedMsg.name}`}>
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Email</span>
                <span className="block font-bold text-slate-900">{selectedMsg.email}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Phone</span>
                <span className="block font-bold text-slate-900">{selectedMsg.phone}</span>
              </div>
            </div>

            {selectedMsg.subject && (
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Subject</span>
                <span className="block font-semibold text-slate-900 text-sm">{selectedMsg.subject}</span>
              </div>
            )}

            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Full Message</span>
              <p className="p-4 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed text-sm text-slate-800">
                {selectedMsg.message}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" isLoading={isUpdating} onClick={() => handleUpdateStatus('READ')}>Mark Read</Button>
                <Button size="sm" variant="secondary" isLoading={isUpdating} onClick={() => handleUpdateStatus('RESPONDED')}>Mark Responded</Button>
                <Button size="sm" variant="ghost" isLoading={isUpdating} onClick={() => handleUpdateStatus('ARCHIVED')}>Archive</Button>
              </div>

              <a
                href={`mailto:${selectedMsg.email}?subject=Re: Interactive Minds Enquiry`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors"
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
