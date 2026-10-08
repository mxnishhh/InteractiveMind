'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import { MediaItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminDeleteModal } from '@/components/admin/AdminDeleteModal';
import { isVercelBlobUrl } from '@/lib/media-utils';
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
  AlertCircle,
  HardDrive,
  Cloud,
  Link as LinkIcon,
  X,
  Loader2,
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
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  uploadedUrl?: string;
  generatedThumbnail?: string; // Data URL for client preview & upload
  uploadedThumbnailUrl?: string;
}

function formatTitleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  if (!base) return 'Media Asset';
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate a representative frame thumbnail from a video file using Canvas API.
 * This runs client-side in the browser on any deployment architecture.
 */
async function generateVideoThumbnail(videoFile: File): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const objectUrl = URL.createObjectURL(videoFile);
      video.src = objectUrl;

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
        video.remove();
        canvas.remove();
      };

      video.addEventListener('loadedmetadata', () => {
        // Seek to 1 second (or 10% of duration, whichever is smaller) to capture a clear frame
        const seekTime = Math.min(1, Math.max(0.1, video.duration * 0.1));
        video.currentTime = seekTime;
      });

      video.addEventListener('seeked', () => {
        try {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          cleanup();
          resolve(thumbnailDataUrl);
        } catch (err) {
          console.error('Error generating canvas video thumbnail:', err);
          cleanup();
          resolve(null);
        }
      });

      video.addEventListener('error', () => {
        cleanup();
        resolve(null);
      });

      video.load();
    } catch (err) {
      console.error('Error in generateVideoThumbnail:', err);
      resolve(null);
    }
  });
}

/**
 * Upload a video thumbnail data URL to Vercel Blob
 */
