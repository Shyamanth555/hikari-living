import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/formatCurrency';
import { EmptyState } from '../common/EmptyState';
import { PriceDisplay } from '../common/PriceDisplay';
import { getProductPricing } from '../../lib/pricing';

export function CartDrawer({ open, onOpenChange }) {
  const { items, subtotal, updateQuantity, removeItem, loading } = useCart();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/40" />
        <DialogPrimitive.Content
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-xl focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <DialogPrimitive.Title className="font-display text-lg">Your Cart</DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Close cart">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!loading && items.length === 0 && (
              <EmptyState
                icon={ShoppingBag}
                title="Your cart is empty"
                description="Browse the shop and add something you love."
              />
            )}

            <ul className="space-y-5">
              {items.map(({ product, quantity }) => (
                <li key={product._id} className="flex gap-3">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {product.name}
                    </Link>
                    <PriceDisplay {...getProductPricing(product)} size="sm" />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted disabled:opacity-40 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product._id)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {items.length > 0 && (
            <div className="border-t border-border px-5 py-4">
              <div className="mb-4 flex items-center justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                <Link to="/cart">View Cart & Checkout</Link>
              </Button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
