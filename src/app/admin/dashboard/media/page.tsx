'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MediaItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  UploadCloud,
  FileCheck,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Link as LinkIcon,
} from 'lucide-react';

interface MediaFormData {
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url: string;
  category: string;
  featured: boolean;
  active: boolean;
  display_order: number;
}

const initialFormData: MediaFormData = {
  title: '',
  description: '',
  type: 'image',
  url: '',
  thumbnail_url: '',
  category: 'Center',
  featured: false,
  active: true,
  display_order: 0,
};

const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.webm'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25 MB

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState<MediaFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload state
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch media library' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to media management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const resetUploadState = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setSourceMode('upload');
    resetUploadState();
    setFormData({
      ...initialFormData,
      display_order: mediaItems.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MediaItem) => {
    setEditingId(item.id);
    resetUploadState();
    const isLocal = item.url.startsWith('/uploads/media/');
    setSourceMode(isLocal ? 'upload' : 'url');
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      url: item.url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category || 'Center',
      featured: Boolean(item.featured),
      active: Boolean(item.active),
      display_order: Number(item.display_order ?? 0),
    });
    setIsModalOpen(true);
  };

  // Client-side file validation & upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setUploadError(`Invalid file format (${ext}). Allowed: JPG, PNG, WebP, SVG, MP4, WebM`);
      return;
    }

    const isVideo = ext === '.mp4' || ext === '.webm' || file.type.startsWith('video/');
    const isImage = !isVideo;

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      setUploadError(`Image exceeds maximum allowed size of 5 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      setUploadError(`Video exceeds maximum allowed size of 25 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      return;
    }

    setSelectedFile(file);

    // Auto-upload selected valid file
    await executeUpload(file, isVideo ? 'video' : 'image');
  };

  const executeUpload = async (file: File, detectedType: 'image' | 'video') => {
    setIsUploading(true);
    setUploadError(null);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(true);
      setFormData((prev) => ({
        ...prev,
        url: data.url,
        type: detectedType,
        // Auto-fill title if empty from clean file name
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      setToast({ type: 'error', message: 'Please select a file to upload or provide a media URL' });
      return;
    }

    setIsSaving(true);

    const payload = {
      title: formData.title,
      description: formData.description.trim() || undefined,
      type: formData.type,
      url: formData.url.trim(),
      thumbnail_url: formData.thumbnail_url.trim() || undefined,
      category: formData.category.trim() || undefined,
      featured: formData.featured,
      active: formData.active,
      display_order: Number(formData.display_order),
    };

    try {
      const url = editingId ? `/api/admin/media/${editingId}` : '/api/admin/media';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save media item');
      }

      setToast({ type: 'success', message: data.message || 'Media item saved successfully' });
      setIsModalOpen(false);
      loadMedia();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (item: MediaItem) => {
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update media status');
      }

      setToast({
        type: 'success',
        message: `Media item is now ${!item.active ? 'Active' : 'Inactive'}`,
      });
      loadMedia();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      const res = await fetch(`/api/admin/media/${deletingItem.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete media item');
      }

      setToast({ type: 'success', message: data.message || 'Media item and file deleted' });
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      loadMedia();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete media item' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Gallery Manager</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Upload and manage center photos, clinical rooms, and video resources</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Upload Media</span>
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-xs text-slate-400">
          Loading media gallery...
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center max-w-lg mx-auto border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6 text-tealbrand-700" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Media Library Empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No media files have been uploaded yet. Click below to upload local photos (up to 5 MB) or clinical videos (up to 25 MB).
          </p>
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 mt-2">
            <UploadCloud className="w-4 h-4" />
            <span>Upload First Media File</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => {
            const isLocal = item.url.startsWith('/uploads/media/');
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-200 transition-colors flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      poster={item.thumbnail_url || undefined}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      {item.type}
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-medium text-slate-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
                    {isLocal && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-tealbrand-900 bg-tealbrand-100/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <HardDrive className="w-3 h-3" /> Local
                      </span>
                    )}
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-300/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-xs leading-snug">{item.title}</h3>
                    <span className="font-mono text-[10px] font-semibold text-slate-400">#{item.display_order}</span>
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-tealbrand-700 hover:underline font-mono"
                    >
                      <span className="max-w-[220px] truncate">{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 pt-2 border-t border-slate-100 bg-slate-50/40">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="inline-flex items-center gap-1.5 focus:outline-none"
                    title="Click to toggle active status"
                  >
                    {item.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200/60">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold text-[10px] border border-slate-200">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Media"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingItem(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Media & Storage File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal with Real File Upload */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Media Item' : 'Upload New Media'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">

          {/* Source Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSourceMode('upload')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                sourceMode === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-tealbrand-700" />
              <span>Local File Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceMode('url')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                sourceMode === 'url'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-tealbrand-700" />
              <span>External URL / Embed</span>
            </button>
          </div>

          {sourceMode === 'upload' ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-200 hover:border-tealbrand-700/50 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="media_file_input"
                  accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <label htmlFor="media_file_input" className="cursor-pointer block space-y-2">
                  <div className="w-10 h-10 rounded-full bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center mx-auto">
                    {isUploading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-tealbrand-700" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs hover:text-tealbrand-700">
                      {isUploading ? 'Uploading file...' : editingId ? 'Click to replace file' : 'Click to choose file'}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Images (JPG, PNG, WebP, SVG) up to 5 MB • Videos (MP4, WebM) up to 25 MB
                    </p>
                  </div>
                </label>

                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px]">
                    <FileCheck className="w-3.5 h-3.5 text-tealbrand-700" />
                    <span className="font-semibold truncate max-w-[200px]">{selectedFile.name}</span>
                    <span className="text-slate-400">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>File uploaded securely to local storage: <code className="font-mono text-[11px]">{formData.url}</code></span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="External Media URL"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://images.unsplash.com/... or https://..."
                helperText="Enter a direct HTTP/HTTPS link to an image or video asset"
              />
            </div>
          )}

          {/* Media Preview Box if URL is available */}
          {formData.url && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Preview</span>
              <div className="relative aspect-video max-h-48 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                {formData.type === 'video' ? (
                  <video
                    src={formData.url}
                    poster={formData.thumbnail_url || undefined}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={formData.url}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Media Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sensory Integration Gym Room"
            />
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Media Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-tealbrand-700/20 focus:border-tealbrand-700"
              >
                <option value="image">Image / Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          {formData.type === 'video' && (
            <Input
              label="Thumbnail Image URL (Optional)"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://... or /uploads/media/..."
            />
          )}

          <Textarea
            label="Description / Caption (Optional)"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Clinical context or caption for this media item..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Center, Therapy Rooms, Events, Sensory..."
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured_media"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
              />
              <label htmlFor="featured_media" className="font-semibold text-slate-800">
                Featured on Homepage
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active_media"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-tealbrand-700 focus:ring-tealbrand-700"
              />
              <label htmlFor="active_media" className="font-semibold text-slate-800">
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
              isLoading={isSaving || isUploading}
              disabled={isUploading}
            >
              {editingId ? 'Save Changes' : 'Add Media Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Media Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to delete media item{' '}
            <strong className="text-slate-900">{deletingItem?.title}</strong>?
          </p>
          <p className="text-rose-600 font-medium">
            This action will permanently remove the database record and clean up any locally stored files on disk.
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
