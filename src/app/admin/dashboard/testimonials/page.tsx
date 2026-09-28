'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
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
    try {
      const res = await fetch(`/api/admin/testimonials/${deletingTestimonial.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete testimonial');
      }

      setToast({ type: 'success', message: data.message || 'Testimonial deleted' });
      setIsDeleteModalOpen(false);
      setDeletingTestimonial(null);
      loadTestimonials();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete testimonial' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parent Testimonials</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage parent reviews and experience feedback with written consent</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center max-w-lg mx-auto border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Testimonials In Database</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The site strictly prohibits fabricated reviews. As parents provide written consent for clinical experience feedback, they can be added using the button below.
          </p>
          <Button onClick={handleOpenCreate} variant="outline" size="sm" className="gap-1.5 mt-2">
            <Plus className="w-4 h-4" />
            <span>Add Consented Review</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:border-slate-200 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.content}"
                </p>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 text-xs">{t.display_name}</h4>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleToggleActive(t)}
                  className="inline-flex items-center gap-1.5 focus:outline-none"
                  title="Click to toggle active status"
                >
                  {t.active ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-200/60">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-bold text-[11px] border border-slate-200">
                      <XCircle className="w-3.5 h-3.5" /> Inactive
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Testimonial"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingTestimonial(t);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Testimonial"
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
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Display Name / Attribution"
            required
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="e.g. Parent of 4-year-old in Speech Therapy (or Priya S.)"
          />

          <Textarea
            label="Testimonial Feedback"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Parent's verified feedback regarding their child's therapy progress..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) || 5 })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-tealbrand-700/20 focus:border-tealbrand-700"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
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

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured_testimonial"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
              />
              <label htmlFor="featured_testimonial" className="font-semibold text-slate-800">
                Featured on Homepage
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active_testimonial"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
              />
              <label htmlFor="active_testimonial" className="font-semibold text-slate-800">
                Active (Published)
              </label>
            </div>
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
              {editingId ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Testimonial Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete the testimonial by{' '}
            <strong className="text-slate-900">{deletingTestimonial?.display_name}</strong>?
          </p>
          <p className="text-rose-600 font-medium">
            This action cannot be undone.
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
