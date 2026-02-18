/**
 * Example: Database Transaction with Rollback
 * 
 * This file demonstrates how to use Prisma transactions to ensure
 * atomic operations (all succeed or all fail).
 * 
 * Scenario: Submit a waste segregation report and verify status atomicity
 */

import { prisma } from './prisma';

/**
 * Example 1: Simple Transactional Submit
 * Ensures report creation and statistics update happen together
 */
export async function submitWasteReport(
  userId: number,
  location: string,
  photoUrl?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create the report
      const report = await tx.report.create({
        data: {
          userId,
          location,
          photoUrl,
          status: 'pending',
        },
      });

      // Step 2: Update user's report status (simulating stats tracking)
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          // Could add reportCount field to User model
        },
        select: { id: true, name: true, email: true },
      });

      return { report, updatedUser };
    });

    console.log('✅ Transaction successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Transaction failed. Rolling back.', error);
    // Database automatically rolls back all changes
    throw new Error('Failed to submit report. Please try again.');
  }
}

/**
 * Example 2: Transactional with Conditional Logic
 * Verifies a report and updates related task status
 */
export async function verifyReportAndUpdateTask(
  reportId: number,
  taskId: number,
  verificationStatus: 'approved' | 'rejected'
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Verify the report exists before updating
      const report = await tx.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        throw new Error(`Report ${reportId} not found`);
      }

      // Update report status
      const updatedReport = await tx.report.update({
        where: { id: reportId },
        data: { status: verificationStatus },
      });

      // Update related task status
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: { status: verificationStatus === 'approved' ? 'done' : 'todo' },
      });

      return { report: updatedReport, task: updatedTask };
    });

    console.log('✅ Verification transaction successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Verification transaction failed:', error);
    // Automatic rollback — if task update fails, report update is also rolled back
    throw error;
  }
}

/**
 * Example 3: Query Optimisation — Avoid Overfetching
 * Only select necessary fields
 */
export async function getReportsOptimized(userId: number) {
  // ✅ Optimized: Only fetch needed fields
  const reports = await prisma.report.findMany({
    where: { userId },
    select: {
      id: true,
      location: true,
      status: true,
      createdAt: true,
      // Note: photoUrl is NOT selected if not needed
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // Pagination: limit to 10 results
  });

  return reports;
}

/**
 * Example 4: Batch Operations
 * Insert multiple reports efficiently in a single query
 */
export async function createMultipleReports(
  reports: Array<{ userId: number; location: string }>
) {
  try {
    const created = await prisma.report.createMany({
      data: reports,
      skipDuplicates: true, // Prevent errors on duplicate keys
    });

    console.log(`✅ Created ${created.count} reports in one batch operation`);
    return created;
  } catch (error) {
    console.error('❌ Batch operation failed:', error);
    throw error;
  }
}

/**
 * Example 5: Indexed Query Performance
 * Demonstrates how indexes improve query speed
 */
export async function getReportsByStatus(status: string, limit = 20) {
  // This query benefits from @@index([status]) in Report model
  // Without the index: O(n) full table scan
  // With the index: O(log n) indexed lookup
  const reports = await prisma.report.findMany({
    where: { status },
    select: { id: true, userId: true, location: true, status: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return reports;
}
