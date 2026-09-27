import { NextResponse } from 'next/server';
import { getServicesDB } from '@/lib/db';

export async function GET() {
  try {
    const services = await getServicesDB();
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
