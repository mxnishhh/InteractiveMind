import { NextRequest, NextResponse } from 'next/server';
import { AppointmentRequestSchema } from '@/validators/schemas';
import { createAppointmentDB, getServiceByIdDB } from '@/lib/db';
import { sendAppointmentAdminNotification } from '@/lib/email';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check for public appointment form
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
    const validatedData = AppointmentRequestSchema.parse(body);

    const appointment = await createAppointmentDB(validatedData);

    // Fetch service name for email readability if service_id was provided
    let serviceName: string | undefined = undefined;
    if (appointment.service_id) {
      try {
        const service = await getServiceByIdDB(appointment.service_id);
        if (service) serviceName = service.name;
      } catch (e) {
        // Non-critical fallback
      }
    }

    // Trigger secondary email notification (isolated from DB outcome)
    sendAppointmentAdminNotification({
      ...appointment,
      service_name: serviceName,
    }).catch((emailErr) => {
      console.error('[EMAIL] Background notification dispatch error:', emailErr);
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your appointment request has been submitted successfully.',
      data: {
        reference: appointment.appointment_reference,
        parent_name: appointment.parent_name,
        child_name: appointment.child_name,
        preferred_date: appointment.preferred_date,
        preferred_time: appointment.preferred_time,
        status: appointment.status,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process appointment request. Please try again later.' },
      { status: 500 }
    );
  }
}
