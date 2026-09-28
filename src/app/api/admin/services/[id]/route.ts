import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getServiceByIdDB, updateServiceDB, deleteServiceDB } from '@/lib/db';
import { ServiceUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid service ID' }, { status: 400 });
  }

  try {
    const service = await getServiceByIdDB(id);
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid service ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validatedData = ServiceUpdateSchema.parse(body);

    const updated = await updateServiceDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const service = await getServiceByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'Therapy program updated successfully',
      data: service,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    if (error.message?.includes('Duplicate entry') || error.message?.includes('slug')) {
      return NextResponse.json({ success: false, error: 'A service with this slug already exists. Please choose a unique slug.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
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
    return NextResponse.json({ success: false, error: 'Invalid service ID' }, { status: 400 });
  }

  try {
    const existing = await getServiceByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const deleted = await deleteServiceDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Therapy program "${existing.name}" deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
