'use client';

import React, { useEffect, useState } from 'react';
import { Condition } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
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
      display_order: (conditions.length + 1),
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
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conditions Supported</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage developmental and behavioral conditions supported</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Add Condition</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Condition Name</th>
              <th className="p-4">Slug / URL</th>
              <th className="p-4">Short Overview</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Loading conditions...</td>
              </tr>
            ) : conditions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No conditions found. Click "Add Condition" to create one.</td>
              </tr>
            ) : (
              conditions.map((cond) => (
                <tr key={cond.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-semibold text-slate-400">#{cond.display_order}</td>
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-tealbrand-700 shrink-0" />
                      <span>{cond.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    <a
                      href={`/conditions/${cond.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-tealbrand-700 hover:underline"
                    >
                      <span>/{cond.slug}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">{cond.short_description}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(cond)}
                      className="inline-flex items-center gap-1.5 focus:outline-none"
                      title="Click to toggle active status"
                    >
                      {cond.active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-emerald-200/60">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-bold text-[11px] border border-slate-200">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cond)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit condition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingCondition(cond);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete condition"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Condition' : 'Add New Condition'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Condition Name"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Autism Spectrum Condition"
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
            label="Detailed Overview"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the condition and clinical considerations (min 20 chars)"
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

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active_condition"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
            />
            <label htmlFor="active_condition" className="font-semibold text-slate-800">
              Active (Visible on public website)
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
              {editingId ? 'Save Changes' : 'Create Condition'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Condition Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete the condition{' '}
            <strong className="text-slate-900">{deletingCondition?.name}</strong>?
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
