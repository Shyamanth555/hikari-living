import { useState } from 'react';
import { Truck } from 'lucide-react';
import { cn } from '../../lib/cn';
import { courierStatusLabel } from '../../lib/courierStatus';

const VISIBLE_EVENTS = 4;

const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

/**
 * Courier name, current status, expected delivery and the scan-by-scan
 * history (picked up → in transit → out for delivery → delivered) for an
 * order's shipment. Renders nothing until the order has a tracking ID.
 */
export function ShipmentTimeline({ tracking, isDelivered = false, showRawStatus = false, className }) {
  const [showAll, setShowAll] = useState(false);

  if (!tracking?.trackingId) return null;

  const events = tracking.events || [];
  const visibleEvents = showAll ? events : events.slice(0, VISIBLE_EVENTS);
  const statusLabel = courierStatusLabel(tracking.courierStatus);

  return (
    <div className={cn('rounded-md bg-cream-100 p-4', className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <Truck className="h-4 w-4 text-foreground" />
        <span className="font-medium text-foreground">{tracking.carrier || 'Courier'}</span>
        <span className="text-muted-foreground">· Tracking ID {tracking.trackingId}</span>
      </div>

      {statusLabel && (
        <div className="mt-3">
          <p className="font-medium text-foreground">{statusLabel}</p>
          {showRawStatus && statusLabel.toLowerCase() !== tracking.courierStatus.toLowerCase() && (
            <p className="text-xs text-muted-foreground">Shiprocket status: {tracking.courierStatus}</p>
          )}
          {tracking.courierStatusAt && (
            <p className="text-xs text-muted-foreground">Updated {formatDateTime(tracking.courierStatusAt)}</p>
          )}
        </div>
      )}

      {tracking.expectedDelivery && !isDelivered && (
        <p className="mt-2 text-sm text-muted-foreground">
          Expected delivery: <span className="font-medium text-foreground">{formatDate(tracking.expectedDelivery)}</span>
        </p>
      )}

      {visibleEvents.length > 0 && (
        <ol className="mt-4">
          {visibleEvents.map((event, i) => (
            <li key={`${event.date}-${i}`} className="relative pb-4 pl-6 last:pb-0">
              {i < visibleEvents.length - 1 && (
                <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden="true" />
              )}
              <span
                className={cn(
                  'absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2',
                  i === 0 ? 'border-primary bg-primary' : 'border-border bg-cream-50'
                )}
                aria-hidden="true"
              />
              <p className={cn('text-sm', i === 0 ? 'font-medium text-foreground' : 'text-foreground/80')}>
                {event.activity || courierStatusLabel(event.status)}
              </p>
              <p className="text-xs text-muted-foreground">
                {[event.location, event.date && formatDateTime(event.date)].filter(Boolean).join(' · ')}
              </p>
            </li>
          ))}
        </ol>
      )}

      {events.length > VISIBLE_EVENTS && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          {showAll ? 'Show fewer updates' : `Show all ${events.length} updates`}
        </button>
      )}

      {tracking.trackingUrl && (
        <a
          href={tracking.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-sm font-medium text-primary hover:underline"
        >
          Track on courier site →
        </a>
      )}
    </div>
  );
}
