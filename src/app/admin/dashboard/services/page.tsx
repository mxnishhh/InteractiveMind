'use client';

import React, { useEffect, useState } from 'react';
import { Service } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import {
  Activity,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface ServiceFormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  who_it_helps: string;
  benefits: string;
  approach: string;
  process_steps_text: string;
  skills_supported_text: string;
  active: boolean;
  display_order: number;
}

const initialFormData: ServiceFormData = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  image_url: '',
  who_it_helps: '',
  benefits: '',
  approach: '',
  process_steps_text: '',
  skills_supported_text: '',
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadServices() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch services' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to service management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: (services.length + 1),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      slug: service.slug,
      short_description: service.short_description || '',
      description: service.description || '',
      image_url: service.image_url || '',
      who_it_helps: service.who_it_helps || '',
      benefits: service.benefits || '',
      approach: service.approach || '',
      process_steps_text: (service.process_steps || []).join('\n'),
      skills_supported_text: (service.skills_supported || []).join('\n'),
      active: Boolean(service.active),
      display_order: Number(service.display_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-generate slug on creation only if user hasn't explicitly edited slug
      slug: editingId ? prev.slug : slugify(name),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const process_steps = formData.process_steps_text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const skills_supported = formData.skills_supported_text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      short_description: formData.short_description,
      description: formData.description,
      image_url: formData.image_url.trim() || undefined,
      who_it_helps: formData.who_it_helps.trim() || undefined,
      benefits: formData.benefits.trim() || undefined,
      approach: formData.approach.trim() || undefined,
      process_steps,
      skills_supported,
      active: formData.active,
      display_order: Number(formData.display_order),
    };

    try {
      const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save therapy program');
      }

      setToast({ type: 'success', message: data.message || 'Service saved successfully' });
      setIsModalOpen(false);
      loadServices();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update service status');
      }

      setToast({
        type: 'success',
        message: `${service.name} is now ${!service.active ? 'Active' : 'Inactive'}`,
      });
      loadServices();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    try {
      const res = await fetch(`/api/admin/services/${deletingService.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete service');
      }

      setToast({ type: 'success', message: data.message || 'Service deleted' });
      setIsDeleteModalOpen(false);
      setDeletingService(null);
      loadServices();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete service' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Therapies & Services Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage clinical programs, therapy processes, and skills</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Add Therapy Program</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Program Name</th>
              <th className="p-4">Slug / URL</th>
              <th className="p-4">Process Steps</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Loading therapies...</td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No therapies found. Click "Add Therapy Program" to create one.</td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-semibold text-slate-400">#{service.display_order}</td>
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-tealbrand-700 shrink-0" />
                      <span>{service.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    <a
                      href={`/therapies/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-tealbrand-700 hover:underline"
                    >
                      <span>/{service.slug}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {service.process_steps ? `${service.process_steps.length} steps` : '0 steps'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className="inline-flex items-center gap-1.5 focus:outline-none"
                      title="Click to toggle active status"
                    >
                      {service.active ? (
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
                        onClick={() => handleOpenEdit(service)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit program"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingService(service);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete program"
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
        title={editingId ? 'Edit Therapy Program' : 'Add New Therapy Program'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Program Name"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Applied Behavior Analysis (ABA)"
            />
            <Input
              label="URL Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. aba-therapy"
              helperText="URL path: /therapies/[slug]"
            />
          </div>

          <Textarea
            label="Short Description"
            required
            rows={2}
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Brief 1-2 sentence overview for cards and listings (min 10 chars)"
          />

          <Textarea
            label="Full Detailed Description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="In-depth explanation of the clinical therapy approach (min 20 chars)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Who It Helps (Optional)"
              rows={2}
              value={formData.who_it_helps}
              onChange={(e) => setFormData({ ...formData, who_it_helps: e.target.value })}
              placeholder="e.g. Children experiencing speech delays, non-verbal communication..."
            />
            <Textarea
              label="Key Benefits (Optional)"
              rows={2}
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="e.g. Builds expressive language, improves confidence..."
            />
          </div>

          <Textarea
            label="Clinical Approach (Optional)"
            rows={2}
            value={formData.approach}
            onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
            placeholder="e.g. Play-based language facilitation, oral-motor exercises..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Therapy Process Steps (One per line)"
              rows={4}
              value={formData.process_steps_text}
              onChange={(e) => setFormData({ ...formData, process_steps_text: e.target.value })}
              placeholder={"1. Comprehensive Assessment\n2. Individualized Plan\n3. Active Therapy Sessions\n4. Parent Coaching"}
              helperText="Enter each step on a new line"
            />
            <Textarea
              label="Skills Supported (One per line)"
              rows={4}
              value={formData.skills_supported_text}
              onChange={(e) => setFormData({ ...formData, skills_supported_text: e.target.value })}
              placeholder={"Functional Communication\nFine Motor Coordination\nSocial Play"}
              helperText="Enter each skill on a new line"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
            <div className="sm:col-span-2">
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
              id="active_service"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
            />
            <label htmlFor="active_service" className="font-semibold text-slate-800">
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
              {editingId ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Program Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete the therapy program{' '}
            <strong className="text-slate-900">{deletingService?.name}</strong>?
          </p>
          <p className="text-rose-600 font-medium">
            This action cannot be undone. Any linked appointments will have their service reference unlinked.
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
