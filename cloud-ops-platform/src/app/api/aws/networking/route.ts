import { NextRequest } from 'next/server';
import {
  DescribeVpcsCommand,
  DescribeSubnetsCommand,
  DescribeRouteTablesCommand,
  DescribeSecurityGroupsCommand,
} from '@aws-sdk/client-ec2';
import { getEC2Client, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getEC2Client(credentials);
    const resource = body.resource || 'vpcs';

    switch (resource) {
      case 'vpcs': {
        const response = await client.send(new DescribeVpcsCommand({}));
        const vpcs = (response.Vpcs || []).map(v => ({
          vpcId: v.VpcId || '',
          cidrBlock: v.CidrBlock || '',
          state: v.State || '',
          isDefault: v.IsDefault || false,
          name: v.Tags?.find(t => t.Key === 'Name')?.Value || 'N/A',
        }));
        return successResponse(vpcs);
      }
      case 'subnets': {
        const response = await client.send(new DescribeSubnetsCommand(body.vpcId ? { Filters: [{ Name: 'vpc-id', Values: [body.vpcId] }] } : {}));
        const subnets = (response.Subnets || []).map(s => ({
          subnetId: s.SubnetId || '',
          vpcId: s.VpcId || '',
          cidrBlock: s.CidrBlock || '',
          az: s.AvailabilityZone || '',
          availableIps: s.AvailableIpAddressCount || 0,
          name: s.Tags?.find(t => t.Key === 'Name')?.Value || 'N/A',
        }));
        return successResponse(subnets);
      }
      case 'routeTables': {
        const response = await client.send(new DescribeRouteTablesCommand(body.vpcId ? { Filters: [{ Name: 'vpc-id', Values: [body.vpcId] }] } : {}));
        const routeTables = (response.RouteTables || []).map(rt => ({
          routeTableId: rt.RouteTableId || '',
          vpcId: rt.VpcId || '',
          routes: (rt.Routes || []).map(r => ({
            destination: r.DestinationCidrBlock || r.DestinationIpv6CidrBlock || '',
            target: r.GatewayId || r.NatGatewayId || r.InstanceId || r.TransitGatewayId || r.VpcPeeringConnectionId || '',
            state: r.State || '',
          })),
          name: rt.Tags?.find(t => t.Key === 'Name')?.Value || 'N/A',
        }));
        return successResponse(routeTables);
      }
      case 'securityGroups': {
        const response = await client.send(new DescribeSecurityGroupsCommand(body.vpcId ? { Filters: [{ Name: 'vpc-id', Values: [body.vpcId] }] } : {}));
        const groups = (response.SecurityGroups || []).map(sg => ({
          groupId: sg.GroupId || '',
          groupName: sg.GroupName || '',
          description: sg.Description || '',
          vpcId: sg.VpcId || '',
          inboundRules: sg.IpPermissions?.length || 0,
          outboundRules: sg.IpPermissionsEgress?.length || 0,
        }));
        return successResponse(groups);
      }
      default:
        return errorResponse(new Error('Invalid resource type'), 400);
    }
  } catch (error) {
    return errorResponse(error);
  }
}
