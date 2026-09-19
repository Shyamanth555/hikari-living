import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { AddressForm } from '../components/common/AddressForm';
import { CartSummary } from '../components/cart/CartSummary';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { userApi } from '../api/userApi';
import { PAYMENT_METHODS } from '../lib/constants';
import { cn } from '../lib/cn';
import { calculateSavings } from '../lib/cartMath';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { items, subtotal, loading, refetch } = useCart();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const savedAddresses = user?.addresses || [];
  const [selectedAddressId, setSelectedAddressId] = useState(
    savedAddresses.find((a) => a.isDefault)?._id || savedAddresses[0]?._id || null
  );

  const payWithRazorpay = async (order, shippingAddress) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast({ title: 'Could not load payment gateway', description: 'Please check your connection and try again.', variant: 'destructive' });
      setPlacing(false);
      return;
    }

    const razorpayOrder = await paymentApi.createRazorpayOrder(order._id);

    const rzp = new window.Razorpay({
      key: razorpayOrder.key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Hikari Living',
      description: `Order ${order.orderNumber}`,
      order_id: razorpayOrder.razorpayOrderId,
      prefill: {
        name: shippingAddress.fullName,
        email: user?.email,
        contact: shippingAddress.phone,
      },
      theme: { color: '#b08f42' },
      handler: async (response) => {
        try {
          await paymentApi.verify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: order._id,
          });
          await refetch();
          navigate(`/order-confirmation/${order.orderNumber}`);
        } catch {
          toast({
            title: 'Payment verification failed',
            description: 'If money was deducted, contact us with your order number.',
            variant: 'destructive',
          });
        }
      },
      modal: {
        ondismiss: () => setPlacing(false),
      },
    });

    rzp.on('payment.failed', () => {
      toast({ title: 'Payment failed', description: 'Please try again.', variant: 'destructive' });
      setPlacing(false);
    });

    rzp.open();
  };

  const handleNewAddressSubmit = async (data) => {
    setPlacing(true);
    try {
      const updated = await userApi.addAddress(data);
      updateUser(updated);
      const savedAddress = updated.addresses[updated.addresses.length - 1];
      setSelectedAddressId(savedAddress._id);
      await handlePlaceOrder(savedAddress);
    } catch (err) {
      toast({
        title: 'Could not save address',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async (shippingAddress) => {
    setPlacing(true);
    try {
      const order = await orderApi.create(shippingAddress, paymentMethod);

      if (paymentMethod === 'cod') {
        await refetch();
        navigate(`/order-confirmation/${order.orderNumber}`);
        return;
      }

      await payWithRazorpay(order, shippingAddress);
    } catch (err) {
      toast({
        title: 'Could not place order',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add items to your cart before checking out." />
      </div>
    );
  }

  const selectedAddress = savedAddresses.find((a) => a._id === selectedAddressId);

  return (
    <div className="container-page py-10">
      <SEO title="Checkout" />
      <h1 className="mb-8 font-display text-3xl text-foreground">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-8 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                htmlFor={`payment-${method.value}`}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors',
                  paymentMethod === method.value ? 'border-primary' : 'border-border'
                )}
              >
                <RadioGroupItem value={method.value} id={`payment-${method.value}`} className="mt-0.5" />
                <span>
                  <span className="font-medium text-foreground">{method.label}</span>
                  <p className="text-muted-foreground">{method.description}</p>
                </span>
              </label>
            ))}
          </RadioGroup>

          <h2 className="mb-4 text-sm font-semibold text-foreground">Shipping Address</h2>

          {savedAddresses.length > 0 && (
            <div className="mb-6 space-y-2">
              {savedAddresses.map((addr) => (
                <label
                  key={addr._id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 text-sm has-checked:border-primary"
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium text-foreground">{addr.fullName}</span> — {addr.addressLine1},{' '}
                    {addr.city}, {addr.state} {addr.postalCode}
                  </span>
                </label>
              ))}
              <button
                type="button"
                onClick={() => setSelectedAddressId(null)}
                className="text-sm font-medium text-primary hover:underline"
              >
                + Use a new address
              </button>
            </div>
          )}

          {(!selectedAddress || savedAddresses.length === 0) && (
            <AddressForm
              onSubmit={handleNewAddressSubmit}
              submitting={placing}
              submitLabel={paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Continue to Payment'}
            />
          )}

          {selectedAddress && (
            <Button
              size="lg"
              disabled={placing}
              onClick={() => handlePlaceOrder(selectedAddress)}
              className="mt-6 w-full"
            >
              {placing ? 'Processing…' : 'Place Order'}
            </Button>
          )}
        </div>

        <div>
          <CartSummary subtotal={subtotal} savings={calculateSavings(items)} />
        </div>
      </div>
    </div>
  );
}
