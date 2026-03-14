'use client';

const statusColors: Record<string, string> = {
  running: 'bg-green-500/20 text-green-400 border-green-500/30',
  available: 'bg-green-500/20 text-green-400 border-green-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  ok: 'bg-green-500/20 text-green-400 border-green-500/30',
  stopped: 'bg-red-500/20 text-red-400 border-red-500/30',
  terminated: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  stopping: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  alarm: 'bg-red-500/20 text-red-400 border-red-500/30',
  insufficient_data: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase().replace(/[ -]/g, '_');
  const colors = statusColors[lower] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
      {status}
    </span>
  );
}
