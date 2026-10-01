import {
  CONSTANT_SERVICES,
  CONSTANT_CONDITIONS,
  CONSTANT_FAQS,
  SITE,
  CONSTANT_TEAM
} from '@/constants';
import { Service, Condition, FAQ, TeamMember, Testimonial, MediaItem, BlogPost } from '@/types';

export const INITIAL_SERVICES: Service[] = [...CONSTANT_SERVICES];
export const INITIAL_CONDITIONS: Condition[] = [...CONSTANT_CONDITIONS];
export const INITIAL_FAQS: FAQ[] = [...CONSTANT_FAQS];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [...CONSTANT_TEAM];
export const INITIAL_TESTIMONIALS: Testimonial[] = [];
export const INITIAL_MEDIA: MediaItem[] = [];
export const INITIAL_BLOG_POSTS: BlogPost[] = [];
