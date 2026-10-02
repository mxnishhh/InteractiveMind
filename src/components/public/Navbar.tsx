'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Phone, LayoutDashboard } from 'lucide-react';
import { SITE, HERO } from '@/constants';

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const isHome = pathname === '/';

  const navLinks: NavLinkItem[] = [
    { id: 'hero', label: 'Home', href: isHome ? '#hero' : '/' },
    { id: 'about', label: 'About', href: isHome ? '#about' : '/#about' },
    { id: 'therapies', label: 'Therapies', href: isHome ? '#therapies' : '/#therapies' },
    { id: 'conditions', label: 'Conditions', href: isHome ? '#conditions' : '/#conditions' },
    { id: 'approach', label: 'Approach', href: isHome ? '#approach' : '/#approach' },
    { id: 'journey', label: 'Journey', href: isHome ? '#journey' : '/#journey' },
    { id: 'team', label: 'Team', href: isHome ? '#team' : '/#team' },
    { id: 'blog', label: 'Blog', href: isHome ? '#blog' : '/#blog' },
    { id: 'faq', label: 'FAQ', href: isHome ? '#faq' : '/#faq' },
  ];

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ['hero', 'about', 'therapies', 'conditions', 'approach', 'journey', 'team', 'blog', 'faq'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const handleScrollTop = () => {
      if (window.scrollY < 120) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top - 80) - Math.abs(b.boundingClientRect.top - 80)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -45% 0px',
        threshold: [0, 0.15, 0.3, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScrollTop);
      observer.disconnect();
    };
  }, [isHome]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    if (isHome && link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        setActiveSection(link.id);
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    setIsOpen(false);
    if (isHome && link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        setActiveSection(link.id);
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  };

  return (
    <header id="site-header" className="sticky top-0 z-50 transition-all duration-300 bg-[#faf9f7]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-6">

          {/* Logo Brand: Circular Mark Only */}
          <Link href="/" className="flex items-center group focus:outline-none shrink-0 py-1" aria-label="Interactive Minds Home">
            <Image
              src="/images/interactive-minds-mark.png"
              alt="Interactive Minds"
              width={56}
              height={56}
              className="h-11 sm:h-12 md:h-[52px] lg:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Nav Links with Animated Active Indicator */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              let isActive = false;
              if (isHome) {
                isActive = activeSection === link.id;
              } else {
                if (link.id === 'hero') isActive = pathname === '/';
                else if (link.id === 'about') isActive = pathname.startsWith('/about');
                else if (link.id === 'therapies') isActive = pathname.startsWith('/therapies');
                else if (link.id === 'conditions') isActive = pathname.startsWith('/conditions');
                // The hash links (approach, journey, team, faq) aren't active on dedicated pages
              }

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-900 font-bold'
                      : 'text-stone-600 hover:text-brand-850 hover:bg-stone-100/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Subtle animated active pill background */}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-brand-100/75 border border-brand-200/90 rounded-full -z-10 shadow-soft"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.28, ease: [0.25, 0.1, 0.25, 1.0] }
                      }
                    />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Utility Area: Phone -> Primary CTA -> Divider -> Admin Portal */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Direct Phone Line */}
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="hidden 2xl:flex items-center gap-2 text-xs font-semibold tracking-wide text-brand-850 hover:text-brand-700 transition-colors px-4 py-2.5 rounded-full bg-brand-50 border border-brand-100 whitespace-nowrap h-10"
            >
              <Phone className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>{SITE.phone}</span>
            </a>

            {/* Primary Public CTA: Book an Assessment */}
            <Link
              href={isHome ? '#appointment' : '/#appointment'}
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-brand-850 hover:bg-brand-900 rounded-full shadow-sm hover:shadow-card transition-all duration-200 whitespace-nowrap h-10"
            >
              {HERO.primaryCta.label}
            </Link>

            {/* Subtle Vertical Divider */}
            <div className="h-6 w-px bg-stone-200/90 shrink-0" aria-hidden="true" />

            {/* Dedicated Admin Portal Utility on the Far Right */}
            <Link
              href="/admin/login"
              className="group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-brand-950 bg-white hover:bg-brand-50/90 border border-brand-850/20 hover:border-brand-850/40 shadow-2xs hover:shadow-sm transition-all duration-200 whitespace-nowrap h-10"
              title="Admin Portal (Clinical Staff & Operations)"
              aria-label="Admin Portal"
            >
              <LayoutDashboard className="w-[18px] h-[18px] text-brand-750 group-hover:text-brand-900 group-hover:scale-105 transition-transform duration-200 shrink-0" />
              <span className="hidden xl:inline">Admin Portal</span>
              <span className="xl:hidden">Admin</span>
            </Link>
          </div>

          {/* Mobile Drawer Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={isHome ? '#appointment' : '/#appointment'}
              className="sm:hidden px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-850 rounded-full shadow-sm"
            >
              Book
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-600 hover:text-brand-850 rounded-lg hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-5 shadow-xl animate-fade-in">
          <div className="flex flex-col space-y-1.5">
            {/* Section 1: Public Section Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                let isActive = false;
                if (isHome) {
                  isActive = activeSection === link.id;
                } else {
                  if (link.id === 'hero') isActive = pathname === '/';
                  else if (link.id === 'about') isActive = pathname.startsWith('/about');
                  else if (link.id === 'therapies') isActive = pathname.startsWith('/therapies');
                  else if (link.id === 'conditions') isActive = pathname.startsWith('/conditions');
                }

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleMobileNavClick(e, link)}
                    className={`text-sm font-semibold py-2 px-3.5 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-brand-50 text-brand-900 font-bold border-l-4 border-brand-700'
                        : 'text-stone-700 hover:text-brand-850 hover:bg-stone-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />}
                  </Link>
                );
              })}
            </div>

            {/* Section 2: Contact Line */}
            <div className="pt-3 mt-1 border-t border-stone-100">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-brand-850 bg-brand-50 rounded-xl"
              >
                <Phone className="w-4 h-4 text-brand-700" />
                <span>Call Centre: {SITE.phone}</span>
              </a>
            </div>

            {/* Section 3: Clearly Separated Admin Portal Entry */}
            <div className="pt-2">
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-brand-950 bg-[#faf9f7] hover:bg-brand-50/80 border border-stone-200/90 rounded-xl shadow-2xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-[18px] h-[18px] text-brand-750" />
                  <span>Admin Portal</span>
                </div>
                <span className="text-[10px] font-semibold text-stone-500 normal-case tracking-normal">Staff Only →</span>
              </Link>
            </div>

            {/* Section 4: Primary Public CTA */}
            <div className="pt-2">
              <Link
                href={isHome ? '#appointment' : '/#appointment'}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-brand-850 hover:bg-brand-900 rounded-xl shadow-sm transition-colors block"
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
