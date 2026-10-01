'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Activity,
  ShieldAlert,
  Users,
  HelpCircle,
  HeartHandshake,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  X
} from 'lucide-react';

const NAVIGATION_GROUPS = [
  {
    title: 'Operations',
    links: [
      { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/admin/dashboard/appointments', label: 'Appointments', icon: Calendar },
      { href: '/admin/dashboard/messages', label: 'Contact Messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Clinical & Content',
    links: [
      { href: '/admin/dashboard/services', label: 'Therapies & Services', icon: Activity },
      { href: '/admin/dashboard/conditions', label: 'Conditions', icon: ShieldAlert },
      { href: '/admin/dashboard/team', label: 'Team Members', icon: Users },
      { href: '/admin/dashboard/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: HeartHandshake },
      { href: '/admin/dashboard/blog', label: 'Blog & Insights', icon: BookOpen },
    ],
  },
  {
    title: 'Assets & Config',
    links: [
      { href: '/admin/dashboard/media', label: 'Media Gallery', icon: ImageIcon },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#0c2424] text-stone-300 flex flex-col justify-between border-r border-brand-900/60 transition-transform duration-300 ease-in-out lg:translate-x-0 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header / Brand */}
          <div className="px-6 py-5 border-b border-brand-900/80 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm">
                <Image
                  src="/images/interactive-minds-mark.png"
                  alt="Interactive Minds"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block font-serif-heading font-bold text-white text-sm tracking-tight">
                  Interactive Minds
                </span>
                <span className="block text-[10px] text-teal-300/80 font-bold uppercase tracking-wider">
                  Clinical Admin
                </span>
              </div>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden text-stone-400 hover:text-white p-1 rounded-lg hover:bg-brand-900/60 transition-colors"
                aria-label="Close navigation sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {NAVIGATION_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1.5">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-teal-200/60">
                  {group.title}
                </div>
                <nav className="space-y-0.5">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                          active
                            ? 'bg-brand-800/90 text-white shadow-sm border border-brand-700/60'
                            : 'text-stone-300 hover:text-white hover:bg-brand-900/40 border border-transparent'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active ? 'text-teal-300' : 'text-stone-400 group-hover:text-stone-200'
                          }`}
                        />
                        <span className="truncate">{link.label}</span>
                        {active && (
                          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer / User & Logout */}
          <div className="p-4 border-t border-brand-900/80 bg-[#091b1b]/80">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors border border-transparent hover:border-rose-900/50"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
