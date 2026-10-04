import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { DataTable } from '../../../components/admin/DataTable';
import { OrderStatusBadge } from '../../../components/common/OrderStatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { useAsync } from '../../../hooks/useAsync';
import { orderApi } from '../../../api/orderApi';
import { formatCurrency } from '../../../lib/formatCurrency';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../../lib/constants';
import { courierStatusLabel } from '../../../lib/courierStatus';

export default function OrderList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const { data, loading } = useAsync(
    () => orderApi.adminList({ page, limit: 15, status: status === 'all' ? undefined : status }),
    [page, status]
  );

  const columns = [
    { key: 'orderNumber', label: 'Order', render: (row) => <span className="font-medium text-foreground">{row.orderNumber}</span> },
    { key: 'customer', label: 'Customer', render: (row) => row.user?.name },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    { key: 'totalPrice', label: 'Total', render: (row) => formatCurrency(row.totalPrice) },
    {
      key: 'isPaid',
      label: 'Paid',
      render: (row) => (row.isPaid ? 'Yes' : row.paymentMethod === 'cod' ? 'On delivery (COD)' : 'No'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div>
          <OrderStatusBadge status={row.status} />
          {row.status === 'shipped' && row.tracking?.courierStatus && (
            <p className="mt-1 text-xs text-muted-foreground">{courierStatusLabel(row.tracking.courierStatus)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Link to={`/admin/orders/${row._id}`} className="text-muted-foreground hover:text-foreground" aria-label="View order">
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-foreground">Orders</h1>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
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
        emptyMessage="No orders yet"
      />
    </div>
  );
}
