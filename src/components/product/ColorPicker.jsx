import { cn } from '../../lib/cn';

// Round swatches for a product's colours. A sold-out colour can still be
// picked (to see its photos) but shows struck through.
export function ColorPicker({ colors, selected, onSelect, className }) {
  return (
    <div className={className}>
      <p className="text-sm text-foreground">
        Colour: <span className="font-medium">{selected.name}</span>
        {selected.stock <= 0 && <span className="text-muted-foreground"> — sold out</span>}
      </p>
      <div role="radiogroup" aria-label="Colour" className="mt-2.5 flex flex-wrap gap-3">
        {colors.map((c) => {
          const isSelected = c._id === selected._id;
          const soldOut = c.stock <= 0;
          return (
            <button
              key={c._id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${c.name}${soldOut ? ' (sold out)' : ''}`}
              title={c.name}
              onClick={() => onSelect(c)}
              className={cn(
                'relative h-9 w-9 overflow-hidden rounded-full ring-offset-2 ring-offset-background transition-shadow cursor-pointer',
                isSelected ? 'ring-2 ring-foreground' : 'ring-1 ring-border hover:ring-muted-foreground',
                soldOut && 'opacity-60'
              )}
              style={{ backgroundColor: c.hex }}
            >
              {soldOut && (
                <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-12 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground/70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
