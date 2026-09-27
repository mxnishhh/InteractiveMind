import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  return NextResponse.json({
    success: true,
    user: auth.user,
  });
}
