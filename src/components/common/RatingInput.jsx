import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

export function RatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="cursor-pointer p-0.5"
          aria-label={`Rate ${star} out of 5`}
        >
          <Star className={cn('h-6 w-6', star <= display ? 'fill-gold-500 text-gold-500' : 'fill-none text-ink-200')} />
        </button>
      ))}
    </div>
  );
}
