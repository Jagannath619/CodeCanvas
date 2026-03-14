'use client';
import { useState } from 'react';
import { Download, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { exportToCSV } from '@/lib/csv-export';
import { useApp } from '@/lib/store';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  title: string;
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({ data, columns, title, loading, emptyMessage = 'No data found' }: Props<T>) {
  const { darkMode } = useApp();
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredData = data.filter(row =>
    columns.some(col => String(row[col.key] || '').toLowerCase().includes(search.toLowerCase()))
  );

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const av = String(a[sortKey] || '');
        const bv = String(b[sortKey] || '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filteredData;

  return (
    <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title} <span className="text-gray-500 font-normal text-sm">({sortedData.length})</span></h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter..."
              className={`pl-8 pr-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
          {data.length > 0 && (
            <button
              onClick={() => exportToCSV(data as Record<string, unknown>[], title.toLowerCase().replace(/\s+/g, '-'))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-3 text-sm">Loading...</p>
        </div>
      ) : sortedData.length === 0 ? (
        <div className="p-12 text-center text-gray-500 text-sm">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}>
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    onClick={() => handleSort(col.key)}
                    className={`px-4 py-3 text-left font-medium cursor-pointer select-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {sortedData.map((row, i) => (
                <tr key={i} className={`${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                  {columns.map(col => (
                    <td key={String(col.key)} className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
