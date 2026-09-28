import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageSchema } from '@/validators/schemas';
import { createContactMessageDB } from '@/lib/db';
import { sendContactAdminNotification } from '@/lib/email';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check for public contact form
    const identifier = getRateLimitIdentifier(req);
    const limitResult = checkRateLimit(identifier, 10, 60_000); // 10 requests per minute
    if (!limitResult.allowed) {
      const retryAfterSeconds = Math.ceil(limitResult.resetInMs / 1000);
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const validatedData = ContactMessageSchema.parse(body);

    const message = await createContactMessageDB(validatedData);

    // Trigger secondary email notification (isolated from DB outcome)
    sendContactAdminNotification(message).catch((emailErr) => {
      console.error('[EMAIL] Background contact notification error:', emailErr);
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting Interactive Minds. We have received your message and will get back to you shortly.',
      data: { id: message.id, status: message.status },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Contact form submission error:', error.message || error);
    return NextResponse.json(
      { success: false, error: 'Unable to submit your message. Please try again later.' },
      { status: 500 }
    );
  }
}
