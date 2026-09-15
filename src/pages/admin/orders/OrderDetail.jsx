import { useParams } from 'react-router-dom';
import { Spinner } from '../../../components/ui/Spinner';
import { OrderStatusBadge } from '../../../components/common/OrderStatusBadge';
import { PriceDisplay } from '../../../components/common/PriceDisplay';
import { OrderStatusUpdater } from '../../../components/admin/OrderStatusUpdater';
import { TrackingForm } from '../../../components/admin/TrackingForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useAsync } from '../../../hooks/useAsync';
import { orderApi } from '../../../api/orderApi';
import { useToast } from '../../../context/ToastContext';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useState } from 'react';

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, loading, refetch } = useAsync(() => orderApi.adminGetById(id), [id]);
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingTracking, setUpdatingTracking] = useState(false);

  const handleStatusUpdate = async (status) => {
    setUpdatingStatus(true);
    try {
      await orderApi.adminUpdateStatus(id, status);
      toast({ title: 'Order status updated', variant: 'success' });
      refetch();
    } catch (err) {
      toast({ title: 'Could not update status', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleTrackingUpdate = async (trackingData) => {
    setUpdatingTracking(true);
    try {
      await orderApi.adminUpdateTracking(id, trackingData);
      toast({ title: 'Tracking updated', variant: 'success' });
      refetch();
    } catch (err) {
      toast({ title: 'Could not update tracking', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setUpdatingTracking(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            {order.user?.name} — {order.user?.email}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-4">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <PriceDisplay price={item.price * item.quantity} />
                  </li>
                ))}
              </ul>
              <div className="space-y-1.5 border-t border-border p-4 text-sm">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">{order.shippingAddress.phone}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater currentStatus={order.status} onUpdate={handleStatusUpdate} updating={updatingStatus} />
              <p className="mt-3 text-xs text-muted-foreground">
                Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay (online)'}
              </p>
              <p className="text-xs text-muted-foreground">
                Payment:{' '}
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString('en-IN')}`
                  : order.paymentMethod === 'cod'
                    ? 'Due on delivery'
                    : 'Not paid'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackingForm tracking={order.tracking} onSubmit={handleTrackingUpdate} submitting={updatingTracking} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
