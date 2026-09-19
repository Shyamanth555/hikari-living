import { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { useAsync } from '../../hooks/useAsync';
import { contactApi } from '../../api/contactApi';

const TYPE_LABELS = {
  general: 'General',
  'custom-sculpture': 'Custom Sculpture',
  'corporate-gifting': 'Corporate Gifting',
};

export default function ContactMessages() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');
  const { data, loading } = useAsync(
    () => contactApi.adminList({ page, limit: 15, type: type === 'all' ? undefined : type }),
    [page, type]
  );

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-foreground">{row.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '—' },
    {
      key: 'type',
      label: 'Type',
      render: (row) => <Badge variant={row.type === 'general' ? 'neutral' : 'gold'}>{TYPE_LABELS[row.type] || row.type}</Badge>,
    },
    { key: 'message', label: 'Message', render: (row) => <span className="line-clamp-2 max-w-xs">{row.message}</span> },
    {
      key: 'createdAt',
      label: 'Received',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'new' ? 'accent' : 'neutral'}>{row.status}</Badge>,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-foreground">Messages & Enquiries</h1>
        <Select
          value={type}
          onValueChange={(v) => {
            setType(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="general">General Contact</SelectItem>
            <SelectItem value="custom-sculpture">Custom Sculpture</SelectItem>
            <SelectItem value="corporate-gifting">Corporate Gifting</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
