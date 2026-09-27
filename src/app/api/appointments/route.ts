import { NextRequest, NextResponse } from 'next/server';
import { AppointmentRequestSchema } from '@/validators/schemas';
import { createAppointmentDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = AppointmentRequestSchema.parse(body);

    const appointment = await createAppointmentDB(validatedData);

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
