import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import { productApi } from '../api/productApi';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const { data, loading } = useAsync(
    () => (debouncedQuery ? productApi.list({ search: debouncedQuery, page, limit: 12 }) : Promise.resolve(null)),
    [debouncedQuery, page]
  );

  return (
    <div className="container-page py-10">
      <SEO title="Search" />

      <div className="mx-auto max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for furniture, lighting, decor…"
            className="h-12 w-full rounded-full border border-border bg-cream-100 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-10">
        {!debouncedQuery && <p className="text-center text-muted-foreground">Start typing to search the catalogue.</p>}

        {debouncedQuery && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {data ? `${data.total} results for "${debouncedQuery}"` : ''}
            </p>
            <ProductGrid products={data?.data} loading={loading} />
            {data && (
              <Pagination
                page={data.page}
                pages={data.pages}
                onPageChange={(p) => setSearchParams({ q: debouncedQuery, page: p })}
                className="mt-10"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
