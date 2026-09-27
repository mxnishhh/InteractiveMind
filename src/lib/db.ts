import mysql from 'mysql2/promise';
import { 
  INITIAL_SERVICES, 
  INITIAL_CONDITIONS, 
  INITIAL_FAQS, 
  INITIAL_SITE_SETTINGS, 
  INITIAL_TEAM_MEMBERS,
  INITIAL_TESTIMONIALS,
  INITIAL_MEDIA 
} from './site-data';
import { Appointment, ContactMessage, Service, Condition, FAQ, TeamMember, Testimonial, MediaItem, SiteSettings } from '@/types';

// In-memory fallback database state
let memoryState = {
  services: [...INITIAL_SERVICES],
  conditions: [...INITIAL_CONDITIONS],
  faqs: [...INITIAL_FAQS],
  settings: { ...INITIAL_SITE_SETTINGS },
  team: [...INITIAL_TEAM_MEMBERS],
  testimonials: [...INITIAL_TESTIMONIALS],
  media: [...INITIAL_MEDIA],
  appointments: [] as Appointment[],
  messages: [] as ContactMessage[],
  nextAppointmentId: 1,
  nextMessageId: 1,
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
      pool = mysql.createPool({
        host,
        port: Number(process.env.DB_PORT || 3306),
        user,
        password: password || '',
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      return pool;
    } catch (e) {
      console.warn('MySQL pool creation failed, falling back to memory store:', e);
      pool = null;
    }
  }
  return null;
}

export async function queryDb<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  if (!p) {
    throw new Error('No DB connection available');
  }
  const [rows] = await p.execute(sql, params);
  return rows as T[];
}

// ----------------------------------------------------
// DB Services & Repositories with In-Memory Fallback
// ----------------------------------------------------

