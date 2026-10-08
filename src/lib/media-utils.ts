/**
 * Client-safe media utility functions.
 * Can be safely imported into both React Client Components and Server Components.
 */

export function isVercelBlobUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('https://') &&
    (trimmed.includes('.blob.vercel-storage.com') ||
      trimmed.includes('.public.blob.vercel-storage.com') ||
      trimmed.includes('vercel-storage.com'))
  );
}

export function isLocalMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.trim().startsWith('/uploads/media/');
}
