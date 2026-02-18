import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/src/lib/prisma';
import { reportUpdateSchema } from '@/src/lib/schemas/reportSchema';
import { sendSuccess, sendError } from '@/src/lib/responseHandler';
import { handleError } from '@/src/lib/errorHandler';

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const reportId = parseInt(params.id, 10);

    if (isNaN(reportId)) {
      return sendError('Invalid report ID', 'INVALID_ID', 400);
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        userId: true,
        location: true,
        status: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    if (!report) {
      return sendError('Report not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(report, 'Report fetched successfully');
  } catch (error) {
    return handleError(error, `GET /api/reports/${params.id}`);
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const reportId = parseInt(params.id, 10);

    if (isNaN(reportId)) {
      return sendError('Invalid report ID', 'INVALID_ID', 400);
    }

    const body = await req.json();

    // Validate update data with Zod
    const validatedData = reportUpdateSchema.parse(body);

    // Verify report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      return sendError('Report not found', 'NOT_FOUND', 404);
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: validatedData,
      select: {
        id: true,
        userId: true,
        location: true,
        status: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    return sendSuccess(updatedReport, 'Report updated successfully');
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
      );
    }
    return handleError(error, `PUT /api/reports/${params.id}`);
  }
}
