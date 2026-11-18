import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/formatCurrency';
import { QuantitySelector } from '../common/QuantitySelector';
import { PriceDisplay } from '../common/PriceDisplay';
import { ColorTag } from '../common/ColorTag';
import { getProductPricing } from '../../lib/pricing';
import { imageUrl } from '../../lib/cloudinaryImage';
import { productUrl } from '../../lib/productColors';

// `color` is the line's chosen colour (null for a product without colours):
// its photo, price and stock apply.
export function CartItem({ product, color, quantity, onUpdateQuantity, onRemove }) {
  const { price, compareAtPrice } = getProductPricing(product, Date.now(), color);
  const href = productUrl(product.slug, color?.name);
  const colorId = color?._id || null;

  return (
    <div className="flex gap-4 py-5">
      <Link to={href} className="shrink-0">
        <img
          src={imageUrl(color?.image || product.images?.[0]?.url, 'thumb')}
          alt={product.name}
          className="h-24 w-24 rounded-md object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div>
          <Link to={href} className="font-medium text-foreground hover:underline">
            {product.name}
          </Link>
          {color && <ColorTag name={color.name} hex={color.hex} className="mt-0.5 flex" />}
          <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="sm" className="mt-1" />
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector
            value={quantity}
            max={color ? color.stock : product.stock}
            onChange={(q) => onUpdateQuantity(product._id, q, colorId)}
            size="sm"
          />
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">{formatCurrency(price * quantity)}</span>
            <button
              type="button"
              onClick={() => onRemove(product._id, colorId)}
              className="text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label={`Remove ${product.name}${color ? ` (${color.name})` : ''}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
