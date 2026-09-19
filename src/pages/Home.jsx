import { Link } from 'react-router-dom';
import { ArrowRight, Hammer, ShieldCheck, Truck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductGrid } from '../components/product/ProductGrid';
import { RatingStars } from '../components/common/RatingStars';
import { HeroCarousel } from '../components/common/HeroCarousel';
import { Button } from '../components/ui/Button';
import { useAsync } from '../hooks/useAsync';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { blogApi } from '../api/blogApi';
import { heroSlideApi } from '../api/heroSlideApi';
import { TESTIMONIALS } from '../lib/testimonials';
import { BRAND_NAME } from '../lib/constants';

const PROMOS = [
  { icon: Truck, title: 'Free shipping over ₹1,999', description: 'On all orders across India' },
  { icon: Hammer, title: 'Handcrafted by artisans', description: 'Brass, panchaloha, marble, and wood' },
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

  return (
    <>
      <SEO title="Home" description="Handcrafted sculptures and idols — Divine Series, car dashboard idols, and Pride of India statues." />

      {heroSlides && heroSlides.length > 0 ? (
        <>
          <section className="container-page pt-6 md:pt-10">
            <HeroCarousel slides={heroSlides} />
          </section>
          <section className="border-b border-border">
            <div className="container-page flex flex-col items-center gap-5 py-12 text-center md:py-16">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Handcrafted in India</p>
              <h1 className="font-display text-3xl leading-tight text-foreground md:text-5xl">
                Sculptures that carry meaning
              </h1>
              <p className="max-w-md text-muted-foreground">
                {BRAND_NAME} brings together handcrafted idols and statues — from home temple centrepieces to
                car dashboard companions — made in brass, marble, and wood by experienced artisans.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/shop">
                    Shop All Sculptures <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="border-b border-border bg-cream-100">
          <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Handcrafted in India</p>
              <h1 className="mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl">
                Sculptures that carry meaning
              </h1>
              <p className="mt-5 max-w-md text-muted-foreground">
                {BRAND_NAME} brings together handcrafted idols and statues — from home temple centrepieces to
                car dashboard companions — made in brass, marble, and wood by experienced artisans.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/shop">
                    Shop All Sculptures <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="aspect-4/3 overflow-hidden rounded-xl bg-cream-200">
              <img
                src="https://picsum.photos/seed/hikari-sculpture-hero/1200/900"
                alt="Handcrafted brass and marble sculptures from Hikari Living"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

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
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
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

      <section className="border-y border-border bg-cream-100">
        <div className="container-page flex flex-col items-center gap-4 py-14 text-center">
          <h2 className="font-display text-2xl text-foreground">Don&apos;t see exactly what you have in mind?</h2>
          <p className="max-w-md text-muted-foreground">
            Our artisans take on custom sculpture commissions and bulk corporate gifting orders.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/custom-sculpture">Custom Sculpture</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/corporate-gifting">Corporate Gifting</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center font-display text-2xl text-foreground">What our customers say</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-lg border border-border bg-cream-50 p-6">
              <RatingStars rating={t.rating} />
              <p className="mt-3 text-sm text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-medium text-foreground">
                {t.name} <span className="font-normal text-muted-foreground">— {t.location}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/reviews" className="text-sm font-medium text-foreground hover:underline">
            Read more reviews →
          </Link>
        </div>
      </section>

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
