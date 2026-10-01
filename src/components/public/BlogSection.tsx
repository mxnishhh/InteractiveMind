'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BlogPost, BlogPostType } from '@/types';
import {
  Bookmark,
  Play,
  Clock,
  Sparkles,
  ArrowUpRight,
  FileText,
  BookOpen,
  X,
  User,
  Calendar,
  Share2,
  Check,
} from 'lucide-react';
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
  MotionCard,
} from '@/components/ui/motion';

interface BlogSectionProps {
  posts?: BlogPost[];
}

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  // YouTube watch URL
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  // Vimeo URL
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }
  return null;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts = [] }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);

  const getTypeBadge = (type: BlogPostType) => {
    switch (type) {
      case 'video':
        return {
          label: 'Video Walkthrough',
          icon: Play,
          className: 'text-purple-800 bg-purple-50 border-purple-200/80',
        };
      case 'resource':
        return {
          label: 'Parent Resource',
          icon: Bookmark,
          className: 'text-amber-800 bg-amber-50 border-amber-200/80',
        };
      case 'article':
      default:
        return {
          label: 'Clinical Insight',
          icon: FileText,
          className: 'text-teal-800 bg-teal-50 border-teal-200/80',
        };
    }
  };

  const handleShare = async (post: BlogPost) => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/#blog`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedSlug(true);
        setTimeout(() => setCopiedSlug(false), 2000);
      }
    } catch {
      // User dismissed share dialog
    }
  };

  return (
    <section id="blog" className="py-20 lg:py-28 bg-[#faf9f7] border-t border-stone-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <FadeUp className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">
            INSIGHTS &amp; RESOURCES
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
            The Interactive Minds Journal
          </h2>
          <p className="text-stone-600 text-base mt-3 leading-relaxed">
            Evidence-informed perspectives, developmental milestone guides, parent tools, and clinical updates.
          </p>
        </FadeUp>

        {/* Dynamic Content Grid or Reassuring Empty State */}
        {posts.length === 0 ? (
          <FadeUp delay={0.1}>
            <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-stone-200/90 shadow-soft text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-850 flex items-center justify-center mx-auto mb-6 shadow-xs border border-brand-100">
                <BookOpen className="w-8 h-8 text-brand-750" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">
                Clinical Library &amp; Publications
              </span>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950 mb-3">
                New resources are coming soon.
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
                Our multidisciplinary specialists are currently drafting parent guides, sensory strategy toolkits, and pediatric development articles. Please check back soon or reach out directly for specific developmental guidance.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-850 bg-stone-50 px-4 py-2 rounded-full border border-stone-200">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Articles, guides, and video resources will appear here</span>
              </div>
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => {
              const badge = getTypeBadge(post.type);
              const BadgeIcon = badge.icon;
              const embedUrl = post.video_url ? getEmbedUrl(post.video_url) : null;

              return (
                <StaggerItem key={post.id} distance={20} scale={0.98}>
                  <MotionCard
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group h-full text-left cursor-pointer"
                  >
                    <div className="space-y-5">
                      {/* Card Thumbnail Area */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 group-hover:border-brand-200 transition-colors">
                        {post.thumbnail ? (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-stone-100 via-brand-50/40 to-stone-100 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-[radial-gradient(#05443e_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                            <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-brand-100 shadow-xs flex items-center justify-center text-brand-750 group-hover:scale-105 transition-transform">
                              <BadgeIcon className="w-5 h-5" />
                            </div>
                          </div>
                        )}

                        {/* Format Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs flex items-center gap-1.5 ${badge.className}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        {/* Video Play Overlay Indicator */}
                        {post.type === 'video' && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-xs text-brand-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Category & Title */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">
                          {post.category || 'General'}
                        </span>
                        <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950 group-hover:text-brand-850 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </div>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-5 mt-6 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{post.published_at ? post.published_at.slice(0, 10) : 'Recent publication'}</span>
                      </div>
                      <span className="text-xs font-semibold text-brand-700 group-hover:text-brand-900 transition-colors inline-flex items-center gap-0.5">
                        <span>{post.type === 'video' ? 'Watch Video' : 'Read Article'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                  </MotionCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

      </div>

      {/* Accessible Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedPost(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-post-title"
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200/90 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                  {selectedPost.category || 'General'}
                </span>
                <span className="text-[11px] font-medium text-stone-500">
                  {selectedPost.published_at ? selectedPost.published_at.slice(0, 10) : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="p-2 rounded-xl text-stone-500 hover:text-brand-850 hover:bg-stone-100 transition-colors"
                  title="Share"
                >
                  {copiedSlug ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Media Player or Cover Photo */}
              {selectedPost.type === 'video' && selectedPost.video_url ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-md">
                  {getEmbedUrl(selectedPost.video_url) ? (
                    <iframe
                      src={getEmbedUrl(selectedPost.video_url)!}
                      title={selectedPost.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedPost.video_url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ) : selectedPost.thumbnail ? (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
                  <Image
                    src={selectedPost.thumbnail}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 id="modal-post-title" className="font-serif-heading text-2xl sm:text-3xl font-bold text-brand-950 leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1 border-b border-stone-100 pb-4">
                  {selectedPost.author && (
                    <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                      <User className="w-3.5 h-3.5 text-brand-600" />
                      <span>{selectedPost.author}</span>
                    </div>
                  )}
                  {selectedPost.published_at && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>Published on {selectedPost.published_at.slice(0, 10)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt Callout */}
              {selectedPost.excerpt && (
                <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100/80">
                  <p className="text-sm font-medium text-brand-950 leading-relaxed italic">
                    &ldquo;{selectedPost.excerpt}&rdquo;
                  </p>
                </div>
              )}

              {/* Safe Content Paragraphs */}
              {selectedPost.content ? (
                <div className="prose prose-stone max-w-none text-sm sm:text-base text-stone-700 leading-relaxed space-y-4">
                  {selectedPost.content.split('\n\n').map((para, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {para.split('\n').map((line, lineIdx) => (
                        <React.Fragment key={lineIdx}>
                          {line}
                          {lineIdx < para.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 italic">No additional body content provided for this entry.</p>
              )}

              {/* Footer Assistance Callout */}
              <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-50/80 p-5 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Have Questions About This Topic?</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Our clinical team is available to discuss personalized evaluations and therapy plans.</p>
                </div>
                <a
                  href="#appointment"
                  onClick={() => setSelectedPost(null)}
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-brand-850 hover:bg-brand-900 rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Book Assessment
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
