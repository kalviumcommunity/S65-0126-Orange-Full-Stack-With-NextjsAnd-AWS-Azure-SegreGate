import { getPresignedUploadUrl, getPublicUrl, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/src/lib/s3';
import { sendSuccess, sendError } from '@/src/lib/responseHandler';
import { handleError } from '@/src/lib/errorHandler';

/**
 * POST /api/upload
 *
 * Body (JSON):
 *   { filename: string, mimeType: string, size: number }
 *
 * Response:
 *   { presignedUrl: string, publicUrl: string, key: string }
 *
 * Flow:
 *   1. Client requests a presigned URL
 *   2. Server validates type/size, generates a unique S3 key, returns presigned PUT URL
 *   3. Client PUTs file directly to S3 using that URL
 *   4. Client uses publicUrl as photoUrl when creating a report
 */
export async function POST(req: Request) {
  try {
    // Auth check — middleware attaches x-user-id for protected routes
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return sendError('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const body = await req.json();
    const { filename, mimeType, size } = body as {
      filename?: string;
      mimeType?: string;
      size?: number;
    };

    // Validate inputs
    if (!filename || !mimeType || size == null) {
      return sendError('filename, mimeType and size are required', 'VALIDATION_ERROR', 400);
    }

    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return sendError(
        `Unsupported file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        'INVALID_FILE_TYPE',
        400
      );
    }

    if (size > MAX_FILE_SIZE_BYTES) {
      return sendError('File too large. Maximum size is 5 MB.', 'FILE_TOO_LARGE', 400);
    }

    // Build a unique, collision-resistant S3 key
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const timestamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const key = `reports/user-${userId}/${timestamp}-${rand}.${ext}`;

    const presignedUrl = await getPresignedUploadUrl(key, mimeType);
    const publicUrl = getPublicUrl(key);

    return sendSuccess({ presignedUrl, publicUrl, key }, 'Presigned URL generated');
  } catch (error) {
    return handleError(error, 'POST /api/upload');
  }
}
