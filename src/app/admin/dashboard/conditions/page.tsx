'use client';

import React, { useEffect, useState } from 'react';
import { Condition } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminDeleteModal } from '@/components/admin/AdminDeleteModal';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface ConditionFormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  active: boolean;
  display_order: number;
}

const initialFormData: ConditionFormData = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  image_url: '',
  active: true,
  display_order: 0,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingCondition, setDeletingCondition] = useState<Condition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<ConditionFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadConditions() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/conditions');
      if (res.ok) {
        const data = await res.json();
        setConditions(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch conditions' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to condition management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConditions();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: conditions.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cond: Condition) => {
    setEditingId(cond.id);
    setFormData({
      name: cond.name,
      slug: cond.slug,
      short_description: cond.short_description || '',
      description: cond.description || '',
      image_url: cond.image_url || '',
      active: Boolean(cond.active),
      display_order: Number(cond.display_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      short_description: formData.short_description,
      description: formData.description,
      image_url: formData.image_url.trim() || undefined,
      active: formData.active,
      display_order: Number(formData.display_order),
    };

    try {
      const url = editingId ? `/api/admin/conditions/${editingId}` : '/api/admin/conditions';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save condition');
      }

      setToast({ type: 'success', message: data.message || 'Condition saved successfully' });
      setIsModalOpen(false);
      loadConditions();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cond: Condition) => {
    try {
      const res = await fetch(`/api/admin/conditions/${cond.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !cond.active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update condition status');
      }

      setToast({
        type: 'success',
        message: `${cond.name} is now ${!cond.active ? 'Active' : 'Inactive'}`,
      });
      loadConditions();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingCondition) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/conditions/${deletingCondition.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete condition');
      }

      setToast({ type: 'success', message: data.message || 'Condition deleted' });
      setIsDeleteModalOpen(false);
      setDeletingCondition(null);
      loadConditions();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete condition' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Clinical Scope"
        title="Conditions Supported"
        description="Manage developmental, communication, sensory, and behavioral conditions supported at the clinic."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Condition</span>
          </Button>
        }
      />

      {/* Conditions Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-600 uppercase tracking-wider font-bold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order</th>
                <th className="py-3.5 px-4">Condition Name</th>
                <th className="py-3.5 px-4">Slug / Public URL</th>
                <th className="py-3.5 px-4">Short Overview</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-600 animate-pulse">
                    Loading conditions...
                  </td>
                </tr>
              ) : conditions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <AdminEmptyState
                      icon={ShieldAlert}
                      title="No Conditions Configured"
                      description="Add developmental conditions to educate families on diagnoses supported at the clinic."
                      action={{
                        label: 'Add First Condition',
                        onClick: handleOpenCreate,
                        icon: Plus,
                      }}
                    />
                  </td>
                </tr>
              ) : (
                conditions.map((cond) => (
                  <tr key={cond.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-600">
                      #{cond.display_order}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-800 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-brand-950 text-xs block">{cond.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <a
                        href={`/conditions/${cond.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-850 hover:text-brand-950 hover:underline"
                      >
                        <span>/{cond.slug}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </td>
                    <td className="py-4 px-4 text-stone-600 max-w-xs truncate text-[11px]">
                      {cond.short_description}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(cond)}
                        className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
                        title="Click to toggle active status"
                      >
                        {cond.active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-200/80 shadow-2xs">
                            <CheckCircle className="w-3 h-3 text-emerald-700" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full font-bold text-[11px] border border-stone-200 shadow-2xs">
                            <XCircle className="w-3 h-3 text-stone-500" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cond)}
                          className="p-1.5 text-stone-600 hover:text-brand-950 hover:bg-stone-100 rounded-xl transition-colors"
                          title="Edit condition"
                          aria-label={`Edit ${cond.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCondition(cond);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete condition"
                          aria-label={`Delete ${cond.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Condition: ${formData.name}` : 'Add New Condition'}
        description="Configure condition descriptions, clinical scope, and public visibility."
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Condition Name"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Autism Spectrum Condition (ASC)"
            />
            <Input
              label="URL Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. autism-spectrum"
              helperText="URL path: /conditions/[slug]"
            />
          </div>

          <Textarea
            label="Short Description"
            required
            rows={2}
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Brief 1-2 sentence clinical summary (min 10 chars)"
          />

          <Textarea
            label="Detailed Clinical Overview"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Comprehensive description of the developmental profile, clinical presentation, and therapeutic pathways (min 20 chars)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div>
              <Input
                label="Image URL (Optional)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
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

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="active_condition"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
            />
            <label htmlFor="active_condition" className="font-bold text-brand-950 cursor-pointer text-xs">
              Active (Published and visible on public website)
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
              {editingId ? 'Save Changes' : 'Create Condition'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shared Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCondition(null);
        }}
        onConfirm={handleDelete}
        title="Delete Condition"
        itemName={deletingCondition?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
