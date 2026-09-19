import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGallery } from '../components/product/ProductGallery';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { StockBadge } from '../components/common/StockBadge';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { RatingStars } from '../components/common/RatingStars';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DELIVERY_INFO = [
  { icon: Truck, text: 'Free shipping on orders over ₹1,999, delivered in 4–8 business days' },
  { icon: RotateCcw, text: '7-day easy returns on eligible items' },
  { icon: ShieldCheck, text: 'Every piece carefully packed and insured in transit' },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsync(() => productApi.getBySlug(slug), [slug]);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="mt-3 inline-block text-sm font-medium hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(product._id, quantity);
      toast({ title: 'Added to cart', description: `${product.name} × ${quantity}`, variant: 'success' });
    } catch (err) {
      toast({
        title: 'Could not add to cart',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    try {
      await addItem(product._id, quantity);
      navigate(isAuthenticated ? '/checkout' : `/login?redirect=/checkout`);
    } catch (err) {
      toast({
        title: 'Could not proceed',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
      setBuyingNow(false);
    }
  };

  return (
    <div className="container-page py-10">
      <SEO title={product.name} description={product.shortDescription || product.description} image={product.images?.[0]?.url} />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(product.category ? [{ label: product.category.name, href: `/category/${product.category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category?.name}</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.ratingAverage} size="sm" />
              <span className="text-sm text-muted-foreground">
                {product.ratingAverage.toFixed(1)} ({product.numReviews} review{product.numReviews === 1 ? '' : 's'})
              </span>
            </div>
          )}

          <div className="mt-3">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>
          <div className="mt-3">
            <StockBadge stock={product.stock} />
          </div>

          {product.shortDescription && <p className="mt-5 text-muted-foreground">{product.shortDescription}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
            <Button size="lg" disabled={product.stock <= 0 || adding} onClick={handleAddToCart} className="flex-1">
              {product.stock <= 0 ? 'Out of stock' : adding ? 'Adding…' : 'Add to Cart'}
            </Button>
          </div>
          {product.stock > 0 && (
            <Button
              size="lg"
              variant="accent"
              disabled={buyingNow}
              onClick={handleBuyNow}
              className="mt-3 w-full"
            >
              {buyingNow ? 'Please wait…' : 'Buy Now'}
            </Button>
          )}

          <div className="mt-8 space-y-3 rounded-lg bg-background-soft p-4">
            {DELIVERY_INFO.map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" strokeWidth={1.5} />
                <p className="text-sm text-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <h2 className="text-sm font-semibold text-foreground">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {product.specifications?.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-sm font-semibold text-foreground">Specifications</h2>
              <dl className="mt-3 divide-y divide-border text-sm">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex justify-between gap-4 py-2">
                    <dt className="text-muted-foreground">{spec.key}</dt>
                    <dd className="text-right font-medium text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <div id="reviews" className="mt-16 scroll-mt-24 border-t border-border pt-12">
        <ReviewsSection productId={product._id} ratingAverage={product.ratingAverage} numReviews={product.numReviews} />
      </div>

      {product.category && (
        <div className="mt-16 border-t border-border pt-12">
          <RelatedProducts categoryId={product.category._id} excludeProductId={product._id} />
        </div>
      )}
    </div>
  );
}
