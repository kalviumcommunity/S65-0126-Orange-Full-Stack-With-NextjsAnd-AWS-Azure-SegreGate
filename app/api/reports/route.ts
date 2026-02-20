import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/src/lib/prisma';
import { reportCreateSchema } from '@/src/lib/schemas/reportSchema';
import { sendSuccess, sendError } from '@/src/lib/responseHandler';
import { handleError } from '@/src/lib/errorHandler';
import { sanitizeHtmlInput, sanitizeUrl, isInputSafe } from '@/src/lib/sanitize';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const statusFilter = searchParams.get('status'); // Optional filter: pending, approved, rejected

    // Get user info from middleware headers
    const userIdHeader = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userIdHeader) {
      return sendError('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const userId = parseInt(userIdHeader, 10);

    // Build where clause based on user role
    // - admin/volunteer: can see all reports
    // - user: can only see their own reports
    const whereClause: { userId?: number; status?: string } = {};
    
    if (userRole !== 'admin' && userRole !== 'volunteer') {
      whereClause.userId = userId;
    }

    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      select: {
        id: true,
        userId: true,
        location: true,
        description: true,
        segregationQuality: true,
        status: true,
        photoUrl: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.report.count({ where: whereClause });

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

    // Get user ID from headers (set by middleware)
    const userIdHeader = req.headers.get('x-user-id');

    if (!userIdHeader) {
      return sendError('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const userId = parseInt(userIdHeader, 10);

    // Sanitize input to prevent XSS and injection attacks
    const sanitizedBody = {
      ...body,
      userId,
      location: sanitizeHtmlInput(body.location || ''),
      description: body.description ? sanitizeHtmlInput(body.description) : undefined,
      segregationQuality: body.segregationQuality, // Enum, safe
      photoUrl: body.photoUrl ? sanitizeUrl(body.photoUrl) : undefined,
    };

    // Additional safety validation
    if (!isInputSafe(body.location)) {
      return sendError('Input contains potentially malicious content', 'UNSAFE_INPUT', 400);
    }

    // Validate sanitized input with Zod
    const validatedData = reportCreateSchema.parse(sanitizedBody);

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!userExists) {
      return sendError('User not found', 'USER_NOT_FOUND', 404);
    }

    // Create report with sanitized data
    const report = await prisma.report.create({
      data: validatedData,
      select: {
        id: true,
        userId: true,
        location: true,
        description: true,
        segregationQuality: true,
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
