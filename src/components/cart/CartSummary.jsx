import { formatCurrency } from '../../lib/formatCurrency';

const SHIPPING_FLAT_RATE = 99;
const FREE_SHIPPING_THRESHOLD = 1999;

export function CartSummary({ subtotal, children }) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="font-display text-lg">Order Summary</h3>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-muted-foreground">
            Free shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      {children}
    </div>
  );
}
