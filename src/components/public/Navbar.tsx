'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { SITE, HERO } from '@/constants';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Therapies', href: isHome ? '#therapies' : '/therapies' },
    { label: 'Conditions', href: isHome ? '#conditions' : '/conditions' },
    { label: 'Approach', href: isHome ? '#approach' : '/#approach' },
    { label: 'Journey', href: isHome ? '#journey' : '/#journey' },
    { label: 'Team', href: isHome ? '#team' : '/#team' },
    { label: 'FAQ', href: isHome ? '#faq' : '/#faq' },
  ];

  return (
    <header id="site-header" className="sticky top-0 z-50 transition-all duration-300 bg-[#faf9f7]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="h-10 flex items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-850 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-brand-900 transition-colors">
                  IM
                </div>
                <div>
                  <span className="font-serif-heading font-semibold text-lg sm:text-xl text-brand-950 tracking-tight block leading-tight">
                    Interactive Minds
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 tracking-wide block">
                    Autism Care &amp; Child Development
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-brand-850 hover:bg-stone-100/60 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Direct Contact & Primary Booking CTA */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="hidden xl:flex items-center gap-2 text-xs font-semibold tracking-wide text-brand-850 hover:text-brand-700 transition-colors px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100"
            >
              <Phone className="w-3.5 h-3.5 text-brand-700" />
              <span>{SITE.phone}</span>
            </a>

            <Link
              href={isHome ? '#appointment' : '/appointment'}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold tracking-wide text-white bg-brand-850 hover:bg-brand-900 rounded-full shadow-sm hover:shadow-card transition-all duration-200"
            >
              {HERO.primaryCta.label}
            </Link>
          </div>

          {/* Mobile Drawer Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={isHome ? '#appointment' : '/appointment'}
              className="sm:hidden px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-850 rounded-full shadow-sm"
            >
              Book
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-600 hover:text-brand-850 rounded-lg hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 shadow-xl animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-stone-700 hover:text-brand-850 py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-stone-100 flex flex-col gap-3">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-brand-850 bg-brand-50 rounded-xl"
              >
                <Phone className="w-4 h-4 text-brand-700" />
                <span>Call Centre: {SITE.phone}</span>
              </a>
              <Link
                href={isHome ? '#appointment' : '/appointment'}
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center text-sm font-semibold text-white bg-brand-850 hover:bg-brand-900 rounded-xl shadow-sm transition-colors"
              >
                {HERO.primaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
