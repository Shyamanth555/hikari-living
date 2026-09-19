import { Link } from 'react-router-dom';
import { IndianRupee, Package, ShoppingCart, Users } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAsync } from '../../hooks/useAsync';
import { adminApi } from '../../api/adminApi';
import { formatCurrency } from '../../lib/formatCurrency';

export default function Dashboard() {
  const { data, loading } = useAsync(() => adminApi.dashboardSummary(), []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">Dashboard</h1>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingCart} to="/admin/orders" />
          <StatCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={IndianRupee} to="/admin/orders" />
          <StatCard label="Products" value={data.totalProducts} icon={Package} to="/admin/products" />
          <StatCard label="Customers" value={data.totalCustomers} icon={Users} to="/admin/customers" />
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Orders</h2>
        <div className="divide-y divide-border rounded-lg border border-border">
          {(data?.recentOrders || []).map((order) => (
            <Link
              key={order._id}
              to={`/admin/orders/${order._id}`}
              className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm hover:bg-cream-100"
            >
              <span className="font-medium text-foreground">{order.orderNumber}</span>
              <span className="text-muted-foreground">{order.user?.name}</span>
              <span className="text-muted-foreground">{formatCurrency(order.totalPrice)}</span>
              <OrderStatusBadge status={order.status} />
            </Link>
          ))}
          {data && data.recentOrders.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
