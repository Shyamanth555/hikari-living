import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, Package } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DELIVERY_INFO = [
  { icon: Truck, text: 'Free shipping on every order', detail: 'Delivered in 4–8 business days' },
  { icon: RotateCcw, text: 'Easy returns', detail: '7-day return window on eligible items' },
  { icon: ShieldCheck, text: 'Secure payments', detail: 'Razorpay-protected checkout' },
  { icon: Package, text: 'Carefully packed', detail: 'Every piece insured in transit' },
];

const TAB_TRIGGER_CLASS =
  'flex-1 rounded-none border-b-2 border-transparent px-0 py-3 text-base data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none';

export default function ProductDetail() {
  const { slug } = useParams();
  const location = useLocation();
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

  const defaultTab = location.hash === '#reviews' ? 'reviews' : 'description';

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
        <ProductGallery
          images={product.images}
          productName={product.name}
          onAddToCart={handleAddToCart}
          addToCartDisabled={product.stock <= 0 || adding}
        />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category?.name}</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">{product.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2">
                <RatingStars rating={product.ratingAverage} size="sm" />
                <span className="text-sm text-muted-foreground">
                  {product.ratingAverage.toFixed(1)} ({product.numReviews} review{product.numReviews === 1 ? '' : 's'})
                </span>
              </div>
            )}
            {product.sku && <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>}
          </div>

          <div className="mt-3">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>
          <div className="mt-3">
            <StockBadge stock={product.stock} />
          </div>

          {product.shortDescription && <p className="mt-5 text-muted-foreground">{product.shortDescription}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
            <Button
              size="lg"
              variant="accent"
              disabled={product.stock <= 0 || buyingNow}
              onClick={handleBuyNow}
              className="flex-1"
            >
              {product.stock <= 0 ? 'Out of stock' : buyingNow ? 'Please wait…' : 'Buy Now'}
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg bg-background-soft p-4 sm:grid-cols-4">
            {DELIVERY_INFO.map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1.5 text-center">
                <item.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                <p className="text-xs font-medium text-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <Tabs id="reviews" defaultValue={defaultTab} className="mt-10 scroll-mt-24">
            <TabsList className="h-auto w-full gap-2 rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger value="description" className={TAB_TRIGGER_CLASS}>
                Description
              </TabsTrigger>
              {product.specifications?.length > 0 && (
                <TabsTrigger value="specifications" className={TAB_TRIGGER_CLASS}>
                  Specifications
                </TabsTrigger>
              )}
              <TabsTrigger value="shipping" className={TAB_TRIGGER_CLASS}>
                Shipping &amp; Returns
              </TabsTrigger>
              <TabsTrigger value="reviews" className={TAB_TRIGGER_CLASS}>
                Reviews{product.numReviews > 0 ? ` (${product.numReviews})` : ''}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </TabsContent>

            {product.specifications?.length > 0 && (
              <TabsContent value="specifications">
                <dl className="divide-y divide-border text-sm">
                  {product.specifications.map((spec) => (
                    <div key={spec.key} className="flex justify-between gap-4 py-2">
                      <dt className="text-muted-foreground">{spec.key}</dt>
                      <dd className="text-right font-medium text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </TabsContent>
            )}

            <TabsContent value="shipping">
              <ul className="space-y-4">
                {DELIVERY_INFO.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.text}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Link to="/policies/shipping" className="font-medium text-primary hover:underline">
                  Read full shipping policy →
                </Link>
                <Link to="/policies/returns" className="font-medium text-primary hover:underline">
                  Read full return policy →
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsSection productId={product._id} ratingAverage={product.ratingAverage} numReviews={product.numReviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {product.category && (
        <div className="mt-16 border-t border-border pt-12">
          <RelatedProducts categoryId={product.category._id} excludeProductId={product._id} />
        </div>
      )}
    </div>
  );
}
