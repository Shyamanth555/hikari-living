import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Button } from '../ui/Button';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../lib/constants';

export function OrderStatusUpdater({ currentStatus, onUpdate, updating = false, canAwaitPayment = true }) {
  const [status, setStatus] = useState(currentStatus);

  // "Awaiting Payment" only makes sense for an unpaid online order — COD is
  // paid to the courier on delivery, and a paid order can't go back to it.
  const statuses = ORDER_STATUSES.filter((s) => s !== 'pending' || canAwaitPayment || s === currentStatus);

  // Keep the dropdown in step when the status changes elsewhere — e.g. Ship
  // Now moving it to "shipped", or a Shiprocket webhook marking it delivered.
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <label className="text-sm font-medium text-foreground">Order status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button disabled={status === currentStatus || updating} onClick={() => onUpdate(status)}>
        {updating ? 'Updating…' : 'Update'}
      </Button>
    </div>
  );
}
