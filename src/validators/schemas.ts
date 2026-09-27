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
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferred_contact_method: z.string().optional().default('email'),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const AppointmentStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  admin_notes: z.string().optional(),
});

export const MessageStatusUpdateSchema = z.object({
  status: z.enum(['NEW', 'READ', 'RESPONDED', 'ARCHIVED']),
});

export const ServiceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  short_description: z.string().min(10),
  description: z.string().min(20),
  image_url: z.string().optional(),
  who_it_helps: z.string().optional(),
  benefits: z.string().optional(),
  approach: z.string().optional(),
  process_steps: z.array(z.string()).optional(),
  skills_supported: z.array(z.string()).optional(),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const ConditionSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  short_description: z.string().min(10),
  description: z.string().min(20),
  image_url: z.string().optional(),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const FAQSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().default('General'),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const TeamMemberSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().optional(),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});

export const TestimonialSchema = z.object({
  display_name: z.string().min(2),
  content: z.string().min(10),
  rating: z.number().min(1).max(5).default(5),
  image_url: z.string().optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  display_order: z.number().default(0),
});

export const MediaItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['image', 'video']).default('image'),
  url: z.string().min(5),
  thumbnail_url: z.string().optional(),
  category: z.string().default('Activities'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  display_order: z.number().default(0),
});
