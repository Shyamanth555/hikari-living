import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, RotateCcw, Truck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { RatingStars } from '../components/common/RatingStars';
import { Button } from '../components/ui/Button';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { TESTIMONIALS } from '../lib/testimonials';
import { BRAND_NAME } from '../lib/constants';

const PROMOS = [
  { icon: Truck, title: 'Free shipping over ₹1,999', description: 'On all orders across India' },
  { icon: RotateCcw, title: '7-day returns', description: 'Easy exchanges on eligible items' },
  { icon: Leaf, title: 'Considered materials', description: 'Natural fibres, solid wood, hand-finished' },
];

export default function Home() {
  const { data: featured, loading: featuredLoading } = useAsync(
    () => productApi.list({ featured: true, limit: 8 }),
    []
  );
  const { data: categories } = useAsync(() => categoryApi.list(), []);

  return (
    <>
      <SEO title="Home" description="Considered furniture, lighting, and decor for the modern home." />

      <section className="border-b border-border bg-cream-100">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">New Season Edit</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl">
              Considered pieces for a quieter home
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              {BRAND_NAME} brings together furniture, lighting, and decor made from natural materials —
              designed to feel calm, warm, and built to last.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/shop">
                Shop the Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="aspect-4/3 overflow-hidden rounded-xl bg-cream-200">
            <img
              src="https://picsum.photos/seed/hikari-hero/1200/900"
              alt="A warm, considered living room styled with Hikari Living furniture"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
          {PROMOS.map((promo) => (
            <div key={promo.title} className="flex items-start gap-3">
              <promo.icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">{promo.title}</p>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="container-page py-14">
          <h2 className="font-display text-2xl text-foreground">Shop by Collection</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="group text-center">
                <div className="aspect-square overflow-hidden rounded-lg bg-cream-200">
                  <img
                    src={cat.image?.url}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2.5 text-sm font-medium text-foreground">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-foreground">Featured</h2>
          <Link to="/shop" className="text-sm font-medium text-foreground hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={featured?.data} loading={featuredLoading} />
      </section>

      <section className="border-t border-border bg-cream-100">
        <div className="container-page py-16">
          <h2 className="text-center font-display text-2xl text-foreground">What our customers say</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-lg bg-cream-50 p-6">
                <RatingStars rating={t.rating} />
                <p className="mt-3 text-sm text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-foreground">
                  {t.name} <span className="font-normal text-muted-foreground">— {t.location}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
