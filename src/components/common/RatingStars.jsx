import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

export function RatingStars({ rating = 5, className }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('h-4 w-4', i < rating ? 'fill-gold-500 text-gold-500' : 'fill-none text-ink-200')}
        />
      ))}
    </div>
  );
}
