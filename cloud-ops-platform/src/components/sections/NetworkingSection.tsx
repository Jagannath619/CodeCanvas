'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { apiCall } from '@/lib/api-client';
import DataTable from '@/components/DataTable';
import JsonViewer from '@/components/JsonViewer';
import StatusBadge from '@/components/StatusBadge';
import type { VPCInfo, SubnetInfo, RouteTableInfo, SecurityGroupInfo } from '@/types';
import { Network, RefreshCw } from 'lucide-react';

type Tab = 'vpcs' | 'subnets' | 'routeTables' | 'securityGroups';

export default function NetworkingSection() {
  const { credentials, darkMode, addToHistory, region } = useApp();
  const [tab, setTab] = useState<Tab>('vpcs');
  const [vpcs, setVpcs] = useState<VPCInfo[]>([]);
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);
  const [routeTables, setRouteTables] = useState<RouteTableInfo[]>([]);
  const [securityGroups, setSecurityGroups] = useState<SecurityGroupInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRouteTable, setSelectedRouteTable] = useState<RouteTableInfo | null>(null);

  const fetchData = async (resource: Tab) => {
    if (!credentials) return;
    setLoading(true);
    const result = await apiCall<any>('/api/aws/networking', credentials, { resource });
    if (result.success && result.data) {
      switch (resource) {
        case 'vpcs': setVpcs(result.data); break;
        case 'subnets': setSubnets(result.data); break;
        case 'routeTables': setRouteTables(result.data); break;
        case 'securityGroups': setSecurityGroups(result.data); break;
      }
      addToHistory({ action: `List ${resource}`, category: 'Networking', region, status: 'success', resultSummary: `Found ${result.data.length} items` });
    } else {
      addToHistory({ action: `List ${resource}`, category: 'Networking', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setLoading(false);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'vpcs', label: 'VPCs' },
    { id: 'subnets', label: 'Subnets' },
    { id: 'routeTables', label: 'Route Tables' },
    { id: 'securityGroups', label: 'Security Groups' },
  ];

  const vpcColumns = [
    { key: 'name' as keyof VPCInfo, label: 'Name' },
    { key: 'vpcId' as keyof VPCInfo, label: 'VPC ID', render: (v: unknown) => <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: 'cidrBlock' as keyof VPCInfo, label: 'CIDR' },
    { key: 'state' as keyof VPCInfo, label: 'State', render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: 'isDefault' as keyof VPCInfo, label: 'Default', render: (v: unknown) => v ? 'Yes' : 'No' },
  ];

  const subnetColumns = [
    { key: 'name' as keyof SubnetInfo, label: 'Name' },
    { key: 'subnetId' as keyof SubnetInfo, label: 'Subnet ID', render: (v: unknown) => <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: 'vpcId' as keyof SubnetInfo, label: 'VPC ID' },
    { key: 'cidrBlock' as keyof SubnetInfo, label: 'CIDR' },
    { key: 'az' as keyof SubnetInfo, label: 'AZ' },
    { key: 'availableIps' as keyof SubnetInfo, label: 'Available IPs' },
  ];

  const sgColumns = [
    { key: 'groupName' as keyof SecurityGroupInfo, label: 'Name' },
    { key: 'groupId' as keyof SecurityGroupInfo, label: 'Group ID', render: (v: unknown) => <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: 'vpcId' as keyof SecurityGroupInfo, label: 'VPC' },
    { key: 'description' as keyof SecurityGroupInfo, label: 'Description' },
    { key: 'inboundRules' as keyof SecurityGroupInfo, label: 'Inbound Rules' },
    { key: 'outboundRules' as keyof SecurityGroupInfo, label: 'Outbound Rules' },
  ];

  const rtColumns = [
    { key: 'name' as keyof RouteTableInfo, label: 'Name' },
    { key: 'routeTableId' as keyof RouteTableInfo, label: 'RT ID', render: (v: unknown) => <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: 'vpcId' as keyof RouteTableInfo, label: 'VPC' },
    { key: 'routes' as keyof RouteTableInfo, label: 'Routes', render: (v: unknown, row: RouteTableInfo) => (
      <button onClick={() => setSelectedRouteTable(row)} className="text-blue-400 hover:text-blue-300 text-xs">{Array.isArray(v) ? v.length : 0} routes</button>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-teal-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Networking</h2>
        </div>
        <button onClick={() => fetchData(tab)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Fetch {tabs.find(t => t.id === tab)?.label}
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === t.id ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'vpcs' && <DataTable data={vpcs as unknown as Record<string, unknown>[]} columns={vpcColumns as any} title="VPCs" loading={loading} />}
      {tab === 'subnets' && <DataTable data={subnets as unknown as Record<string, unknown>[]} columns={subnetColumns as any} title="Subnets" loading={loading} />}
      {tab === 'routeTables' && (
        <>
          <DataTable data={routeTables as unknown as Record<string, unknown>[]} columns={rtColumns as any} title="Route Tables" loading={loading} />
          {selectedRouteTable && <JsonViewer data={selectedRouteTable.routes} title={`Routes for ${selectedRouteTable.routeTableId}`} />}
        </>
      )}
      {tab === 'securityGroups' && <DataTable data={securityGroups as unknown as Record<string, unknown>[]} columns={sgColumns as any} title="Security Groups" loading={loading} />}
    </div>
  );
}
