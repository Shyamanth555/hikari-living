import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductSort } from '../components/product/ProductSort';
import { ProductGrid } from '../components/product/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      sort: searchParams.get('sort') || 'newest',
      page: Number(searchParams.get('page')) || 1,
    }),
    [searchParams]
  );

  const { data: categories } = useAsync(() => categoryApi.list(), []);
  const { data, loading } = useAsync(() => productApi.list({ ...filters, limit: 12 }), [JSON.stringify(filters)]);

  const updateParams = (next) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && !(key === 'page' && value === 1)) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  return (
    <div className="container-page py-10">
      <SEO title="Shop All Products" description="Browse the full Hikari Living collection." />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />

      <div className="mb-6 flex flex-nowrap items-center justify-between gap-3 sm:gap-4">
        <h1 className="font-display text-xl text-foreground sm:text-3xl">All Idols</h1>
        <ProductSort value={filters.sort} onChange={(sort) => updateParams({ ...filters, sort, page: 1 })} />
      </div>

      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        <aside className="hidden w-56 shrink-0 self-start md:sticky md:top-24 md:block">
          <div className="mb-4 flex h-11 items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </div>
          <ProductFilters
            categories={categories || []}
            value={filters}
            onChange={(next) => updateParams({ ...next, page: 1 })}
            onClear={() => setSearchParams({})}
          />
        </aside>

        <div className="flex-1">
          <ProductGrid products={data?.data} loading={loading} />

          {data && (
            <Pagination
              page={data.page}
              pages={data.pages}
              onPageChange={(page) => updateParams({ ...filters, page })}
              className="mt-10"
            />
          )}
        </div>
      </div>
    </div>
  );
}
