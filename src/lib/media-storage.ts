import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { del } from '@vercel/blob';
import { isVercelBlobUrl } from './media-utils';

export { isVercelBlobUrl };

export const UPLOAD_DIR_RELATIVE = '/uploads/media';
export const UPLOAD_BASE_DIR = path.join(process.cwd(), 'public', 'uploads', 'media');

export const MAX_IMAGE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB
export const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export const ALLOWED_MIME_MAP: Record<string, { type: 'image' | 'video'; exts: string[] }> = {
  'image/jpeg': { type: 'image', exts: ['.jpg', '.jpeg'] },
  'image/png': { type: 'image', exts: ['.png'] },
  'image/webp': { type: 'image', exts: ['.webp'] },
  'image/svg+xml': { type: 'image', exts: ['.svg'] },
  'video/mp4': { type: 'video', exts: ['.mp4'] },
  'video/webm': { type: 'video', exts: ['.webm'] },
};

export const ALLOWED_CONTENT_TYPES = Object.keys(ALLOWED_MIME_MAP);

const DISALLOWED_EXTENSIONS = new Set([
  '.js', '.ts', '.tsx', '.jsx', '.php', '.phtml', '.sh', '.bash',
  '.html', '.htm', '.exe', '.bat', '.cmd', '.com', '.dll', '.jar',
  '.py', '.rb', '.pl', '.cgi', '.env', '.htaccess',
]);

export interface ValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: 'image' | 'video';
  extension?: string;
}

export function validateMediaFile(file: File): ValidationResult {
  if (!file || !(file instanceof File) || file.size === 0) {
    return { valid: false, error: 'No file provided or file is empty' };
  }

  const mimeType = (file.type || '').toLowerCase().trim();
  const originalName = file.name || 'unnamed';
  const rawExt = path.extname(originalName).toLowerCase();

  if (!rawExt || DISALLOWED_EXTENSIONS.has(rawExt)) {
    return { valid: false, error: `Disallowed or unsafe file extension: ${rawExt || 'none'}` };
  }

  const mimeConfig = ALLOWED_MIME_MAP[mimeType];
  if (!mimeConfig) {
    return {
      valid: false,
      error: `Unsupported file type: ${mimeType || 'unknown'}. Allowed: JPG, PNG, WebP, SVG, MP4, WebM`,
    };
  }

  if (!mimeConfig.exts.includes(rawExt)) {
    return {
      valid: false,
      error: `MIME type (${mimeType}) does not match file extension (${rawExt})`,
    };
  }

  const mediaType = mimeConfig.type;

  if (mediaType === 'image' && file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `Image file is too large (${sizeMb} MB). Maximum allowed size is 500 MB.` };
  }

  if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `Video file is too large (${sizeMb} MB). Maximum allowed size is 500 MB.` };
  }

  return {
    valid: true,
    mediaType,
    extension: rawExt,
  };
}

export async function saveUploadedMediaFile(file: File): Promise<{
  url: string;
  filename: string;
  size: number;
  type: 'image' | 'video';
}> {
  const validation = validateMediaFile(file);
  if (!validation.valid || !validation.extension || !validation.mediaType) {
    throw new Error(validation.error || 'Invalid media file');
  }

  // Ensure upload directory exists
  await fs.mkdir(UPLOAD_BASE_DIR, { recursive: true });

  // Generate safe unique filename
  const uniqueToken = crypto.randomBytes(12).toString('hex');
  const safeFilename = `${Date.now()}-${uniqueToken}${validation.extension}`;
  const destinationPath = path.resolve(UPLOAD_BASE_DIR, safeFilename);

  // Security check: ensure path is strictly inside UPLOAD_BASE_DIR
  if (!destinationPath.startsWith(UPLOAD_BASE_DIR)) {
    throw new Error('Security error: Path traversal detected');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(destinationPath, buffer);

  return {
    url: `${UPLOAD_DIR_RELATIVE}/${safeFilename}`,
    filename: safeFilename,
    size: file.size,
    type: validation.mediaType,
  };
}

export async function deleteLocalMediaFile(mediaUrl?: string | null): Promise<boolean> {
  if (!mediaUrl || typeof mediaUrl !== 'string') return false;

  const trimmed = mediaUrl.trim();
  if (!trimmed.startsWith(UPLOAD_DIR_RELATIVE + '/')) {
    // Not a local media upload (e.g. external link or unsplash URL)
    return false;
  }

  const filename = path.basename(trimmed);
  if (!filename || filename === '.' || filename === '..' || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  const targetPath = path.resolve(UPLOAD_BASE_DIR, filename);
  if (!targetPath.startsWith(UPLOAD_BASE_DIR)) {
    return false;
  }

  try {
    await fs.unlink(targetPath);
    return true;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false; // File did not exist
    }
    console.error(`Failed to delete local media file (${filename}):`, err);
    return false;
  }
}

/**
 * Unified media storage deletion.
 * Deletes from Vercel Blob if the URL is a Blob URL,
 * or from local filesystem if it is a legacy local file.
 */
export async function deleteMediaStorage(mediaUrl?: string | null): Promise<boolean> {
  if (!mediaUrl || typeof mediaUrl !== 'string') return false;
  const trimmed = mediaUrl.trim();

  // 1. If it is a Vercel Blob URL, delete via @vercel/blob
  if (isVercelBlobUrl(trimmed)) {
    try {
      await del(trimmed);
      return true;
    } catch (err) {
      console.error(`Failed to delete Vercel Blob object (${trimmed}):`, err);
      return false;
    }
  }

  // 2. If it is a legacy local upload, delete from disk
  if (trimmed.startsWith(UPLOAD_DIR_RELATIVE + '/')) {
    return deleteLocalMediaFile(trimmed);
  }

  return false;
}
