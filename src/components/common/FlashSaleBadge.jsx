import { Zap } from 'lucide-react';

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-cream-50 opacity-75 motion-safe:animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-cream-50" />
    </span>
  );
}

// "Flash Sale · Live now" (pulsing) or "Flash Sale · Starts soon" pill.
export function FlashSaleBadge({ live }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-sale px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sale-foreground">
      {live ? <LiveDot /> : <Zap className="h-3.5 w-3.5 fill-current" />}
      {live ? 'Flash Sale · Live now' : 'Flash Sale · Starts soon'}
    </span>
  );
}
