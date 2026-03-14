'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { apiCall, apiPut } from '@/lib/api-client';
import DataTable from '@/components/DataTable';
import type { S3Bucket, S3Object } from '@/types';
import { HardDrive, FolderOpen, RefreshCw, ArrowLeft, Download, Upload } from 'lucide-react';

export default function StorageSection() {
  const { credentials, darkMode, addToHistory, region } = useApp();
  const [buckets, setBuckets] = useState<S3Bucket[]>([]);
  const [objects, setObjects] = useState<S3Object[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentBucket, setCurrentBucket] = useState<string | null>(null);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'buckets' | 'objects'>('buckets');

  const fetchBuckets = async () => {
    if (!credentials) return;
    setLoading(true);
    const result = await apiCall<S3Bucket[]>('/api/aws/s3', credentials);
    if (result.success && result.data) {
      setBuckets(result.data);
      setView('buckets');
      addToHistory({ action: 'List S3 Buckets', category: 'Storage', region, status: 'success', resultSummary: `Found ${result.data.length} buckets` });
    } else {
      addToHistory({ action: 'List S3 Buckets', category: 'Storage', region, status: 'error', resultSummary: result.error || 'Failed' });
    }
    setLoading(false);
  };

  const browseBucket = async (bucketName: string, prefix = '') => {
    if (!credentials) return;
    setLoading(true);
    setCurrentBucket(bucketName);
    setCurrentPrefix(prefix);
    const result = await apiPut<{ objects: S3Object[]; folders: string[] }>('/api/aws/s3', credentials, { bucketName, prefix });
    if (result.success && result.data) {
      setObjects(result.data.objects);
      setFolders(result.data.folders);
      setView('objects');
    }
    setLoading(false);
  };

  const getPresignedUrl = async (key: string, action: 'download' | 'upload') => {
    if (!credentials || !currentBucket) return;
    const result = await apiCall<{ url: string }>('/api/aws/s3/presign', credentials, { bucketName: currentBucket, key, action });
    if (result.success && result.data) {
      if (action === 'download') {
        window.open(result.data.url, '_blank');
      }
      addToHistory({ action: `${action} S3 object: ${key}`, category: 'Storage', region, status: 'success', resultSummary: 'Presigned URL generated' });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const bucketColumns = [
    { key: 'name' as keyof S3Bucket, label: 'Bucket Name', render: (v: unknown) => (
      <button onClick={() => browseBucket(String(v))} className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
        <FolderOpen className="w-3.5 h-3.5" />{String(v)}
      </button>
    )},
    { key: 'creationDate' as keyof S3Bucket, label: 'Created', render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString() : 'N/A' },
  ];

  const objectColumns = [
    { key: 'key' as keyof S3Object, label: 'Key', render: (v: unknown) => <code className="text-xs">{String(v)}</code> },
    { key: 'size' as keyof S3Object, label: 'Size', render: (v: unknown) => formatBytes(Number(v)) },
    { key: 'lastModified' as keyof S3Object, label: 'Modified', render: (v: unknown) => v ? new Date(String(v)).toLocaleString() : '' },
    { key: 'storageClass' as keyof S3Object, label: 'Class' },
    { key: 'key' as keyof S3Object, label: 'Actions', render: (v: unknown) => (
      <button onClick={() => getPresignedUrl(String(v), 'download')} className="p-1 hover:bg-blue-900/30 rounded text-blue-400" title="Download">
        <Download className="w-3.5 h-3.5" />
      </button>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-purple-400" />
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Storage</h2>
          {view === 'objects' && currentBucket && (
            <span className="text-sm text-gray-500">/ {currentBucket}{currentPrefix && ` / ${currentPrefix}`}</span>
          )}
        </div>
        <div className="flex gap-2">
          {view === 'objects' && (
            <button onClick={() => {
              if (currentPrefix) {
                const parts = currentPrefix.split('/').filter(Boolean);
                parts.pop();
                browseBucket(currentBucket!, parts.length ? parts.join('/') + '/' : '');
              } else {
                setView('buckets');
              }
            }} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button onClick={fetchBuckets} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {view === 'buckets' ? 'List Buckets' : 'Refresh'}
          </button>
        </div>
      </div>

      {view === 'buckets' ? (
        <DataTable data={buckets as unknown as Record<string, unknown>[]} columns={bucketColumns as any} title="S3 Buckets" loading={loading} emptyMessage="Click 'List Buckets' to fetch data" />
      ) : (
        <>
          {folders.length > 0 && (
            <div className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Folders</h4>
              <div className="flex flex-wrap gap-2">
                {folders.map(f => (
                  <button key={f} onClick={() => browseBucket(currentBucket!, f)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300">
                    <FolderOpen className="w-3.5 h-3.5 text-yellow-400" />{f.split('/').filter(Boolean).pop()}
                  </button>
                ))}
              </div>
            </div>
          )}
          <DataTable data={objects as unknown as Record<string, unknown>[]} columns={objectColumns as any} title="Objects" loading={loading} emptyMessage="No objects in this prefix" />
        </>
      )}
    </div>
  );
}
