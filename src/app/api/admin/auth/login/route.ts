import { NextRequest, NextResponse } from 'next/server';
import { AdminLoginSchema } from '@/validators/schemas';
import { authenticateAdminByEmail, generateToken } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check for admin login (brute-force protection)
    const identifier = getRateLimitIdentifier(req);
    const limitResult = checkRateLimit(identifier, 5, 60_000); // 5 attempts per minute
    if (!limitResult.allowed) {
      const retryAfterSeconds = Math.ceil(limitResult.resetInMs / 1000);
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const validatedData = AdminLoginSchema.parse(body);

    const user = await authenticateAdminByEmail(validatedData.email, validatedData.password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    const response = NextResponse.json({ success: true, message: 'Login successful.' });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });
    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Admin login error:', error.message || error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again later.' },
      { status: 500 }
    );
  }
}
