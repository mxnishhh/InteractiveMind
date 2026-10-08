import crypto from 'crypto';
import mysql from 'mysql2/promise';
import {
  INITIAL_SERVICES,
  INITIAL_CONDITIONS,
  INITIAL_FAQS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TESTIMONIALS,
  INITIAL_MEDIA,
  INITIAL_BLOG_POSTS
} from './site-data';
import { Appointment, ContactMessage, Service, Condition, FAQ, TeamMember, Testimonial, MediaItem, BlogPost } from '@/types';

// Helper to safely parse JSON arrays from MySQL TEXT/LONGTEXT columns
function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.filter((item): item is string => typeof item === 'string');
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch {
      return [trimmed];
    }
  }
  return [];
}

export function normalizeService(row: any): Service {
  return {
    id: Number(row.id),
    name: String(row.name || ''),
    slug: String(row.slug || ''),
    short_description: String(row.short_description || ''),
    description: String(row.description || ''),
    image_url: row.image_url ? String(row.image_url) : undefined,
    who_it_helps: row.who_it_helps ? String(row.who_it_helps) : undefined,
    benefits: row.benefits ? String(row.benefits) : undefined,
    approach: row.approach ? String(row.approach) : undefined,
    process_steps: parseJsonArray(row.process_steps),
    skills_supported: parseJsonArray(row.skills_supported),
    closing_text: row.closing_text ? String(row.closing_text) : undefined,
    active: Boolean(row.active),
    display_order: Number(row.display_order ?? 0),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function normalizeCondition(row: any): Condition {
  return {
    id: Number(row.id),
    name: String(row.name || ''),
    slug: String(row.slug || ''),
    short_description: String(row.short_description || ''),
    description: String(row.description || ''),
    image_url: row.image_url ? String(row.image_url) : undefined,
    active: Boolean(row.active),
    display_order: Number(row.display_order ?? 0),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function normalizeFAQ(row: any): FAQ {
  return {
    id: Number(row.id),
    question: String(row.question || ''),
    answer: String(row.answer || ''),
    category: String(row.category || 'General'),
    active: Boolean(row.active),
    display_order: Number(row.display_order ?? 0),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function normalizeTeamMember(row: any): TeamMember {
  return {
    id: Number(row.id),
    name: String(row.name || ''),
    role: String(row.role || ''),
    specialization: row.specialization ? String(row.specialization) : undefined,
    bio: row.bio ? String(row.bio) : undefined,
    image_url: row.image_url ? String(row.image_url) : undefined,
    active: Boolean(row.active),
    display_order: Number(row.display_order ?? 0),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function normalizeTestimonial(row: any): Testimonial {
  return {
    id: Number(row.id),
    display_name: String(row.display_name || ''),
    content: String(row.content || ''),
    rating: Number(row.rating ?? 5),
    image_url: row.image_url ? String(row.image_url) : undefined,
    active: Boolean(row.active),
    featured: Boolean(row.featured),
    display_order: Number(row.display_order ?? 0),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function normalizeMediaItem(row: any): MediaItem {
  return {
    id: Number(row.id),
    title: String(row.title || ''),
    description: row.description ? String(row.description) : undefined,
    type: row.type === 'video' ? 'video' : 'image',
    url: String(row.url || ''),
    thumbnail_url: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    category: String(row.category || 'Activities'),
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    display_order: Number(row.display_order ?? 0),
    optimization_status: row.optimization_status ? String(row.optimization_status) as any : undefined,
    original_size_bytes: row.original_size_bytes !== null && row.original_size_bytes !== undefined ? Number(row.original_size_bytes) : undefined,
    optimized_size_bytes: row.optimized_size_bytes !== null && row.optimized_size_bytes !== undefined ? Number(row.optimized_size_bytes) : undefined,
    duration_seconds: row.duration_seconds !== null && row.duration_seconds !== undefined ? Number(row.duration_seconds) : undefined,
    width: row.width !== null && row.width !== undefined ? Number(row.width) : undefined,
    height: row.height !== null && row.height !== undefined ? Number(row.height) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function normalizeBlogPost(row: any): BlogPost {
  return {
    id: Number(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    excerpt: row.excerpt ? String(row.excerpt) : undefined,
    content: row.content ? String(row.content) : undefined,
    thumbnail: row.thumbnail ? String(row.thumbnail) : undefined,
    type: (row.type === 'video' || row.type === 'resource') ? row.type : 'article',
    category: String(row.category || 'General'),
    author: row.author ? String(row.author) : undefined,
    video_url: row.video_url ? String(row.video_url) : undefined,
    published_at: row.published_at
      ? typeof row.published_at === 'object' && row.published_at instanceof Date
        ? row.published_at.toISOString().slice(0, 10)
        : String(row.published_at).slice(0, 10)
      : undefined,
    status: row.status === 'published' ? 'published' : 'draft',
    display_order: Number(row.display_order ?? 0),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

// In-memory fallback database state (development only)
const memoryState = {
  services: [...INITIAL_SERVICES],
  conditions: [...INITIAL_CONDITIONS],
  faqs: [...INITIAL_FAQS],
  team: [...INITIAL_TEAM_MEMBERS],
  testimonials: [...INITIAL_TESTIMONIALS],
  media: [...INITIAL_MEDIA],
  blogPosts: [...INITIAL_BLOG_POSTS],
  appointments: [] as Appointment[],
  messages: [] as ContactMessage[],
  nextAppointmentId: 10,
  nextMessageId: 10,
  nextServiceId: 10,
  nextConditionId: 10,
  nextFaqId: 10,
  nextTeamId: 10,
  nextTestimonialId: 10,
  nextMediaId: 10,
  nextBlogPostId: 1,
};

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (host && user && database) {
    try {
      const isSsl = process.env.DB_SSL === 'true';

      pool = mysql.createPool({
        host,
        port: Number(process.env.DB_PORT || 3306),
        user,
        password: password || '',
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ...(isSsl ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
      });
      return pool;
    } catch (e) {
      console.error('MySQL pool creation failed:', e);
      pool = null;
    }
  }

  // In development mode, allow fallback with clear warning
  if (process.env.NODE_ENV !== 'production') {
    console.warn('No database connection available. Falling back to in-memory store for DEVELOPMENT ONLY.');
  }

  return null;
}

export async function queryDb<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  if (!p) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database connection unavailable');
    }
    throw new Error('Database connection unavailable (development mode)');
  }

  try {
    const [rows] = await p.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query failed:', error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ====================================================
// 1. SERVICES (THERAPIES) REPOSITORY
// ====================================================

export async function getServicesDB(): Promise<Service[]> {
  try {
    const rows = await queryDb('SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeService);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for services (dev mode)');
      return memoryState.services.filter(s => s.active).map(normalizeService);
    }
    throw error;
  }
  return [];
}

export async function getAllServicesDB(): Promise<Service[]> {
  try {
    const rows = await queryDb('SELECT * FROM services ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeService);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for all services (dev mode)');
      return memoryState.services.map(normalizeService);
    }
    throw error;
  }
  return [];
}

export async function getServiceBySlugDB(slug: string): Promise<Service | null> {
  try {
    const rows = await queryDb('SELECT * FROM services WHERE slug = ? LIMIT 1', [slug]);
    if (rows && rows.length > 0) return normalizeService(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for service by slug (dev mode)');
      const found = memoryState.services.find(s => s.slug === slug);
      return found ? normalizeService(found) : null;
    }
    throw error;
  }
  return null;
}

export async function getServiceByIdDB(id: number): Promise<Service | null> {
  try {
    const rows = await queryDb('SELECT * FROM services WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeService(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.services.find(s => s.id === id);
      return found ? normalizeService(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createServiceDB(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  const processStepsJson = JSON.stringify(data.process_steps || []);
  const skillsJson = JSON.stringify(data.skills_supported || []);

  const res = await queryDb(
    `INSERT INTO services
     (name, slug, short_description, description, image_url, who_it_helps, benefits, approach, process_steps, skills_supported, active, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.slug,
      data.short_description,
      data.description,
      data.image_url || null,
      data.who_it_helps || null,
      data.benefits || null,
      data.approach || null,
      processStepsJson,
      skillsJson,
      data.active ? 1 : 0,
      data.display_order ?? 0,
    ]
  );

  const insertId = (res as any).insertId;
  const created = await getServiceByIdDB(insertId);
  return created || { id: insertId, ...data, process_steps: data.process_steps || [], skills_supported: data.skills_supported || [] };
}

export async function updateServiceDB(id: number, data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existing = await getServiceByIdDB(id);
  if (!existing) return false;

  const merged = {
    ...existing,
    ...data,
  };

  const processStepsJson = JSON.stringify(merged.process_steps || []);
  const skillsJson = JSON.stringify(merged.skills_supported || []);

  await queryDb(
    `UPDATE services SET
     name = ?, slug = ?, short_description = ?, description = ?, image_url = ?, who_it_helps = ?, benefits = ?, approach = ?, process_steps = ?, skills_supported = ?, active = ?, display_order = ?
     WHERE id = ?`,
    [
      merged.name,
      merged.slug,
      merged.short_description,
      merged.description,
      merged.image_url || null,
      merged.who_it_helps || null,
      merged.benefits || null,
      merged.approach || null,
      processStepsJson,
      skillsJson,
      merged.active ? 1 : 0,
      merged.display_order ?? 0,
      id,
    ]
  );

  return true;
}

export async function deleteServiceDB(id: number): Promise<boolean> {
  const res = await queryDb('DELETE FROM services WHERE id = ?', [id]);
  return (res as any).affectedRows > 0;
}

// ====================================================
// 2. CONDITIONS REPOSITORY
// ====================================================

export async function getConditionsDB(): Promise<Condition[]> {
  try {
    const rows = await queryDb('SELECT * FROM conditions WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeCondition);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for conditions (dev mode)');
      return memoryState.conditions.filter(c => c.active).map(normalizeCondition);
    }
    throw error;
  }
  return [];
}

export async function getAllConditionsDB(): Promise<Condition[]> {
  try {
    const rows = await queryDb('SELECT * FROM conditions ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeCondition);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for all conditions (dev mode)');
      return memoryState.conditions.map(normalizeCondition);
    }
    throw error;
  }
  return [];
}

export async function getConditionBySlugDB(slug: string): Promise<Condition | null> {
  try {
    const rows = await queryDb('SELECT * FROM conditions WHERE slug = ? LIMIT 1', [slug]);
    if (rows && rows.length > 0) return normalizeCondition(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for condition by slug (dev mode)');
      const found = memoryState.conditions.find(c => c.slug === slug);
      return found ? normalizeCondition(found) : null;
    }
    throw error;
  }
  return null;
}

export async function getConditionByIdDB(id: number): Promise<Condition | null> {
  try {
    const rows = await queryDb('SELECT * FROM conditions WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeCondition(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.conditions.find(c => c.id === id);
      return found ? normalizeCondition(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createConditionDB(data: Omit<Condition, 'id' | 'created_at' | 'updated_at'>): Promise<Condition> {
  const res = await queryDb(
    `INSERT INTO conditions (name, slug, short_description, description, image_url, active, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.slug,
      data.short_description,
      data.description,
      data.image_url || null,
      data.active ? 1 : 0,
      data.display_order ?? 0,
    ]
  );

  const insertId = (res as any).insertId;
  const created = await getConditionByIdDB(insertId);
  return created || { id: insertId, ...data };
}

export async function updateConditionDB(id: number, data: Partial<Omit<Condition, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existing = await getConditionByIdDB(id);
  if (!existing) return false;

  const merged = { ...existing, ...data };

  await queryDb(
    `UPDATE conditions SET
     name = ?, slug = ?, short_description = ?, description = ?, image_url = ?, active = ?, display_order = ?
     WHERE id = ?`,
    [
      merged.name,
      merged.slug,
      merged.short_description,
      merged.description,
      merged.image_url || null,
      merged.active ? 1 : 0,
      merged.display_order ?? 0,
      id,
    ]
  );

  return true;
}

export async function deleteConditionDB(id: number): Promise<boolean> {
  const res = await queryDb('DELETE FROM conditions WHERE id = ?', [id]);
  return (res as any).affectedRows > 0;
}

// ====================================================
// 3. FAQS REPOSITORY
// ====================================================

export async function getFaqsDB(): Promise<FAQ[]> {
  try {
    const rows = await queryDb('SELECT * FROM faqs WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeFAQ);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for FAQs (dev mode)');
      return memoryState.faqs.filter(f => f.active).map(normalizeFAQ);
    }
    throw error;
  }
  return [];
}

export async function getAllFaqsDB(): Promise<FAQ[]> {
  try {
    const rows = await queryDb('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeFAQ);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for all FAQs (dev mode)');
      return memoryState.faqs.map(normalizeFAQ);
    }
    throw error;
  }
  return [];
}

export async function getFaqByIdDB(id: number): Promise<FAQ | null> {
  try {
    const rows = await queryDb('SELECT * FROM faqs WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeFAQ(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.faqs.find(f => f.id === id);
      return found ? normalizeFAQ(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createFaqDB(data: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>): Promise<FAQ> {
  const res = await queryDb(
    `INSERT INTO faqs (question, answer, category, active, display_order)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.question,
      data.answer,
      data.category || 'General',
      data.active ? 1 : 0,
      data.display_order ?? 0,
    ]
  );

  const insertId = (res as any).insertId;
  const created = await getFaqByIdDB(insertId);
  return created || { id: insertId, ...data };
}

export async function updateFaqDB(id: number, data: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existing = await getFaqByIdDB(id);
  if (!existing) return false;

  const merged = { ...existing, ...data };

  await queryDb(
    `UPDATE faqs SET
     question = ?, answer = ?, category = ?, active = ?, display_order = ?
     WHERE id = ?`,
    [
      merged.question,
      merged.answer,
      merged.category || 'General',
      merged.active ? 1 : 0,
      merged.display_order ?? 0,
      id,
    ]
  );

  return true;
}

export async function deleteFaqDB(id: number): Promise<boolean> {
  const res = await queryDb('DELETE FROM faqs WHERE id = ?', [id]);
  return (res as any).affectedRows > 0;
}

// ====================================================
// 4. TEAM MEMBERS REPOSITORY
// ====================================================

export async function getTeamMembersDB(): Promise<TeamMember[]> {
  try {
    const rows = await queryDb('SELECT * FROM team_members WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeTeamMember);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for team members (dev mode)');
      return memoryState.team.filter(t => t.active).map(normalizeTeamMember);
    }
    throw error;
  }
  return [];
}

export async function getAllTeamMembersDB(): Promise<TeamMember[]> {
  try {
    const rows = await queryDb('SELECT * FROM team_members ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows.map(normalizeTeamMember);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for all team members (dev mode)');
      return memoryState.team.map(normalizeTeamMember);
    }
    throw error;
  }
  return [];
}

export async function getTeamMemberByIdDB(id: number): Promise<TeamMember | null> {
  try {
    const rows = await queryDb('SELECT * FROM team_members WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeTeamMember(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.team.find(t => t.id === id);
      return found ? normalizeTeamMember(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createTeamMemberDB(data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
  const res = await queryDb(
    `INSERT INTO team_members (name, role, specialization, bio, image_url, active, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.role,
      data.specialization || null,
      data.bio || null,
      data.image_url || null,
      data.active ? 1 : 0,
      data.display_order ?? 0,
    ]
  );

  const insertId = (res as any).insertId;
  const created = await getTeamMemberByIdDB(insertId);
  return created || { id: insertId, ...data };
}

export async function updateTeamMemberDB(id: number, data: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existing = await getTeamMemberByIdDB(id);
  if (!existing) return false;

  const merged = { ...existing, ...data };

  await queryDb(
    `UPDATE team_members SET
     name = ?, role = ?, specialization = ?, bio = ?, image_url = ?, active = ?, display_order = ?
     WHERE id = ?`,
    [
      merged.name,
      merged.role,
      merged.specialization || null,
      merged.bio || null,
      merged.image_url || null,
      merged.active ? 1 : 0,
      merged.display_order ?? 0,
      id,
    ]
  );

  return true;
}

export async function deleteTeamMemberDB(id: number): Promise<boolean> {
  const res = await queryDb('DELETE FROM team_members WHERE id = ?', [id]);
  return (res as any).affectedRows > 0;
}

// ====================================================
// 5. TESTIMONIALS REPOSITORY
// ====================================================

export async function getTestimonialsDB(): Promise<Testimonial[]> {
  try {
    const rows = await queryDb('SELECT * FROM testimonials WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows) return rows.map(normalizeTestimonial);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for testimonials (dev mode)');
      return memoryState.testimonials.filter(t => t.active).map(normalizeTestimonial);
    }
    throw error;
  }
  return [];
}

export async function getAllTestimonialsDB(): Promise<Testimonial[]> {
  try {
    const rows = await queryDb('SELECT * FROM testimonials ORDER BY display_order ASC, id ASC');
    if (rows) return rows.map(normalizeTestimonial);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for all testimonials (dev mode)');
      return memoryState.testimonials.map(normalizeTestimonial);
    }
    throw error;
  }
  return [];
}

export async function getTestimonialByIdDB(id: number): Promise<Testimonial | null> {
  try {
    const rows = await queryDb('SELECT * FROM testimonials WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeTestimonial(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.testimonials.find(t => t.id === id);
      return found ? normalizeTestimonial(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createTestimonialDB(data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
  const res = await queryDb(
    `INSERT INTO testimonials (display_name, content, rating, image_url, active, featured, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.display_name,
      data.content,
      data.rating ?? 5,
      data.image_url || null,
      data.active ? 1 : 0,
      data.featured ? 1 : 0,
      data.display_order ?? 0,
    ]
  );

  const insertId = (res as any).insertId;
  const created = await getTestimonialByIdDB(insertId);
  return created || { id: insertId, ...data };
}

export async function updateTestimonialDB(id: number, data: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existing = await getTestimonialByIdDB(id);
  if (!existing) return false;

  const merged = { ...existing, ...data };

  await queryDb(
    `UPDATE testimonials SET
     display_name = ?, content = ?, rating = ?, image_url = ?, active = ?, featured = ?, display_order = ?
     WHERE id = ?`,
    [
      merged.display_name,
      merged.content,
      merged.rating ?? 5,
      merged.image_url || null,
      merged.active ? 1 : 0,
      merged.featured ? 1 : 0,
      merged.display_order ?? 0,
      id,
    ]
  );

  return true;
}

export async function deleteTestimonialDB(id: number): Promise<boolean> {
  const res = await queryDb('DELETE FROM testimonials WHERE id = ?', [id]);
  return (res as any).affectedRows > 0;
}

// ====================================================
// 6. MEDIA GALLERY REPOSITORY
// ====================================================

let mediaSchemaMigrated = false;

/**
 * Ensure media table has optimization columns in MySQL database.
 * Non-destructive and safe across MySQL / TiDB / MariaDB.
 */
async function ensureMediaSchema(): Promise<void> {
  if (mediaSchemaMigrated) return;
  const p = getDbPool();
  if (!p) return;

  try {
    const columns = await queryDb<any>(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'media' AND TABLE_SCHEMA = DATABASE()`
    );
    const existing = new Set(columns.map((c: any) => String(c.COLUMN_NAME).toLowerCase()));

    if (existing.size > 0) {
      if (!existing.has('optimization_status')) {
        await queryDb(`ALTER TABLE \`media\` ADD COLUMN \`optimization_status\` ENUM('ready', 'processing', 'failed', 'original') DEFAULT 'ready'`);
      }
      if (!existing.has('original_size_bytes')) {
        await queryDb(`ALTER TABLE \`media\` ADD COLUMN \`original_size_bytes\` BIGINT NULL`);
      }
      if (!existing.has('optimized_size_bytes')) {
        await queryDb(`ALTER TABLE \`media\` ADD COLUMN \`optimized_size_bytes\` BIGINT NULL`);
      }
      if (!existing.has('duration_seconds')) {
        await queryDb(`ALTER TABLE \`media\` ADD COLUMN \`duration_seconds\` DECIMAL(10, 2) NULL`);
      }
      if (!existing.has('width')) {
        await queryDb(`ALTER TABLE \`media\` ADD COLUMN \`width\` INT NULL`);
      }
      if (!existing.has('height')) {
        await queryDb(`ALTER TABLE \`media\` ADD COLUMN \`height\` INT NULL`);
      }
    }
    mediaSchemaMigrated = true;
  } catch (err) {
    console.warn('Media table schema verification note:', err);
  }
}

export async function getMediaDB(): Promise<MediaItem[]> {
  try {
    const rows = await queryDb('SELECT * FROM media WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows) return rows.map(normalizeMediaItem);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for media (dev mode)');
      return memoryState.media.filter(m => m.active).map(normalizeMediaItem);
    }
    throw error;
  }
  return [];
}

export async function getAllMediaDB(): Promise<MediaItem[]> {
  try {
    const rows = await queryDb('SELECT * FROM media ORDER BY display_order ASC, id ASC');
    if (rows) return rows.map(normalizeMediaItem);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for all media (dev mode)');
      return memoryState.media.map(normalizeMediaItem);
    }
    throw error;
  }
  return [];
}

export async function getMediaByIdDB(id: number): Promise<MediaItem | null> {
  try {
    const rows = await queryDb('SELECT * FROM media WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeMediaItem(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.media.find(m => m.id === id);
      return found ? normalizeMediaItem(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createMediaDB(data: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem> {
  await ensureMediaSchema();

  const descValue = data.description ? String(data.description).trim() : null;
  const thumbValue = data.thumbnail_url ? String(data.thumbnail_url).trim() : null;
  const optStatus = data.optimization_status || 'ready';
  const origSize = data.original_size_bytes ?? null;
  const optSize = data.optimized_size_bytes ?? null;
  const durationSec = data.duration_seconds ?? null;
  const widthVal = data.width ?? null;
  const heightVal = data.height ?? null;

  try {
    const res = await queryDb(
      `INSERT INTO media (title, description, type, url, thumbnail_url, category, featured, active, display_order, optimization_status, original_size_bytes, optimized_size_bytes, duration_seconds, width, height)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        descValue,
        data.type || 'image',
        data.url,
        thumbValue,
        data.category || 'Activities',
        data.featured ? 1 : 0,
        data.active ? 1 : 0,
        data.display_order ?? 0,
        optStatus,
        origSize,
        optSize,
        durationSec,
        widthVal,
        heightVal,
      ]
    );

    const insertId = (res as any).insertId;
    const created = await getMediaByIdDB(insertId);
    return created || {
      id: insertId,
      ...data,
      description: descValue || undefined,
      thumbnail_url: thumbValue || undefined,
      optimization_status: optStatus,
      original_size_bytes: origSize ?? undefined,
      optimized_size_bytes: optSize ?? undefined,
      duration_seconds: durationSec ?? undefined,
      width: widthVal ?? undefined,
      height: heightVal ?? undefined,
    };
  } catch (error: any) {
    const errMsg = String(error?.message || '').toLowerCase();
    // Safe fallback if production DB lacks new columns and cannot ALTER TABLE
    if (errMsg.includes('unknown column') || errMsg.includes('optimization_status')) {
      try {
        const fallbackRes = await queryDb(
          `INSERT INTO media (title, description, type, url, thumbnail_url, category, featured, active, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.title,
            descValue,
            data.type || 'image',
            data.url,
            thumbValue,
            data.category || 'Activities',
            data.featured ? 1 : 0,
            data.active ? 1 : 0,
            data.display_order ?? 0,
          ]
        );
        const insertId = (fallbackRes as any).insertId;
        const created = await getMediaByIdDB(insertId);
        return created || {
          id: insertId,
          ...data,
          description: descValue || undefined,
          thumbnail_url: thumbValue || undefined,
        };
      } catch (fallbackErr) {
        // Continue to error handling below
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      const newMedia: MediaItem = {
        id: memoryState.nextMediaId++,
        title: data.title,
        description: descValue || undefined,
        type: data.type || 'image',
        url: data.url,
        thumbnail_url: thumbValue || undefined,
        category: data.category || 'Activities',
        featured: Boolean(data.featured),
        active: data.active !== undefined ? Boolean(data.active) : true,
        display_order: Number(data.display_order ?? 0),
        optimization_status: optStatus,
        original_size_bytes: origSize ?? undefined,
        optimized_size_bytes: optSize ?? undefined,
        duration_seconds: durationSec ?? undefined,
        width: widthVal ?? undefined,
        height: heightVal ?? undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      memoryState.media.push(newMedia);
      return normalizeMediaItem(newMedia);
    }
    throw error;
  }
}

export async function updateMediaDB(id: number, data: Partial<Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  await ensureMediaSchema();

  const existing = await getMediaByIdDB(id);
  if (!existing) return false;

  const merged = { ...existing, ...data };
  const descValue = data.description !== undefined
    ? (data.description && String(data.description).trim().length > 0 ? String(data.description).trim() : null)
    : (existing.description ? String(existing.description) : null);

  const thumbValue = data.thumbnail_url !== undefined
    ? (data.thumbnail_url && String(data.thumbnail_url).trim().length > 0 ? String(data.thumbnail_url).trim() : null)
    : (existing.thumbnail_url ? String(existing.thumbnail_url) : null);

  const optStatus = data.optimization_status !== undefined
    ? data.optimization_status
    : (existing.optimization_status || 'ready');

  const origSize = data.original_size_bytes !== undefined ? data.original_size_bytes : (existing.original_size_bytes ?? null);
  const optSize = data.optimized_size_bytes !== undefined ? data.optimized_size_bytes : (existing.optimized_size_bytes ?? null);
  const durationSec = data.duration_seconds !== undefined ? data.duration_seconds : (existing.duration_seconds ?? null);
  const widthVal = data.width !== undefined ? data.width : (existing.width ?? null);
  const heightVal = data.height !== undefined ? data.height : (existing.height ?? null);

  try {
    await queryDb(
      `UPDATE media SET
       title = ?, description = ?, type = ?, url = ?, thumbnail_url = ?, category = ?, featured = ?, active = ?, display_order = ?,
       optimization_status = ?, original_size_bytes = ?, optimized_size_bytes = ?, duration_seconds = ?, width = ?, height = ?
       WHERE id = ?`,
      [
        merged.title,
        descValue,
        merged.type || 'image',
        merged.url,
        thumbValue,
        merged.category || 'Activities',
        merged.featured ? 1 : 0,
        merged.active ? 1 : 0,
        merged.display_order ?? 0,
        optStatus,
        origSize,
        optSize,
        durationSec,
        widthVal,
        heightVal,
        id,
      ]
    );

    return true;
  } catch (error: any) {
    const errMsg = String(error?.message || '').toLowerCase();
    if (errMsg.includes('unknown column') || errMsg.includes('optimization_status')) {
      try {
        await queryDb(
          `UPDATE media SET
           title = ?, description = ?, type = ?, url = ?, thumbnail_url = ?, category = ?, featured = ?, active = ?, display_order = ?
           WHERE id = ?`,
          [
            merged.title,
            descValue,
            merged.type || 'image',
            merged.url,
            thumbValue,
            merged.category || 'Activities',
            merged.featured ? 1 : 0,
            merged.active ? 1 : 0,
            merged.display_order ?? 0,
            id,
          ]
        );
        return true;
      } catch (fallbackErr) {}
    }

    if (process.env.NODE_ENV !== 'production') {
      const idx = memoryState.media.findIndex(m => m.id === id);
      if (idx !== -1) {
        memoryState.media[idx] = {
          ...memoryState.media[idx],
          ...data,
          description: descValue || undefined,
          thumbnail_url: thumbValue || undefined,
          optimization_status: optStatus || undefined,
          original_size_bytes: origSize ?? undefined,
          optimized_size_bytes: optSize ?? undefined,
          duration_seconds: durationSec ?? undefined,
          width: widthVal ?? undefined,
          height: heightVal ?? undefined,
          updated_at: new Date().toISOString(),
        };
        return true;
      }
      return false;
    }
    throw error;
  }
}

export async function deleteMediaDB(id: number): Promise<boolean> {
  try {
    const res = await queryDb('DELETE FROM media WHERE id = ?', [id]);
    return (res as any).affectedRows > 0;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const initLen = memoryState.media.length;
      memoryState.media = memoryState.media.filter(m => m.id !== id);
      return memoryState.media.length < initLen;
    }
    throw error;
  }
}

// ====================================================
// 7. BLOG POSTS & INSIGHTS REPOSITORY
// ====================================================

export async function getBlogPostsDB(): Promise<BlogPost[]> {
  try {
    const rows = await queryDb('SELECT * FROM blog_posts ORDER BY display_order ASC, published_at DESC, id DESC');
    if (rows) return rows.map(normalizeBlogPost);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for blog posts (dev mode)');
      return [...memoryState.blogPosts]
        .sort((a, b) => a.display_order - b.display_order || b.id - a.id)
        .map(normalizeBlogPost);
    }
    throw error;
  }
  return [];
}

export async function getPublishedBlogPostsDB(): Promise<BlogPost[]> {
  try {
    const rows = await queryDb("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY display_order ASC, published_at DESC, id DESC");
    if (rows) return rows.map(normalizeBlogPost);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to memory for published blog posts (dev mode)');
      return memoryState.blogPosts
        .filter(p => p.status === 'published')
        .sort((a, b) => a.display_order - b.display_order || b.id - a.id)
        .map(normalizeBlogPost);
    }
    throw error;
  }
  return [];
}

export async function getBlogPostByIdDB(id: number): Promise<BlogPost | null> {
  try {
    const rows = await queryDb('SELECT * FROM blog_posts WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) return normalizeBlogPost(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.blogPosts.find(p => p.id === id);
      return found ? normalizeBlogPost(found) : null;
    }
    throw error;
  }
  return null;
}

export async function getBlogPostBySlugDB(slug: string): Promise<BlogPost | null> {
  try {
    const rows = await queryDb('SELECT * FROM blog_posts WHERE slug = ? LIMIT 1', [slug]);
    if (rows && rows.length > 0) return normalizeBlogPost(rows[0]);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const found = memoryState.blogPosts.find(p => p.slug === slug);
      return found ? normalizeBlogPost(found) : null;
    }
    throw error;
  }
  return null;
}

export async function createBlogPostDB(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const publishedAt = data.status === 'published' ? (data.published_at || new Date().toISOString().slice(0, 19).replace('T', ' ')) : (data.published_at || null);

  try {
    const res = await queryDb(
      `INSERT INTO blog_posts (title, slug, excerpt, content, thumbnail, type, category, author, video_url, published_at, status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.slug,
        data.excerpt || null,
        data.content || null,
        data.thumbnail || null,
        data.type || 'article',
        data.category || 'General',
        data.author || null,
        data.video_url || null,
        publishedAt,
        data.status || 'draft',
        data.display_order ?? 0,
      ]
    );

    const insertId = (res as any).insertId;
    const created = await getBlogPostByIdDB(insertId);
    return created || { id: insertId, ...data, published_at: publishedAt ? String(publishedAt) : undefined };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const newPost: BlogPost = {
        id: memoryState.nextBlogPostId++,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || undefined,
        content: data.content || undefined,
        thumbnail: data.thumbnail || undefined,
        type: data.type || 'article',
        category: data.category || 'General',
        author: data.author || undefined,
        video_url: data.video_url || undefined,
        published_at: publishedAt ? String(publishedAt) : undefined,
        status: data.status || 'draft',
        display_order: data.display_order ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      memoryState.blogPosts.push(newPost);
      return normalizeBlogPost(newPost);
    }
    throw error;
  }
}

export async function updateBlogPostDB(id: number, data: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existing = await getBlogPostByIdDB(id);
  if (!existing) return false;

  const merged = { ...existing, ...data };
  let publishedAt = merged.published_at || null;
  if (data.status === 'published' && !existing.published_at) {
    publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  try {
    await queryDb(
      `UPDATE blog_posts SET
       title = ?, slug = ?, excerpt = ?, content = ?, thumbnail = ?, type = ?, category = ?, author = ?, video_url = ?, published_at = ?, status = ?, display_order = ?
       WHERE id = ?`,
      [
        merged.title,
        merged.slug,
        merged.excerpt || null,
        merged.content || null,
        merged.thumbnail || null,
        merged.type || 'article',
        merged.category || 'General',
        merged.author || null,
        merged.video_url || null,
        publishedAt,
        merged.status || 'draft',
        merged.display_order ?? 0,
        id,
      ]
    );

    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const idx = memoryState.blogPosts.findIndex(p => p.id === id);
      if (idx !== -1) {
        memoryState.blogPosts[idx] = {
          ...memoryState.blogPosts[idx],
          ...data,
          published_at: publishedAt ? String(publishedAt) : undefined,
          updated_at: new Date().toISOString(),
        };
        return true;
      }
      return false;
    }
    throw error;
  }
}

export async function deleteBlogPostDB(id: number): Promise<boolean> {
  try {
    const res = await queryDb('DELETE FROM blog_posts WHERE id = ?', [id]);
    return (res as any).affectedRows > 0;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const initLen = memoryState.blogPosts.length;
      memoryState.blogPosts = memoryState.blogPosts.filter(p => p.id !== id);
      return memoryState.blogPosts.length < initLen;
    }
    throw error;
  }
}


// ====================================================
// 8. APPOINTMENTS & MESSAGES REPOSITORY
// ====================================================

function generateAppointmentReference(): string {
  // Generate 6 uppercase alphanumeric characters using cryptographically secure random bytes
  // Base32 charset avoids easily confused characters (0/O, 1/I)
  const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += charset[bytes[i] % charset.length];
  }
  return `IM-${code}`;
}

export async function createAppointmentDB(data: Omit<Appointment, 'id' | 'appointment_reference' | 'status' | 'created_at'>): Promise<Appointment> {
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const ref = generateAppointmentReference();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    try {
      const res = await queryDb(
        `INSERT INTO appointments
         (appointment_reference, parent_name, child_name, email, phone, child_age, service_id, preferred_date, preferred_time, message, preferred_contact_method, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
        [
          ref,
          data.parent_name,
          data.child_name,
          data.email,
          data.phone,
          data.child_age,
          data.service_id || null,
          data.preferred_date,
          data.preferred_time,
          data.message || null,
          data.preferred_contact_method || 'phone',
          now
        ]
      );

      const insertId = (res as any).insertId;

      return {
        id: insertId,
        appointment_reference: ref,
        ...data,
        status: 'PENDING',
        created_at: now
      };
    } catch (error: any) {
      lastError = error;
      // If collision on unique appointment_reference, retry with a fresh random code
      if (error.message?.includes('Duplicate entry') || error.message?.includes('ER_DUP_ENTRY')) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error('Failed to generate a unique appointment reference.');
}

export async function getAppointmentsDB(): Promise<Appointment[]> {
  const rows = await queryDb(`
    SELECT a.*, s.name as service_name
    FROM appointments a
    LEFT JOIN services s ON a.service_id = s.id
    ORDER BY a.created_at DESC
  `);
  return rows || [];
}

export async function getAppointmentByIdDB(id: number): Promise<(Appointment & { service_name?: string }) | null> {
  const rows = await queryDb(
    `SELECT a.*, s.name as service_name
     FROM appointments a
     LEFT JOIN services s ON a.service_id = s.id
     WHERE a.id = ?
     LIMIT 1`,
    [id]
  );
  if (rows && rows.length > 0) {
    return rows[0];
  }
  return null;
}

export async function updateAppointmentStatusDB(id: number, status: Appointment['status'], admin_notes?: string | null): Promise<boolean> {
  await queryDb('UPDATE appointments SET status = ?, admin_notes = ? WHERE id = ?', [status, admin_notes || null, id]);
  return true;
}

export async function createContactMessageDB(data: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const res = await queryDb(
    `INSERT INTO contact_messages (name, email, phone, subject, message, preferred_contact_method, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'NEW', ?)`,
    [
      data.name,
      data.email,
      data.phone,
      data.subject || null,
      data.message,
      data.preferred_contact_method || 'email',
      now
    ]
  );

  const insertId = (res as any).insertId;

  return {
    id: insertId,
    ...data,
    status: 'NEW',
    created_at: now
  };
}

export async function getContactMessagesDB(): Promise<ContactMessage[]> {
  const rows = await queryDb('SELECT * FROM contact_messages ORDER BY created_at DESC');
  return rows || [];
}

export async function updateContactMessageStatusDB(id: number, status: ContactMessage['status']): Promise<boolean> {
  await queryDb('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
  return true;
}
