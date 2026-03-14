import { NextRequest } from 'next/server';
import { GetCallerIdentityCommand, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { getSTSClient, parseCredentialsFromRequest, encryptCredentials } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getSTSClient(credentials);

    if (body.roleArn) {
      const command = new AssumeRoleCommand({
        RoleArn: body.roleArn,
        RoleSessionName: 'cloud-ops-session',
        DurationSeconds: 3600,
      });
      const response = await client.send(command);
      const sessionCreds = {
        accessKeyId: response.Credentials!.AccessKeyId!,
        secretAccessKey: response.Credentials!.SecretAccessKey!,
        sessionToken: response.Credentials!.SessionToken!,
        region: credentials.region,
      };
      return successResponse({
        identity: { account: response.AssumedRoleUser?.Arn },
        encryptedCredentials: encryptCredentials(sessionCreds),
        expiration: response.Credentials!.Expiration,
      });
    }

    const command = new GetCallerIdentityCommand({});
    const response = await client.send(command);
    return successResponse({
      account: response.Account,
      arn: response.Arn,
      userId: response.UserId,
      encryptedCredentials: encryptCredentials(credentials),
    });
  } catch (error) {
    return errorResponse(error, 401);
  }
}
