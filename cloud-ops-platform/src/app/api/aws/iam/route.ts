import { NextRequest } from 'next/server';
import { ListUsersCommand, ListRolesCommand, GenerateServiceLastAccessedDetailsCommand, GetServiceLastAccessedDetailsCommand } from '@aws-sdk/client-iam';
import { getIAMClient, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const client = getIAMClient(credentials);
    const resource = body.resource || 'users';

    switch (resource) {
      case 'users': {
        const response = await client.send(new ListUsersCommand({}));
        const users = (response.Users || []).map(u => ({
          userName: u.UserName || '',
          userId: u.UserId || '',
          arn: u.Arn || '',
          createDate: u.CreateDate?.toISOString(),
          passwordLastUsed: u.PasswordLastUsed?.toISOString(),
        }));
        return successResponse(users);
      }
      case 'roles': {
        const response = await client.send(new ListRolesCommand({}));
        const roles = (response.Roles || []).map(r => ({
          roleName: r.RoleName || '',
          roleId: r.RoleId || '',
          arn: r.Arn || '',
          createDate: r.CreateDate?.toISOString(),
          description: r.Description,
        }));
        return successResponse(roles);
      }
      case 'accessAdvisor': {
        const { arn } = body;
        if (!arn) return errorResponse(new Error('ARN required for access advisor'), 400);
        const genCmd = new GenerateServiceLastAccessedDetailsCommand({ Arn: arn });
        const genResponse = await client.send(genCmd);
        // Wait briefly then fetch
        await new Promise(resolve => setTimeout(resolve, 2000));
        const getCmd = new GetServiceLastAccessedDetailsCommand({ JobId: genResponse.JobId! });
        const details = await client.send(getCmd);
        return successResponse({
          jobStatus: details.JobStatus,
          services: (details.ServicesLastAccessed || []).slice(0, 50).map(s => ({
            serviceName: s.ServiceName,
            serviceNamespace: s.ServiceNamespace,
            lastAuthenticated: s.LastAuthenticated?.toISOString(),
            lastAuthenticatedEntity: s.LastAuthenticatedEntity,
            totalAuthenticatedEntities: s.TotalAuthenticatedEntities,
          })),
        });
      }
      default:
        return errorResponse(new Error('Invalid resource type'), 400);
    }
  } catch (error) {
    return errorResponse(error);
  }
}
