import { NextResponse } from 'next/server';
import { getConditionsDB } from '@/lib/db';

export async function GET() {
  try {
    const conditions = await getConditionsDB();
    return NextResponse.json({ success: true, data: conditions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch conditions' }, { status: 500 });
  }
}
