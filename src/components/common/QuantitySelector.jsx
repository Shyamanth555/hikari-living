import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

export function QuantitySelector({ value, onChange, max = 99, min = 1, className }) {
  return (
    <div className={cn('inline-flex items-center rounded-md border border-border', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-11 w-11 items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-11 w-11 items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
