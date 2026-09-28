import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getAllTestimonialsDB, createTestimonialDB } from '@/lib/db';
import { TestimonialSchema } from '@/validators/schemas';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const testimonials = await getAllTestimonialsDB();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const body = await req.json();
    const validatedData = TestimonialSchema.parse(body);

    const created = await createTestimonialDB(validatedData);
    return NextResponse.json({
      success: true,
      message: 'Testimonial added successfully',
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 });
  }
}
