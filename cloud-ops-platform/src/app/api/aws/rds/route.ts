import { NextRequest } from 'next/server';
import { DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import { getRDSClient, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';
import type { RDSInstance } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getRDSClient(credentials);
    const command = new DescribeDBInstancesCommand({});
    const response = await client.send(command);

    const instances: RDSInstance[] = (response.DBInstances || []).map(db => ({
      dbInstanceId: db.DBInstanceIdentifier || '',
      engine: db.Engine || '',
      engineVersion: db.EngineVersion || '',
      status: db.DBInstanceStatus || '',
      endpoint: db.Endpoint?.Address,
      port: db.Endpoint?.Port,
      instanceClass: db.DBInstanceClass || '',
      multiAZ: db.MultiAZ || false,
      storageType: db.StorageType || '',
      allocatedStorage: db.AllocatedStorage || 0,
    }));
    return successResponse(instances);
  } catch (error) {
    return errorResponse(error);
  }
}
