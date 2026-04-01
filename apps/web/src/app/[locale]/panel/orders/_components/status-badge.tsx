'use client';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-rose-100 text-rose-800',
  refunded: 'bg-slate-100 text-slate-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-rose-100 text-rose-800',
};

export function StatusBadge({
  status,
  type = 'order',
}: {
  status: string;
  type?: 'order' | 'payment';
}) {
  const colorClass = statusColors[status] ?? 'bg-slate-100 text-slate-800';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colorClass}`}
    >
      {status}
    </span>
  );
}
