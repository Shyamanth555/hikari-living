import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { ReviewCard } from '../components/review/ReviewCard';
import { ReviewDetailDialog } from '../components/review/ReviewDetailDialog';
import { HeroCarousel } from '../components/common/HeroCarousel';
import { FlashSaleHero } from '../components/common/FlashSaleHero';
import { CategoryCarousel } from '../components/common/CategoryCarousel';
import { Button } from '../components/ui/Button';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { blogApi } from '../api/blogApi';
import { heroSlideApi } from '../api/heroSlideApi';
import { reviewApi } from '../api/reviewApi';
import { cn } from '../lib/cn';
import { BRAND_NAME } from '../lib/constants';

const PROMOS = [
  { icon: Truck, title: 'Free shipping on every order', description: 'Delivered across India' },
  { icon: ShieldCheck, title: 'Secure, careful packaging', description: 'Every piece insured in transit' },
];

export default function Home() {
  const { data: featured, loading: featuredLoading } = useAsync(
    () => productApi.list({ featured: true, limit: 8 }),
    []
  );
  const { data: categories } = useAsync(() => categoryApi.list(), []);
  const { data: recentPosts } = useAsync(() => blogApi.list({ limit: 3 }), []);
  const { data: heroSlides } = useAsync(() => heroSlideApi.list(), []);
  const { data: flashSales } = useAsync(() => productApi.flashSale(), []);
  // Latest well-rated reviews here; every approved review is on the Reviews page.
  const { data: reviews } = useAsync(() => reviewApi.listAll({ limit: 3, minRating: 4 }), []);
  const [openReview, setOpenReview] = useState(null);
  const reviewCount = reviews?.data.length || 0;

  return (
    <>
      <SEO title="Home" description="Handcrafted sculptures and idols — Divine Series, car dashboard idols, and Pride of India statues." />

      {flashSales && flashSales.length > 0 && <FlashSaleHero products={flashSales} />}

      {heroSlides && heroSlides.length > 0 ? (
        <>
          <HeroCarousel slides={heroSlides} />
          <section className="border-b border-border">
            <div className="container-page flex flex-col items-center gap-5 py-12 text-center md:py-16">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Handcrafted in India</p>
              <h1 className="font-display text-3xl leading-tight text-foreground md:text-5xl">
                Sculptures that carry meaning
              </h1>
              <p className="max-w-md text-muted-foreground">
                {BRAND_NAME} brings together handcrafted idols and statues — from home temple centrepieces to
                car dashboard companions — made with polyresin and hand painted.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/shop">
                    Shop All Idols <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="relative overflow-hidden border-b border-border bg-cream-100">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-300/40 blur-3xl" />
            <div className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-pine-300/30 blur-3xl" />
            <div className="absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="container-page relative flex flex-col items-center gap-5 py-16 text-center md:py-28">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Handcrafted in India</p>
            <h1 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
              Sculptures that carry meaning
            </h1>
            <p className="max-w-lg text-muted-foreground md:text-lg">
              {BRAND_NAME} brings together handcrafted idols and statues — from home temple centrepieces to
              car dashboard companions — made with polyresin and hand painted.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/shop">
                  Shop All Idols <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-border">
        <div className="container-page flex flex-col items-center gap-8 py-10 sm:flex-row sm:justify-center sm:gap-x-20">
          {PROMOS.map((promo) => (
            <div key={promo.title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <promo.icon className="h-6 w-6 shrink-0 text-primary sm:mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">{promo.title}</p>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="pt-14 pb-8">
          <h2 className="container-page font-display text-2xl text-foreground">Shop by Collection</h2>
          <div className="mt-6">
            <CategoryCarousel categories={categories} />
          </div>
        </section>
      )}

      <section className="container-page pt-8 pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-foreground">Featured</h2>
          <Link to="/shop" className="text-sm font-medium text-foreground hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={featured?.data} loading={featuredLoading} />
      </section>

      <section className="border-y border-border bg-cream-100">
        <div className="container-page flex flex-col items-center gap-4 py-10 text-center">
          <h2 className="font-display text-2xl text-foreground">Don&apos;t see exactly what you have in mind?</h2>
          <p className="max-w-md text-muted-foreground">
            Our artisans take on custom sculpture commissions and bulk corporate gifting orders.
          </p>
          <div className="mt-2 flex w-full max-w-xs flex-nowrap justify-center gap-3 sm:max-w-none sm:w-auto">
            <Button asChild className="flex-1 sm:flex-none">
              <Link to="/custom-sculpture">Custom Sculpture</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 sm:flex-none">
              <Link to="/corporate-gifting">Corporate Gifting</Link>
            </Button>
          </div>
        </div>
      </section>

      {reviewCount > 0 && (
        <section className="container-page py-16">
          <h2 className="text-center font-display text-2xl text-foreground">What our customers say</h2>
          {/* Fewer than three reviews are centred rather than leaving empty columns. */}
          <div
            className={cn(
              'mx-auto mt-10 grid gap-8',
              reviewCount >= 3 ? 'md:grid-cols-3' : reviewCount === 2 ? 'max-w-3xl md:grid-cols-2' : 'max-w-md'
            )}
          >
            {reviews.data.map((review) => (
              <ReviewCard key={review._id} review={review} onOpen={() => setOpenReview(review)} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/reviews" className="text-sm font-medium text-foreground hover:underline">
              Read more reviews →
            </Link>
          </div>
          <ReviewDetailDialog review={openReview} onClose={() => setOpenReview(null)} />
        </section>
      )}

      {recentPosts && recentPosts.data.length > 0 && (
        <section className="border-t border-border bg-cream-100">
          <div className="container-page py-14">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl text-foreground">From the Blog</h2>
              <Link to="/blog" className="text-sm font-medium text-foreground hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {recentPosts.data.map((post) => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-video overflow-hidden rounded-lg bg-cream-200">
                    <img
                      src={post.coverImage?.url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 font-display text-base text-foreground group-hover:underline">{post.title}</h3>
                  {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
