import { NextRequest, NextResponse } from 'next/server';
import { getServiceBySlugDB } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const service = await getServiceBySlugDB(params.slug);
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch service details' }, { status: 500 });
  }
}
