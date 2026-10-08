'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import { MediaItem, VideoOptimizationMeta } from '@/types';
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
  optimizeVideo,
  extractVideoMetadata,
  canOptimizeVideo,
} from '@/lib/video-optimizer';
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
  Zap,
  Gauge,
  Film,
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
  status: 'pending' | 'optimizing' | 'uploading' | 'success' | 'error';
  stageMessage?: string;
  progress: number;
  error?: string;
  uploadedUrl?: string;
  generatedThumbnail?: string;
  uploadedThumbnailUrl?: string;
  optimizationMeta?: VideoOptimizationMeta;
}

function formatTitleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  if (!base) return 'Media Asset';
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || isNaN(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Upload a thumbnail image data URL to Vercel Blob
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

  // Multi-file upload & optimization state
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    setIsProcessing(false);
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
        try {
          const meta = await extractVideoMetadata(file);
          if (meta.posterDataUrl) {
            fileWithPreview.generatedThumbnail = meta.posterDataUrl;
            fileWithPreview.preview = meta.posterDataUrl;
          }
        } catch (err) {
          console.warn('Initial video poster extraction failed:', err);
        }
      }

      newFiles.push(fileWithPreview);
    }

    if (newFiles.length === 0) return;

    setSelectedFiles((prev) => {
      const updated = [...prev, ...newFiles];
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
   * Process (Optimize Video if needed) and Upload a single file directly to Vercel Blob
   */
  const processAndUploadFile = async (
    fileWithPreview: FileWithPreview
  ): Promise<{ blobUrl: string; thumbnailUrl?: string; meta?: VideoOptimizationMeta }> => {
    const { file, id, generatedThumbnail } = fileWithPreview;
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');

    let fileToUpload = file;
    let posterDataUrl = generatedThumbnail || '';
    let optimizationMeta: VideoOptimizationMeta | undefined = undefined;

    // 1. If Video, perform hardware-accelerated transcoding (H.264 FastStart)
    if (isVideo) {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: 'optimizing',
                progress: 0,
                stageMessage: 'Analyzing video & hardware encoders...',
                error: undefined,
              }
            : f
        )
      );

      try {
        const optResult = await optimizeVideo(file, (percentage, stage) => {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    progress: percentage,
                    stageMessage: stage,
                  }
                : f
            )
          );
        });

        fileToUpload = optResult.optimizedFile;
        optimizationMeta = optResult.metadata;
        if (optResult.posterDataUrl) {
          posterDataUrl = optResult.posterDataUrl;
        }
      } catch (optErr: any) {
        console.warn('Video optimization encountered error, proceeding with original:', optErr);
        fileToUpload = file;
      }
    }

    // 2. Upload file to Vercel Blob
    setSelectedFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'uploading',
              progress: 0,
              stageMessage: 'Uploading optimized media to Vercel Blob...',
              optimizationMeta,
            }
          : f
      )
    );

    const cleanFileName = fileToUpload.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `media/${Date.now()}_${cleanFileName}`;

    try {
      const blobResult = await upload(pathname, fileToUpload, {
        access: 'public',
        handleUploadUrl: '/api/admin/media/upload',
        multipart: fileToUpload.size > 5 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    progress: percentage,
                    stageMessage: `Uploading to Blob: ${Math.round(percentage)}%`,
                  }
                : f
            )
          );
        },
      });

      let uploadedThumbnailUrl: string | undefined = undefined;

      // 3. Upload thumbnail image if present
      if (isVideo && posterDataUrl) {
        const thumbUrl = await uploadThumbnailDataUrl(posterDataUrl, file.name);
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
                stageMessage: 'Completed',
                uploadedUrl: blobResult.url,
                uploadedThumbnailUrl,
                optimizationMeta,
              }
            : f
        )
      );

      return {
        blobUrl: blobResult.url,
        thumbnailUrl: uploadedThumbnailUrl,
        meta: optimizationMeta,
      };
    } catch (err: any) {
      console.error('Upload failed for file:', file.name, err);
      const errorMsg = err?.message || 'Upload was interrupted';

      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: 'error', progress: 0, error: errorMsg, stageMessage: 'Failed' }
            : f
        )
      );
      throw new Error(errorMsg);
    }
  };

  /**
   * Bulk upload all pending files with optimization and save records to database
   */
  const handleBulkUpload = async () => {
    const pendingFiles = selectedFiles.filter((f) => f.status === 'pending' || f.status === 'error');

    if (pendingFiles.length === 0) {
      setToast({ type: 'error', message: 'No pending files to upload' });
      return;
    }

    setIsProcessing(true);

    let successCount = 0;
    let failedCount = 0;
    const baseDisplayOrder = Number(formData.display_order) || mediaItems.length + 1;

    for (let i = 0; i < pendingFiles.length; i++) {
      const item = pendingFiles[i];
      try {
        const { blobUrl, thumbnailUrl, meta } = await processAndUploadFile(item);
        const isVideo = item.file.type.startsWith('video/') || item.file.name.endsWith('.mp4') || item.file.name.endsWith('.webm');

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
          optimization_status: meta?.optimization_status || (isVideo ? 'ready' : null),
          original_size_bytes: meta?.original_size_bytes ?? item.file.size,
          optimized_size_bytes: meta?.optimized_size_bytes ?? null,
          duration_seconds: meta?.duration_seconds ?? null,
          width: meta?.width ?? null,
          height: meta?.height ?? null,
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

    setIsProcessing(false);

    if (successCount > 0) {
      setToast({
        type: 'success',
        message: `Successfully processed, optimized and saved ${successCount} media item(s)`,
      });
      loadMedia();

      if (failedCount === 0) {
        setIsModalOpen(false);
        resetUploadState();
      }
    }

    if (failedCount > 0) {
      setToast({
        type: 'error',
        message: `${failedCount} file(s) encountered an issue. Successful items were saved.`,
      });
    }
  };

  /**
   * Save media item from modal (handles single create with optimization, edit, or URL mode)
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetUrl = formData.url.trim();
    let targetThumbnailUrl = formData.thumbnail_url.trim() || null;
    let targetType = formData.type;
    let optMeta: VideoOptimizationMeta | undefined = undefined;

    if (sourceMode === 'upload' && !editingId && selectedFiles.length > 0) {
      const pendingFile = selectedFiles.find((f) => f.status === 'pending' || f.status === 'error');
      if (pendingFile) {
        try {
          setIsSaving(true);
          const { blobUrl, thumbnailUrl, meta } = await processAndUploadFile(pendingFile);
          targetUrl = blobUrl;
          if (thumbnailUrl) {
            targetThumbnailUrl = thumbnailUrl;
          }
          optMeta = meta;
          const isVideo = pendingFile.file.type.startsWith('video/') || pendingFile.file.name.endsWith('.mp4') || pendingFile.file.name.endsWith('.webm');
          targetType = isVideo ? 'video' : 'image';
        } catch (err: any) {
          setIsSaving(false);
          setToast({ type: 'error', message: err?.message || 'Failed to optimize or upload file' });
          return;
        }
      } else {
        const uploadedFile = selectedFiles.find((f) => f.status === 'success');
        if (uploadedFile?.uploadedUrl) {
          targetUrl = uploadedFile.uploadedUrl;
          if (uploadedFile.uploadedThumbnailUrl) {
            targetThumbnailUrl = uploadedFile.uploadedThumbnailUrl;
          }
          optMeta = uploadedFile.optimizationMeta;
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
      optimization_status: optMeta?.optimization_status || (targetType === 'video' ? 'ready' : null),
      original_size_bytes: optMeta?.original_size_bytes ?? null,
      optimized_size_bytes: optMeta?.optimized_size_bytes ?? null,
      duration_seconds: optMeta?.duration_seconds ?? null,
      width: optMeta?.width ?? null,
      height: optMeta?.height ?? null,
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
        eyebrow="Digital Assets & Video Optimization"
        title="Media Gallery Manager"
        description="Upload photos and high-bitrate camera videos with automatic client-side H.264 FastStart transcoding, Vercel Blob storage, and instant public streaming."
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
          description="Upload photos or clinical videos (up to 500 MB each) with automated FastStart compression and Vercel Blob storage."
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
            const hasOptimization =
              item.original_size_bytes &&
              item.optimized_size_bytes &&
              item.original_size_bytes > item.optimized_size_bytes;

            const reductionPct = hasOptimization
              ? Math.round(
                  ((item.original_size_bytes! - item.optimized_size_bytes!) /
                    item.original_size_bytes!) *
                    100
                )
              : null;

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
                      playsInline
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

                <div className="p-5 space-y-2.5">
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

                  {/* Video Optimization / Codec Metric Badge */}
                  {item.type === 'video' && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {hasOptimization ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                          <Zap className="w-3 h-3 text-indigo-600" />
                          <span>
                            {formatBytes(item.optimized_size_bytes)} ({reductionPct}% saved)
                          </span>
                        </span>
                      ) : null}

                      {item.width && item.height ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md font-mono">
                          <Film className="w-3 h-3 text-stone-500" />
                          <span>
                            {item.width}x{item.height}
                            {item.duration_seconds ? ` • ${Math.round(item.duration_seconds)}s` : ''}
                          </span>
                        </span>
                      ) : null}

                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        <Gauge className="w-3 h-3 text-emerald-600" />
                        <span>FastStart MP4</span>
                      </span>
                    </div>
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

      {/* Create / Edit Modal with Automatic Video Optimization & Vercel Blob Upload */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetUploadState();
        }}
        title={editingId ? 'Edit Media Asset' : 'Upload & Optimize Media'}
        description={
          editingId
            ? 'Update metadata or replace the media URL.'
            : 'Upload photos or high-bitrate camera videos. Videos are automatically transcoded into web-optimized H.264 FastStart MP4s.'
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
                <span>Direct Upload &amp; Optimization</span>
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
                      Camera Videos &amp; Photos (JPG, PNG, WebP, MP4, WebM) up to 500 MB each
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
                        <Zap className="w-3 h-3 text-emerald-600" /> Auto H.264 FastStart
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-100/90 px-2 py-0.5 rounded">
                        <Cloud className="w-3 h-3 text-indigo-600" /> Vercel Blob Direct
                      </span>
                    </div>
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
                        disabled={isProcessing}
                        className="gap-1.5"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing &amp; Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Optimize &amp; Upload All ({selectedFiles.length})</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {selectedFiles.map((fileWithPreview) => {
                      const isVideo =
                        fileWithPreview.file.type.startsWith('video/') ||
                        fileWithPreview.file.name.endsWith('.mp4') ||
                        fileWithPreview.file.name.endsWith('.webm');

                      const isOptimizing = fileWithPreview.status === 'optimizing';
                      const isUploading = fileWithPreview.status === 'uploading';

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
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-stone-900 truncate">
                                {fileWithPreview.file.name}
                              </p>
                              <span className="text-[10px] font-mono text-stone-500 shrink-0">
                                {formatBytes(fileWithPreview.file.size)}
                              </span>
                            </div>

                            {/* Optimization & Upload Progress */}
                            {(isOptimizing || isUploading) && (
                              <div className="space-y-1 mt-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className={isOptimizing ? 'text-indigo-700 flex items-center gap-1' : 'text-emerald-700'}>
                                    {isOptimizing && <Loader2 className="w-3 h-3 animate-spin inline" />}
                                    {fileWithPreview.stageMessage || (isOptimizing ? 'Optimizing video...' : 'Uploading to Blob...')}
                                  </span>
                                  <span className="font-mono">{Math.round(fileWithPreview.progress)}%</span>
                                </div>
                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-200 ${
                                      isOptimizing ? 'bg-indigo-600' : 'bg-emerald-600'
                                    }`}
                                    style={{ width: `${Math.max(5, fileWithPreview.progress)}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {fileWithPreview.status === 'success' && (
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-[11px] text-emerald-700 font-bold">
                                  {isVideo ? 'Optimized (H.264 FastStart) & Saved' : 'Uploaded to Vercel Blob'}
                                </span>
                              </div>
                            )}

                            {fileWithPreview.status === 'error' && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span className="text-[11px] text-rose-700 font-medium line-clamp-1">
                                  {fileWithPreview.error || 'Processing failed'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          {!isOptimizing && !isUploading && (
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
                    playsInline
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
              disabled={isSaving || isProcessing}
            >
              {editingId ? 'Save Changes' : selectedFiles.length > 1 ? 'Optimize & Upload All' : 'Save Media Item'}
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
