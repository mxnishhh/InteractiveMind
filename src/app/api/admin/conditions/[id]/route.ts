import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getConditionByIdDB, updateConditionDB, deleteConditionDB } from '@/lib/db';
import { ConditionUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid condition ID' }, { status: 400 });
  }

  try {
    const condition = await getConditionByIdDB(id);
    if (!condition) {
      return NextResponse.json({ success: false, error: 'Condition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: condition });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch condition' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid condition ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validatedData = ConditionUpdateSchema.parse(body);

    const updated = await updateConditionDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Condition not found' }, { status: 404 });
    }

    const condition = await getConditionByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'Condition updated successfully',
      data: condition,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    if (error.message?.includes('Duplicate entry') || error.message?.includes('slug')) {
      return NextResponse.json({ success: false, error: 'A condition with this slug already exists. Please choose a unique slug.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update condition' }, { status: 500 });
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
    return NextResponse.json({ success: false, error: 'Invalid condition ID' }, { status: 400 });
  }

  try {
    const existing = await getConditionByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Condition not found' }, { status: 404 });
    }

    const deleted = await deleteConditionDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete condition' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Condition "${existing.name}" deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete condition' }, { status: 500 });
  }
}
