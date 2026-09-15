import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductSort } from '../components/product/ProductSort';
import { ProductGrid } from '../components/product/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const { data: category, loading: categoryLoading, error } = useAsync(() => categoryApi.getBySlug(slug), [slug]);

  const productParams = useMemo(
    () => (category ? { category: category._id, sort, page, limit: 12 } : null),
    [category, sort, page]
  );

  const { data, loading: productsLoading } = useAsync(
    () => (productParams ? productApi.list(productParams) : Promise.resolve(null)),
    [JSON.stringify(productParams)]
  );

  const updateParams = (next) => {
    const params = new URLSearchParams();
    if (next.sort && next.sort !== 'newest') params.set('sort', next.sort);
    if (next.page && next.page !== 1) params.set('page', next.page);
    setSearchParams(params);
  };

  if (categoryLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !category) {
    return <div className="container-page py-20 text-center text-muted-foreground">Category not found.</div>;
  }

  return (
    <div className="container-page py-10">
      <SEO title={category.name} description={category.description} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: category.name }]} />

      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data ? `${data.total} products` : ''}</p>
        <ProductSort value={sort} onChange={(nextSort) => updateParams({ sort: nextSort, page: 1 })} />
      </div>

      <ProductGrid products={data?.data} loading={productsLoading} />

      {data && (
        <Pagination page={data.page} pages={data.pages} onPageChange={(p) => updateParams({ sort, page: p })} className="mt-10" />
      )}
    </div>
  );
}
