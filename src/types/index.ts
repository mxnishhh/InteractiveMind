export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type MessageStatus = 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';
export type MediaType = 'image' | 'video';

export type BlogPostType = 'article' | 'video' | 'resource';
export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  thumbnail?: string | null;
  type: BlogPostType;
  category?: string;
  author?: string | null;
  video_url?: string | null;
  published_at?: string | null;
  status: BlogPostStatus;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url?: string | null;
  who_it_helps?: string | null;
  benefits?: string | null;
  approach?: string | null;
  process_steps?: string[];
  skills_supported?: string[];
  closing_text?: string | null;
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
  image_url?: string | null;
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
  message?: string | null;
  preferred_contact_method?: string;
  status: AppointmentStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject?: string | null;
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
  specialization?: string | null;
  bio?: string | null;
  image_url?: string | null;
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
  image_url?: string | null;
  active: boolean;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: number;
  title: string;
  description?: string | null;
  type: MediaType;
  url: string;
  thumbnail_url?: string | null;
  category: string;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
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
