import React from 'react';
import { getMediaDB } from '@/lib/db';
import { FolderOpen, Video } from 'lucide-react';
import { CTASection } from '@/components/public/CTASection';
import { MEDIA_PAGE } from '@/constants';
import {
  FadeUp,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  MotionCard,
} from '@/components/ui/motion';

export default async function MediaPage() {
  const mediaItems = await getMediaDB();

  return (
    <div className="space-y-0 text-stone-800">

      {/* Hero Banner */}
      <section className="bg-[#faf9f7] py-16 lg:py-24 border-b border-stone-200/80 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              {MEDIA_PAGE.eyebrow}
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-950 tracking-tight leading-tight max-w-4xl">
              {MEDIA_PAGE.heading}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
              {MEDIA_PAGE.description}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 lg:py-24 bg-white min-h-[400px] flex items-center justify-center border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {mediaItems.length === 0 ? (
            <FadeIn delay={0.1}>
              <div className="bg-[#faf9f7] rounded-3xl p-10 sm:p-12 text-center max-w-lg mx-auto border border-stone-200/90 shadow-soft space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-750 flex items-center justify-center mx-auto border border-brand-100">
                  <FolderOpen className="w-7 h-7 text-brand-750" />
                </div>
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-brand-950">
                  {MEDIA_PAGE.emptyTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                  {MEDIA_PAGE.emptyDescription}
                </p>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {mediaItems.map((item) => (
                <StaggerItem key={item.id} className="h-full">
                  <MotionCard
                    hoverLift={true}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-soft hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 space-y-4 p-5 group h-full"
                  >
                    {item.type === 'image' ? (
                      <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-stone-100">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] bg-brand-950 rounded-2xl flex items-center justify-center text-brand-200 border border-brand-900">
                        <Video className="w-10 h-10" />
                      </div>
                    )}
                    <div className="space-y-1.5 px-1">
                      <h4 className="font-serif-heading font-bold text-brand-950 text-base group-hover:text-brand-850 transition-colors">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </MotionCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
