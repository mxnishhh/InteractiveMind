import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getAllTeamMembersDB, createTeamMemberDB } from '@/lib/db';
import { TeamMemberSchema } from '@/validators/schemas';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const members = await getAllTeamMembersDB();
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const body = await req.json();
    const validatedData = TeamMemberSchema.parse(body);

    const created = await createTeamMemberDB(validatedData);
    return NextResponse.json({
      success: true,
      message: 'Team member added successfully',
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
  }
}
