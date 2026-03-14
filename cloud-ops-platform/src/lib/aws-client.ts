import { EC2Client } from '@aws-sdk/client-ec2';
import { S3Client } from '@aws-sdk/client-s3';
import { RDSClient } from '@aws-sdk/client-rds';
import { IAMClient } from '@aws-sdk/client-iam';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { STSClient } from '@aws-sdk/client-sts';
import type { AWSCredentials } from '@/types';

const ENCRYPTION_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || 'cloud-ops-default-key-change-me';

export function encryptCredentials(credentials: AWSCredentials): string {
  const data = JSON.stringify(credentials);
  const encoded = Buffer.from(data).toString('base64');
  // Simple XOR encryption for in-memory use
  let encrypted = '';
  for (let i = 0; i < encoded.length; i++) {
    encrypted += String.fromCharCode(encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
  }
  return Buffer.from(encrypted, 'binary').toString('base64');
}

export function decryptCredentials(encrypted: string): AWSCredentials {
  const decoded = Buffer.from(encrypted, 'base64').toString('binary');
  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
  }
  return JSON.parse(Buffer.from(decrypted, 'base64').toString('utf8'));
}

function getBaseConfig(credentials: AWSCredentials) {
  return {
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      ...(credentials.sessionToken && { sessionToken: credentials.sessionToken }),
    },
  };
}

export function getEC2Client(credentials: AWSCredentials): EC2Client {
  return new EC2Client(getBaseConfig(credentials));
}

export function getS3Client(credentials: AWSCredentials): S3Client {
  return new S3Client(getBaseConfig(credentials));
}

export function getRDSClient(credentials: AWSCredentials): RDSClient {
  return new RDSClient(getBaseConfig(credentials));
}

export function getIAMClient(credentials: AWSCredentials): IAMClient {
  return new IAMClient({ ...getBaseConfig(credentials), region: 'us-east-1' }); // IAM is global
}

export function getCloudWatchClient(credentials: AWSCredentials): CloudWatchClient {
  return new CloudWatchClient(getBaseConfig(credentials));
}

export function getCloudWatchLogsClient(credentials: AWSCredentials): CloudWatchLogsClient {
  return new CloudWatchLogsClient(getBaseConfig(credentials));
}

export function getSTSClient(credentials: AWSCredentials): STSClient {
  return new STSClient(getBaseConfig(credentials));
}

export function parseCredentialsFromRequest(body: { credentials?: string; accessKeyId?: string; secretAccessKey?: string; region?: string; sessionToken?: string }): AWSCredentials {
  if (body.credentials) {
    return decryptCredentials(body.credentials);
  }
  if (body.accessKeyId && body.secretAccessKey) {
    return {
      accessKeyId: body.accessKeyId,
      secretAccessKey: body.secretAccessKey,
      region: body.region || 'us-east-1',
      sessionToken: body.sessionToken,
    };
  }
  throw new Error('No valid credentials provided');
}