import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { saveUploadedMediaFile, deleteMediaStorage, validateMediaFile } from '@/lib/media-storage';

export const dynamic = 'force-dynamic';

/**
 * Handle multipart/form-data media uploads directly to Hostinger storage.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Enforce admin authentication
  const auth = requireAdminApi(req);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string' || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: 'No valid file provided in upload request' },
        { status: 400 }
      );
    }

    // Validate file type, extension, and size
    const validation = validateMediaFile(file as File);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid media file' },
        { status: 400 }
      );
    }

    // Save file to persistent storage
    const saved = await saveUploadedMediaFile(file as File);

    return NextResponse.json({
      success: true,
      url: saved.url,
      filename: saved.filename,
      size: saved.size,
      type: saved.type,
    });
  } catch (error: any) {
    console.error('Admin media upload error:', error);
    const errorMessage = error?.message || 'Failed to process media upload';

    return NextResponse.json(
      { success: false, error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Handle deletion of stored media assets from Hostinger storage.
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const { url } = await req.json();
    if (url && typeof url === 'string') {
      await deleteMediaStorage(url);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting media storage:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete file' },
      { status: 500 }
    );
  }
}
