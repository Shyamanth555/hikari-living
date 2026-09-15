import { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { contactApi } from '../../api/contactApi';

export default function ContactMessages() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(() => contactApi.adminList({ page, limit: 15 }), [page]);

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-foreground">{row.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '—' },
    { key: 'message', label: 'Message', render: (row) => <span className="line-clamp-2 max-w-xs">{row.message}</span> },
    {
      key: 'createdAt',
      label: 'Received',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'new' ? 'clay' : 'neutral'}>{row.status}</Badge>,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">Contact Messages</h1>
      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={loading}
        page={data?.page || 1}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No messages yet"
      />
    </div>
  );
}
