import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageSchema } from '@/validators/schemas';
import { createContactMessageDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = ContactMessageSchema.parse(body);

    const message = await createContactMessageDB(validatedData);

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
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to submit your message. Please try again later.' },
      { status: 500 }
    );
  }
}
