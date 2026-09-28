'use client';

import React, { useEffect, useState } from 'react';
import { Service } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminDeleteModal } from '@/components/admin/AdminDeleteModal';
import {
  Activity,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Eye
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
  const [isDeleting, setIsDeleting] = useState(false);
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
      display_order: services.length + 1,
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

      setToast({ type: 'success', message: data.message || 'Therapy program saved successfully' });
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
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${deletingService.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete service');
      }

      setToast({ type: 'success', message: data.message || 'Therapy program deleted' });
      setIsDeleteModalOpen(false);
      setDeletingService(null);
      loadServices();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete service' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Clinical Programs"
        title="Therapies & Services"
        description="Manage clinical interventions, therapy methodology, step-by-step processes, and supported skills."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Therapy Program</span>
          </Button>
        }
      />

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-600 uppercase tracking-wider font-bold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order</th>
                <th className="py-3.5 px-4">Program Name</th>
                <th className="py-3.5 px-4">Slug / Public URL</th>
                <th className="py-3.5 px-4">Process &amp; Skills</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-600 animate-pulse">
                    Loading therapy programs...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <AdminEmptyState
                      icon={Activity}
                      title="No Therapy Programs"
                      description="Create therapy programs to showcase on the Interactive Minds website and booking forms."
                      action={{
                        label: 'Add First Therapy Program',
                        onClick: handleOpenCreate,
                        icon: Plus,
                      }}
                    />
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-600">
                      #{service.display_order}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-800 flex items-center justify-center shrink-0">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-brand-950 text-xs block">{service.name}</span>
                          <span className="text-[11px] text-stone-600 line-clamp-1 max-w-xs font-normal">
                            {service.short_description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <a
                        href={`/therapies/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-850 hover:text-brand-950 hover:underline"
                      >
                        <span>/{service.slug}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                          {service.process_steps?.length || 0} Steps
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-850 font-semibold border border-brand-100">
                          {service.skills_supported?.length || 0} Skills
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
                        title="Click to toggle active status"
                      >
                        {service.active ? (
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
                          onClick={() => handleOpenEdit(service)}
                          className="p-1.5 text-stone-600 hover:text-brand-950 hover:bg-stone-100 rounded-xl transition-colors"
                          title="Edit program"
                          aria-label={`Edit ${service.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingService(service);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete program"
                          aria-label={`Delete ${service.name}`}
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
        title={editingId ? `Edit Therapy: ${formData.name}` : 'Add New Therapy Program'}
        description="Configure program descriptions, clinical process steps, and public visibility."
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-6 text-xs text-stone-800">
          {/* Section 1: Basic Identity */}
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80">
            <h4 className="font-serif-heading text-sm font-bold text-brand-950">
              1. Program Identity &amp; URL
            </h4>
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
              label="Short Summary"
              required
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief 1-2 sentence overview for cards and listings (min 10 chars)"
            />

            <Textarea
              label="Full Clinical Description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="In-depth explanation of the clinical therapy approach, methodology, and scope (min 20 chars)"
            />
          </div>

          {/* Section 2: Clinical Details */}
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80">
            <h4 className="font-serif-heading text-sm font-bold text-brand-950">
              2. Clinical Context &amp; Benefits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Who It Helps (Optional)"
                rows={2}
                value={formData.who_it_helps}
                onChange={(e) => setFormData({ ...formData, who_it_helps: e.target.value })}
                placeholder="e.g. Children experiencing speech delays, non-verbal communication, expressive difficulties..."
              />
              <Textarea
                label="Key Benefits (Optional)"
                rows={2}
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="e.g. Builds expressive vocabulary, improves self-regulation, enhances social confidence..."
              />
            </div>

            <Textarea
              label="Clinical Approach & Methodology (Optional)"
              rows={2}
              value={formData.approach}
              onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
              placeholder="e.g. Play-based language facilitation, multi-sensory stimulation, positive reinforcement protocols..."
            />
          </div>

          {/* Section 3: Structured Clinical Lists */}
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80">
            <h4 className="font-serif-heading text-sm font-bold text-brand-950">
              3. Therapy Journey &amp; Skills Supported
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Therapy Process Steps (One per line)"
                rows={4}
                value={formData.process_steps_text}
                onChange={(e) => setFormData({ ...formData, process_steps_text: e.target.value })}
                placeholder={"1. Comprehensive Clinical Assessment\n2. Individualized Therapy Plan\n3. Active 1-on-1 Sessions\n4. Parent Coaching & Home Support"}
                helperText="Enter each sequential step on a new line"
              />
              <Textarea
                label="Skills Supported (One per line)"
                rows={4}
                value={formData.skills_supported_text}
                onChange={(e) => setFormData({ ...formData, skills_supported_text: e.target.value })}
                placeholder={"Functional Communication\nFine Motor Coordination\nSocial Play & Interaction\nEmotional Regulation"}
                helperText="Enter each key skill on a new line"
              />
            </div>
          </div>

          {/* Section 4: Display & Settings */}
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80">
            <h4 className="font-serif-heading text-sm font-bold text-brand-950">
              4. Media &amp; Visibility
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-2">
                <Input
                  label="Cover Image URL (Optional)"
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
                id="active_service"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
              />
              <label htmlFor="active_service" className="font-bold text-brand-950 cursor-pointer text-xs">
                Active (Published and visible on public website)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200/80">
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
              {editingId ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shared Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingService(null);
        }}
        onConfirm={handleDelete}
        title="Delete Therapy Program"
        itemName={deletingService?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
