'use client';
import { useApp } from '@/lib/store';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import type { CommandHistoryEntry } from '@/types';
import { History, Trash2 } from 'lucide-react';

export default function HistorySection() {
  const { commandHistory, clearHistory, darkMode } = useApp();

  const columns = [
    { key: 'timestamp' as keyof CommandHistoryEntry, label: 'Time', render: (v: unknown) => new Date(String(v)).toLocaleString() },
    { key: 'category' as keyof CommandHistoryEntry, label: 'Category' },
    { key: 'action' as keyof CommandHistoryEntry, label: 'Action' },
    { key: 'region' as keyof CommandHistoryEntry, label: 'Region' },
    { key: 'status' as keyof CommandHistoryEntry, label: 'Status', render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: 'resultSummary' as keyof CommandHistoryEntry, label: 'Result' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-gray-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Command History</h2>
        </div>
        {commandHistory.length > 0 && (
          <button onClick={clearHistory} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg">
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>
      <DataTable data={commandHistory as unknown as Record<string, unknown>[]} columns={columns as any} title="History" emptyMessage="No commands executed yet" />
    </div>
  );
}
