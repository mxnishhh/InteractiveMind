'use client';

import React, { useEffect, useState } from 'react';
import { FAQ } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminDeleteModal } from '@/components/admin/AdminDeleteModal';
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
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Knowledge Base"
        title="Frequently Asked Questions"
        description="Manage clinical answers, parent intake FAQs, payment policies, and clinic guidance."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </Button>
        }
      />

      <div className="space-y-3.5">
        {loading ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center text-xs text-stone-600 font-medium animate-pulse">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <AdminEmptyState
            icon={HelpCircle}
            title="No FAQs Configured"
            description="Add answers to frequently asked questions to help parents understand the therapy journey."
            action={{
              label: 'Add First FAQ',
              onClick: handleOpenCreate,
              icon: Plus,
            }}
          />
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-3.5 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-stone-600 px-2 py-0.5 rounded-md bg-stone-100 shrink-0 mt-0.5">
                    #{faq.display_order}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <h3 className="font-serif-heading font-bold text-brand-950 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    {faq.category && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-850 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-md">
                          <Tag className="w-3 h-3 text-brand-700" />
                          {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => handleToggleActive(faq)}
                    className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
                    title="Click to toggle active status"
                  >
                    {faq.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-200/80 shadow-2xs">
                        <CheckCircle className="w-3 h-3 text-emerald-700" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full font-bold text-[11px] border border-stone-200 shadow-2xs">
                        <XCircle className="w-3 h-3 text-stone-500" /> Inactive
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1.5 text-stone-600 hover:text-brand-950 hover:bg-stone-100 rounded-xl transition-colors"
                    title="Edit FAQ"
                    aria-label={`Edit FAQ: ${faq.question}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingFaq(faq);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete FAQ"
                    aria-label={`Delete FAQ: ${faq.question}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf9f7] border border-stone-200/70 text-xs text-stone-700 leading-relaxed font-medium">
                {faq.answer}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit FAQ' : 'Add New FAQ'}
        description="Provide a clear, reassuring answer for parents seeking clarity."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-800">
          <Input
            label="Question"
            required
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="e.g. What age groups do you support at Interactive Minds?"
          />

          <Textarea
            label="Comprehensive Answer"
            required
            rows={4}
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Provide a clear, reassuring, and clinically grounded answer for parents..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="General, Assessment, Therapy, Sessions..."
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="active_faq"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
            />
            <label htmlFor="active_faq" className="font-bold text-brand-950 cursor-pointer text-xs">
              Active (Visible on public FAQ accordion)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/80">
            <Button
              type="button"
              variant="ghost"
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

      {/* Shared Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingFaq(null);
        }}
        onConfirm={handleDelete}
        title="Delete FAQ"
        itemName={deletingFaq?.question}
        isDeleting={isDeleting}
      />
    </div>
  );
}
