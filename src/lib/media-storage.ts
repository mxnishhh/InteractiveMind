import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { isVercelBlobUrl, isLocalMediaUrl } from './media-utils';
import { isMediaUrlInUseDB } from './db';

export { isVercelBlobUrl, isLocalMediaUrl };

export const UPLOAD_DIR_RELATIVE = '/uploads/media';

/**
 * Resolves the absolute directory path where uploaded media files are stored.
 * If MEDIA_UPLOAD_DIR is set in the environment, uses that persistent path.
 * Otherwise, falls back to public/uploads/media inside the project root.
 */
export function getUploadBaseDir(): string {
  if (process.env.MEDIA_UPLOAD_DIR && process.env.MEDIA_UPLOAD_DIR.trim().length > 0) {
    return path.resolve(process.env.MEDIA_UPLOAD_DIR.trim());
  }
  return path.resolve(process.cwd(), 'public', 'uploads', 'media');
}

export const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
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

export function validateMediaFile(file: File | Blob & { name?: string }): ValidationResult {
  if (!file || file.size === 0) {
    return { valid: false, error: 'No file provided or file is empty' };
  }

  const mimeType = (file.type || '').toLowerCase().trim();
  const originalName = (file as any).name || 'unnamed.jpg';
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
    return { valid: false, error: `Image file is too large (${sizeMb} MB). Maximum allowed size is 50 MB.` };
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

export async function saveUploadedMediaFile(file: File | Blob & { name?: string }): Promise<{
  url: string;
  filename: string;
  size: number;
  type: 'image' | 'video';
}> {
  const validation = validateMediaFile(file);
  if (!validation.valid || !validation.extension || !validation.mediaType) {
    throw new Error(validation.error || 'Invalid media file');
  }

  const baseDir = getUploadBaseDir();

  // Ensure target upload directory exists
  await fs.mkdir(baseDir, { recursive: true });

  // Generate safe collision-resistant filename
  const uniqueToken = crypto.randomBytes(12).toString('hex');
  const safeFilename = `${Date.now()}-${uniqueToken}${validation.extension}`;
  const destinationPath = path.resolve(baseDir, safeFilename);

  // Security check: ensure path is strictly inside baseDir
  if (!destinationPath.startsWith(baseDir)) {
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

  const baseDir = getUploadBaseDir();
  const targetPath = path.resolve(baseDir, filename);
  if (!targetPath.startsWith(baseDir)) {
    return false;
  }

  try {
    await fs.unlink(targetPath);
    return true;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false; // File already does not exist
    }
    console.error(`Failed to delete local media file (${filename}):`, err);
    return false;
  }
}

/**
 * Unified media storage deletion.
 * Safely deletes local media files from Hostinger storage only if they
 * are not referenced by any other database records.
 */
export async function deleteMediaStorage(mediaUrl?: string | null): Promise<boolean> {
  if (!mediaUrl || typeof mediaUrl !== 'string') return false;
  const trimmed = mediaUrl.trim();

  // If it is a local upload, check references before deletion
  if (trimmed.startsWith(UPLOAD_DIR_RELATIVE + '/')) {
    const inUse = await isMediaUrlInUseDB(trimmed);
    if (inUse) {
      // Preserve physical file because another record still references it
      return false;
    }
    return deleteLocalMediaFile(trimmed);
  }

  return false;
}
