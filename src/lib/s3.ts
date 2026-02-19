import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_S3_BUCKET_NAME!;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Generate a presigned PUT URL for direct browser → S3 uploads.
 * The client uploads the file directly to S3 — the Next.js server
 * never handles the binary data, keeping the API lightweight.
 *
 * @param key       S3 object key  e.g. "reports/1234-photo.jpg"
 * @param mimeType  Content-Type of the file  e.g. "image/jpeg"
 * @param expiresIn Seconds the presigned URL is valid (default 60)
 */
export async function getPresignedUploadUrl(
  key: string,
  mimeType: string,
  expiresIn = 60
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Return the public HTTPS URL for an object that has been uploaded.
 * Requires the S3 bucket to have public read enabled OR use CloudFront.
 */
export function getPublicUrl(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

/** Allowed MIME types for photo uploads */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/** Max file size: 5 MB (free-tier friendly) */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
