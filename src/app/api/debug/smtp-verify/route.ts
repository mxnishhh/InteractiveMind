import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass =
    process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return NextResponse.json({
      success: false,
      stage: 'configuration',
      host: Boolean(host),
      user: Boolean(user),
      password: Boolean(pass),
    }, { status: 500 });
  }

  const secure =
    port === 465 || process.env.SMTP_SECURE === 'true';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: true,
    },
  });

  try {
    await transporter.verify();

    return NextResponse.json({
      success: true,
      stage: 'smtp-verify',
      host,
      port,
      secure,
      durationMs: Date.now() - started,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      stage: 'smtp-verify',
      host,
      port,
      secure,
      error: error?.message || String(error),
      code: error?.code || null,
      command: error?.command || null,
      responseCode: error?.responseCode || null,
      durationMs: Date.now() - started,
    }, { status: 502 });
  } finally {
    transporter.close();
  }
}
