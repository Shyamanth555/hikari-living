import { ProductGrid } from './ProductGrid';
import { useAsync } from '../../hooks/useAsync';
import { productApi } from '../../api/productApi';

export function RelatedProducts({ categoryId, excludeProductId }) {
  const { data, loading } = useAsync(
    () => productApi.list({ category: categoryId, limit: 5 }),
    [categoryId]
  );

  const products = (data?.data || []).filter((p) => p._id !== excludeProductId).slice(0, 4);

  if (!loading && products.length === 0) return null;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-foreground">You May Also Like</h2>
      <ProductGrid products={loading ? undefined : products} loading={loading} skeletonCount={4} />
    </div>
  );
}
