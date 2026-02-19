import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendSuccess, sendError } from '@/src/lib/responseHandler';
import { handleError } from '@/src/lib/errorHandler';

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  try {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return sendError('Invalid user ID', 'INVALID_ID', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError('User not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(user, 'User fetched successfully');
  } catch (error) {
    return handleError(error, `GET /api/users/${id}`);
  }
}
