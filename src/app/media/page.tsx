import React from 'react';
import { getMediaDB } from '@/lib/db';
import { FolderOpen, Video } from 'lucide-react';
import { CTASection } from '@/components/public/CTASection';
import { MEDIA_PAGE } from '@/constants';

export default async function MediaPage() {
  const mediaItems = await getMediaDB();

  return (
    <div className="space-y-0">
      <section className="bg-white py-16 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-tealbrand-700">
            {MEDIA_PAGE.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {MEDIA_PAGE.heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {MEDIA_PAGE.description}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-slate-50 min-h-[400px] flex items-center justify-center border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {mediaItems.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center max-w-md mx-auto border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{MEDIA_PAGE.emptyTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {MEDIA_PAGE.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm space-y-3 p-4">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-48 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                      <Video className="w-8 h-8" />
                    </div>
                  )}
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
