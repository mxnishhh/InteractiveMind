import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getMediaByIdDB, updateMediaDB, deleteMediaDB } from '@/lib/db';
import { deleteLocalMediaFile } from '@/lib/media-storage';
import { MediaItemUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid media ID' }, { status: 400 });
  }

  try {
    const media = await getMediaByIdDB(id);
    if (!media) {
      return NextResponse.json({ success: false, error: 'Media item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch media item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid media ID' }, { status: 400 });
  }

  try {
    const existing = await getMediaByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Media item not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = MediaItemUpdateSchema.parse(body);

    const updated = await updateMediaDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update media item' }, { status: 404 });
    }

    // If media URL changed and old URL was a local upload, safely delete old file
    if (validatedData.url && validatedData.url !== existing.url) {
      await deleteLocalMediaFile(existing.url);
    }

    const media = await getMediaByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'Media item updated successfully',
      data: media,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update media item' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return PUT(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid media ID' }, { status: 400 });
  }

  try {
    const existing = await getMediaByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Media item not found' }, { status: 404 });
    }

    // Clean up local file from disk if it was a local upload
    if (existing.url) {
      await deleteLocalMediaFile(existing.url);
    }
    if (existing.thumbnail_url) {
      await deleteLocalMediaFile(existing.thumbnail_url);
    }

    const deleted = await deleteMediaDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete media item' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Media item and associated storage deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete media item' }, { status: 500 });
  }
}
