import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { updateAppointmentStatusDB } from '@/lib/db';
import { AppointmentStatusUpdateSchema } from '@/validators/schemas';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid appointment ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status, admin_notes } = AppointmentStatusUpdateSchema.parse(body);

    const updated = await updateAppointmentStatusDB(id, status, admin_notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Appointment status updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Invalid status data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update appointment' }, { status: 500 });
  }
}
