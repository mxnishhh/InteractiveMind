import { NextRequest, NextResponse } from 'next/server';
import { AdminLoginSchema } from '@/validators/schemas';
import { authenticateAdminByEmail, generateToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = AdminLoginSchema.parse(body);

    const user = await authenticateAdminByEmail(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input fields', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unexpected authentication error occurred' },
      { status: 500 }
    );
  }
}
