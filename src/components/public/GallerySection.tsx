'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MediaItem } from '@/types';
import { FadeUp } from '@/components/ui/motion';
import { Modal } from '@/components/ui';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface GallerySectionProps {
  media: MediaItem[];
}

export function GallerySection({ media }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // If there's no media published, return null
  if (!media || media.length === 0) {
    return null;
  }

  const navigateTo = useCallback(
    (index: number, dir: number = 0) => {
      if (index < 0) {
        setCurrentIndex(media.length - 1);
        setDirection(-1);
      } else if (index >= media.length) {
        setCurrentIndex(0);
        setDirection(1);
      } else {
        setCurrentIndex(index);
        setDirection(dir);
      }
    },
    [media.length]
  );

  const prev = () => navigateTo(currentIndex - 1, -1);
  const next = () => navigateTo(currentIndex + 1, 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prev();
    } else if (e.key === 'ArrowRight') {
      next();
    } else if (e.key === 'Enter') {
      setIsLightboxOpen(true);
    }
  };

  const activeMedia = media[currentIndex];

  // Calculate indices for preview (handle wrapping)
  const prevIndex = currentIndex === 0 ? media.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === media.length - 1 ? 0 : currentIndex + 1;

  // Simple, subtle animation variants - crossfade with minimal movement
  const fadeVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 12 : -12, // Very small horizontal movement (12px)
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -12 : 12,
    }),
  };

  // Smooth, short transition with ease-in-out
  const transition = {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1], // ease-in-out
  };

  // Renders the media item depending on its type
  const renderMedia = (item: MediaItem, isFeatured: boolean) => {
    const isVideo = item.type === 'video';
    const posterSrc = item.thumbnail_url || item.url;

    if (isVideo) {
      return (
        <div className="relative w-full h-full bg-stone-900 rounded-2xl overflow-hidden group">
          {/* Use lightweight thumbnail/poster image for gallery cards to eliminate video preloading overhead */}
          {posterSrc && (
            <Image
              src={posterSrc}
              alt={item.title || 'Video preview'}
              fill
              className={`object-cover ${shouldReduceMotion ? '' : 'transition-transform duration-700 group-hover:scale-105'}`}
              sizes={isFeatured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 0vw, 20vw"}
            />
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all group-hover:bg-black/30">
            <div className={`rounded-full bg-white/95 flex items-center justify-center shadow-lg text-brand-700 transition-transform ${isFeatured ? 'w-14 h-14 group-hover:scale-110' : 'w-8 h-8'}`}>
              <Play className={`${isFeatured ? 'w-6 h-6 ml-1' : 'w-4 h-4 ml-0.5'}`} />
            </div>
          </div>

          {/* Caption only for featured media if present */}
          {isFeatured && item.title && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
              <p className="text-white font-medium text-lg md:text-xl drop-shadow-md">
                {item.title}
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative w-full h-full bg-stone-100 rounded-2xl overflow-hidden group">
        <Image
          src={posterSrc}
          alt={item.title || 'Gallery Image'}
          fill
          className={`object-cover ${shouldReduceMotion ? '' : 'transition-transform duration-700 group-hover:scale-105'}`}
          sizes={isFeatured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 0vw, 20vw"}
        />

        {/* Caption only for featured media if present */}
        {isFeatured && item.title && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12">
            <p className="text-white font-medium text-lg md:text-xl drop-shadow-md">
              {item.title}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="gallery" className="py-20 lg:py-24 bg-white scroll-mt-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-2">Our Environment</span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight">
            Inside Interactive Minds
          </h2>
        </FadeUp>

        {/* Carousel Container */}
        <div
          className="relative max-w-[100vw] sm:max-w-7xl mx-auto w-full group outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Media gallery. Use left and right arrow keys to navigate."
        >
          {/* Main Layout: Flex container holding prev, center(featured), next items */}
          <div className="flex items-center justify-center gap-4 md:gap-6 h-[400px] md:h-[500px] lg:h-[600px] relative">

            {/* Previous Preview (hidden on mobile, visible on tablet/desktop) */}
            <div
              className="hidden sm:block flex-shrink-0 w-1/5 max-w-[200px] h-3/4 opacity-40 hover:opacity-70 transition-opacity duration-300 cursor-pointer pointer-events-auto"
              onClick={prev}
              aria-label="Previous item"
            >
              {media.length > 1 && renderMedia(media[prevIndex], false)}
            </div>

            {/* Featured Center Media - with subtle crossfade animation */}
            <div className="w-full sm:w-3/5 max-w-[800px] h-full relative z-10">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={shouldReduceMotion ? {} : fadeVariants}
                  initial={shouldReduceMotion ? 'center' : 'enter'}
                  animate="center"
                  exit={shouldReduceMotion ? 'center' : 'exit'}
                  transition={shouldReduceMotion ? { duration: 0 } : transition}
                  className="absolute inset-0 shadow-2xl cursor-pointer will-change-transform"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Open fullscreen"
                >
                  {renderMedia(activeMedia, true)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Preview (hidden on mobile, visible on tablet/desktop) */}
            <div
              className="hidden sm:block flex-shrink-0 w-1/5 max-w-[200px] h-3/4 opacity-40 hover:opacity-70 transition-opacity duration-300 cursor-pointer pointer-events-auto"
              onClick={next}
              aria-label="Next item"
            >
              {media.length > 2 ? renderMedia(media[nextIndex], false) : (media.length > 1 && renderMedia(media[prevIndex], false))}
            </div>

            {/* Navigation Arrows */}
            {media.length > 1 && (
              <>
                <button
                  className="absolute left-2 sm:left-[10%] lg:left-[15%] top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur text-brand-950 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 hover:text-brand-700 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 mr-0.5" />
                </button>
                <button
                  className="absolute right-2 sm:right-[10%] lg:right-[15%] top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur text-brand-950 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 hover:text-brand-700 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 ml-0.5" />
                </button>
              </>
            )}
          </div>

          {/* Pagination Dots */}
          {media.length > 1 && (
            <div className="flex justify-center flex-wrap gap-2 mt-8">
              {media.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    const dir = idx > currentIndex ? 1 : -1;
                    navigateTo(idx, dir);
                  }}
                  className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 ${
                    currentIndex === idx
                      ? 'w-8 h-2.5 bg-brand-700'
                      : 'w-2.5 h-2.5 bg-stone-300 hover:bg-brand-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={currentIndex === idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={activeMedia?.title || 'Media Viewer'}
        description={activeMedia?.description || undefined}
        maxWidth="3xl"
      >
        <div className="w-full aspect-video sm:aspect-auto mt-4 bg-black rounded-xl overflow-hidden relative">
          {activeMedia?.type === 'video' ? (
            <video
              key={activeMedia.url}
              src={activeMedia.url}
              poster={activeMedia.thumbnail_url || undefined}
              className="w-full max-h-[70vh] object-contain"
              controls
              preload="metadata"
              playsInline
            />
          ) : activeMedia ? (
            <div className="relative w-full h-[60vh] max-h-[70vh]">
              <Image
                src={activeMedia.url}
                alt={activeMedia.title || 'Enlarged media'}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          ) : null}
        </div>
      </Modal>
    </section>
  );
}
