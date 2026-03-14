import { NextRequest } from 'next/server';
import { DescribeAlarmsCommand } from '@aws-sdk/client-cloudwatch';
import { DescribeLogGroupsCommand, FilterLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { getCloudWatchClient, getCloudWatchLogsClient, parseCredentialsFromRequest } from '@/lib/aws-client';
import { successResponse, errorResponse } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentials = parseCredentialsFromRequest(body);
    const resource = body.resource || 'alarms';

    switch (resource) {
      case 'alarms': {
        const client = getCloudWatchClient(credentials);
        const response = await client.send(new DescribeAlarmsCommand({ MaxRecords: 100 }));
        const alarms = (response.MetricAlarms || []).map(a => ({
          alarmName: a.AlarmName || '',
          state: a.StateValue || '',
          metric: a.MetricName || '',
          namespace: a.Namespace || '',
          threshold: a.Threshold,
          comparisonOperator: a.ComparisonOperator,
        }));
        return successResponse(alarms);
      }
      case 'logGroups': {
        const client = getCloudWatchLogsClient(credentials);
        const response = await client.send(new DescribeLogGroupsCommand({ limit: 50 }));
        const groups = (response.logGroups || []).map(g => ({
          logGroupName: g.logGroupName || '',
          storedBytes: g.storedBytes || 0,
          retentionInDays: g.retentionInDays,
          creationTime: g.creationTime ? new Date(g.creationTime).toISOString() : undefined,
        }));
        return successResponse(groups);
      }
      case 'logEvents': {
        const client = getCloudWatchLogsClient(credentials);
        const { logGroupName, filterPattern = '', startTime } = body;
        if (!logGroupName) return errorResponse(new Error('logGroupName required'), 400);
        const response = await client.send(new FilterLogEventsCommand({
          logGroupName,
          filterPattern,
          startTime: startTime || Date.now() - 3600000,
          limit: 100,
        }));
        const events = (response.events || []).map(e => ({
          timestamp: e.timestamp ? new Date(e.timestamp).toISOString() : '',
          message: e.message || '',
          logStreamName: e.logStreamName || '',
        }));
        return successResponse(events);
      }
      default:
        return errorResponse(new Error('Invalid resource type'), 400);
    }
  } catch (error) {
    return errorResponse(error);
  }
}
