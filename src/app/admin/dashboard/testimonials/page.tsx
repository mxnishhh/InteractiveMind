'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminDeleteModal } from '@/components/admin/AdminDeleteModal';
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  Quote,
} from 'lucide-react';

interface TestimonialFormData {
  display_name: string;
  content: string;
  rating: number;
  image_url: string;
  featured: boolean;
  active: boolean;
  display_order: number;
}

const initialFormData: TestimonialFormData = {
  display_name: '',
  content: '',
  rating: 5,
  image_url: '',
  featured: false,
  active: true,
  display_order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadTestimonials() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch testimonials' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to testimonials management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      display_name: t.display_name,
      content: t.content,
      rating: Number(t.rating || 5),
      image_url: t.image_url || '',
      featured: Boolean(t.featured),
      active: Boolean(t.active),
      display_order: Number(t.display_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      display_name: formData.display_name,
      content: formData.content,
      rating: Number(formData.rating),
      image_url: formData.image_url.trim() || undefined,
      featured: formData.featured,
      active: formData.active,
      display_order: Number(formData.display_order),
    };

    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save testimonial');
      }

      setToast({ type: 'success', message: data.message || 'Testimonial saved successfully' });
      setIsModalOpen(false);
      loadTestimonials();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !t.active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update testimonial status');
      }

      setToast({
        type: 'success',
        message: `Testimonial is now ${!t.active ? 'Active' : 'Inactive'}`,
      });
      loadTestimonials();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingTestimonial) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${deletingTestimonial.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete testimonial');
      }

      setToast({ type: 'success', message: data.message || 'Testimonial removed' });
      setIsDeleteModalOpen(false);
      setDeletingTestimonial(null);
      loadTestimonials();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete testimonial' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Clinical Feedback"
        title="Parent Testimonials"
        description="Manage parent stories, developmental milestones, and experience feedback obtained with written consent."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </Button>
        }
      />

      {loading ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center text-xs text-stone-600 font-medium animate-pulse">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <AdminEmptyState
          icon={HeartHandshake}
          title="No Testimonials in Database"
          description="Interactive Minds maintains a strict policy against fabricated reviews. As families provide written consent for clinical feedback, add them here."
          action={{
            label: 'Add Consented Review',
            onClick: handleOpenCreate,
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Featured
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Quote className="w-6 h-6 text-stone-200 absolute -top-1 -left-1 -z-0 opacity-50" />
                  <p className="text-xs text-stone-700 leading-relaxed italic relative z-10 font-medium line-clamp-5">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <h4 className="font-serif-heading font-bold text-brand-950 text-xs">{t.display_name}</h4>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <button
                  onClick={() => handleToggleActive(t)}
                  className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
                  title="Click to toggle active status"
                >
                  {t.active ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-200/80 shadow-2xs">
                      <CheckCircle className="w-3 h-3 text-emerald-700" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full font-bold text-[11px] border border-stone-200 shadow-2xs">
                      <XCircle className="w-3 h-3 text-stone-500" /> Inactive
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-stone-600 hover:text-brand-950 hover:bg-stone-100 rounded-xl transition-colors"
                    title="Edit Testimonial"
                    aria-label={`Edit testimonial by ${t.display_name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingTestimonial(t);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Testimonial"
                    aria-label={`Delete testimonial by ${t.display_name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Testimonial' : 'Add Consented Testimonial'}
        description="Verify parent consent before adding clinical feedback to the website."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-800">
          <Input
            label="Display Name / Consent Attribution"
            required
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="e.g. Parent of 4-year-old in Speech Therapy (or Sangeeta K.)"
            helperText="Respect patient privacy by using anonymized or consented attribution"
          />

          <Textarea
            label="Parent Milestone / Feedback"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Verified parent feedback regarding their child's developmental milestones and progress..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-bold text-[11px] uppercase tracking-wider text-stone-700 mb-1.5">
                Rating (1 to 5 Stars)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) || 5 })}
                aria-label="Rating (1 to 5 Stars)"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs bg-white text-brand-950 font-bold focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
            <div>
              <Input
                label="Display Order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured_testimonial"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
              />
              <label htmlFor="featured_testimonial" className="font-bold text-brand-950 cursor-pointer text-xs">
                Featured on Homepage
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active_testimonial"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
              />
              <label htmlFor="active_testimonial" className="font-bold text-brand-950 cursor-pointer text-xs">
                Active (Published)
              </label>
            </div>
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
              {editingId ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shared Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTestimonial(null);
        }}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        itemName={deletingTestimonial?.display_name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
