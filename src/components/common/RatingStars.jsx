import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

// Supports fractional ratings (e.g. 4.3) via a width-clipped overlay of filled
// stars on top of an identical row of empty stars, so an average rating reads
// as a partially-filled star instead of rounding to the nearest whole star.
export function RatingStars({ rating = 0, size = 'md', className }) {
  const clamped = Math.max(0, Math.min(5, rating));
  const starClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={cn('relative inline-flex', className)} role="img" aria-label={`${clamped} out of 5 stars`}>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn(starClass, 'fill-none text-ink-200')} />
        ))}
      </div>
      <div
        className="absolute inset-0 flex gap-0.5 overflow-hidden"
        style={{ width: `${(clamped / 5) * 100}%` }}
        aria-hidden="true"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn(starClass, 'shrink-0 fill-gold-500 text-gold-500')} />
        ))}
      </div>
    </div>
  );
}
