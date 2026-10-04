import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { ShipmentTimeline } from '../../components/common/ShipmentTimeline';
import { CancelOrderDialog } from '../../components/common/CancelOrderDialog';
import { useAsync } from '../../hooks/useAsync';
import { orderApi } from '../../api/orderApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../lib/formatCurrency';

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { data: order, loading, error, refetch } = useAsync(() => orderApi.myByNumber(orderNumber), [orderNumber]);
  const { toast } = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderApi.cancelMy(orderNumber);
      toast({ title: 'Order cancelled', variant: 'success' });
      setConfirmCancel(false);
      refetch();
    } catch (err) {
      toast({ title: 'Could not cancel order', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !order) {
    return <p className="text-muted-foreground">Order not found.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.paymentMethod === 'cod'
              ? order.isPaid
                ? 'Cash on Delivery — paid'
                : 'Cash on Delivery — pay on arrival'
              : order.isPaid
                ? 'Paid online'
                : 'Payment pending'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {order.canCancel && (
            <Button size="sm" variant="outline" onClick={() => setConfirmCancel(true)}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <CancelOrderDialog open={confirmCancel} onOpenChange={setConfirmCancel} onConfirm={handleCancel} cancelling={cancelling}>
        You can cancel until the courier picks up your parcel. This can&apos;t be undone.
        {order.isPaid && order.paymentMethod === 'razorpay' &&
          ` Your payment of ${formatCurrency(order.totalPrice)} will be refunded to your original payment method.`}
      </CancelOrderDialog>

      <ShipmentTimeline className="mt-5" tracking={order.tracking} isDelivered={order.status === 'delivered'} />

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Items</h3>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 p-4">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                  {order.status === 'delivered' && item.product?.slug && (
                    <Link
                      to={`/product/${item.product.slug}#reviews`}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Star className="h-3.5 w-3.5" /> Write a review
                    </Link>
                  )}
                </div>
                <PriceDisplay price={item.price * item.quantity} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Shipping Address</h3>
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">{order.shippingAddress.phone}</p>
          </div>

          <div className="mt-4 space-y-1.5 rounded-lg border border-border p-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-medium text-foreground">
              <span>Total</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
