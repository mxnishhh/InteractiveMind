import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
          <Activity className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-3">
          {service.name}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {service.short_description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/therapies/${service.slug}`}
          className="text-xs font-bold uppercase tracking-wider text-brand-600 group-hover:text-brand-700 inline-flex items-center gap-1.5"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
