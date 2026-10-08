import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { getBlogPostByIdDB, updateBlogPostDB, deleteBlogPostDB } from '@/lib/db';
import { deleteMediaStorage } from '@/lib/media-storage';
import { BlogPostUpdateSchema } from '@/validators/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const post = await getBlogPostByIdDB(id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const existing = await getBlogPostByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = BlogPostUpdateSchema.parse(body);

    const updated = await updateBlogPostDB(id, validatedData);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 404 });
    }

    // If thumbnail changed and old thumbnail was stored locally, safely delete old file
    if (validatedData.thumbnail && validatedData.thumbnail !== existing.thumbnail) {
      await deleteMediaStorage(existing.thumbnail);
    }

    const post = await getBlogPostByIdDB(id);
    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, details: error.errors }, { status: 400 });
    }
    if (error.message?.includes('Duplicate entry') || error.message?.includes('slug')) {
      return NextResponse.json({ success: false, error: 'A post with this slug already exists. Please choose a unique slug.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return PUT(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const existing = await getBlogPostByIdDB(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const deleted = await deleteBlogPostDB(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
    }

    // Safely delete thumbnail file from storage only if not referenced elsewhere
    if (existing.thumbnail) {
      await deleteMediaStorage(existing.thumbnail);
    }

    return NextResponse.json({
      success: true,
      message: `Blog post "${existing.title}" deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}
