import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getTestimonialByIdDB, updateTestimonialDB, deleteTestimonialDB } from '@/lib/db';
import { TestimonialUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid testimonial ID' }, { status: 400 });
  }

  try {
    const testimonial = await getTestimonialByIdDB(id);
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid testimonial ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validatedData = TestimonialUpdateSchema.parse(body);

    const updated = await updateTestimonialDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    const testimonial = await getTestimonialByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 });
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
    return NextResponse.json({ success: false, error: 'Invalid testimonial ID' }, { status: 400 });
  }

  try {
    const existing = await getTestimonialByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    const deleted = await deleteTestimonialDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
