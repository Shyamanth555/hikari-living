import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { useAsync } from '../../hooks/useAsync';
import { orderApi } from '../../api/orderApi';
import { formatCurrency } from '../../lib/formatCurrency';
import { useState } from 'react';

export default function OrderHistory() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(() => orderApi.my({ page, limit: 10 }), [page]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No orders yet"
        description="Once you place an order, it will show up here."
        action={
          <Button asChild>
            <Link to="/shop">Start Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="divide-y divide-border rounded-lg border border-border">
        {data.data.map((order) => (
          <Link
            key={order._id}
            to={`/account/orders/${order.orderNumber}`}
            className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-cream-100"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
            <p className="text-sm font-medium text-foreground">{formatCurrency(order.totalPrice)}</p>
            <OrderStatusBadge status={order.status} />
          </Link>
        ))}
      </div>

      <Pagination page={data.page} pages={data.pages} onPageChange={setPage} className="mt-6" />
    </div>
  );
}
