import { NextRequest } from 'next/server';
import { DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } from '@aws-sdk/client-ec2';
import { getEC2Client, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';
import type { EC2Instance } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getEC2Client(credentials);
    const command = new DescribeInstancesCommand({});
    const response = await client.send(command);

    const instances: EC2Instance[] = [];
    for (const reservation of response.Reservations || []) {
      for (const instance of reservation.Instances || []) {
        instances.push({
          instanceId: instance.InstanceId || '',
          name: instance.Tags?.find(t => t.Key === 'Name')?.Value || 'N/A',
          state: instance.State?.Name || 'unknown',
          type: instance.InstanceType || '',
          publicIp: instance.PublicIpAddress,
          privateIp: instance.PrivateIpAddress,
          launchTime: instance.LaunchTime?.toISOString(),
          az: instance.Placement?.AvailabilityZone || '',
        });
      }
    }
    return successResponse(instances);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getEC2Client(credentials);
    const { instanceId, action } = body;

    if (!instanceId || !action) {
      return errorResponse(new Error('instanceId and action required'), 400);
    }

    if (action === 'start') {
      const command = new StartInstancesCommand({ InstanceIds: [instanceId] });
      const response = await client.send(command);
      return successResponse({ message: `Starting instance ${instanceId}`, changes: response.StartingInstances });
    } else if (action === 'stop') {
      const command = new StopInstancesCommand({ InstanceIds: [instanceId] });
      const response = await client.send(command);
      return successResponse({ message: `Stopping instance ${instanceId}`, changes: response.StoppingInstances });
    }
    return errorResponse(new Error('Invalid action. Use "start" or "stop"'), 400);
  } catch (error) {
    return errorResponse(error);
  }
}
