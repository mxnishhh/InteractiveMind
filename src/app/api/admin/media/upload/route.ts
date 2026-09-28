import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { saveUploadedMediaFile, validateMediaFile } from '@/lib/media-storage';

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Please attach a valid file in the "file" field.' },
        { status: 400 }
      );
    }

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'File validation failed' },
        { status: 400 }
      );
    }

    const uploaded = await saveUploadedMediaFile(file);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: uploaded.url,
      filename: uploaded.filename,
      size: uploaded.size,
      type: uploaded.type,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Admin media upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload media file' },
      { status: 500 }
    );
  }
}
