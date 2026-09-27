import { NextResponse } from 'next/server';
import { getFaqsDB } from '@/lib/db';

export async function GET() {
  try {
    const faqs = await getFaqsDB();
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}
