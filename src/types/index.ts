export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type MessageStatus = 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';
export type MediaType = 'image' | 'video';

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url?: string;
  who_it_helps?: string;
  benefits?: string;
  approach?: string;
  process_steps?: string[];
  skills_supported?: string[];
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Condition {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url?: string;
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id: number;
  appointment_reference: string;
  parent_name: string;
  child_name: string;
  email: string;
  phone: string;
  child_age: string;
  service_id?: number | null;
  service_name?: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  preferred_contact_method?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  preferred_contact_method?: string;
  status: MessageStatus;
  created_at: string;
  updated_at?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialization?: string;
  bio?: string;
  image_url?: string;
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  display_name: string;
  content: string;
  rating: number;
  image_url?: string;
  active: boolean;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: number;
  title: string;
  description?: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string;
  category: string;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_email: string;
  site_phone: string;
  whatsapp_number: string;
  site_address: string;
  working_hours: string;
  hero_heading: string;
  hero_subheading: string;
  footer_copyright: string;
  [key: string]: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  last_login_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}
