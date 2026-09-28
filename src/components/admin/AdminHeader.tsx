'use client';

import React from 'react';
import Link from 'next/link';
import { AdminUser } from '@/types';
import { ExternalLink, User, Menu } from 'lucide-react';

interface AdminHeaderProps {
  user?: AdminUser | null;
  onOpenMobile?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onOpenMobile }) => {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-brand-950 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
            Operations Panel
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-850 hover:text-brand-950 hover:bg-brand-50 border border-brand-200/70 transition-all shadow-2xs"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </Link>

        {user && (
          <div className="flex items-center gap-2.5 pl-3 sm:pl-4 border-l border-stone-200/80">
            <div className="w-8 h-8 rounded-full bg-brand-100/80 border border-brand-200 text-brand-850 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <div className="text-xs hidden md:block">
              <span className="block font-bold text-brand-950 leading-tight">{user.name}</span>
              <span className="block text-[10px] text-stone-600 font-medium">{user.role || 'Admin'}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
