import { NextRequest } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getS3Client(credentials);
    const { bucketName, key, action = 'download' } = body;

    if (!bucketName || !key) {
      return errorResponse(new Error('bucketName and key are required'), 400);
    }

    const command = action === 'upload'
      ? new PutObjectCommand({ Bucket: bucketName, Key: key })
      : new GetObjectCommand({ Bucket: bucketName, Key: key });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return successResponse({ url, expiresIn: 3600 });
  } catch (error) {
    return errorResponse(error);
  }
}
