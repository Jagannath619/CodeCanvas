'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { apiCall } from '@/lib/api-client';
import DataTable from '@/components/DataTable';
import JsonViewer from '@/components/JsonViewer';
import type { IAMUser, IAMRole } from '@/types';
import { Shield, RefreshCw, FileSearch } from 'lucide-react';

type Tab = 'users' | 'roles';

export default function SecuritySection() {
  const { credentials, darkMode, addToHistory, region } = useApp();
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [roles, setRoles] = useState<IAMRole[]>([]);
  const [accessAdvisor, setAccessAdvisor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  const fetchData = async (resource: Tab) => {
    if (!credentials) return;
    setLoading(true);
    const result = await apiCall<any>('/api/aws/iam', credentials, { resource });
    if (result.success && result.data) {
      if (resource === 'users') setUsers(result.data);
      else setRoles(result.data);
      addToHistory({ action: `List IAM ${resource}`, category: 'Security', region, status: 'success', resultSummary: `Found ${result.data.length} ${resource}` });
    } else {
      addToHistory({ action: `List IAM ${resource}`, category: 'Security', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setLoading(false);
  };

  const fetchAccessAdvisor = async (arn: string) => {
    if (!credentials) return;
    setAdvisorLoading(true);
    const result = await apiCall<any>('/api/aws/iam', credentials, { resource: 'accessAdvisor', arn });
    if (result.success && result.data) {
      setAccessAdvisor(result.data);
      addToHistory({ action: 'Access Advisor', category: 'Security', region, status: 'success', resultSummary: `${result.data.services?.length || 0} services` });
    }
    setAdvisorLoading(false);
  };

  const userColumns = [
    { key: 'userName' as keyof IAMUser, label: 'User Name' },
    { key: 'userId' as keyof IAMUser, label: 'User ID' },
    { key: 'createDate' as keyof IAMUser, label: 'Created', render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : 'N/A' },
    { key: 'passwordLastUsed' as keyof IAMUser, label: 'Password Last Used', render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : 'Never' },
    { key: 'arn' as keyof IAMUser, label: 'Access Advisor', render: (v: unknown) => (
      <button onClick={() => fetchAccessAdvisor(String(v))} disabled={advisorLoading} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
        <FileSearch className="w-3.5 h-3.5" /> View
      </button>
    )},
  ];

  const roleColumns = [
    { key: 'roleName' as keyof IAMRole, label: 'Role Name' },
    { key: 'description' as keyof IAMRole, label: 'Description', render: (v: unknown) => String(v || 'N/A') },
    { key: 'createDate' as keyof IAMRole, label: 'Created', render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : 'N/A' },
    { key: 'arn' as keyof IAMRole, label: 'ARN', render: (v: unknown) => <code className="text-xs">{String(v)}</code> },
    { key: 'arn' as keyof IAMRole, label: 'Access Advisor', render: (v: unknown) => (
      <button onClick={() => fetchAccessAdvisor(String(v))} disabled={advisorLoading} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
        <FileSearch className="w-3.5 h-3.5" /> View
      </button>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Security</h2>
        </div>
        <button onClick={() => fetchData(tab)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Fetch {tab === 'users' ? 'IAM Users' : 'IAM Roles'}
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg w-fit">
        <button onClick={() => setTab('users')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'users' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>IAM Users</button>
        <button onClick={() => setTab('roles')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'roles' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>IAM Roles</button>
      </div>

      {tab === 'users' && <DataTable data={users as unknown as Record<string, unknown>[]} columns={userColumns as any} title="IAM Users" loading={loading} />}
      {tab === 'roles' && <DataTable data={roles as unknown as Record<string, unknown>[]} columns={roleColumns as any} title="IAM Roles" loading={loading} />}
      {accessAdvisor && <JsonViewer data={accessAdvisor} title="Access Advisor Details" />}
    </div>
  );
}
