import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">INTERACTIVE MINDS</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become more independent.
            </p>
            <div className="pt-2 text-xs font-medium text-brand-400 uppercase tracking-wider">
              Child-Led Progress • Family Co-Design • Sensory Ease
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link href="/conditions" className="hover:text-brand-400 transition-colors">Conditions Supported</Link></li>
              <li><Link href="/therapies" className="hover:text-brand-400 transition-colors">Therapies & Services</Link></li>
              <li><Link href="/media" className="hover:text-brand-400 transition-colors">Media Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/appointment" className="hover:text-brand-400 transition-colors">Book Assessment</Link></li>
            </ul>
          </div>

          {/* Col 3: Primary Services */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Our Therapies</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/therapies/aba-therapy" className="hover:text-brand-400 transition-colors">ABA Therapy</Link></li>
              <li><Link href="/therapies/occupational-therapy" className="hover:text-brand-400 transition-colors">Occupational Therapy</Link></li>
              <li><Link href="/therapies/speech-therapy" className="hover:text-brand-400 transition-colors">Speech Therapy</Link></li>
              <li><Link href="/therapies/special-education" className="hover:text-brand-400 transition-colors">Special Education</Link></li>
              <li><Link href="/therapies/sensory-integration" className="hover:text-brand-400 transition-colors">Sensory Integration</Link></li>
              <li><Link href="/therapies/school-readiness" className="hover:text-brand-400 transition-colors">School Readiness</Link></li>
            </ul>
          </div>

          {/* Col 4: Verified Contact Info */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Center Contact</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  1st Floor, Hira Shiv Palace, Ashok Rajpath Rd, Gudari Bazar, Khamji Begum Colony, Sadikpur, Patna, Bihar 800008
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-400 shrink-0" />
                <a href="mailto:interactiveminds@gmail.com" className="hover:text-brand-400 transition-colors">interactiveminds@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-400 transition-colors">(555) 234-5678</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Interactive Minds - Neurodiversity-affirming therapy for children and youth.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
