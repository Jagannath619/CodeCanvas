'use client';
import { useApp } from '@/lib/store';
import { AWS_REGIONS } from '@/types';
import { Globe, Clock } from 'lucide-react';

export default function TopBar() {
  const { region, setRegion, darkMode, accountInfo } = useApp();

  return (
    <header className={`h-14 border-b flex items-center justify-between px-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className={`text-sm font-medium rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'
            } border`}
          >
            {AWS_REGIONS.map(r => (
              <option key={r.code} value={r.code}>{r.code}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {accountInfo?.arn && `${accountInfo.arn.split(':').pop()}`}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  );
}