export async function getServicesDB(): Promise<Service[]> {
  try {
    const rows = await queryDb('SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback to memory
  }
  return memoryState.services.filter(s => s.active);
}

export async function getAllServicesDB(): Promise<Service[]> {
  try {
    const rows = await queryDb('SELECT * FROM services ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.services;
}

export async function getServiceBySlugDB(slug: string): Promise<Service | null> {
  try {
    const rows = await queryDb('SELECT * FROM services WHERE slug = ? LIMIT 1', [slug]);
    if (rows && rows.length > 0) return rows[0];
  } catch (e) {
    // Fallback
  }
  const found = memoryState.services.find(s => s.slug === slug);
  return found || null;
}

export async function getConditionsDB(): Promise<Condition[]> {
  try {
    const rows = await queryDb('SELECT * FROM conditions WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.conditions.filter(c => c.active);
}

export async function getAllConditionsDB(): Promise<Condition[]> {
  try {
    const rows = await queryDb('SELECT * FROM conditions ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.conditions;
}

export async function getConditionBySlugDB(slug: string): Promise<Condition | null> {
  try {
    const rows = await queryDb('SELECT * FROM conditions WHERE slug = ? LIMIT 1', [slug]);
    if (rows && rows.length > 0) return rows[0];
  } catch (e) {
    // Fallback
  }
  const found = memoryState.conditions.find(c => c.slug === slug);
  return found || null;
}

export async function getFaqsDB(): Promise<FAQ[]> {
  try {
    const rows = await queryDb('SELECT * FROM faqs WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.faqs.filter(f => f.active);
}

export async function getAllFaqsDB(): Promise<FAQ[]> {
  try {
    const rows = await queryDb('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.faqs;
}

export async function getSiteSettingsDB(): Promise<SiteSettings> {
  try {
    const rows = await queryDb('SELECT setting_key, setting_value FROM site_settings');
    if (rows && rows.length > 0) {
      const settingsMap = { ...INITIAL_SITE_SETTINGS };
      rows.forEach((r: { setting_key: string; setting_value: string }) => {
        settingsMap[r.setting_key] = r.setting_value;
      });
      return settingsMap;
    }
  } catch (e) {
    // Fallback
  }
  return memoryState.settings;
}

export async function updateSiteSettingsDB(key: string, value: string): Promise<void> {
  try {
    await queryDb(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
      [key, value]
    );
  } catch (e) {
    // Fallback
  }
  memoryState.settings[key] = value;
}

export async function createAppointmentDB(data: Omit<Appointment, 'id' | 'appointment_reference' | 'status' | 'created_at'>): Promise<Appointment> {
  const ref = 'IM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
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
    const insertId = (res as any).insertId || memoryState.nextAppointmentId++;
    return {
      id: insertId,
      appointment_reference: ref,
      ...data,
      status: 'PENDING',
      created_at: now
    };
  } catch (e) {
    console.warn('DB appointment creation failed, writing to memory state:', e);
  }

  const appt: Appointment = {
    id: memoryState.nextAppointmentId++,
    appointment_reference: ref,
    ...data,
    status: 'PENDING',
    created_at: now
  };
  memoryState.appointments.unshift(appt);
  return appt;
}

export async function getAppointmentsDB(): Promise<Appointment[]> {
  try {
    const rows = await queryDb(`
      SELECT a.*, s.name as service_name 
      FROM appointments a 
      LEFT JOIN services s ON a.service_id = s.id 
      ORDER BY a.created_at DESC
    `);
    if (rows) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.appointments;
}

export async function updateAppointmentStatusDB(id: number, status: Appointment['status'], admin_notes?: string): Promise<boolean> {
  try {
    await queryDb('UPDATE appointments SET status = ?, admin_notes = ? WHERE id = ?', [status, admin_notes || null, id]);
    return true;
  } catch (e) {
    // Fallback
  }
  const appt = memoryState.appointments.find(a => a.id === id);
  if (appt) {
    appt.status = status;
    if (admin_notes !== undefined) appt.admin_notes = admin_notes;
    return true;
  }
  return false;
}

export async function createContactMessageDB(data: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  try {
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
    const insertId = (res as any).insertId || memoryState.nextMessageId++;
    return {
      id: insertId,
      ...data,
      status: 'NEW',
      created_at: now
    };
  } catch (e) {
    console.warn('DB contact creation failed, writing to memory state:', e);
  }

  const msg: ContactMessage = {
    id: memoryState.nextMessageId++,
    ...data,
    status: 'NEW',
    created_at: now
  };
  memoryState.messages.unshift(msg);
  return msg;
}

export async function getContactMessagesDB(): Promise<ContactMessage[]> {
  try {
    const rows = await queryDb('SELECT * FROM contact_messages ORDER BY created_at DESC');
    if (rows) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.messages;
}

export async function updateContactMessageStatusDB(id: number, status: ContactMessage['status']): Promise<boolean> {
  try {
    await queryDb('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    return true;
  } catch (e) {
    // Fallback
  }
  const msg = memoryState.messages.find(m => m.id === id);
  if (msg) {
    msg.status = status;
    return true;
  }
  return false;
}

export async function getTeamMembersDB(): Promise<TeamMember[]> {
  try {
    const rows = await queryDb('SELECT * FROM team_members WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.team.filter(t => t.active);
}

export async function getAllTeamMembersDB(): Promise<TeamMember[]> {
  try {
    const rows = await queryDb('SELECT * FROM team_members ORDER BY display_order ASC, id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.team;
}

export async function getTestimonialsDB(): Promise<Testimonial[]> {
  try {
    const rows = await queryDb('SELECT * FROM testimonials WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.testimonials.filter(t => t.active);
}

export async function getMediaDB(): Promise<MediaItem[]> {
  try {
    const rows = await queryDb('SELECT * FROM media WHERE active = 1 ORDER BY display_order ASC, id ASC');
    if (rows) return rows;
  } catch (e) {
    // Fallback
  }
  return memoryState.media.filter(m => m.active);
}
