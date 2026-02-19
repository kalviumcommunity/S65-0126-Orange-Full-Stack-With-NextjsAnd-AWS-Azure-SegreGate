import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { userCreateSchema } from '@/src/lib/schemas/userSchema';
import { sendSuccess, sendError } from '@/src/lib/responseHandler';
import { handleError } from '@/src/lib/errorHandler';
import { sanitizeHtmlInput, sanitizeEmail, isInputSafe } from '@/src/lib/sanitize';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const role = searchParams.get('role'); // Optional filter

    const where = role ? { role } : {};

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({ where });

    return sendSuccess(
      {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Users fetched successfully'
    );
  } catch (error) {
    return handleError(error, 'GET /api/users');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sanitize input to prevent XSS and injection attacks
    const sanitizedBody = {
      ...body,
      name: sanitizeHtmlInput(body.name || ''),
      email: sanitizeEmail(body.email || ''),
    };

    // Additional safety validation
    if (!isInputSafe(body.name)) {
      return sendError('Input contains potentially malicious content', 'UNSAFE_INPUT', 400);
    }

    // Validate sanitized input with Zod
    const validatedData = userCreateSchema.parse(sanitizedBody);

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return sendError('Email already in use', 'EMAIL_EXISTS', 400);
    }

    // Create user with sanitized data
    const user = await prisma.user.create({
      data: { ...validatedData, password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(user, 'User created successfully', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
      );
    }
    return handleError(error, 'POST /api/users');
  }
}
