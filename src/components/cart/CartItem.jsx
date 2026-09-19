import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/formatCurrency';
import { QuantitySelector } from '../common/QuantitySelector';
import { PriceDisplay } from '../common/PriceDisplay';

export function CartItem({ product, quantity, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-5">
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <img src={product.images?.[0]?.url} alt={product.name} className="h-24 w-24 rounded-md object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div>
          <Link to={`/product/${product.slug}`} className="font-medium text-foreground hover:underline">
            {product.name}
          </Link>
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-1" />
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector
            value={quantity}
            max={product.stock}
            onChange={(q) => onUpdateQuantity(product._id, q)}
          />
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">{formatCurrency(product.price * quantity)}</span>
            <button
              type="button"
              onClick={() => onRemove(product._id)}
              className="text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
