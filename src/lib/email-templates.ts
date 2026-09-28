import { Appointment, ContactMessage } from '@/types';
import { SITE } from '@/constants';

interface EmailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

/**
 * Simple HTML entity escaping for user-provided content.
 * Prevents XSS in HTML email templates by escaping HTML special characters.
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const BRAND_NAME = SITE.name || 'INTERACTIVE MINDS';
const BRAND_TAGLINE = SITE.tagline || 'Autism Care & Child Development Centre';
const BRAND_PHONE = SITE.phone || '(555) 234-5678';
const BRAND_EMAIL = SITE.email || 'interactiveminds@gmail.com';
const BRAND_ADDRESS = SITE.address || 'Patna, Bihar';

/**
 * Base email layout wrapper for consistent visual branding
 */
function wrapEmailLayout(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0d9488; padding: 28px 32px; text-align: left;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">${BRAND_NAME}</h1>
              <p style="margin: 4px 0 0 0; color: #ccfbf1; font-size: 13px; font-weight: 500;">${BRAND_TAGLINE}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #334155;">${BRAND_NAME} — ${BRAND_TAGLINE}</p>
              <p style="margin: 0 0 4px 0;"><strong>Address:</strong> ${BRAND_ADDRESS}</p>
              <p style="margin: 0 0 4px 0;"><strong>Phone:</strong> ${BRAND_PHONE} &bull; <strong>Email:</strong> ${BRAND_EMAIL}</p>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">This is an automated notification from the Interactive Minds system.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. Admin Notification: New Appointment Request Submitted
 */
export function appointmentAdminNotificationTemplate(appointment: Appointment & { service_name?: string }): EmailTemplateResult {
  const safeParentName = escapeHtml(appointment.parent_name);
  const safeChildName = escapeHtml(appointment.child_name || 'Not specified');
  const safeChildAge = escapeHtml(appointment.child_age || 'Age not specified');
  const safeEmail = escapeHtml(appointment.email);
  const safePhone = escapeHtml(appointment.phone);
  const safeDate = escapeHtml(appointment.preferred_date || 'Flexible');
  const safeTime = escapeHtml(appointment.preferred_time || 'Any time');
  const safeService = escapeHtml(appointment.service_name || '');
  const safeContactMethod = escapeHtml(appointment.preferred_contact_method || 'Phone');
  const safeMessage = escapeHtml(appointment.message || '');
  const safeRef = escapeHtml(appointment.appointment_reference);

  const subject = `[New Appointment Request] ${safeRef} - ${safeParentName}`;

  const htmlContent = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #fde68a;">
        New Request (${appointment.status || 'PENDING'})
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 18px; color: #0f172a;">New Appointment Assessment Request</h2>
      <p style="margin: 0; font-size: 14px; color: #475569;">A new appointment consultation request has been submitted through the public portal.</p>
    </div>

    <table role="presentation" width="100%" style="border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 38%;">Reference ID:</td>
        <td style="padding: 10px 0; color: #0f172a; font-family: monospace; font-weight: 700;">${safeRef}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Parent / Guardian:</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${safeParentName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Child Name & Age:</td>
        <td style="padding: 10px 0; color: #0f172a;">${safeChildName} (${safeChildAge})</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address:</td>
        <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${safeEmail}" style="color: #0d9488; text-decoration: none;">${safeEmail}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Phone Number:</td>
        <td style="padding: 10px 0; color: #0f172a;"><a href="tel:${safePhone}" style="color: #0d9488; text-decoration: none;">${safePhone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Preferred Date:</td>
        <td style="padding: 10px 0; color: #0f172a;">${safeDate}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Preferred Time Slot:</td>
        <td style="padding: 10px 0; color: #0f172a;">${safeTime}</td>
      </tr>
      ${appointment.service_name ? `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Requested Therapy:</td>
        <td style="padding: 10px 0; color: #0d9488; font-weight: 600;">${safeService}</td>
      </tr>` : ''}
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Preferred Contact:</td>
        <td style="padding: 10px 0; color: #0f172a; text-transform: capitalize;">${safeContactMethod}</td>
      </tr>
    </table>

    ${appointment.message ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Parent Notes / Primary Concerns:</p>
      <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-wrap;">${safeMessage}</p>
    </div>` : ''}

    <p style="margin: 0; font-size: 12px; color: #64748b;">Please log in to the administrative dashboard to review clinical availability and confirm or manage this appointment request.</p>
  `;

  const text = `
NEW APPOINTMENT ASSESSMENT REQUEST
----------------------------------------
Reference ID: ${appointment.appointment_reference}
Status: ${appointment.status || 'PENDING'}

Parent / Guardian: ${appointment.parent_name}
Child Name: ${appointment.child_name || 'Not specified'} (${appointment.child_age || 'Age not specified'})
Email: ${appointment.email}
Phone: ${appointment.phone}
Preferred Date: ${appointment.preferred_date || 'Flexible'}
Preferred Time: ${appointment.preferred_time || 'Any time'}
Requested Therapy: ${appointment.service_name || 'General Assessment'}
Preferred Contact Method: ${appointment.preferred_contact_method || 'Phone'}

Parent Notes:
${appointment.message || 'None provided'}

----------------------------------------
${BRAND_NAME} - ${BRAND_TAGLINE}
  `.trim();

  return {
    subject,
    html: wrapEmailLayout('New Appointment Request', htmlContent),
    text,
  };
}

/**
 * 2. Admin Notification: New Contact Inquiry Submitted
 */
export function contactAdminNotificationTemplate(message: ContactMessage): EmailTemplateResult {
  const safeName = escapeHtml(message.name);
  const safeEmail = escapeHtml(message.email);
  const safePhone = escapeHtml(message.phone);
  const safeSubject = escapeHtml(message.subject || '');
  const safeContactMethod = escapeHtml(message.preferred_contact_method || 'Email');
  const safeMessage = escapeHtml(message.message);

  const subject = `[New Contact Inquiry] ${message.subject ? `${safeSubject} - ` : ''}${safeName}`;

  const htmlContent = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #bae6fd;">
        New Message
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 18px; color: #0f172a;">New Contact Inquiry Received</h2>
      <p style="margin: 0; font-size: 14px; color: #475569;">A visitor has submitted a message via the Interactive Minds contact form.</p>
    </div>

    <table role="presentation" width="100%" style="border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 38%;">Sender Name:</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${safeName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address:</td>
        <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${safeEmail}" style="color: #0d9488; text-decoration: none;">${safeEmail}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Phone Number:</td>
        <td style="padding: 10px 0; color: #0f172a;"><a href="tel:${safePhone}" style="color: #0d9488; text-decoration: none;">${safePhone}</a></td>
      </tr>
      ${message.subject ? `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Subject:</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${safeSubject}</td>
      </tr>` : ''}
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Preferred Method:</td>
        <td style="padding: 10px 0; color: #0f172a; text-transform: capitalize;">${safeContactMethod}</td>
      </tr>
    </table>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Message Content:</p>
      <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-wrap;">${safeMessage}</p>
    </div>

    <p style="margin: 0; font-size: 12px; color: #64748b;">Reply directly to this email or reach out to the sender via their preferred contact method.</p>
  `;

  const text = `
NEW CONTACT INQUIRY
----------------------------------------
Sender Name: ${message.name}
Email: ${message.email}
Phone: ${message.phone}
Subject: ${message.subject || 'General Inquiry'}
Preferred Contact Method: ${message.preferred_contact_method || 'Email'}

Message:
${message.message}

----------------------------------------
${BRAND_NAME} - ${BRAND_TAGLINE}
  `.trim();

  return {
    subject,
    html: wrapEmailLayout('New Contact Inquiry', htmlContent),
    text,
  };
}

/**
 * 3. Patient / Parent Notification: Appointment Confirmed
 */
export function appointmentConfirmedTemplate(appointment: Appointment & { service_name?: string }): EmailTemplateResult {
  const safeParentName = escapeHtml(appointment.parent_name);
  const safeChildName = escapeHtml(appointment.child_name || 'your child');
  const safeRef = escapeHtml(appointment.appointment_reference);
  const safeDate = escapeHtml(appointment.preferred_date);
  const safeTime = escapeHtml(appointment.preferred_time);
  const safeService = escapeHtml(appointment.service_name || '');
  const safeAdminNotes = escapeHtml(appointment.admin_notes || '');

  const subject = `Appointment Confirmed - Reference #${safeRef} | ${BRAND_NAME}`;

  const htmlContent = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #a7f3d0;">
        CONFIRMED
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 18px; color: #0f172a;">Your Appointment Request is Confirmed</h2>
      <p style="margin: 0; font-size: 14px; color: #475569;">Dear ${safeParentName},</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #475569;">We are pleased to inform you that your appointment request for ${safeChildName} has been confirmed by our clinical team at ${BRAND_NAME}.</p>
    </div>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #166534; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Details</h3>
      <table role="presentation" width="100%" style="border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #dcfce7;">
          <td style="padding: 8px 0; font-weight: 600; color: #15803d; width: 40%;">Reference Number:</td>
          <td style="padding: 8px 0; color: #0f172a; font-family: monospace; font-weight: 700;">${safeRef}</td>
        </tr>
        <tr style="border-bottom: 1px solid #dcfce7;">
          <td style="padding: 8px 0; font-weight: 600; color: #15803d;">Child Name:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${safeChildName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #dcfce7;">
          <td style="padding: 8px 0; font-weight: 600; color: #15803d;">Date:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${safeDate}</td>
        </tr>
        <tr style="border-bottom: 1px solid #dcfce7;">
          <td style="padding: 8px 0; font-weight: 600; color: #15803d;">Time Slot:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${safeTime}</td>
        </tr>
        ${appointment.service_name ? `
        <tr style="border-bottom: 1px solid #dcfce7;">
          <td style="padding: 8px 0; font-weight: 600; color: #15803d;">Program / Therapy:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${safeService}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #15803d;">Centre Location:</td>
          <td style="padding: 8px 0; color: #0f172a;">${BRAND_ADDRESS}</td>
        </tr>
      </table>
    </div>

    ${appointment.admin_notes ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Note from our Clinical Team:</p>
      <p style="margin: 0; font-size: 13px; color: #334155;">${safeAdminNotes}</p>
    </div>` : ''}

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e293b;">Important Instructions for Your Visit:</p>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 6px;">Please arrive 10 minutes prior to your scheduled time.</li>
        <li style="margin-bottom: 6px;">Please bring any previous developmental or medical assessment reports if available.</li>
        <li>If you need to reschedule or have any questions, please contact our team at <strong>${BRAND_PHONE}</strong> or reply to this email.</li>
      </ul>
    </div>
  `;

  const text = `
APPOINTMENT CONFIRMATION
----------------------------------------
Dear ${appointment.parent_name},

Your appointment request for ${appointment.child_name || 'your child'} at ${BRAND_NAME} has been confirmed.

Reference ID: ${appointment.appointment_reference}
Status: CONFIRMED
Date: ${appointment.preferred_date}
Time Slot: ${appointment.preferred_time}
Program: ${appointment.service_name || 'Developmental Assessment'}
Location: ${BRAND_ADDRESS}

${appointment.admin_notes ? `Notes from our team:\n${appointment.admin_notes}\n` : ''}
Important Instructions:
- Please arrive 10 minutes prior to your scheduled time.
- Please bring any previous developmental assessment reports if available.
- For rescheduling or questions, please contact ${BRAND_PHONE} or ${BRAND_EMAIL}.

----------------------------------------
${BRAND_NAME} - ${BRAND_TAGLINE}
  `.trim();

  return {
    subject,
    html: wrapEmailLayout('Appointment Confirmed', htmlContent),
    text,
  };
}

/**
 * 4. Patient / Parent Notification: Appointment Cancelled
 */
export function appointmentCancelledTemplate(appointment: Appointment & { service_name?: string }): EmailTemplateResult {
  const safeParentName = escapeHtml(appointment.parent_name);
  const safeChildName = escapeHtml(appointment.child_name || 'your child');
  const safeRef = escapeHtml(appointment.appointment_reference);
  const safeDate = escapeHtml(appointment.preferred_date);
  const safeTime = escapeHtml(appointment.preferred_time);
  const safeAdminNotes = escapeHtml(appointment.admin_notes || '');

  const subject = `Appointment Update - Reference #${safeRef} | ${BRAND_NAME}`;

  const htmlContent = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #fecaca;">
        CANCELLED
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 18px; color: #0f172a;">Appointment Cancellation Notice</h2>
      <p style="margin: 0; font-size: 14px; color: #475569;">Dear ${safeParentName},</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #475569;">This is to notify you that your appointment request (Reference #${safeRef}) for ${safeChildName} has been cancelled.</p>
    </div>

    <table role="presentation" width="100%" style="border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 38%;">Reference ID:</td>
        <td style="padding: 10px 0; color: #0f172a; font-family: monospace; font-weight: 700;">${safeRef}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Scheduled Date:</td>
        <td style="padding: 10px 0; color: #0f172a;">${safeDate}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Scheduled Time:</td>
        <td style="padding: 10px 0; color: #0f172a;">${safeTime}</td>
      </tr>
    </table>

    ${appointment.admin_notes ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Cancellation Reason / Notes:</p>
      <p style="margin: 0; font-size: 13px; color: #334155;">${safeAdminNotes}</p>
    </div>` : ''}

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
      <p style="margin: 0 0 8px 0;">If you would like to reschedule your consultation, or if you believe this cancellation was made in error, please contact our centre team directly:</p>
      <p style="margin: 0;"><strong>Phone:</strong> ${BRAND_PHONE} &bull; <strong>Email:</strong> <a href="mailto:${BRAND_EMAIL}" style="color: #0d9488; text-decoration: none;">${BRAND_EMAIL}</a></p>
    </div>
  `;

  const text = `
APPOINTMENT CANCELLATION NOTICE
----------------------------------------
Dear ${appointment.parent_name},

This notice is to confirm that your appointment request (Reference #${appointment.appointment_reference}) for ${appointment.child_name || 'your child'} has been cancelled.

Scheduled Date: ${appointment.preferred_date}
Scheduled Time: ${appointment.preferred_time}

${appointment.admin_notes ? `Cancellation Notes:\n${appointment.admin_notes}\n` : ''}
To reschedule or for any questions, please contact:
Phone: ${BRAND_PHONE}
Email: ${BRAND_EMAIL}

----------------------------------------
${BRAND_NAME} - ${BRAND_TAGLINE}
  `.trim();

  return {
    subject,
    html: wrapEmailLayout('Appointment Cancelled', htmlContent),
    text,
  };
}
