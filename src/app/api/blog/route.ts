import { NextResponse } from 'next/server';
import { getPublishedBlogPostsDB } from '@/lib/db';

export async function GET() {
  try {
    const posts = await getPublishedBlogPostsDB();
    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
