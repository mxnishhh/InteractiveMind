'use client';

import React, { useEffect, useState } from 'react';
import { TeamMember } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  User,
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
        throw new Error(data.error || 'Failed to save team member');
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
    try {
      const res = await fetch(`/api/admin/team/${deletingMember.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete team member');
      }

      setToast({ type: 'success', message: data.message || 'Team specialist deleted' });
      setIsDeleteModalOpen(false);
      setDeletingMember(null);
      loadTeam();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete team specialist' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Multidisciplinary Team</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage clinical therapists, specialists, and bios</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Add Specialist</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            Loading team specialists...
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            No team specialists found. Click "Add Specialist" to create one.
          </div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:border-slate-200 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center font-bold overflow-hidden border border-tealbrand-100/60">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-tealbrand-700" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{member.name}</h3>
                      <span className="block text-[11px] font-semibold text-tealbrand-700 uppercase tracking-wide mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-400">#{member.display_order}</span>
                </div>

                {member.specialization && (
                  <p className="text-[11px] font-medium text-slate-500 italic">
                    Specialization: {member.specialization}
                  </p>
                )}

                {member.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleToggleActive(member)}
                  className="inline-flex items-center gap-1.5 focus:outline-none"
                  title="Click to toggle active status"
                >
                  {member.active ? (
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
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Specialist"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingMember(member);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Specialist"
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
        title={editingId ? 'Edit Specialist' : 'Add New Specialist'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name & Title"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Priya Sharma, BCBA"
            />
            <Input
              label="Role / Clinical Title"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Lead Behavior Analyst"
            />
          </div>

          <Input
            label="Specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g. Early Intervention, AAC & Social Communication"
          />

          <Textarea
            label="Professional Bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Clinical background, qualifications, certifications, and therapy philosophy..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Photo URL (Optional)"
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

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active_member"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
            />
            <label htmlFor="active_member" className="font-semibold text-slate-800">
              Active (Visible on public About & Team sections)
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
              {editingId ? 'Save Changes' : 'Create Specialist'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Specialist Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to delete specialist{' '}
            <strong className="text-slate-900">{deletingMember?.name}</strong>?
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
