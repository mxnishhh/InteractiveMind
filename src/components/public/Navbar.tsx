'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Calendar } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/conditions', label: 'Conditions' },
  { href: '/therapies', label: 'Therapies' },
  { href: '/about', label: 'About Us' },
  { href: '/media', label: 'Media' },
  { href: '/contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-widest">
              IM
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-slate-900 leading-tight">
                INTERACTIVE MINDS
              </span>
              <span className="block text-[11px] font-medium text-slate-500 tracking-wide">
                Autism Care & Child Development
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors py-1 relative ${
                    active
                      ? 'text-slate-900 font-bold border-b-2 border-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              <span>(555) 234-5678</span>
            </Link>
            <Link
              href="/appointment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Assessment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/appointment"
              className="md:hidden px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900"
            >
              Book
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/appointment"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 rounded-lg text-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800"
            >
              Book an Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
