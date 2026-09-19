import { formatCurrency } from '../../lib/formatCurrency';

const STANDARD_DELIVERY_FEE = 149;

export function CartSummary({ subtotal, savings = 0, children }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="font-display text-lg">Order Summary</h3>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-pine-600">
            <span>You save</span>
            <span className="font-medium">{formatCurrency(savings)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="flex items-center gap-2">
            <span className="text-destructive line-through">{formatCurrency(STANDARD_DELIVERY_FEE)}</span>
            <span className="font-medium text-pine-600">Free</span>
          </span>
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
