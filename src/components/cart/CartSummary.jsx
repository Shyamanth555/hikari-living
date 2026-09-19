import { formatCurrency } from '../../lib/formatCurrency';

export function CartSummary({ subtotal, children }) {
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
          <span>Free</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium">
        <span>Total</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {children}
    </div>
  );
}
