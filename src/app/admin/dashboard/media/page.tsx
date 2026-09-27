'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Media Gallery Manager</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Manage photo and video gallery items</p>
      </div>

      <div className="bg-white rounded-2xl p-10 text-center max-w-md mx-auto border border-slate-100 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Media Library Empty</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          No photos or videos have been uploaded yet. When center activity photos are approved, you can upload them here.
        </p>
      </div>
    </div>
  );
}
