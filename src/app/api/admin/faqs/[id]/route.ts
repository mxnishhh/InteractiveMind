import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getFaqByIdDB, updateFaqDB, deleteFaqDB } from '@/lib/db';
import { FAQUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid FAQ ID' }, { status: 400 });
  }

  try {
    const faq = await getFaqByIdDB(id);
    if (!faq) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid FAQ ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validatedData = FAQUpdateSchema.parse(body);

    const updated = await updateFaqDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }

    const faq = await getFaqByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 });
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
    return NextResponse.json({ success: false, error: 'Invalid FAQ ID' }, { status: 400 });
  }

  try {
    const existing = await getFaqByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }

    const deleted = await deleteFaqDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
