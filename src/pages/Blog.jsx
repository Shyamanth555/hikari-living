import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Pagination } from '../components/ui/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useAsync } from '../hooks/useAsync';
import { blogApi } from '../api/blogApi';
import { Newspaper } from 'lucide-react';

export default function Blog() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(() => blogApi.list({ page, limit: 9 }), [page]);

  return (
    <div className="container-page py-10">
      <SEO title="Blog" description="Guides, care tips, and stories from Hikari Living." />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />

      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Blog</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Guides, care tips, and stories from the workshop.</p>
      </div>

      {loading && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && (!data || data.data.length === 0) && (
        <EmptyState icon={Newspaper} title="No posts yet" description="Check back soon for new stories and guides." />
      )}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((post) => (
            <Link key={post._id} to={`/blog/${post.slug}`} className="group block">
              <div className="aspect-video overflow-hidden rounded-lg bg-cream-200">
                <img
                  src={post.coverImage?.url}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <h2 className="mt-1 font-display text-lg text-foreground group-hover:underline">{post.title}</h2>
              {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}

      {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} className="mt-10" />}
    </div>
  );
}
