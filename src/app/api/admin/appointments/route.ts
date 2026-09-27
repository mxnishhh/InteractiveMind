import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getAppointmentsDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const appointments = await getAppointmentsDB();
    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
