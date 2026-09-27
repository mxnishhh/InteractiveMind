import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getSiteSettingsDB, updateSiteSettingsDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const settings = await getSiteSettingsDB();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const body = await req.json();
    if (typeof body !== 'object' || !body) {
      return NextResponse.json({ success: false, error: 'Invalid settings body' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await updateSiteSettingsDB(key, value);
      }
    }

    const updatedSettings = await getSiteSettingsDB();
    return NextResponse.json({ success: true, message: 'Settings updated successfully', data: updatedSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
