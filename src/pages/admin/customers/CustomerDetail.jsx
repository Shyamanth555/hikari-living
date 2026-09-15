import { Link, useParams } from 'react-router-dom';
import { Spinner } from '../../../components/ui/Spinner';
import { OrderStatusBadge } from '../../../components/common/OrderStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useAsync } from '../../../hooks/useAsync';
import { adminApi } from '../../../api/adminApi';
import { formatCurrency } from '../../../lib/formatCurrency';

export default function CustomerDetail() {
  const { id } = useParams();
  const { data, loading } = useAsync(() => adminApi.customerById(id), [id]);

  if (loading || !data) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  const { user, orders } = data;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">{user.name}</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>{user.email}</p>
            <p>{user.phone || 'No phone on file'}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {(user.addresses || []).length === 0 && <p>No saved addresses.</p>}
            {(user.addresses || []).map((addr) => (
              <div key={addr._id}>
                <p className="font-medium text-foreground">{addr.fullName}</p>
                <p>
                  {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Order History</h2>
        <div className="divide-y divide-border rounded-lg border border-border">
          {orders.length === 0 && <p className="p-4 text-sm text-muted-foreground">No orders yet.</p>}
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/admin/orders/${order._id}`}
              className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm hover:bg-cream-100"
            >
              <span className="font-medium text-foreground">{order.orderNumber}</span>
              <span className="text-muted-foreground">{formatCurrency(order.totalPrice)}</span>
              <OrderStatusBadge status={order.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
