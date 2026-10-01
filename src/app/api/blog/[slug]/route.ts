import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlugDB } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPostBySlugDB(params.slug);
    if (!post || post.status !== 'published') {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
