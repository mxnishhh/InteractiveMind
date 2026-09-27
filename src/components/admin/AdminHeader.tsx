'use client';

import React from 'react';
import Link from 'next/link';
import { AdminUser } from '@/types';
import { ExternalLink, User } from 'lucide-react';

interface AdminHeaderProps {
  user?: AdminUser | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Control Panel</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {user && (
          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-100">
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="block font-bold text-slate-800 leading-tight">{user.name}</span>
              <span className="block text-[10px] text-slate-400">{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
