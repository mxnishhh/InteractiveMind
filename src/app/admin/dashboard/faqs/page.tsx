'use client';

import React, { useEffect, useState } from 'react';
import { FAQ } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
} from 'lucide-react';

interface FaqFormData {
  question: string;
  answer: string;
  category: string;
  display_order: number;
  active: boolean;
}

const initialFormData: FaqFormData = {
  question: '',
  answer: '',
  category: 'General',
  display_order: 0,
  active: true,
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<FaqFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadFaqs() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch FAQs' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to FAQ management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: faqs.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      display_order: Number(faq.display_order ?? 0),
      active: Boolean(faq.active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      question: formData.question,
      answer: formData.answer,
      category: formData.category.trim() || 'General',
      display_order: Number(formData.display_order),
      active: formData.active,
    };

    try {
      const url = editingId ? `/api/admin/faqs/${editingId}` : '/api/admin/faqs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save FAQ');
      }

      setToast({ type: 'success', message: data.message || 'FAQ saved successfully' });
      setIsModalOpen(false);
      loadFaqs();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (faq: FAQ) => {
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !faq.active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update FAQ status');
      }

      setToast({
        type: 'success',
        message: `FAQ is now ${!faq.active ? 'Active' : 'Inactive'}`,
      });
      loadFaqs();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingFaq) return;
    try {
      const res = await fetch(`/api/admin/faqs/${deletingFaq.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete FAQ');
      }

      setToast({ type: 'success', message: data.message || 'FAQ deleted' });
      setIsDeleteModalOpen(false);
      setDeletingFaq(null);
      loadFaqs();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete FAQ' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQ Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage public frequently asked questions and clinical guidance</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            No FAQs found. Click "Add FAQ" to create one.
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-semibold text-slate-400 mt-0.5">#{faq.display_order}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-tealbrand-700 shrink-0" />
                      <h3 className="font-bold text-slate-900 text-sm">{faq.question}</h3>
                    </div>
                    {faq.category && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1.5">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {faq.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(faq)}
                    className="inline-flex items-center gap-1.5 focus:outline-none"
                    title="Click to toggle active status"
                  >
                    {faq.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-200/60">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-bold text-[11px] border border-slate-200">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingFaq(faq);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-8">{faq.answer}</p>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit FAQ' : 'Add New FAQ'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Question"
            required
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="e.g. What age groups do you serve at Interactive Minds?"
          />

          <Textarea
            label="Answer"
            required
            rows={4}
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Provide a clear, helpful explanation for parents and caregivers..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="General, Assessment, Therapy, Payment..."
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active_faq"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
            />
            <label htmlFor="active_faq" className="font-semibold text-slate-800">
              Active (Visible on public FAQ page)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              {editingId ? 'Save Changes' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm FAQ Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to delete this FAQ:
          </p>
          <p className="text-slate-900 font-semibold italic">
            "{deletingFaq?.question}"
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
