import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Button } from '../ui/Button';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../lib/constants';

export function OrderStatusUpdater({ currentStatus, onUpdate, updating = false }) {
  const [status, setStatus] = useState(currentStatus);

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <label className="text-sm font-medium text-foreground">Order status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
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
