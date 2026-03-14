'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { apiCall, apiPut } from '@/lib/api-client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import type { EC2Instance } from '@/types';
import { Server, Play, Square, RefreshCw, Loader2 } from 'lucide-react';

export default function ComputeSection() {
  const { credentials, darkMode, readOnlyMode, addToHistory, region } = useApp();
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchInstances = async () => {
    if (!credentials) return;
    setLoading(true);
    const result = await apiCall<EC2Instance[]>('/api/aws/ec2', credentials);
    if (result.success && result.data) {
      setInstances(result.data);
      addToHistory({ action: 'List EC2 Instances', category: 'Compute', region, status: 'success', resultSummary: `Found ${result.data.length} instances` });
    } else {
      addToHistory({ action: 'List EC2 Instances', category: 'Compute', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setLoading(false);
  };

  const handleAction = async (instanceId: string, action: 'start' | 'stop') => {
    if (!credentials || readOnlyMode) return;
    setActionLoading(instanceId);
    const result = await apiPut('/api/aws/ec2', credentials, { instanceId, action });
    if (result.success) {
      addToHistory({ action: `${action === 'start' ? 'Start' : 'Stop'} EC2 ${instanceId}`, category: 'Compute', region, status: 'success', resultSummary: `Instance ${action}ed` });
      setTimeout(fetchInstances, 2000);
    } else {
      addToHistory({ action: `${action === 'start' ? 'Start' : 'Stop'} EC2 ${instanceId}`, category: 'Compute', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setActionLoading(null);
  };

  const columns = [
    { key: 'name' as keyof EC2Instance, label: 'Name' },
    { key: 'instanceId' as keyof EC2Instance, label: 'Instance ID', render: (v: unknown) => <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: 'state' as keyof EC2Instance, label: 'State', render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: 'type' as keyof EC2Instance, label: 'Type' },
    { key: 'az' as keyof EC2Instance, label: 'AZ' },
    { key: 'publicIp' as keyof EC2Instance, label: 'Public IP', render: (v: unknown) => <span>{String(v || 'N/A')}</span> },
    { key: 'privateIp' as keyof EC2Instance, label: 'Private IP' },
    {
      key: 'instanceId' as keyof EC2Instance,
      label: 'Actions',
      render: (_: unknown, row: EC2Instance) => {
        if (readOnlyMode) return <span className="text-xs text-gray-600">Read-only</span>;
        return (
          <div className="flex gap-1">
            {row.state === 'stopped' && (
              <button onClick={() => handleAction(row.instanceId, 'start')} disabled={!!actionLoading} className="p-1 hover:bg-green-900/30 rounded text-green-400" title="Start">
                {actionLoading === row.instanceId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            )}
            {row.state === 'running' && (
              <button onClick={() => handleAction(row.instanceId, 'stop')} disabled={!!actionLoading} className="p-1 hover:bg-red-900/30 rounded text-red-400" title="Stop">
                {actionLoading === row.instanceId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-blue-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Compute</h2>
        </div>
        <button
          onClick={fetchInstances}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          List EC2 Instances
        </button>
      </div>
      <DataTable data={instances as unknown as Record<string, unknown>[]} columns={columns as any} title="EC2 Instances" loading={loading} emptyMessage="Click 'List EC2 Instances' to fetch data" />
    </div>
  );
}
