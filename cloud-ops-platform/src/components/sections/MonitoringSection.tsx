'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { apiCall } from '@/lib/api-client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import type { CloudWatchAlarm } from '@/types';
import { Activity, RefreshCw, FileText } from 'lucide-react';

type Tab = 'alarms' | 'logGroups' | 'logEvents';

interface LogGroup {
  logGroupName: string;
  storedBytes: number;
  retentionInDays?: number;
  creationTime?: string;
}

interface LogEvent {
  timestamp: string;
  message: string;
  logStreamName: string;
}

export default function MonitoringSection() {
  const { credentials, darkMode, addToHistory, region } = useApp();
  const [tab, setTab] = useState<Tab>('alarms');
  const [alarms, setAlarms] = useState<CloudWatchAlarm[]>([]);
  const [logGroups, setLogGroups] = useState<LogGroup[]>([]);
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);
  const [selectedLogGroup, setSelectedLogGroup] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async (resource: Tab, extra: Record<string, unknown> = {}) => {
    if (!credentials) return;
    setLoading(true);
    const result = await apiCall<any>('/api/aws/cloudwatch', credentials, { resource, ...extra });
    if (result.success && result.data) {
      switch (resource) {
        case 'alarms': setAlarms(result.data); break;
        case 'logGroups': setLogGroups(result.data); break;
        case 'logEvents': setLogEvents(result.data); break;
      }
      addToHistory({ action: `Fetch ${resource}`, category: 'Monitoring', region, status: 'success', resultSummary: `Found ${result.data.length} items` });
    } else {
      addToHistory({ action: `Fetch ${resource}`, category: 'Monitoring', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setLoading(false);
  };

  const viewLogs = (logGroupName: string) => {
    setSelectedLogGroup(logGroupName);
    setTab('logEvents');
    fetchData('logEvents', { logGroupName });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const alarmColumns = [
    { key: 'alarmName' as keyof CloudWatchAlarm, label: 'Alarm' },
    { key: 'state' as keyof CloudWatchAlarm, label: 'State', render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: 'namespace' as keyof CloudWatchAlarm, label: 'Namespace' },
    { key: 'metric' as keyof CloudWatchAlarm, label: 'Metric' },
    { key: 'threshold' as keyof CloudWatchAlarm, label: 'Threshold' },
    { key: 'comparisonOperator' as keyof CloudWatchAlarm, label: 'Operator' },
  ];

  const logGroupColumns = [
    { key: 'logGroupName' as keyof LogGroup, label: 'Log Group', render: (v: unknown) => (
      <button onClick={() => viewLogs(String(v))} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
        <FileText className="w-3.5 h-3.5" />{String(v)}
      </button>
    )},
    { key: 'storedBytes' as keyof LogGroup, label: 'Size', render: (v: unknown) => formatBytes(Number(v)) },
    { key: 'retentionInDays' as keyof LogGroup, label: 'Retention', render: (v: unknown) => v ? `${v} days` : 'Never expire' },
  ];

  const logEventColumns = [
    { key: 'timestamp' as keyof LogEvent, label: 'Time', render: (v: unknown) => new Date(String(v)).toLocaleString() },
    { key: 'logStreamName' as keyof LogEvent, label: 'Stream' },
    { key: 'message' as keyof LogEvent, label: 'Message', render: (v: unknown) => <pre className="text-xs max-w-xl truncate">{String(v)}</pre> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monitoring</h2>
        </div>
        <button onClick={() => fetchData(tab === 'logEvents' ? 'logEvents' : tab, tab === 'logEvents' ? { logGroupName: selectedLogGroup } : {})} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg w-fit">
        <button onClick={() => setTab('alarms')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'alarms' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}>Alarms</button>
        <button onClick={() => setTab('logGroups')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'logGroups' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}>Log Groups</button>
        {tab === 'logEvents' && <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-emerald-600 text-white">Log Events</button>}
      </div>

      {tab === 'alarms' && <DataTable data={alarms as unknown as Record<string, unknown>[]} columns={alarmColumns as any} title="CloudWatch Alarms" loading={loading} />}
      {tab === 'logGroups' && <DataTable data={logGroups as unknown as Record<string, unknown>[]} columns={logGroupColumns as any} title="Log Groups" loading={loading} />}
      {tab === 'logEvents' && (
        <>
          <p className="text-sm text-gray-500">Viewing logs for: <code className="text-blue-400">{selectedLogGroup}</code></p>
          <DataTable data={logEvents as unknown as Record<string, unknown>[]} columns={logEventColumns as any} title="Recent Log Events" loading={loading} />
        </>
      )}
    </div>
  );
}
