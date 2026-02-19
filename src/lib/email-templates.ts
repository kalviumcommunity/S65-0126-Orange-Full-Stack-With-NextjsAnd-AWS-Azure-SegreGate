/**
 * Email Templates for SegreGate
 * Transactional email content for various user actions
 */

import { sendEmail } from './sendgrid';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const APP_NAME = 'SegreGate';

/**
 * Base email wrapper template
 */
function emailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #16a34a; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ♻️ ${APP_NAME}
              </h1>
              <p style="margin: 8px 0 0; color: #dcfce7; font-size: 14px;">
                Community-Driven Waste Segregation
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
                © ${new Date().getFullYear()} ${APP_NAME}. Building cleaner communities together.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                <a href="${APP_URL}" style="color: #16a34a; text-decoration: none;">Visit Dashboard</a> •
                <a href="${APP_URL}/contact" style="color: #16a34a; text-decoration: none;">Contact Support</a>
              </p>
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
 * Welcome email for new users
 */
export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">Welcome to ${APP_NAME}, ${name}!</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Thank you for joining our community as a <strong>${role}</strong>. Together, we're making waste segregation easier and more effective.
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      ${
        role === 'user'
          ? 'You can now start submitting waste segregation reports and track your contribution to a cleaner environment.'
          : role === 'volunteer'
            ? 'As a volunteer, you can verify submitted reports and help maintain community standards.'
            : 'As an admin, you have full access to monitor compliance and manage the platform.'
      }
    </p>
    <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      <tr>
        <td style="background-color: #16a34a; border-radius: 6px; padding: 14px 28px;">
          <a href="${APP_URL}/dashboard" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
      Need help getting started? Check out our <a href="${APP_URL}/about" style="color: #16a34a;">About page</a> or <a href="${APP_URL}/contact" style="color: #16a34a;">contact support</a>.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Welcome to ${APP_NAME}!`,
    html: emailTemplate(content),
  });
}

/**
 * Report submission confirmation
 */
export async function sendReportSubmittedEmail(to: string, name: string, reportId: number) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">Report Submitted Successfully</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Your waste segregation report <strong>#${reportId}</strong> has been submitted and is now pending verification.
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      Our volunteers will review your submission shortly. You'll receive an email once the verification is complete.
    </p>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="background-color: #16a34a; border-radius: 6px; padding: 14px 28px;">
          <a href="${APP_URL}/reports" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            View My Reports
          </a>
        </td>
      </tr>
    </table>
  `;

  return sendEmail({
    to,
    subject: `Report #${reportId} Submitted`,
    html: emailTemplate(content),
  });
}

/**
 * Report approved notification
 */
export async function sendReportApprovedEmail(to: string, name: string, reportId: number) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #16a34a; font-size: 24px;">✅ Report Approved!</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Great news! Your waste segregation report <strong>#${reportId}</strong> has been verified and approved.
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      Thank you for your commitment to proper waste segregation. Your contribution helps create a cleaner, greener community.
    </p>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="background-color: #16a34a; border-radius: 6px; padding: 14px 28px;">
          <a href="${APP_URL}/reports" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            View Report Details
          </a>
        </td>
      </tr>
    </table>
  `;

  return sendEmail({
    to,
    subject: `Report #${reportId} Approved`,
    html: emailTemplate(content),
  });
}

/**
 * Report rejected notification
 */
export async function sendReportRejectedEmail(
  to: string,
  name: string,
  reportId: number,
  reason?: string,
) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #dc2626; font-size: 24px;">Report Needs Attention</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Your waste segregation report <strong>#${reportId}</strong> has been reviewed and requires resubmission.
    </p>
    ${
      reason
        ? `<p style="margin: 0 0 16px; padding: 16px; background-color: #fef2f2; border-left: 4px solid #dc2626; color: #991b1b; font-size: 14px; line-height: 1.5;">
      <strong>Reason:</strong> ${reason}
    </p>`
        : ''
    }
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      Please review the guidelines and submit a new report with the correct information.
    </p>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="background-color: #16a34a; border-radius: 6px; padding: 14px 28px;">
          <a href="${APP_URL}/reports/new" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            Submit New Report
          </a>
        </td>
      </tr>
    </table>
  `;

  return sendEmail({
    to,
    subject: `Report #${reportId} Needs Resubmission`,
    html: emailTemplate(content),
  });
}

/**
 * Volunteer notification: New report to verify
 */
export async function sendNewReportToVolunteerEmail(to: string, name: string, reportId: number) {
  const content = `
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">New Report Ready for Verification</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      A new waste segregation report <strong>#${reportId}</strong> has been submitted and is awaiting your verification.
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      Please review the report and approve or reject it based on the segregation standards.
    </p>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="background-color: #16a34a; border-radius: 6px; padding: 14px 28px;">
          <a href="${APP_URL}/reports/verify" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            Verify Reports
          </a>
        </td>
      </tr>
    </table>
  `;

  return sendEmail({
    to,
    subject: `New Report #${reportId} Awaiting Verification`,
    html: emailTemplate(content),
  });
}

/**
 * Password reset email (for future implementation)
 */
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">Reset Your Password</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      <tr>
        <td style="background-color: #16a34a; border-radius: 6px; padding: 14px 28px;">
          <a href="${resetUrl}" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.5;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
    <p style="margin: 0; padding: 12px; background-color: #f9fafb; border-radius: 4px; color: #6b7280; font-size: 12px; font-family: monospace;">
      ${resetUrl}
    </p>
  `;

  return sendEmail({
    to,
    subject: 'Reset Your Password',
    html: emailTemplate(content),
  });
}
