import { formatCurrency } from '../../lib/formatCurrency';
import { cn } from '../../lib/cn';

export function PriceDisplay({ price, compareAtPrice, size = 'md', showBadge = true, className }) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const percentOff = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  const priceSize = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base';
  const detailSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-medium text-foreground', priceSize)}>{formatCurrency(price)}</span>
      {hasDiscount && (
        <span className={cn('text-muted-foreground line-through', detailSize)}>{formatCurrency(compareAtPrice)}</span>
      )}
      {hasDiscount && showBadge && (
        <span className={cn('font-medium text-gold-600', detailSize)}>{percentOff}% off</span>
      )}
    </div>
  );
}
