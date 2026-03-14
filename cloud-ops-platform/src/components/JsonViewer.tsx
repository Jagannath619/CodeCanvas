'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Copy, Check } from 'lucide-react';

export default function JsonViewer({ data, title }: { data: unknown; title?: string }) {
  const { darkMode } = useApp();
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">
            {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
      )}
      <pre className={`p-4 text-sm overflow-x-auto max-h-96 ${darkMode ? 'text-green-400' : 'text-gray-800'}`}>
        <code>{json}</code>
      </pre>
    </div>
  );
}
