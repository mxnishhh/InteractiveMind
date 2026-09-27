import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { updateContactMessageStatusDB } from '@/lib/db';
import { MessageStatusUpdateSchema } from '@/validators/schemas';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdminApi(req);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid message ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status } = MessageStatusUpdateSchema.parse(body);

    const updated = await updateContactMessageStatusDB(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message status updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Invalid status data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}
