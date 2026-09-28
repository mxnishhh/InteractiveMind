import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getAllServicesDB, createServiceDB } from '@/lib/db';
import { ServiceSchema } from '@/validators/schemas';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const services = await getAllServicesDB();
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const body = await req.json();
    const validatedData = ServiceSchema.parse(body);

    const created = await createServiceDB(validatedData);
    return NextResponse.json({
      success: true,
      message: 'Therapy program created successfully',
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    if (error.message?.includes('Duplicate entry') || error.message?.includes('slug')) {
      return NextResponse.json({ success: false, error: 'A service with this slug already exists. Please choose a unique slug.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}
