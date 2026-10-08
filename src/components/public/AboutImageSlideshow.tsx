'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const IMAGES = [
  '/images/about1.JPG',
  '/images/about2.webp',
  '/images/about3.webp',
  '/images/about4.webp',
];

const DISPLAY_DURATION = 1500; // 1.5 seconds visible
const FADE_DURATION = 750; // 750ms smooth crossfade (600–800ms)

export function AboutImageSlideshow() {
  const [{ current, prev }, setSlide] = useState({ current: 0, prev: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Preload all 4 images into browser memory
    IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setSlide((state) => ({
        prev: state.current,
        current: (state.current + 1) % IMAGES.length,
      }));
    }, DISPLAY_DURATION + FADE_DURATION);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-100">
      {/* Layered images for a true overlapping crossfade */}
      {IMAGES.map((src, index) => {
        const isCurrent = index === current;
        const isPrev = index === prev;

        let zIndex = 0;
        let opacity = 0;

        if (prefersReducedMotion) {
          zIndex = index === 0 ? 2 : 0;
          opacity = index === 0 ? 1 : 0;
        } else if (isCurrent) {
          zIndex = 2;
          opacity = 1;
        } else if (isPrev) {
          zIndex = 1;
          opacity = 1;
        } else {
          zIndex = 0;
          opacity = 0;
        }

        return (
          <div
            key={src}
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex,
              opacity,
              transition: prefersReducedMotion ? 'none' : `opacity ${FADE_DURATION}ms ease-in-out`,
              willChange: 'opacity',
              pointerEvents: 'none',
            }}
          >
            <Image
              src={src}
              alt="Interactive Minds child development and sensory exploration environment in Patna City"
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        );
      })}

      {/* Gradient overlay (existing) */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent pointer-events-none z-10" />

      {/* Floating Centre Environment Badge (existing overlay - permanently on top) */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 shadow-card flex items-center gap-3.5 z-20">
        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-brand-700" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block">
            Interactive Minds Centre
          </span>
          <span className="text-xs font-semibold text-stone-800">
            Patna City, Bihar
          </span>
        </div>
      </div>
    </div>
  );
}
