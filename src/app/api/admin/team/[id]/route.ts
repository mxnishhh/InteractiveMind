import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getTeamMemberByIdDB, updateTeamMemberDB, deleteTeamMemberDB } from '@/lib/db';
import { TeamMemberUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid team member ID' }, { status: 400 });
  }

  try {
    const member = await getTeamMemberByIdDB(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid team member ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validatedData = TeamMemberUpdateSchema.parse(body);

    const updated = await updateTeamMemberDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    const member = await getTeamMemberByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully',
      data: member,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
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
    return NextResponse.json({ success: false, error: 'Invalid team member ID' }, { status: 400 });
  }

  try {
    const existing = await getTeamMemberByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    const deleted = await deleteTeamMemberDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Team member "${existing.name}" removed successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
  }
}
