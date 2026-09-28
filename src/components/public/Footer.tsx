import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowUp, Lock } from 'lucide-react';
import { SITE, CONSTANT_SERVICES } from '@/constants';
import { FadeUp, FadeIn } from '@/components/ui/motion';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#051c1a] text-stone-300 py-16 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-brand-900/80">

            {/* Col 1: Brand & Identity (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-700 text-white font-bold text-sm flex items-center justify-center shadow">
                  IM
                </div>
                <div>
                  <span className="font-serif-heading text-lg font-bold text-white tracking-tight block">
                    Interactive Minds
                  </span>
                  <span className="text-[11px] text-brand-200 block">
                    Autism Care &amp; Child Development Centre
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
                An evidence-informed, neurodiversity-affirming pediatric developmental institute in Sadikpur, Patna. Dedicated to nurturing communication, autonomy, sensory regulation, and self-confidence.
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-brand-200 bg-brand-950 border border-brand-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  In-Person Centre &amp; Assessment Facility
                </span>
              </div>
            </div>

            {/* Col 2: Navigation Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-serif-heading text-sm font-bold uppercase tracking-wider text-white">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/#about" className="hover:text-white transition-colors">About Our Centre</Link></li>
                <li><Link href="/therapies" className="hover:text-white transition-colors">All 9 Therapies</Link></li>
                <li><Link href="/conditions" className="hover:text-white transition-colors">Conditions Supported</Link></li>
                <li><Link href="/#approach" className="hover:text-white transition-colors">Clinical Principles</Link></li>
                <li><Link href="/#journey" className="hover:text-white transition-colors">4-Step Journey</Link></li>
                <li><Link href="/#team" className="hover:text-white transition-colors">Specialist Team</Link></li>
                <li><Link href="/#faq" className="hover:text-white transition-colors">Parent FAQ</Link></li>
              </ul>
            </div>

            {/* Col 3: Therapies (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-serif-heading text-sm font-bold uppercase tracking-wider text-white">
                Programs
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                {CONSTANT_SERVICES.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/therapies/${service.slug}`} className="hover:text-white transition-colors">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Centre Coordinates (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-serif-heading text-sm font-bold uppercase tracking-wider text-white">
                Centre Coordinates
              </h4>
              <ul className="space-y-3 text-xs text-stone-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{SITE.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white transition-colors">{SITE.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">{SITE.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>{SITE.workingHours}</span>
                </li>
              </ul>
            </div>

          </div>
        </FadeUp>

        {/* Bottom Legal & Staff Bar */}
        <FadeIn delay={0.2} className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>{SITE.copyright}</p>

          <div className="flex items-center gap-6">
            <Link
              href="#hero"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};
