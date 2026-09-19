import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Spinner } from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { blogApi } from '../api/blogApi';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useAsync(() => blogApi.getBySlug(slug), [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="mt-3 inline-block text-sm font-medium hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <SEO title={post.title} description={post.excerpt} image={post.coverImage?.url} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />

      <article className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-foreground md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.author} ·{' '}
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        {post.coverImage?.url && (
          <div className="mt-6 aspect-video overflow-hidden rounded-lg bg-cream-200">
            <img src={post.coverImage.url} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="markdown-content mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
