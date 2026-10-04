import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

export function QuantitySelector({ value, onChange, max = 99, min = 1, size = 'md', className }) {
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const spanWidth = size === 'sm' ? 'w-7 text-xs' : 'w-10 text-sm';

  return (
    <div className={cn('inline-flex items-center rounded-md border border-border', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn('flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer', buttonSize)}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </button>
      <span className={cn('text-center font-medium', spanWidth)}>{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn('flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer', buttonSize)}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
