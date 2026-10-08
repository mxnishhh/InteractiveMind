import { z } from 'zod';

export const AppointmentRequestSchema = z.object({
  parent_name: z.string().min(2, 'Parent/Guardian name must be at least 2 characters'),
  child_name: z.string().min(2, 'Child name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  child_age: z.string().min(1, 'Please select or enter your child\'s age'),
  service_id: z.number().optional().nullable(),
  preferred_date: z.string().min(1, 'Please select a preferred date'),
  preferred_time: z.string().min(1, 'Please select a preferred time slot'),
  message: z.string().optional(),
  preferred_contact_method: z.string().optional().default('phone'),
});

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  subject: z.string().optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferred_contact_method: z.string().optional().default('email'),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const AppointmentStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  admin_notes: z.string().optional().nullable(),
});

export const MessageStatusUpdateSchema = z.object({
  status: z.enum(['NEW', 'READ', 'RESPONDED', 'ARCHIVED']),
});

// Service (Therapy) CRUD Schemas
export const ServiceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  image_url: z.string().optional().nullable(),
  who_it_helps: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  approach: z.string().optional().nullable(),
  process_steps: z.array(z.string()).optional().default([]),
  skills_supported: z.array(z.string()).optional().default([]),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const ServiceUpdateSchema = ServiceSchema.partial();

// Condition CRUD Schemas
export const ConditionSchema = z.object({
  name: z.string().min(2, 'Condition name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  image_url: z.string().optional().nullable(),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const ConditionUpdateSchema = ConditionSchema.partial();

// FAQ CRUD Schemas
export const FAQSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(5, 'Answer must be at least 5 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters').default('General'),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const FAQUpdateSchema = FAQSchema.partial();

// Team Member CRUD Schemas
export const TeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  specialization: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const TeamMemberUpdateSchema = TeamMemberSchema.partial();

// Testimonial CRUD Schemas
export const TestimonialSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5').default(5),
  image_url: z.string().optional().nullable(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  display_order: z.number().default(0),
});

export const TestimonialUpdateSchema = TestimonialSchema.partial();

// Media Item CRUD Schemas
export const MediaItemSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional().nullable(),
  type: z.enum(['image', 'video']).default('image'),
  url: z.string().min(5, 'Valid media URL is required'),
  thumbnail_url: z.string().optional().nullable(),
  category: z.string().min(1, 'Category is required').default('Activities'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
  optimization_status: z.enum(['ready', 'processing', 'failed', 'original']).optional().nullable(),
  original_size_bytes: z.number().optional().nullable(),
  optimized_size_bytes: z.number().optional().nullable(),
  duration_seconds: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
});

export const MediaItemUpdateSchema = MediaItemSchema.partial();

// Blog Post CRUD Schemas
export const BlogPostSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  type: z.enum(['article', 'video', 'resource']).default('article'),
  category: z.string().min(1, 'Category is required').default('General'),
  author: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  display_order: z.number().default(0),
});

export const BlogPostUpdateSchema = BlogPostSchema.partial();

