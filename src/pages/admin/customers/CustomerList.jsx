import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { DataTable } from '../../../components/admin/DataTable';
import { useAsync } from '../../../hooks/useAsync';
import { adminApi } from '../../../api/adminApi';

export default function CustomerList() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(() => adminApi.customers({ page, limit: 15 }), [page]);

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-foreground">{row.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '—' },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Link to={`/admin/customers/${row._id}`} className="text-muted-foreground hover:text-foreground" aria-label="View customer">
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">Customers</h1>
      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={loading}
        page={data?.page || 1}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No customers yet"
      />
    </div>
  );
}
