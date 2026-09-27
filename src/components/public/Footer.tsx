import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SITE, NAVIGATION, FOOTER, CONSTANT_SERVICES } from '@/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white text-slate-900 font-bold text-xs flex items-center justify-center">
                {SITE.shortName}
              </div>
              <span className="text-base font-bold text-white tracking-tight">{SITE.name}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {SITE.tagline} dedicated to helping children learn, communicate, participate, and become independent.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{FOOTER.quickNavTitle}</h4>
            <ul className="space-y-2 text-xs">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{FOOTER.therapiesTitle}</h4>
            <ul className="space-y-2 text-xs">
              {CONSTANT_SERVICES.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link href={`/therapies/${service.slug}`} className="hover:text-white transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{FOOTER.contactTitle}</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">{SITE.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white transition-colors">{SITE.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{SITE.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{SITE.copyright}</p>
          <div>
            <Link href="/admin/login" className="hover:text-white transition-colors">{FOOTER.adminLinkText}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
