import { NextRequest } from 'next/server';
import { ListBucketsCommand, ListObjectsV2Command, GetBucketLocationCommand } from '@aws-sdk/client-s3';
import { getS3Client, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';
import type { S3Bucket, S3Object } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getS3Client(credentials);
    const command = new ListBucketsCommand({});
    const response = await client.send(command);

    const buckets: S3Bucket[] = (response.Buckets || []).map(b => ({
      name: b.Name || '',
      creationDate: b.CreationDate?.toISOString(),
    }));
    return successResponse(buckets);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getS3Client(credentials);
    const { bucketName, prefix = '', continuationToken } = body;

    if (!bucketName) {
      return errorResponse(new Error('bucketName is required'), 400);
    }

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: '/',
      MaxKeys: 100,
      ContinuationToken: continuationToken,
    });
    const response = await client.send(command);

    const objects: S3Object[] = (response.Contents || []).map(obj => ({
      key: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified?.toISOString(),
      storageClass: obj.StorageClass,
    }));

    const folders = (response.CommonPrefixes || []).map(p => p.Prefix || '');

    return successResponse({
      objects,
      folders,
      isTruncated: response.IsTruncated,
      nextContinuationToken: response.NextContinuationToken,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
