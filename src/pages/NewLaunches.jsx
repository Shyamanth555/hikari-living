import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGrid } from '../components/product/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { useState } from 'react';

export default function NewLaunches() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(
    () => productApi.list({ newLaunch: true, sort: 'newest', page, limit: 12 }),
    [page]
  );

  return (
    <div className="container-page py-10">
      <SEO title="New Launches" description="The newest sculptures added to the Hikari Living collection." />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'New Launches' }]} />

      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">New Launches</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">The latest pieces to join the collection.</p>
      </div>

      <ProductGrid products={data?.data} loading={loading} />

      {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} className="mt-10" />}
    </div>
  );
}
