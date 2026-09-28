import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { queryDb } from './db';
import { AdminUser } from '@/types';

/**
 * JWT secret is read strictly from the environment.
 * A missing secret in production is a fatal configuration error.
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start insecurely.');
  }
  console.warn('[AUTH] JWT_SECRET is not set. Using a temporary development-only secret. DO NOT deploy like this.');
}

export const AUTH_COOKIE_NAME = 'admin_token';

/**
 * Enforce a minimum secret length to prevent trivially weak tokens.
 */
function assertSecretStrength(): string {
  const secret = JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET must be at least 32 characters in production.');
    }
    console.warn('[AUTH] JWT_SECRET is shorter than 32 characters. This is insecure for production use.');
  }
  return secret || '';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    return false;
  }
}

export function generateToken(user: AdminUser): string {
  const secret = assertSecretStrength();
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    { expiresIn: '8h' }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const secret = assertSecretStrength();
    const decoded = jwt.verify(token, secret) as any;
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (e) {
    return null;
  }
}

export async function authenticateAdminByEmail(email: string, pass: string): Promise<AdminUser | null> {
  if (!email || typeof email !== 'string' || !pass || typeof pass !== 'string') {
    return null;
  }

  let dbUser = null;
  try {
    const rows = await queryDb('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    if (rows && rows.length > 0) {
      dbUser = rows[0];
    }
  } catch (e) {
    // Database unreachable — do NOT silently fall back to hardcoded credentials.
    console.error('[AUTH] Failed to query admin_users table during authentication:', e);
    return null;
  }

  if (!dbUser) {
    return null;
  }

  const valid = await verifyPassword(pass, dbUser.password_hash);
  if (!valid) return null;

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };
}

export function getAdminFromRequest(req: NextRequest): AdminUser | null {
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookieToken || headerToken;

  if (!token) return null;
  return verifyToken(token);
}

export function requireAdminApi(req: NextRequest): { authenticated: boolean; user?: AdminUser; errorResponse?: NextResponse } {
  const user = getAdminFromRequest(req);
  if (!user) {
    return {
      authenticated: false,
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      ),
    };
  }
  return { authenticated: true, user };
}
