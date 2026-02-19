/**
 * SendGrid Email Integration
 * Handles transactional emails for SegreGate
 */

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@segregate.app';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'SegreGate';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send a single email via SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[SendGrid] API key not configured. Email not sent.');
    return false;
  }

  try {
    await sgMail.send({
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
    });

    console.log(`[SendGrid] Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error('[SendGrid] Failed to send email:', error);
    return false;
  }
}

/**
 * Send multiple emails in bulk
 */
export async function sendBulkEmails(emails: EmailOptions[]): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[SendGrid] API key not configured. Bulk email not sent.');
    return false;
  }

  try {
    const messages = emails.map((email) => ({
      to: email.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: email.subject,
      html: email.html,
      text: email.text || stripHtml(email.html),
    }));

    await sgMail.send(messages);
    console.log(`[SendGrid] Sent ${emails.length} bulk emails`);
    return true;
  } catch (error) {
    console.error('[SendGrid] Failed to send bulk emails:', error);
    return false;
  }
}

/**
 * Simple HTML to text conversion
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}
