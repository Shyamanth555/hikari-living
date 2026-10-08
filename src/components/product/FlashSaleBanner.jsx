import { cn } from '../../lib/cn';
import { formatSaleTime, getSaleStatus } from '../../lib/pricing';
import { FlashSaleBadge } from '../common/FlashSaleBadge';
import { SaleCountdown } from '../common/SaleCountdown';

// Product page card for a live or upcoming flash sale, with the same boxed
// countdown as the home page hero.
export function FlashSaleBanner({ product, now, className }) {
  const status = getSaleStatus(product, now);
  if (status !== 'live' && status !== 'upcoming') return null;

  const live = status === 'live';
  const { percentOff, startsAt, endsAt } = product.sale;

  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-x-6 gap-y-5 rounded-lg border border-border bg-background-soft p-4 sm:p-5',
        className
      )}
    >
      <div>
        <FlashSaleBadge live={live} />
        <p className="mt-3 font-display text-2xl leading-tight text-foreground">
          Flat <span className="text-sale">{percentOff}% off</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatSaleTime(startsAt)} – {formatSaleTime(endsAt)} · While stocks last
        </p>
      </div>
      <SaleCountdown sale={product.sale} live={live} now={now} />
    </div>
  );
}
