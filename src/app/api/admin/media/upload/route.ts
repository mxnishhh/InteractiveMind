import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdminApi } from '@/lib/auth';
import { ALLOWED_CONTENT_TYPES, MAX_IMAGE_SIZE_BYTES } from '@/lib/media-storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Enforce admin authentication
  const auth = requireAdminApi(req);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle Vercel Blob client upload token generation
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as HandleUploadBody;

      const jsonResponse = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname /*, clientPayload, multipart */) => {
          // Re-verify authentication
          const currentAuth = requireAdminApi(req);
          if (!currentAuth.authenticated) {
            throw new Error('Unauthorized: Admin authentication required');
          }

          // Validate filename / extension
          const sanitizedExt = '.' + pathname.split('.').pop()?.toLowerCase();
          const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.webm'];

          if (!sanitizedExt || !allowedExts.includes(sanitizedExt)) {
            throw new Error(`Disallowed file extension: ${sanitizedExt || 'unknown'}. Allowed: JPG, PNG, WebP, SVG, MP4, WebM`);
          }

          return {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,
            maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES, // 500 MB
            addRandomSuffix: true,
          };
        },
        onUploadCompleted: async ({ blob }) => {
          // Optional server-side logging of completed upload
          console.log('[BLOB] Client upload completed successfully:', blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request format. Expected JSON for client-side Blob upload.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Admin media upload error:', error);

    const errorMessage = error?.message || 'Failed to process media upload';
    const isTokenMissing =
      errorMessage.includes('BLOB_READ_WRITE_TOKEN') ||
      errorMessage.includes('No token found') ||
      errorMessage.includes('token');

    const formattedError = isTokenMissing
      ? 'Upload failed: storage configuration is missing (BLOB_READ_WRITE_TOKEN is not configured).'
      : `Upload failed: ${errorMessage}`;

    const isUnauthorized = errorMessage.includes('Unauthorized');

    return NextResponse.json(
      { success: false, error: formattedError },
      { status: isUnauthorized ? 401 : 400 }
    );
  }
}
