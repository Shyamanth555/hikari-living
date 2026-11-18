import { cn } from '../../lib/cn';

// A colour's swatch and name, e.g. under a cart or order line — "● Antique Gold".
export function ColorTag({ name, hex, className }) {
  if (!name) return null;
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      {hex && (
        <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full ring-1 ring-border" style={{ backgroundColor: hex }} />
      )}
      {name}
    </span>
  );
}
