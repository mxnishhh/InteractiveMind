import { NextRequest, NextResponse } from 'next/server';
import { getConditionBySlugDB } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const condition = await getConditionBySlugDB(params.slug);
    if (!condition) {
      return NextResponse.json({ success: false, error: 'Condition not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: condition });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch condition details' }, { status: 500 });
  }
}
