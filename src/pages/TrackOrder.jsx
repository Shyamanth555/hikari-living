import { useState } from 'react';
import { PackageCheck, PackageSearch } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { OrderStatusBadge } from '../components/common/OrderStatusBadge';
import { ShipmentTimeline } from '../components/common/ShipmentTimeline';
import { orderApi } from '../api/orderApi';

export default function TrackOrder() {
  const [form, setForm] = useState({ orderNumber: '', email: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await orderApi.track(form.orderNumber.trim(), form.email.trim());
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'No order found for those details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-14">
      <SEO title="Track Your Order" />
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <PackageSearch className="mx-auto h-10 w-10 text-primary" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-3xl text-foreground">Track Your Order</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your order number and the email used at checkout.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="orderNumber">
              Order number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="orderNumber"
              placeholder="HL-20260101-12345"
              value={form.orderNumber}
              onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? 'Searching…' : 'Track Order'}
          </Button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}

        {result && (
          <div className="mt-8 rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">{result.orderNumber}</p>
              <OrderStatusBadge status={result.status} />
            </div>

            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            {result.status === 'delivered' && (
              <p className="mt-5 flex items-center gap-2 text-sm text-pine-600">
                <PackageCheck className="h-4 w-4" /> Delivered — thanks for shopping with us.
              </p>
            )}

            {result.tracking?.trackingId ? (
              <ShipmentTimeline
                className="mt-5"
                tracking={result.tracking}
                isDelivered={result.status === 'delivered'}
              />
            ) : (
              result.status !== 'delivered' && (
                <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <PackageCheck className="h-4 w-4" /> Tracking details will appear here once your order ships.
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
