import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/src/lib/prisma';
import { reportCreateSchema } from '@/src/lib/schemas/reportSchema';
import { sendSuccess, sendError } from '@/src/lib/responseHandler';
import { handleError } from '@/src/lib/errorHandler';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const reports = await prisma.report.findMany({
      select: {
        id: true,
        userId: true,
        location: true,
        status: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.report.count();

    return sendSuccess(
      {
        reports,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Reports fetched successfully'
    );
  } catch (error) {
    return handleError(error, 'GET /api/reports');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input with Zod
    const validatedData = reportCreateSchema.parse(body);

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!userExists) {
      return sendError('User not found', 'USER_NOT_FOUND', 404);
    }

    // Create report
    const report = await prisma.report.create({
      data: validatedData,
      select: {
        id: true,
        userId: true,
        location: true,
        status: true,
        createdAt: true,
      },
    });

    return sendSuccess(report, 'Report created successfully', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
      );
    }
    return handleError(error, 'POST /api/reports');
  }
}
