import { Badge } from '../ui/Badge';
import { ORDER_STATUS_LABELS } from '../../lib/constants';

const VARIANT_MAP = {
  pending: 'neutral',
  processing: 'clay',
  shipped: 'accent',
  delivered: 'accent',
  cancelled: 'destructive',
};

export function OrderStatusBadge({ status }) {
  return <Badge variant={VARIANT_MAP[status] || 'neutral'}>{ORDER_STATUS_LABELS[status] || status}</Badge>;
}
