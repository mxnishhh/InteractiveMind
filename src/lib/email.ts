import nodemailer, { Transporter } from 'nodemailer';
import { Appointment, ContactMessage } from '@/types';
import {
  appointmentAdminNotificationTemplate,
  contactAdminNotificationTemplate,
  appointmentConfirmedTemplate,
  appointmentCancelledTemplate,
} from '@/lib/email-templates';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

let transporter: Transporter | null = null;

/**
 * Validates whether essential SMTP environment variables are set.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && (process.env.SMTP_USER || process.env.SMTP_PASS || process.env.SMTP_PASSWORD));
}

/**
 * Returns the designated administrator notification email address.
 */
export function getAdminNotificationEmail(): string {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    'admin@interactivemind.in'
  );
}

/**
 * Returns default sender address.
 */
export function getFromEmail(): string {
  return (
    process.env.SMTP_FROM ||
    '"Interactive Minds" <noreply@interactivemind.in>'
  );
}

/**
 * Initializes or reuses the Nodemailer SMTP transporter.
 */
function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  const secure = port === 465 || process.env.SMTP_SECURE === 'true';

  if (!host) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });

  return transporter;
}

/**
 * Core email dispatcher with strict error isolation and structured logging.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const { to, subject, html, text, replyTo } = options;

  if (!to || !to.includes('@')) {
    console.warn(`[EMAIL] Invalid recipient email address: "${to}". Skipping.`);
    return false;
  }

  if (!isEmailConfigured()) {
    console.log(`[EMAIL] SMTP is not configured in environment. Notification to "${to}" with subject "${subject}" was skipped.`);
    return false;
  }

  const mailer = getTransporter();
  if (!mailer) {
    console.warn(`[EMAIL] Failed to initialize SMTP transporter. Skipping email to "${to}".`);
    return false;
  }

  try {
    const info = await mailer.sendMail({
      from: getFromEmail(),
      to,
      replyTo,
      subject,
      text,
      html,
    });

    console.log(`[EMAIL] Email successfully sent to ${to}. MessageId: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error(`[EMAIL] Failed to send email to ${to}:`, error.message || error);
    return false;
  }
}

/**
 * 1. Sends an admin notification email when a new appointment is requested.
 */
export async function sendAppointmentAdminNotification(
  appointment: Appointment & { service_name?: string }
): Promise<boolean> {
  try {
    const adminEmail = getAdminNotificationEmail();
    const { subject, html, text } = appointmentAdminNotificationTemplate(appointment);

    const success = await sendEmail({
      to: adminEmail,
      replyTo: appointment.email,
      subject,
      html,
      text,
    });

    if (success) {
      console.log(`[EMAIL] Appointment notification sent for reference #${appointment.appointment_reference}`);
    }
    return success;
  } catch (error: any) {
    console.error('[EMAIL] Failed to dispatch appointment admin notification:', error.message || error);
    return false;
  }
}

/**
 * 2. Sends an admin notification email when a new contact message is received.
 */
export async function sendContactAdminNotification(
  message: ContactMessage
): Promise<boolean> {
  try {
    const adminEmail = getAdminNotificationEmail();
    const { subject, html, text } = contactAdminNotificationTemplate(message);

    const success = await sendEmail({
      to: adminEmail,
      replyTo: message.email,
      subject,
      html,
      text,
    });

    if (success) {
      console.log(`[EMAIL] Contact notification sent for message from ${message.name}`);
    }
    return success;
  } catch (error: any) {
    console.error('[EMAIL] Failed to dispatch contact admin notification:', error.message || error);
    return false;
  }
}

/**
 * 3. Sends a status update email to the patient/parent when an appointment status changes.
 */
export async function sendAppointmentStatusNotification(
  appointment: Appointment & { service_name?: string },
  newStatus: string,
  oldStatus?: string
): Promise<boolean> {
  if (!appointment.email || !appointment.email.includes('@')) {
    console.log(`[EMAIL] No valid recipient email for appointment reference #${appointment.appointment_reference}. Status update email skipped.`);
    return false;
  }

  // Only notify on meaningful transitions
  const isConfirmed = newStatus === 'CONFIRMED' && oldStatus !== 'CONFIRMED';
  const isCancelled = newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED';

  if (!isConfirmed && !isCancelled) {
    return false;
  }

  try {
    if (isConfirmed) {
      const { subject, html, text } = appointmentConfirmedTemplate(appointment);
      const success = await sendEmail({
        to: appointment.email,
        subject,
        html,
        text,
      });
      if (success) {
        console.log(`[EMAIL] Appointment confirmation sent to ${appointment.email} for reference #${appointment.appointment_reference}`);
      }
      return success;
    }

    if (isCancelled) {
      const { subject, html, text } = appointmentCancelledTemplate(appointment);
      const success = await sendEmail({
        to: appointment.email,
        subject,
        html,
        text,
      });
      if (success) {
        console.log(`[EMAIL] Appointment cancellation sent to ${appointment.email} for reference #${appointment.appointment_reference}`);
      }
      return success;
    }

    return false;
  } catch (error: any) {
    console.error('[EMAIL] Failed to dispatch appointment status notification:', error.message || error);
    return false;
  }
}
