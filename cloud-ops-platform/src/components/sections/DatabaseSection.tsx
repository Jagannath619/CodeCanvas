'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { apiCall } from '@/lib/api-client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import type { RDSInstance } from '@/types';
import { Database, RefreshCw } from 'lucide-react';

export default function DatabaseSection() {
  const { credentials, darkMode, addToHistory, region } = useApp();
  const [instances, setInstances] = useState<RDSInstance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInstances = async () => {
    if (!credentials) return;
    setLoading(true);
    const result = await apiCall<RDSInstance[]>('/api/aws/rds', credentials);
    if (result.success && result.data) {
      setInstances(result.data);
      addToHistory({ action: 'List RDS Instances', category: 'Database', region, status: 'success', resultSummary: `Found ${result.data.length} instances` });
    } else {
      addToHistory({ action: 'List RDS Instances', category: 'Database', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setLoading(false);
  };

  const columns = [
    { key: 'dbInstanceId' as keyof RDSInstance, label: 'DB Instance' },
    { key: 'engine' as keyof RDSInstance, label: 'Engine', render: (v: unknown, row: RDSInstance) => `${row.engine} ${row.engineVersion}` },
    { key: 'status' as keyof RDSInstance, label: 'Status', render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: 'instanceClass' as keyof RDSInstance, label: 'Class' },
    { key: 'endpoint' as keyof RDSInstance, label: 'Endpoint', render: (v: unknown, row: RDSInstance) => v ? <code className="text-xs">{String(v)}:{row.port}</code> : 'N/A' },
    { key: 'multiAZ' as keyof RDSInstance, label: 'Multi-AZ', render: (v: unknown) => v ? 'Yes' : 'No' },
    { key: 'allocatedStorage' as keyof RDSInstance, label: 'Storage', render: (v: unknown) => `${v} GiB` },
    { key: 'storageType' as keyof RDSInstance, label: 'Type' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-orange-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Database</h2>
        </div>
        <button onClick={fetchInstances} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> List RDS Instances
        </button>
      </div>
      <DataTable data={instances as unknown as Record<string, unknown>[]} columns={columns as any} title="RDS Instances" loading={loading} emptyMessage="Click 'List RDS Instances' to fetch data" />
    </div>
  );
}
