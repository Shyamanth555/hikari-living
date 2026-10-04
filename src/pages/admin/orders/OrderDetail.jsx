import { useParams } from 'react-router-dom';
import { AlertTriangle, Printer, RefreshCw } from 'lucide-react';
import { Spinner } from '../../../components/ui/Spinner';
import { OrderStatusBadge } from '../../../components/common/OrderStatusBadge';
import { PriceDisplay } from '../../../components/common/PriceDisplay';
import { ShipmentTimeline } from '../../../components/common/ShipmentTimeline';
import { OrderStatusUpdater } from '../../../components/admin/OrderStatusUpdater';
import { TrackingForm } from '../../../components/admin/TrackingForm';
import { ParcelForm } from '../../../components/admin/ParcelForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/Accordion';
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
  const [shipping, setShipping] = useState(false);
  const [retryingPickup, setRetryingPickup] = useState(false);
  const [syncingTracking, setSyncingTracking] = useState(false);
  const [downloadingLabel, setDownloadingLabel] = useState(false);
  const [labelUrl, setLabelUrl] = useState('');

  const handleDownloadLabel = async () => {
    // Open the tab synchronously, inside the click, so the browser doesn't
    // block it as a popup — then point it at the PDF once Shiprocket replies.
    const labelWindow = window.open('', '_blank');
    labelWindow?.document.write('<p style="font-family:sans-serif;padding:24px">Generating shipping label…</p>');
    setDownloadingLabel(true);
    try {
      const { labelUrl: url } = await orderApi.adminGetShiprocketLabel(id);
      setLabelUrl(url);
      if (labelWindow) {
        labelWindow.opener = null;
        labelWindow.location.href = url;
      }
    } catch (err) {
      labelWindow?.close();
      toast({
        title: 'Could not download label',
        description: err?.response?.data?.message,
        variant: 'destructive',
      });
    } finally {
      setDownloadingLabel(false);
    }
  };

  const handleSyncTracking = async () => {
    setSyncingTracking(true);
    try {
      await orderApi.adminSyncShiprocketTracking(id);
      toast({ title: 'Tracking status updated', variant: 'success' });
      refetch();
    } catch (err) {
      toast({
        title: 'Could not refresh tracking',
        description: err?.response?.data?.message,
        variant: 'destructive',
      });
    } finally {
      setSyncingTracking(false);
    }
  };

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

  const handleShipNow = async (parcel) => {
    setShipping(true);
    try {
      await orderApi.adminShipWithShiprocket(id, parcel);
      toast({ title: 'Shiprocket shipment created', variant: 'success' });
      refetch();
    } catch (err) {
      toast({
        title: 'Shiprocket shipment failed',
        description: err?.response?.data?.message,
        variant: 'destructive',
      });
      // A 502 means Shiprocket itself rejected it and the error was saved on the
      // order — reload to show it. Anything else (e.g. a validation error) is
      // left alone so the admin's parcel entries aren't wiped by the reload.
      if (err?.response?.status === 502) refetch();
    } finally {
      setShipping(false);
    }
  };

  const handleRetryPickup = async () => {
    setRetryingPickup(true);
    try {
      await orderApi.adminRetryShiprocketPickup(id);
      toast({ title: 'Pickup scheduled', variant: 'success' });
      refetch();
    } catch (err) {
      toast({
        title: 'Pickup request failed',
        description: err?.response?.data?.message,
        variant: 'destructive',
      });
      refetch();
    } finally {
      setRetryingPickup(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  const hasShiprocketShipment = order.tracking?.provider === 'shiprocket' && order.tracking?.trackingId;
  const hasManualTracking = order.tracking?.provider === 'manual' && order.tracking?.trackingId;
  const isShippableStatus = ['pending', 'processing'].includes(order.status);
  const awaitingPayment = order.paymentMethod === 'razorpay' && !order.isPaid;
  const canShip = !order.tracking?.trackingId && isShippableStatus && !awaitingPayment;

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
              <CardTitle>{hasShiprocketShipment ? 'Order Status' : 'Update Status'}</CardTitle>
            </CardHeader>
            <CardContent>
              {hasShiprocketShipment ? (
                // Once Shiprocket has the shipment, the courier's scans are the
                // only source of truth for status — no manual changes.
                <div>
                  <OrderStatusBadge status={order.status} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated automatically by Shiprocket as the courier moves the parcel. If it looks out of date,
                    use &ldquo;Refresh status from Shiprocket&rdquo; under Shipment.
                  </p>
                </div>
              ) : (
                <OrderStatusUpdater
                  currentStatus={order.status}
                  onUpdate={handleStatusUpdate}
                  updating={updatingStatus}
                  canAwaitPayment={awaitingPayment}
                />
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay (online)'}
              </p>
              <p className="text-xs text-muted-foreground">
                Payment:{' '}
                {order.paymentMethod === 'cod'
                  ? order.isPaid
                    ? `Cash collected on delivery (${new Date(order.paidAt).toLocaleDateString('en-IN')})`
                    : 'Customer pays the courier in cash on delivery'
                  : order.isPaid
                    ? `Paid on ${new Date(order.paidAt).toLocaleDateString('en-IN')}`
                    : 'Not paid'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipment</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipmentError && (
                <div className="mb-4 rounded-md border border-destructive/30 bg-red-50 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    {hasShiprocketShipment ? 'Pickup not scheduled' : 'Shipment failed'}
                  </div>
                  <p className="mt-1 text-sm text-destructive/90">{order.shipmentError}</p>
                  {hasShiprocketShipment ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      disabled={retryingPickup}
                      onClick={handleRetryPickup}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {retryingPickup ? 'Retrying…' : 'Retry Pickup Request'}
                    </Button>
                  ) : (
                    canShip && (
                      <p className="mt-2 text-xs text-destructive/90">
                        Check the parcel details below and click Ship Now to try again.
                      </p>
                    )
                  )}
                </div>
              )}

              {hasShiprocketShipment ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent">via Shiprocket</Badge>
                    <Badge variant={order.tracking.pickupScheduled ? 'accent' : 'warning'}>
                      {order.tracking.pickupScheduled ? 'Pickup scheduled' : 'Pickup pending'}
                    </Badge>
                  </div>
                  {!['cancelled', 'delivered'].includes(order.status) && (
                    <div>
                      <Button className="w-full" disabled={downloadingLabel} onClick={handleDownloadLabel}>
                        <Printer className="h-4 w-4" />
                        {downloadingLabel ? 'Generating label…' : 'Download Shipping Label'}
                      </Button>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Print it and stick it on the parcel before the courier picks it up.
                        {labelUrl && (
                          <>
                            {' '}
                            Didn&apos;t open?{' '}
                            <a
                              href={labelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline"
                            >
                              Open the label PDF
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                  <ShipmentTimeline
                    tracking={order.tracking}
                    isDelivered={order.status === 'delivered'}
                    showRawStatus
                  />
                  {order.parcel?.weight && (
                    <p className="text-sm text-muted-foreground">
                      Parcel: {order.parcel.weight} kg · {order.parcel.length} × {order.parcel.breadth} ×{' '}
                      {order.parcel.height} cm
                    </p>
                  )}
                  <Button size="sm" variant="outline" disabled={syncingTracking} onClick={handleSyncTracking}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    {syncingTracking ? 'Refreshing…' : 'Refresh status from Shiprocket'}
                  </Button>
                </div>
              ) : hasManualTracking ? (
                <ShipmentTimeline tracking={order.tracking} isDelivered={order.status === 'delivered'} />
              ) : canShip ? (
                <>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Pack the order, then enter the parcel&apos;s weight and size. Shiprocket uses these to assign a
                    courier and calculate the shipping charge.
                  </p>
                  <ParcelForm
                    parcel={order.parcel}
                    suggestedWeight={order.suggestedParcelWeightKg}
                    onSubmit={handleShipNow}
                    submitting={shipping}
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {!isShippableStatus
                    ? `No shipment can be created for a ${order.status} order.`
                    : 'Waiting for payment — this order can be shipped once the customer has paid.'}
                </p>
              )}

              {!hasShiprocketShipment && (
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="manual">
                    <AccordionTrigger className="text-sm">Manual tracking override</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3 text-xs text-muted-foreground">
                        For shipments sent outside Shiprocket. Submitting this replaces whatever tracking info is
                        currently shown.
                      </p>
                      <TrackingForm
                        tracking={order.tracking}
                        onSubmit={handleTrackingUpdate}
                        submitting={updatingTracking}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
