import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { useAsync } from '../hooks/useAsync';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../lib/formatCurrency';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { data: order, loading, error } = useAsync(() => orderApi.myByNumber(orderNumber), [orderNumber]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !order) {
    return <div className="container-page py-20 text-center text-muted-foreground">Order not found.</div>;
  }

  return (
    <div className="container-page py-14">
      <SEO title="Order Confirmed" />
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-pine-500" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-3xl text-foreground">Thank you for your order</h1>
        <p className="mt-2 text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.orderNumber}</span> has been placed
          {order.paymentMethod === 'cod'
            ? ` — pay ${formatCurrency(order.totalPrice)} in cash when it arrives.`
            : order.isPaid
              ? ' and payment confirmed.'
              : '.'}
        </p>

        <div className="mt-8 rounded-lg border border-border p-6 text-left">
          <ul className="divide-y divide-border">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <PriceDisplay price={item.price * item.quantity} />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium">
            <span>Total</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link to={`/account/orders/${order.orderNumber}`}>View Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
