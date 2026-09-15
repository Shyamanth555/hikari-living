import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGallery } from '../components/product/ProductGallery';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { StockBadge } from '../components/common/StockBadge';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsync(() => productApi.getBySlug(slug), [slug]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

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
          <div className="mt-3">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>
          <div className="mt-3">
            <StockBadge stock={product.stock} />
          </div>

          {product.shortDescription && <p className="mt-5 text-muted-foreground">{product.shortDescription}</p>}

          <div className="mt-8 flex items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
            <Button size="lg" disabled={product.stock <= 0 || adding} onClick={handleAddToCart} className="flex-1">
              {product.stock <= 0 ? 'Out of stock' : adding ? 'Adding…' : 'Add to Cart'}
            </Button>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <h2 className="text-sm font-semibold text-foreground">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
