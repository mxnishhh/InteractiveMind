'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AdminSidebar, AdminHeader } from '@/components/admin';
import { AdminUser } from '@/types';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (e) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/images/interactive-minds-mark.webp"
              alt="Interactive Minds"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2.5 text-stone-700">
            <svg
              className="animate-spin h-5 w-5 text-brand-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-xs font-semibold text-brand-950 uppercase tracking-wider">
              Verifying Session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f7]">
      <AdminSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
