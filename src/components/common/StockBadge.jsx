import { Badge } from '../ui/Badge';

export function StockBadge({ stock }) {
  if (stock <= 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (stock <= 5) return <Badge variant="warning">Only {stock} left</Badge>;
  return <Badge variant="accent">In stock</Badge>;
}
