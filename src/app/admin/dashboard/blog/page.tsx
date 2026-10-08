'use client';

import React, { useEffect, useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { BlogPost, BlogPostType, BlogPostStatus } from '@/types';
import { Button, Input, Textarea, Modal, Toast } from '@/components/ui';
import { AdminPageHeader, AdminEmptyState, AdminDeleteModal } from '@/components/admin';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Video,
  Bookmark,
  Search,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Link as LinkIcon,
  HardDrive,
  Eye,
} from 'lucide-react';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  type: BlogPostType;
  category: string;
  author: string;
  video_url: string;
  published_at: string;
  status: BlogPostStatus;
  display_order: number;
}

const initialFormData: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  type: 'article',
  category: 'Clinical Insights',
  author: '',
  video_url: '',
  published_at: '',
  status: 'draft',
  display_order: 0,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | BlogPostType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogPostStatus>('all');

  // Thumbnail Upload
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadPosts() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.data || []);
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Failed to fetch blog posts' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Unable to connect to blog management API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const resetUploadState = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    resetUploadState();
    setThumbnailMode('upload');
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      ...initialFormData,
      published_at: today,
      display_order: posts.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id);
    resetUploadState();
    const isLocal = post.thumbnail?.startsWith('/uploads/media/');
    setThumbnailMode(isLocal ? 'upload' : 'url');
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      thumbnail: post.thumbnail || '',
      type: post.type,
      category: post.category || 'General',
      author: post.author || '',
      video_url: post.video_url || '',
      published_at: post.published_at ? post.published_at.slice(0, 10) : '',
      status: post.status,
      display_order: Number(post.display_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        title,
        slug: slugify(title),
      }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setUploadError(`Invalid image format (${ext}). Allowed: JPG, PNG, WebP, SVG`);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError(`Image exceeds maximum allowed size of 5 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const pathname = `blog/${Date.now()}_${cleanFileName}`;

      const blobResult = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/media/upload',
      });

      setUploadSuccess(true);
      setFormData((prev) => ({
        ...prev,
        thumbnail: blobResult.url,
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Title is required' });
      return;
    }

    if (!formData.slug.trim()) {
      setToast({ type: 'error', message: 'URL slug is required' });
      return;
    }

    setIsSaving(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase(),
      excerpt: formData.excerpt.trim() || null,
      content: formData.content.trim() || null,
      thumbnail: formData.thumbnail.trim() || null,
      type: formData.type,
      category: formData.category.trim() || 'General',
      author: formData.author.trim() || null,
      video_url: formData.video_url.trim() || null,
      published_at: formData.published_at || null,
      status: formData.status,
      display_order: Number(formData.display_order ?? 0),
    };

    try {
      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save post');
      }

      setToast({
        type: 'success',
        message: editingId ? 'Blog post updated successfully' : 'Blog post created successfully',
      });

      setIsModalOpen(false);
      loadPosts();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to save blog post' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    const nextStatus: BlogPostStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update post status');
      }

      setToast({
        type: 'success',
        message: `Post is now ${nextStatus === 'published' ? 'Published' : 'in Draft mode'}`,
      });
      loadPosts();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle status' });
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${deletingPost.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete post');
      }

      setToast({ type: 'success', message: data.message || 'Post deleted' });
      setIsDeleteModalOpen(false);
      setDeletingPost(null);
      loadPosts();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to delete post' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: BlogPostType) => {
    switch (type) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-purple-600" />;
      case 'resource':
        return <Bookmark className="w-3.5 h-3.5 text-amber-600" />;
      case 'article':
      default:
        return <FileText className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        eyebrow="Insights & Publications"
        title="Blog & Insights"
        description="Manage educational articles, clinical guides, parent resources, and therapy video walkthroughs."
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>New Post / Resource</span>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, category, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 font-medium focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="resource">Resources</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 font-medium focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-600 uppercase tracking-wider font-bold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order</th>
                <th className="py-3.5 px-4">Title &amp; Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Author / Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-stone-600 animate-pulse">
                    Loading blog posts and insights...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <AdminEmptyState
                      icon={BookOpen}
                      title={posts.length === 0 ? 'No Blog Posts or Resources Yet' : 'No Matching Posts Found'}
                      description={
                        posts.length === 0
                          ? 'Publish articles, parent guides, and therapy video walkthroughs to educate families and showcase clinical expertise.'
                          : 'Try adjusting your search query or filters to find what you are looking for.'
                      }
                      action={
                        posts.length === 0
                          ? {
                              label: 'Create First Post',
                              onClick: handleOpenCreate,
                              icon: Plus,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-500">
                      #{post.display_order}
                    </td>
                    <td className="py-4 px-4 max-w-xs sm:max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                            {post.category || 'General'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-brand-950 line-clamp-1">{post.title}</h4>
                        <span className="font-mono text-[11px] text-stone-400 block truncate">
                          /{post.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full capitalize">
                        {getTypeIcon(post.type)}
                        {post.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="font-medium text-stone-800 block">
                          {post.author || 'Interactive Minds'}
                        </span>
                        <span className="text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.published_at ? post.published_at.slice(0, 10) : 'Not published'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Published
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-stone-400" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => handleOpenEdit(post)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-stone-500 hover:text-brand-800 hover:bg-brand-50 rounded-lg"
                          title="Edit Post"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          onClick={() => {
                            setDeletingPost(post);
                            setIsDeleteModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Blog Post / Resource' : 'Create New Post / Resource'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Post Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Understanding Sensory Diet Strategies"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Slug (URL Identifier) <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                placeholder="e.g. understanding-sensory-diet-strategies"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Content Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as BlogPostType })}
                className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="article">Article / Clinical Insight</option>
                <option value="video">Video Walkthrough</option>
                <option value="resource">Parent Tool / Resource</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Sensory Support"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Author Name</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Clinical Specialist"
              />
            </div>
          </div>

          {/* Conditional Video URL */}
          {formData.type === 'video' && (
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
              <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-600" />
                Video URL (YouTube, Vimeo, or MP4)
              </label>
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=... or direct video link"
              />
            </div>
          )}

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Short Excerpt / Summary
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
              placeholder="A brief 1-2 sentence overview shown on the card..."
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Full Article Content
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              placeholder="Write the full content here. Separate paragraphs with blank lines."
            />
          </div>

          {/* Thumbnail Image Picker / Uploader */}
          <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700">Cover Thumbnail</label>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200">
                <button
                  type="button"
                  onClick={() => setThumbnailMode('upload')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    thumbnailMode === 'upload' ? 'bg-brand-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <HardDrive className="w-3 h-3 inline mr-1" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setThumbnailMode('url')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    thumbnailMode === 'url' ? 'bg-brand-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3 inline mr-1" /> URL
                </button>
              </div>
            </div>

            {thumbnailMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-brand-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white"
                >
                  {isUploading ? (
                    <div className="text-xs text-brand-700 font-medium animate-pulse flex items-center justify-center gap-2">
                      <UploadCloud className="w-4 h-4 animate-bounce" /> Uploading image...
                    </div>
                  ) : uploadSuccess || formData.thumbnail ? (
                    <div className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>{formData.thumbnail ? 'Image selected / uploaded' : 'Uploaded successfully'}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500">
                      <UploadCloud className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                      <span className="font-semibold text-brand-800">Click to upload thumbnail</span> (JPG, PNG, WebP up to 5MB)
                    </div>
                  )}
                </div>
                {uploadError && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {uploadError}
                  </p>
                )}
              </div>
            ) : (
              <Input
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            )}

            {formData.thumbnail && (
              <div className="text-[11px] text-stone-500 truncate flex items-center gap-1.5 pt-1">
                <span className="font-semibold text-stone-700">Preview path:</span>
                <span className="font-mono text-stone-600 truncate">{formData.thumbnail}</span>
              </div>
            )}
          </div>

          {/* Status & Publication Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPostStatus })}
                className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="draft">Draft (Hidden from Public)</option>
                <option value="published">Published (Live on Website)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Publication Date</label>
              <Input
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Display Order</label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingPost(null);
        }}
        onConfirm={handleDelete}
        title="Delete Blog Post / Resource"
        itemName={deletingPost?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
