import { cn } from '../../lib/cn';
import { formatSaleTime, getCountdownParts } from '../../lib/pricing';

const SIZES = {
  md: {
    box: 'h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl',
    separator: 'pt-2.5 text-xl sm:pt-3 sm:text-2xl',
  },
  lg: {
    box: 'h-12 w-12 text-xl md:h-16 md:w-16 md:text-3xl',
    separator: 'pt-2.5 text-xl md:pt-3.5 md:text-2xl',
  },
};

function CountdownUnit({ value, label, boxClass }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={cn(
          'flex items-center justify-center rounded-lg bg-cream-50 font-display tabular-nums text-foreground shadow-sm ring-1 ring-border',
          boxClass
        )}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function CountdownSeparator({ className }) {
  return (
    <span aria-hidden="true" className={cn('font-display text-muted-foreground/60', className)}>
      :
    </span>
  );
}

/**
 * Boxed HH : MM : SS countdown to a flash sale's start (upcoming) or end (live).
 * The row is inline-flex, so it follows the parent's text alignment.
 */
export function SaleCountdown({ sale, live, now, size = 'md', className }) {
  const until = live ? sale.endsAt : sale.startsAt;
  const { days, hours, minutes, seconds } = getCountdownParts(Date.parse(until) - now);
  const { box, separator } = SIZES[size];

  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {live ? 'Offer ends in' : 'Sale starts in'}
      </p>
      <div
        role="timer"
        aria-label={`${live ? 'Offer ends' : 'Sale starts'} at ${formatSaleTime(until)}`}
        className="mt-3 inline-flex items-start gap-1.5 md:gap-2.5"
      >
        {days > 0 && (
          <>
            <CountdownUnit value={days} label="Days" boxClass={box} />
            <CountdownSeparator className={separator} />
          </>
        )}
        <CountdownUnit value={hours} label="Hours" boxClass={box} />
        <CountdownSeparator className={separator} />
        <CountdownUnit value={minutes} label="Mins" boxClass={box} />
        <CountdownSeparator className={separator} />
        <CountdownUnit value={seconds} label="Secs" boxClass={box} />
      </div>
    </div>
  );
}
