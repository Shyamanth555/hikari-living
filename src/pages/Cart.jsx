import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { EmptyState } from '../components/common/EmptyState';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(isAuthenticated ? '/checkout' : '/login?redirect=/checkout');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <SEO title="Your Cart" />
      <h1 className="mb-8 font-display text-3xl text-foreground">Your Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the shop and add something you love."
          action={
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="divide-y divide-border lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <CartItem
                key={product._id}
                product={product}
                quantity={quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div>
            <CartSummary subtotal={subtotal}>
              <Button size="lg" className="mt-5 w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </CartSummary>
          </div>
        </div>
      )}
    </div>
  );
}
