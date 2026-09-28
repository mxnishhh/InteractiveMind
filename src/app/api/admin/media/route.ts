import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getAllMediaDB, createMediaDB } from '@/lib/db';
import { MediaItemSchema } from '@/validators/schemas';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const media = await getAllMediaDB();
    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch media items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const body = await req.json();
    const validatedData = MediaItemSchema.parse(body);

    const created = await createMediaDB(validatedData);
    return NextResponse.json({
      success: true,
      message: 'Media item added successfully',
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create media item' }, { status: 500 });
  }
}
