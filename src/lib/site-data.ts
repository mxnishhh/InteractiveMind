import { 
  CONSTANT_SERVICES, 
  CONSTANT_CONDITIONS, 
  CONSTANT_FAQS, 
  SITE, 
  CONSTANT_TEAM 
} from '@/constants';
import { Service, Condition, FAQ, TeamMember, SiteSettings, Testimonial, MediaItem } from '@/types';

export const INITIAL_SERVICES: Service[] = [...CONSTANT_SERVICES];
export const INITIAL_CONDITIONS: Condition[] = [...CONSTANT_CONDITIONS];
export const INITIAL_FAQS: FAQ[] = [...CONSTANT_FAQS];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  site_name: SITE.name,
  site_tagline: SITE.tagline,
  site_email: SITE.email,
  site_phone: SITE.phone,
  whatsapp_number: SITE.whatsappNumber,
  site_address: SITE.address,
  working_hours: SITE.workingHours,
  hero_heading: "Helping Every Child Learn, Grow & Shine",
  hero_subheading: "Autism Care & Child Development",
  footer_copyright: SITE.copyright
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [...CONSTANT_TEAM];
export const INITIAL_TESTIMONIALS: Testimonial[] = [];
export const INITIAL_MEDIA: MediaItem[] = [];
