/**
 * SendGrid Email Integration - Integration Guide
 * 
 * This file shows HOW to integrate email notifications into your API routes.
 * These are code snippets to copy into your route handlers - NOT executable in this file.
 */

// ============================================================================
// INTEGRATION GUIDE: Where to add email notifications
// ============================================================================

/**
 * STEP 1: User Signup (app/api/auth/signup/route.ts)
 * 
 * After creating a new user, send welcome email:
 * 
 * ---CODE TO ADD---
 * import { sendWelcomeEmail } from '@/src/lib/email-templates';
 * 
 * const user = await prisma.user.create({
 *   data: { name, email, password: hashedPassword, role },
 * });
 * 
 * // Send welcome email (non-blocking)
 * sendWelcomeEmail(user.email, user.name, user.role).catch((err) =>
 *   console.error('Failed to send welcome email:', err)
 * );
 * ---END CODE---
 */

/**
 * STEP 2: Report Creation (app/api/reports/route.ts - POST)
 * 
 * After creating a report, notify user and volunteers:
 * 
 * ---CODE TO ADD---
 * import { 
 *   sendReportSubmittedEmail, 
 *   sendNewReportToVolunteerEmail 
 * } from '@/src/lib/email-templates';
 * 
 * const report = await prisma.report.create({ data: validatedData });
 * const user = await prisma.user.findUnique({ where: { id: report.userId } });
 * 
 * if (user) {
 *   sendReportSubmittedEmail(user.email, user.name, report.id).catch(console.error);
 * }
 * 
 * // Notify volunteers about new report
 * const volunteers = await prisma.user.findMany({
 *   where: { role: { in: ['volunteer', 'admin'] } },
 *   select: { email: true, name: true },
 * });
 * 
 * volunteers.forEach((volunteer) => {
 *   sendNewReportToVolunteerEmail(
 *     volunteer.email, 
 *     volunteer.name, 
 *     report.id
 *   ).catch(console.error);
 * });
 * ---END CODE---
 */

/**
 * STEP 3: Report Status Update (app/api/reports/[id]/route.ts - PUT)
 * 
 * When report status changes to approved/rejected, notify user:
 * 
 * ---CODE TO ADD---
 * import {
 *   sendReportApprovedEmail,
 *   sendReportRejectedEmail
 * } from '@/src/lib/email-templates';
 * 
 * const report = await prisma.report.update({
 *   where: { id: reportId },
 *   data: validatedData,
 *   include: { user: true },
 * });
 * 
 * // Send email if status changed
 * if (validatedData.status && report.user) {
 *   if (validatedData.status === 'approved') {
 *     sendReportApprovedEmail(
 *       report.user.email,
 *       report.user.name,
 *       report.id
 *     ).catch(console.error);
 *   } else if (validatedData.status === 'rejected') {
 *     sendReportRejectedEmail(
 *       report.user.email,
 *       report.user.name,
 *       report.id
 *     ).catch(console.error);
 *   }
 * }
 * ---END CODE---
 */

/**
 * CUSTOM EMAILS
 * 
 * Use sendEmail() to send any custom email:
 * 
 * ---CODE TO ADD---
 * import { sendEmail } from '@/src/lib/sendgrid';
 * 
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Custom Subject',
 *   html: '<h1>Hello!</h1><p>Custom message here.</p>',
 *   text: 'Hello! Custom message here.', // Optional
 * });
 * ---END CODE---
 */

/**
 * BULK EMAILS
 * 
 * Send to many users at once (announcements, etc):
 * 
 * ---CODE TO ADD---
 * import { sendBulkEmails } from '@/src/lib/sendgrid';
 * 
 * const users = await prisma.user.findMany({
 *   select: { email: true, name: true },
 * });
 * 
 * const emails = users.map((user) => ({
 *   to: user.email,
 *   subject: 'Announcement Subject',
 *   html: `<p>Hi ${user.name},</p><p>Announcement content here.</p>`,
 * }));
 * 
 * await sendBulkEmails(emails);
 * ---END CODE---
 */

// ============================================================================
// AVAILABLE EMAIL TEMPLATES
// ============================================================================

/**
 * From '@/src/lib/email-templates':
 * 
 * 1. sendWelcomeEmail(to, name, role)
 *    - Sent after user signup
 *    - Personalized based on role (user/volunteer/admin)
 * 
 * 2. sendReportSubmittedEmail(to, name, reportId)
 *    - Sent after user submits a report
 *    - Includes link to view report
 * 
 * 3. sendReportApprovedEmail(to, name, reportId)
 *    - Sent when report is approved by volunteer
 *    - Congratulates user on proper segregation
 * 
 * 4. sendReportRejectedEmail(to, name, reportId, reason?)
 *    - Sent when report is rejected
 *    - Optional reason field for feedback
 * 
 * 5. sendNewReportToVolunteerEmail(to, name, reportId)
 *    - Sent to volunteers when new report needs review
 *    - Link to verification dashboard
 * 
 * 6. sendPasswordResetEmail(to, name, token)
 *    - For future password reset feature
 *    - 1-hour expiry on reset link
 */

// ============================================================================
// SETUP INSTRUCTIONS
// ============================================================================

/**
 * 1. SENDGRID ACCOUNT
 *    - Go to https://sendgrid.com and sign up (free tier: 100 emails/day)
 *    - Create API key with "Mail Send" permission
 * 
 * 2. ENVIRONMENT VARIABLES (.env.local)
 *    SENDGRID_API_KEY=SG.your_api_key_here
 *    SENDGRID_FROM_EMAIL=noreply@yourdomain.com
 *    SENDGRID_FROM_NAME=SegreGate
 *    NEXT_PUBLIC_APP_URL=http://localhost:3000
 * 
 * 3. VERIFY SENDER EMAIL
 *    - Login to SendGrid dashboard
 *    - Go to Settings > Sender Authentication
 *    - Verify your domain or single sender email
 *    - (Without this, emails may go to spam)
 * 
 * 4. TEST FIRST
 *    - Use your own email when testing
 *    - Check spam folder for test emails
 *    - After verification, you can send to any email
 */

// ============================================================================
// EMAIL BEST PRACTICES
// ============================================================================

/**
 * ✓ DO:
 *   - Use .catch() for non-blocking email sends
 *   - Send emails asynchronously (don't await in critical paths)
 *   - Log email failures for monitoring
 *   - Test with your email first before production
 *   - Include unsubscribe links for marketing emails
 *   - Keep HTML emails responsive and simple
 * 
 * ✗ DON'T:
 *   - Await email sends in request handlers
 *   - Send without .catch() error handlers
 *   - Forget to verify sender email in SendGrid
 *   - Commit API keys to git (use .env.local)
 *   - Send duplicate emails on retry
 *   - Use HTML-only emails (always provide text version)
 */

// ============================================================================
// SENDGRID PLANS
// ============================================================================

/**
 * Free: 100 emails/day forever
 * Essentials: $19.95/month for 50,000 emails/month
 * Pro: $99.95/month for 500,000 emails/month
 * 
 * SegreGate MVP estimate:
 * - Signup: 1 email per new user
 * - Reports: 2-3 emails per report (user + volunteers)
 * - Status updates: 1 email per status change
 * 
 * If ~50 reports/day → ~150 emails/day → Need Essentials plan for production
 */

