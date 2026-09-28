'use client';

import React, { useEffect, useState } from 'react';
import { TeamMember } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminDeleteModal } from '@/components/admin/AdminDeleteModal';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  User,
  Sparkles,
} from 'lucide-react';

interface TeamFormData {
  name: string;
  role: string;
  specialization: string;
  bio: string;
  image_url: string;
  active: boolean;
  display_order: number;
}

const initialFormData: TeamFormData = {
  name: '',
  role: '',
  specialization: '',
  bio: '',
  image_url: '',
  active: true,
  display_order: 0,
};

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function loadTeam() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch team members' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to team management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      display_order: teamMembers.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      specialization: member.specialization || '',
      bio: member.bio || '',
      image_url: member.image_url || '',
      active: Boolean(member.active),
      display_order: Number(member.display_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name,
      role: formData.role,
      specialization: formData.specialization.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      image_url: formData.image_url.trim() || undefined,
      active: formData.active,
      display_order: Number(formData.display_order),
    };

    try {
      const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save team specialist');
      }

      setToast({ type: 'success', message: data.message || 'Team specialist saved successfully' });
      setIsModalOpen(false);
      loadTeam();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !member.active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update team member status');
      }

      setToast({
        type: 'success',
        message: `${member.name} is now ${!member.active ? 'Active' : 'Inactive'}`,
      });
      loadTeam();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${deletingMember.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete team member');
      }

      setToast({ type: 'success', message: data.message || 'Team specialist removed' });
      setIsDeleteModalOpen(false);
      setDeletingMember(null);
      loadTeam();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete team specialist' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Clinical Staff"
        title="Multidisciplinary Team"
        description="Manage clinical specialists, occupational therapists, speech pathologists, and psychologist profiles."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Specialist</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {loading ? (
          <div className="col-span-full bg-white rounded-3xl border border-stone-200/80 p-12 text-center text-xs text-stone-600 font-medium animate-pulse">
            Loading team specialists...
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full">
            <AdminEmptyState
              icon={Users}
              title="No Team Members Found"
              description="Add therapists, psychologists, and specialists to display on the public Team page."
              action={{
                label: 'Add First Specialist',
                onClick: handleOpenCreate,
                icon: Plus,
              }}
            />
          </div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-850 flex items-center justify-center font-bold overflow-hidden shadow-2xs shrink-0">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-brand-750" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif-heading font-bold text-brand-950 text-sm leading-snug">
                        {member.name}
                      </h3>
                      <span className="block text-[11px] font-bold text-brand-750 uppercase tracking-wider mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-600 px-2 py-0.5 rounded-md bg-stone-100">
                    #{member.display_order}
                  </span>
                </div>

                {member.specialization && (
                  <div className="p-2.5 rounded-xl bg-[#faf9f7] border border-stone-200/70 text-[11px] font-medium text-stone-700">
                    <strong className="text-brand-950 font-semibold">Specialization:</strong> {member.specialization}
                  </div>
                )}

                {member.bio && (
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 font-medium">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => handleToggleActive(member)}
                  className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
                  title="Click to toggle active status"
                >
                  {member.active ? (
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
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 text-stone-600 hover:text-brand-950 hover:bg-stone-100 rounded-xl transition-colors"
                    title="Edit Specialist"
                    aria-label={`Edit ${member.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingMember(member);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Specialist"
                    aria-label={`Delete ${member.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Specialist: ${formData.name}` : 'Add New Team Specialist'}
        description="Configure clinician credentials, specialization details, and profile photo."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name & Title"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Ritu Sinha, BCBA"
            />
            <Input
              label="Role / Clinical Designation"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Lead Occupational Therapist"
            />
          </div>

          <Input
            label="Specialization (Optional)"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g. Sensory Integration, Autism Early Intervention, AAC"
          />

          <Textarea
            label="Professional Bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Clinical experience, academic background, certifications, and therapy philosophy..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Profile Photo URL (Optional)"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
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
              id="active_member"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
            />
            <label htmlFor="active_member" className="font-bold text-brand-950 cursor-pointer text-xs">
              Active (Visible on public About &amp; Team sections)
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
              {editingId ? 'Save Changes' : 'Create Specialist'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shared Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingMember(null);
        }}
        onConfirm={handleDelete}
        title="Delete Team Specialist"
        itemName={deletingMember?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
