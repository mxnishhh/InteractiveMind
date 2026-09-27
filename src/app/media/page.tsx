import React from 'react';
import { getMediaDB } from '@/lib/db';
import { Image as ImageIcon, Video, FolderOpen } from 'lucide-react';
import { CTASection } from '@/components/public/CTASection';

export default async function MediaPage() {
  const mediaItems = await getMediaDB();

  return (
    <div className="space-y-0">
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-16 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            Media & Activity Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Life at Interactive Minds
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Moments, therapy activities, and community events from our child development centre.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50/60 min-h-[400px] flex items-center justify-center border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {mediaItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Media Coming Soon</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We are in the process of curating photos and video highlights of our center routines and activities. Please check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mediaItems.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm space-y-4 p-4">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-48 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                      <Video className="w-10 h-10" />
                    </div>
                  )}
                  <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
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
