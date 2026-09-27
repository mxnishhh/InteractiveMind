'use client';

import React from 'react';
import Link from 'next/link';
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
  Image as ImageIcon, 
  Settings, 
  LogOut 
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/dashboard/messages', label: 'Contact Messages', icon: MessageSquare },
  { href: '/admin/dashboard/services', label: 'Therapies & Services', icon: Activity },
  { href: '/admin/dashboard/conditions', label: 'Conditions', icon: ShieldAlert },
  { href: '/admin/dashboard/team', label: 'Team Members', icon: Users },
  { href: '/admin/dashboard/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: HeartHandshake },
  { href: '/admin/dashboard/media', label: 'Media Gallery', icon: ImageIcon },
  { href: '/admin/dashboard/settings', label: 'Site Settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
      <div className="space-y-6">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
            IM
          </div>
          <div>
            <span className="block font-bold text-white text-sm tracking-wide">Admin Portal</span>
            <span className="block text-[10px] text-brand-400 font-semibold uppercase">Interactive Minds</span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
