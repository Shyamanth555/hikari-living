import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';
import { RatingStars } from './RatingStars';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product._id, 1);
      toast({ title: 'Added to cart', description: product.name, variant: 'success' });
    } catch (err) {
      toast({
        title: 'Could not add to cart',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-200">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock > 0 && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/95 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 cursor-pointer"
            aria-label="Quick add to cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>
        )}
        {product.compareAtPrice > product.price && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-medium text-cream-50">
            {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% off
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-800 px-2.5 py-1 text-xs font-medium text-cream-50">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category?.name}</p>
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-foreground group-hover:underline">
          {product.name}
        </h3>
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <RatingStars rating={product.ratingAverage} size="sm" />
            <span className="text-xs text-muted-foreground">({product.numReviews})</span>
          </div>
        )}
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} showBadge={false} />
      </div>
    </Link>
  );
}
