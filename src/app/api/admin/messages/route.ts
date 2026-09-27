import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getContactMessagesDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const messages = await getContactMessagesDB();
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch contact messages' }, { status: 500 });
  }
}
