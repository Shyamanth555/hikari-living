import { formatCurrency } from '../../lib/formatCurrency';
import { cn } from '../../lib/cn';

export function PriceDisplay({ price, compareAtPrice, size = 'md', showBadge = true, className }) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const percentOff = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-medium text-foreground', size === 'lg' ? 'text-xl' : 'text-base')}>
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">{formatCurrency(compareAtPrice)}</span>
      )}
      {hasDiscount && showBadge && (
        <span className="text-sm font-medium text-gold-600">{percentOff}% off</span>
      )}
    </div>
  );
}