async function uploadThumbnailDataUrl(dataUrl: string, baseFilename: string): Promise<string | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const cleanName = baseFilename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^/.]+$/, '');
    const thumbFile = new File([blob], `thumb_${cleanName}.jpg`, { type: 'image/jpeg' });

    const uploaded = await upload(`media/thumbnails/thumb_${Date.now()}_${cleanName}.jpg`, thumbFile, {
      access: 'public',
      handleUploadUrl: '/api/admin/media/upload',
    });

    return uploaded.url;
  } catch (err) {
    console.error('Error uploading video thumbnail to Vercel Blob:', err);
    return null;
  }
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<MediaFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Multi-file upload state
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const resetUploadState = () => {
    selectedFiles.forEach((f) => {
      if (f.preview && f.preview.startsWith('blob:')) {
        URL.revokeObjectURL(f.preview);
      }
    });
    setSelectedFiles([]);
    setIsUploading(false);
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
    const isBlob = isVercelBlobUrl(item.url);
    const isLocal = item.url.startsWith('/uploads/media/');
    setSourceMode(isBlob || isLocal ? 'upload' : 'url');
    setFormData({
      title: item.title || '',
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

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return { valid: false, error: `Invalid format (${ext}). Allowed: JPG, PNG, WebP, SVG, MP4, WebM` };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File exceeds 500 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)` };
    }

    return { valid: true };
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: FileWithPreview[] = [];

    for (const file of Array.from(files)) {
      const validation = validateFile(file);

      if (!validation.valid) {
        setToast({ type: 'error', message: `${file.name}: ${validation.error}` });
        continue;
      }

      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
      const preview = isVideo ? '' : URL.createObjectURL(file);

      const fileWithPreview: FileWithPreview = {
        file,
        preview,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'pending',
        progress: 0,
      };

      if (isVideo) {
        const thumbnail = await generateVideoThumbnail(file);
        if (thumbnail) {
          fileWithPreview.generatedThumbnail = thumbnail;
          fileWithPreview.preview = thumbnail;
        }
      }

      newFiles.push(fileWithPreview);
    }

    if (newFiles.length === 0) return;

    setSelectedFiles((prev) => {
      const updated = [...prev, ...newFiles];
      // If single file selected, auto-populate title & type
      if (updated.length === 1 && !editingId) {
        const single = updated[0];
        const isVideo = single.file.type.startsWith('video/') || single.file.name.endsWith('.mp4') || single.file.name.endsWith('.webm');
        setFormData((formPrev) => ({
          ...formPrev,
          type: isVideo ? 'video' : 'image',
          title: formPrev.title || formatTitleFromFilename(single.file.name),
        }));
      }
      return updated;
    });
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview && file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  /**
   * Upload a single file directly to Vercel Blob with progress tracking,
   * generate its video thumbnail if needed, and return the uploaded URLs.
   */
  const uploadSingleFileToBlob = async (
    fileWithPreview: FileWithPreview
  ): Promise<{ blobUrl: string; thumbnailUrl?: string }> => {
    const { file, id, generatedThumbnail } = fileWithPreview;

    setSelectedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'uploading', progress: 0, error: undefined } : f))
    );

    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `media/${Date.now()}_${cleanFileName}`;

    try {
      // Direct client-side upload to Vercel Blob with multipart support for large files (up to 500 MB)
      const blobResult = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/media/upload',
        multipart: file.size > 5 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => {
          setSelectedFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: percentage } : f))
          );
        },
      });

      let uploadedThumbnailUrl: string | undefined = undefined;

      // If this is a video with a generated Canvas frame, upload the thumbnail image to Vercel Blob
      if (isVideo && generatedThumbnail) {
        const thumbUrl = await uploadThumbnailDataUrl(generatedThumbnail, file.name);
        if (thumbUrl) {
          uploadedThumbnailUrl = thumbUrl;
        }
      }

      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: 'success',
                progress: 100,
                uploadedUrl: blobResult.url,
                uploadedThumbnailUrl,
              }
            : f
        )
      );

      return { blobUrl: blobResult.url, thumbnailUrl: uploadedThumbnailUrl };
    } catch (err: any) {
      console.error('Vercel Blob upload failed for file:', file.name, err);
      const errorMsg = err?.message || 'Blob upload was interrupted';

      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: 'error', progress: 0, error: errorMsg }
            : f
        )
      );
      throw new Error(errorMsg);
    }
  };

  /**
   * Bulk upload all pending files directly to Vercel Blob and create their MySQL database records
   */
  const handleBulkUpload = async () => {
    const pendingFiles = selectedFiles.filter((f) => f.status === 'pending' || f.status === 'error');

    if (pendingFiles.length === 0) {
      setToast({ type: 'error', message: 'No pending files to upload' });
      return;
    }

    setIsUploading(true);

    let successCount = 0;
    let failedCount = 0;
    const baseDisplayOrder = Number(formData.display_order) || mediaItems.length + 1;

    for (let i = 0; i < pendingFiles.length; i++) {
      const item = pendingFiles[i];
      try {
        const { blobUrl, thumbnailUrl } = await uploadSingleFileToBlob(item);
        const isVideo = item.file.type.startsWith('video/') || item.file.name.endsWith('.mp4') || item.file.name.endsWith('.webm');

        // Create MySQL database record for this media asset
        const recordPayload = {
          title: formatTitleFromFilename(item.file.name),
          description: formData.description.trim() || null,
          type: isVideo ? 'video' : 'image',
          url: blobUrl,
          thumbnail_url: thumbnailUrl || null,
          category: formData.category.trim() || 'Center',
          featured: formData.featured,
          active: formData.active,
          display_order: baseDisplayOrder + i,
        };

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recordPayload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create media database record');
        }

        successCount++;
      } catch (err: any) {
        failedCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      setToast({
        type: 'success',
        message: `Successfully uploaded and saved ${successCount} media item(s) to Vercel Blob & database`,
      });
      loadMedia();

      // If all succeeded, close modal
      if (failedCount === 0) {
        setIsModalOpen(false);
        resetUploadState();
      }
    }

    if (failedCount > 0) {
      setToast({
        type: 'error',
        message: `${failedCount} file(s) failed. Successful files have been saved.`,
      });
    }
  };

  /**
   * Save media item from modal (handles single create, edit, or URL mode)
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetUrl = formData.url.trim();
    let targetThumbnailUrl = formData.thumbnail_url.trim() || null;
    let targetType = formData.type;

    // If in upload mode and there is a pending single file that has not uploaded yet, upload it first
    if (sourceMode === 'upload' && !editingId && selectedFiles.length > 0) {
      const pendingFile = selectedFiles.find((f) => f.status === 'pending' || f.status === 'error');
      if (pendingFile) {
        try {
          setIsSaving(true);
          const { blobUrl, thumbnailUrl } = await uploadSingleFileToBlob(pendingFile);
          targetUrl = blobUrl;
          if (thumbnailUrl) {
            targetThumbnailUrl = thumbnailUrl;
          }
          const isVideo = pendingFile.file.type.startsWith('video/') || pendingFile.file.name.endsWith('.mp4') || pendingFile.file.name.endsWith('.webm');
          targetType = isVideo ? 'video' : 'image';
        } catch (err: any) {
          setIsSaving(false);
          setToast({ type: 'error', message: err?.message || 'Failed to upload file to Vercel Blob' });
          return;
        }
      } else {
        const uploadedFile = selectedFiles.find((f) => f.status === 'success');
        if (uploadedFile?.uploadedUrl) {
          targetUrl = uploadedFile.uploadedUrl;
          if (uploadedFile.uploadedThumbnailUrl) {
            targetThumbnailUrl = uploadedFile.uploadedThumbnailUrl;
          }
        }
      }
    }

    if (!targetUrl) {
      setToast({ type: 'error', message: 'Please upload a file or provide a valid media URL' });
      return;
    }

    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Please provide a media title' });
      return;
    }

    setIsSaving(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      type: targetType,
      url: targetUrl,
      thumbnail_url: targetThumbnailUrl,
      category: formData.category.trim() || 'Center',
      featured: formData.featured,
      active: formData.active,
      display_order: Number(formData.display_order),
    };

    try {
      const endpoint = editingId ? `/api/admin/media/${editingId}` : '/api/admin/media';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
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
      resetUploadState();
      loadMedia();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'An unexpected error occurred while saving' });
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
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${deletingItem.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete media item');
      }

      setToast({ type: 'success', message: data.message || 'Media item and persistent storage deleted' });
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      loadMedia();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete media item' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Digital Assets"
        title="Media Gallery Manager"
        description="Upload and organize sensory gym photos, therapy room galleries, and clinical explainer videos with Vercel Blob persistent storage."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </Button>
        }
      />

      {loading ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center text-xs text-stone-600 font-medium animate-pulse">
          Loading media library...
        </div>
      ) : mediaItems.length === 0 ? (
        <AdminEmptyState
          icon={UploadCloud}
          title="Media Library Empty"
          description="Upload photos or clinical videos (up to 500 MB each) to showcase the facility with Vercel Blob storage."
          action={{
            label: 'Upload First Media File',
            onClick: handleOpenCreate,
            icon: UploadCloud,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {mediaItems.map((item) => {
            const isBlob = isVercelBlobUrl(item.url);
            const isLocal = item.url.startsWith('/uploads/media/');
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-video bg-stone-900 flex items-center justify-center overflow-hidden">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-brand-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs">
                      {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      {item.type}
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-bold text-stone-800 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-2xs">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
                    {isBlob && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-2xs">
                        <Cloud className="w-3 h-3 text-emerald-700" /> Blob
                      </span>
                    )}
                    {isLocal && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-900 bg-teal-100/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-2xs">
                        <HardDrive className="w-3 h-3" /> Local
                      </span>
                    )}
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-300/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-2xs">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif-heading font-bold text-brand-950 text-xs sm:text-sm leading-snug">
                      {item.title}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-stone-600 px-1.5 py-0.5 rounded bg-stone-100 shrink-0">
                      #{item.display_order}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-brand-850 hover:text-brand-950 hover:underline font-mono"
                    >
                      <span className="max-w-[200px] truncate">{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 px-5 border-t border-stone-100 bg-[#faf9f7]/60">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
                    title="Click to toggle active status"
                  >
                    {item.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[10px] border border-emerald-200/80 shadow-2xs">
                        <CheckCircle className="w-3 h-3 text-emerald-700" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full font-bold text-[10px] border border-stone-200 shadow-2xs">
                        <XCircle className="w-3 h-3 text-stone-500" /> Inactive
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-stone-600 hover:text-brand-950 hover:bg-stone-200/60 rounded-xl transition-colors"
                      title="Edit Media"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingItem(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Media & Storage File"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal with Direct Vercel Blob Multi-File Upload */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetUploadState();
        }}
        title={editingId ? 'Edit Media Asset' : 'Upload New Media'}
        description={
          editingId
            ? 'Update metadata or replace the media URL.'
            : 'Upload photos or videos directly to Vercel Blob persistent storage (up to 500 MB each).'
        }
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-800">
          {/* Source Mode Switcher */}
          {!editingId && (
            <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setSourceMode('upload')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  sourceMode === 'upload'
                    ? 'bg-white text-brand-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-brand-700" />
                <span>Direct Vercel Blob Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('url')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  sourceMode === 'url'
                    ? 'bg-white text-brand-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LinkIcon className="w-4 h-4 text-brand-700" />
                <span>External URL / Cloud CDN</span>
              </button>
            </div>
          )}

          {sourceMode === 'upload' && !editingId ? (
            <div className="space-y-3">
              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragActive
                    ? 'border-brand-700 bg-brand-50'
                    : 'border-stone-300 hover:border-brand-700 bg-[#faf9f7]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="media_file_input"
                  accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  multiple
                />

                <label htmlFor="media_file_input" className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-850 flex items-center justify-center mx-auto shadow-2xs">
                    <UploadCloud className="w-6 h-6 text-brand-700" />
                  </div>
                  <div>
                    <span className="font-bold text-brand-950 text-xs hover:text-brand-700 block">
                      {isDragActive ? 'Drop files here' : 'Click to choose files or drag & drop'}
                    </span>
                    <p className="text-[11px] text-stone-600 mt-1 font-medium">
                      Images &amp; Videos (JPG, PNG, WebP, MP4, WebM) up to 500 MB each
                    </p>
                    <p className="text-[11px] text-emerald-700 font-bold mt-1">
                      Direct Vercel Blob client upload • Auto-generated video thumbnails
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected Files Preview with Progress */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">
                      Selected Files ({selectedFiles.length})
                    </span>
                    {selectedFiles.length > 1 && selectedFiles.some((f) => f.status === 'pending' || f.status === 'error') && (
                      <Button
                        type="button"
                        onClick={handleBulkUpload}
                        variant="primary"
                        size="sm"
                        disabled={isUploading}
                        className="gap-1.5"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading to Blob...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload All ({selectedFiles.length} files)</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
                    {selectedFiles.map((fileWithPreview) => {
                      const isVideo =
                        fileWithPreview.file.type.startsWith('video/') ||
                        fileWithPreview.file.name.endsWith('.mp4') ||
                        fileWithPreview.file.name.endsWith('.webm');

                      return (
                        <div
                          key={fileWithPreview.id}
                          className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-xl shadow-2xs"
                        >
                          {/* Thumbnail / Preview */}
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            {fileWithPreview.preview ? (
                              <img
                                src={fileWithPreview.preview}
                                alt={fileWithPreview.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="w-5 h-5 text-stone-500" />
                              </div>
                            )}
                          </div>

                          {/* File Details & Progress */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {fileWithPreview.file.name}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {(fileWithPreview.file.size / (1024 * 1024)).toFixed(2)} MB
                              {isVideo && fileWithPreview.generatedThumbnail ? ' • Auto-thumbnail ready' : ''}
                            </p>

                            {/* Status and Progress Bar */}
                            {fileWithPreview.status === 'uploading' && (
                              <div className="space-y-1 mt-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold text-brand-700">
                                  <span>Uploading directly to Blob...</span>
                                  <span>{Math.round(fileWithPreview.progress)}%</span>
                                </div>
                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-brand-700 h-full rounded-full transition-all duration-200"
                                    style={{ width: `${Math.max(5, fileWithPreview.progress)}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {fileWithPreview.status === 'success' && (
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-[11px] text-emerald-700 font-bold">
                                  Uploaded to Vercel Blob {isVideo && fileWithPreview.uploadedThumbnailUrl ? '+ Thumbnail' : ''}
                                </span>
                              </div>
                            )}

                            {fileWithPreview.status === 'error' && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span className="text-[11px] text-rose-700 font-medium line-clamp-1">
                                  {fileWithPreview.error || 'Upload failed'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          {fileWithPreview.status !== 'uploading' && (
                            <button
                              type="button"
                              onClick={() => removeFile(fileWithPreview.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                              aria-label="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="Media URL"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://...public.blob.vercel-storage.com/... or https://..."
                helperText="Enter a direct link to a Vercel Blob or external media asset"
              />
            </div>
          )}

          {/* Media Preview Box if URL is available */}
          {formData.url && (
            <div className="p-3 bg-[#faf9f7] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">Preview</span>
              <div className="relative aspect-video max-h-48 bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center">
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
              placeholder="e.g. Sensory Integration Gymnasium"
            />
            <div>
              <label className="block font-bold text-[11px] uppercase tracking-wider text-stone-700 mb-1.5">
                Media Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                aria-label="Media Type"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs bg-white text-brand-950 font-bold focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100"
              >
                <option value="image">Image / Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          {formData.type === 'video' && (
            <Input
              label="Custom Thumbnail URL (Optional)"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://...public.blob.vercel-storage.com/... or https://..."
              helperText="Leave blank to use auto-generated video frame thumbnail"
            />
          )}

          <Textarea
            label="Description / Caption (Optional)"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Clinical context or photo caption for this facility space..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Center, Therapy Rooms, Sensory, Events..."
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured_media"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
              />
              <label htmlFor="featured_media" className="font-bold text-brand-950 cursor-pointer text-xs">
                Featured on Homepage Gallery
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active_media"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-brand-850 focus:ring-brand-700 border-stone-300"
              />
              <label htmlFor="active_media" className="font-bold text-brand-950 cursor-pointer text-xs">
                Active (Published)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/80">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                resetUploadState();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              disabled={isSaving || isUploading}
            >
              {editingId ? 'Save Changes' : selectedFiles.length > 1 ? 'Save / Submit All' : 'Add Media Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shared Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        itemName={deletingItem?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
